import type { APIRoute } from 'astro';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

export const prerender = false;

const BASE_FEE = 50;
const URGENT_SURCHARGE = 120;
const DAILY_CAPACITY_STANDARD = 5;
const DAILY_CAPACITY_URGENT = 7;

const TicketAnalysisSchema = z.object({
  tasks: z.array(
    z.object({
      executionOrder: z.number(),
      title: z.string().describe('Τίτλος τεχνικής εργασίας στα Ελληνικά'),
      technicalCategory: z.string().describe('Κατηγορία: Backend, Pricing, Frontend, ή QA'),
      technicalDescription: z.string().describe('Αναλυτική τεχνική περιγραφή στα Ελληνικά'),
      estimatedHours: z.number().describe('Εκτιμώμενες ώρες σε βήματα του 0.25'),
      dependencyReason: z.string().describe('Αιτιολόγηση σειράς εκτέλεσης στα Ελληνικά'),
    })
  ),
  missingInformationWarnings: z
    .array(z.string().describe('Προειδοποίηση/έλλειψη πληροφορίας στα Ελληνικά'))
    .describe('Λίστα ελλείψεων στα Ελληνικά'),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

async function getCurrentQueueWorkload() {
  return { urgentQueueHours: 1.5, standardQueueHours: 11.0 };
}

function addBusinessDays(startDate: Date, daysToAdd: number): Date {
  const currentDate = new Date(startDate);
  let addedDays = 0;
  while (addedDays < daysToAdd) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) addedDays++;
  }
  return currentDate;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { fullName, afm, companyDetails, websiteUrl, rawRequest, isUrgent } = body;

    if (
      !fullName ||
      !afm ||
      !/^\d{9}$/.test(String(afm).trim()) ||
      !companyDetails ||
      !websiteUrl ||
      !rawRequest
    ) {
      return new Response(
        JSON.stringify({ error: 'Απαιτούνται όλα τα υποχρεωτικά πεδία και έγκυρο ΑΦΜ (9 ψηφία).' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey =
      import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      import.meta.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Λείπει το κλειδί AI API (GOOGLE_GENERATIVE_AI_API_KEY / GEMINI_API_KEY).' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const google = createGoogleGenerativeAI({ apiKey });

    const prompt = `
      Είσαι Senior WordPress Technical Architect.
      Ανάλυσε το αίτημα πελάτη για το ${websiteUrl}: """${rawRequest}"""
      1. Διαχώρισε σε τεχνικές εργασίες WordPress.
      2. Ιεράρχησε αυστηρά (Backend -> Pricing -> Frontend -> QA).
      3. Υπολόγισε ρεαλιστικές και σφιχτές ώρες για έμπειρο developer (σε βήματα του 0.25h, π.χ. απλές αλλαγές CSS/κειμένων/τιμών 0.25h-0.5h, ρυθμίσεις booking/woo 0.5h-1.25h).
      4. Εντόπισε κρίσιμες ελλείψεις δεδομένων (missingInformationWarnings).
      Απάντησε αποκλειστικά στα Ελληνικά για τα πεδία title, technicalDescription, dependencyReason και missingInformationWarnings.
    `;

    let aiAnalysis: z.infer<typeof TicketAnalysisSchema>;
    try {
      const res = await generateObject({
        model: google('gemini-2.5-pro'),
        schema: TicketAnalysisSchema,
        prompt,
      });
      aiAnalysis = res.object;
    } catch (proError) {
      console.warn('[Ticket Analyze] gemini-2.5-pro fallback to gemini-2.5-flash:', proError);
      const res = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: TicketAnalysisSchema,
        prompt,
      });
      aiAnalysis = res.object;
    }

    // Sort tasks by executionOrder
    aiAnalysis.tasks.sort((a, b) => a.executionOrder - b.executionOrder);

    const rawTotalHours = aiAnalysis.tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    const totalHours = Math.max(0.25, +rawTotalHours.toFixed(2));

    // Κλιμακωτή Ωριαία Χρέωση & Κρυφός Συντελεστής Προσαύξησης (Multiplier)
    // - Έως <5 ώρες: 40€/ώρα + multiplier 1.15
    // - Από 5 έως 8 ώρες: 36€/ώρα (-10% από τα 40€) + multiplier 1.05
    // - Πάνω από 8 ώρες: 30€/ώρα + multiplier 1.00
    let hourlyRate = 40;
    let markupMultiplier = 1.15;

    if (totalHours < 5) {
      hourlyRate = 40;
      markupMultiplier = 1.15;
    } else if (totalHours <= 8) {
      hourlyRate = 36; // 40€ - 10%
      markupMultiplier = 1.05;
    } else {
      hourlyRate = 30;
      markupMultiplier = 1.0;
    }

    const baseFeeTotal = BASE_FEE;
    const urgentFeeTotal = isUrgent ? URGENT_SURCHARGE : 0;
    const rawLaborCost = totalHours * hourlyRate;
    const laborCostWithMarkup = Math.ceil(rawLaborCost * markupMultiplier);

    const totalCostNet = baseFeeTotal + urgentFeeTotal + laborCostWithMarkup;
    const vatAmount = +(totalCostNet * 0.24).toFixed(2);
    const totalCostGross = +(totalCostNet + vatAmount).toFixed(2);

    const queue = await getCurrentQueueWorkload();
    const IN_PROGRESS_PROJECT_DAYS = 3; // Έργο σε εξέλιξη (λήξη σε 3 ημέρες)
    let estimatedBusinessDays = 1;

    if (isUrgent) {
      const effectiveHours = queue.urgentQueueHours + totalHours;
      estimatedBusinessDays =
        Math.max(1, Math.ceil(effectiveHours / DAILY_CAPACITY_URGENT)) + IN_PROGRESS_PROJECT_DAYS;
    } else {
      const effectiveHours = queue.urgentQueueHours + queue.standardQueueHours + totalHours;
      estimatedBusinessDays =
        Math.ceil(effectiveHours / DAILY_CAPACITY_STANDARD) + 1 + IN_PROGRESS_PROJECT_DAYS;
    }

    const etdDate = addBusinessDays(new Date(), estimatedBusinessDays);

    return new Response(
      JSON.stringify({
        client: { fullName, afm, companyDetails, websiteUrl },
        ticketType: isUrgent ? 'URGENT' : 'STANDARD',
        pricing: {
          baseFee: baseFeeTotal,
          urgentSurcharge: urgentFeeTotal,
          hourlyRate,
          totalHours,
          markupMultiplier,
          laborCost: laborCostWithMarkup,
          totalCostNet,
          vatAmount,
          totalCostGross,
        },
        schedule: {
          estimatedBusinessDays,
          etdFormatted: etdDate.toLocaleDateString('el-GR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
        analysis: aiAnalysis,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      }
    );
  } catch (error: any) {
    console.error('[Ticket Analyze Error]:', error);
    return new Response(
      JSON.stringify({ error: 'Σφάλμα ανάλυσης αιτήματος. Παρακαλώ δοκιμάστε ξανά.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
