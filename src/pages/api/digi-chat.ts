import type { APIRoute } from 'astro';
import { buildDigiSystemPrompt } from '../../lib/digiKnowledgeBase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages, exchangeCount, currentPage } = await request.json();

    const FALLBACK_MESSAGE = 'Αυτή τη στιγμή το δίκτυο έχει μεγάλο φόρτο. Παρόλα αυτά, είμαι εδώ για σένα! Θέλεις να σημειώσω τα στοιχεία σου για να σου στείλει η ομάδα μας μια δωρεάν πρόταση; [SHOW_FORM]';

    const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ message: FALLBACK_MESSAGE, captureLeads: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt = buildDigiSystemPrompt();
    if (currentPage) {
      systemPrompt += `\n\n[ΣΗΜΑΝΤΙΚΗ ΠΛΗΡΟΦΟΡΙΑ]\nΟ χρήστης αυτή τη στιγμή βρίσκεται στη σελίδα με URL/Path: "${currentPage}". Προσάρμοσε την απάντησή σου και το ενδιαφέρον σου με βάση αυτή τη σελίδα. Αν για παράδειγμα βρίσκεται στη σελίδα κατασκευής ιστοσελίδων (/web-design), μίλα στοχευμένα για αυτό.`;
    }

    // Normalize messages to ensure they strictly alternate and start with "user"
    const normalizedContents: { role: string; parts: { text: string }[] }[] = [];
    
    for (const m of messages as { role: string; content: string }[]) {
      if (normalizedContents.length === 0 && m.role !== 'user') continue;
      
      const role = m.role === 'assistant' ? 'model' : 'user';
      
      if (normalizedContents.length > 0 && normalizedContents[normalizedContents.length - 1].role === role) {
        normalizedContents[normalizedContents.length - 1].parts[0].text += '\n\n' + m.content;
      } else {
        normalizedContents.push({ role, parts: [{ text: m.content }] });
      }
    }

    if (normalizedContents.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Γεια σου! Πώς μπορώ να σε βοηθήσω;', captureLeads: false }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Wrap fetch with timeout for extra resilience
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout for Gemini

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: normalizedContents,
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 1500,
            topP: 0.9,
          },
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      // Even on rate limit or other errors, return 200 with fallback so the UI pops the form!
      return new Response(
        JSON.stringify({ message: FALLBACK_MESSAGE, captureLeads: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // We return the raw SSE stream from Google directly to our frontend!
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Digi chat error:', error);
    const FALLBACK_MESSAGE = 'Υπάρχει μια μικρή καθυστέρηση. Θέλεις να σημειώσω το email σου για να επικοινωνήσουμε εμείς μαζί σου; [SHOW_FORM]';
    return new Response(
      JSON.stringify({
        message: FALLBACK_MESSAGE,
        captureLeads: true,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
