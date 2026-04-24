import type { APIRoute } from 'astro';
import { buildDigiSystemPrompt } from '../../lib/digiKnowledgeBase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages, exchangeCount } = await request.json();

    const apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ message: 'API key missing', captureLeads: false }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = buildDigiSystemPrompt();

    // Gemini REQUIRES conversation to start with "user" — filter out initial assistant greeting
    const filteredMessages = (messages as { role: string; content: string }[]).filter(
      (m, idx) => !(idx === 0 && m.role === 'assistant')
    );

    if (filteredMessages.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Γεια σου! Πώς μπορώ να σε βοηθήσω;', captureLeads: false }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const contents = filteredMessages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 400,
            topP: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      // Handle rate limit gracefully
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

    const data = await response.json();
    const message: string =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      'Συγγνώμη, κάτι πήγε στραβά. Δοκίμασε ξανά!';

    const captureLeads = (exchangeCount as number) >= 3;

    return new Response(
      JSON.stringify({ message, captureLeads }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
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
