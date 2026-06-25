import type { APIRoute } from 'astro';
import { buildDigiSystemPrompt } from '../../lib/digiKnowledgeBase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages, exchangeCount, currentPage } = await request.json();

    const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ message: 'API key missing', captureLeads: false }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
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
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ message: 'Στιγμή — έχω πολλές συνομιλίες τώρα. Δοκίμασε ξανά σε λίγα δευτερόλεπτα! ⏱️', captureLeads: false }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ message: 'Συγγνώμη, κάτι πήγε στραβά. Δοκίμασε ξανά!', captureLeads: false }),
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
    return new Response(
      JSON.stringify({
        message: 'Κάτι πήγε στραβά. Επικοινώνησε μαζί μας στο info@digiads.gr 🙏',
        captureLeads: false,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
