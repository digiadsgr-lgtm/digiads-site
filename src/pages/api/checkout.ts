import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { buildStripeTicketMetadata } from '../../lib/ticketNotification';

export const prerender = false;

const BASE_FEE = 50;
const URGENT_SURCHARGE = 120;

const ALLOWED_ORIGINS = new Set([
  'https://www.digiads.gr',
  'https://digiads.gr',
  'http://localhost:4321',
  'http://localhost:3000',
]);

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const stripeSecretKey =
      import.meta.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey || stripeSecretKey.startsWith('sk_test_...')) {
      return new Response(
        JSON.stringify({
          error:
            'Η διασύνδεση Stripe είναι σε αναμονή ενεργοποίησης (εκκρεμεί το STRIPE_SECRET_KEY στο περιβάλλον).',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const { result, formData } = await request.json();

    if (!result || !formData || !formData.websiteUrl) {
      return new Response(
        JSON.stringify({ error: 'Μη έγκυρα δεδομένα αιτήματος.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Recalculate pricing strictly on the server to prevent client-side price tampering
    const tasks = Array.isArray(result.analysis?.tasks) ? result.analysis.tasks : [];
    const rawTotalHours = tasks.reduce(
      (sum: number, t: any) => sum + (Number(t?.estimatedHours) || 0),
      0
    );
    const totalHours = Math.max(
      0.25,
      +(rawTotalHours || Number(result.pricing?.totalHours) || 0.25).toFixed(2)
    );

    let hourlyRate = 40;
    let markupMultiplier = 1.15;
    if (totalHours < 5) {
      hourlyRate = 40;
      markupMultiplier = 1.15;
    } else if (totalHours <= 8) {
      hourlyRate = 36;
      markupMultiplier = 1.05;
    } else {
      hourlyRate = 30;
      markupMultiplier = 1.0;
    }

    const isUrgent = Boolean(formData.isUrgent || result.ticketType === 'URGENT');
    const isBusiness = formData.customerType === 'BUSINESS';

    const baseFeeTotal = BASE_FEE;
    const urgentFeeTotal = isUrgent ? URGENT_SURCHARGE : 0;
    const laborCostWithMarkup = Math.ceil(totalHours * hourlyRate * markupMultiplier);
    const totalCostNet = baseFeeTotal + urgentFeeTotal + laborCostWithMarkup;
    const vatAmount = isBusiness ? +(totalCostNet * 0.24).toFixed(2) : 0;
    const totalCostGross = +(totalCostNet + vatAmount).toFixed(2);

    // Override result.pricing with server-verified values
    const verifiedResult = {
      ...result,
      ticketType: isUrgent ? 'URGENT' : 'STANDARD',
      pricing: {
        ...result.pricing,
        baseFee: baseFeeTotal,
        urgentSurcharge: urgentFeeTotal,
        hourlyRate,
        totalHours,
        markupMultiplier,
        laborCost: laborCostWithMarkup,
        totalCostNet,
        vatAmount,
        hasVat: isBusiness,
        totalCostGross,
      },
    };

    const envBaseUrl = (
      import.meta.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      ''
    ).trim().replace(/\/+$/, '');

    const baseUrl = ALLOWED_ORIGINS.has(envBaseUrl)
      ? envBaseUrl
      : ALLOWED_ORIGINS.has(url.origin)
      ? url.origin
      : 'https://www.digiads.gr';

    const metadata = buildStripeTicketMetadata(formData, verifiedResult);

    const descParts = [
      `Εργατοώρες: ${totalHours}h`,
      `ETD: ${verifiedResult.schedule?.etdFormatted || '-'}`,
      isBusiness ? `Τιμολόγιο (ΑΦΜ: ${formData.afm})` : 'Ιδιώτης (Χωρίς Τιμολόγιο)',
    ];

    const session = await stripe.checkout.sessions.create({
      customer_email: formData.email ? String(formData.email).trim() : undefined,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `DIGIADS Ticket: ${String(formData.websiteUrl).slice(0, 120)}`,
              description: descParts.join(' | '),
            },
            unit_amount: Math.round(totalCostGross * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/support-ticket/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/support-ticket/cancel`,
      metadata,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  } catch (err: any) {
    console.error('[Stripe Checkout Error]:', err);
    return new Response(
      JSON.stringify({ error: 'Σφάλμα διασύνδεσης πληρωμής.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
