import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { buildStripeTicketMetadata } from '../../lib/ticketNotification';

export const prerender = false;

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

    // Use default latest Stripe API version so Dynamic Payment Methods (Klarna, Google Pay, Apple Pay, Cards) work automatically
    const stripe = new Stripe(stripeSecretKey);

    const { result, formData } = await request.json();

    const baseUrl =
      import.meta.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      url.origin ||
      'https://www.digiads.gr';

    const metadata = buildStripeTicketMetadata(formData, result);

    const isBusiness = formData.customerType === 'BUSINESS';
    const descParts = [
      `Εργατοώρες: ${result.pricing.totalHours}h`,
      `ETD: ${result.schedule.etdFormatted}`,
      isBusiness ? `Τιμολόγιο (ΑΦΜ: ${formData.afm})` : 'Ιδιώτης (Χωρίς Τιμολόγιο)',
    ];

    const session = await stripe.checkout.sessions.create({
      // Do NOT restrict payment_method_types to ['card'] so Stripe Dashboard methods (Klarna, Google Pay, Apple Pay, Card) appear automatically
      customer_email: formData.email ? String(formData.email).trim() : undefined,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `DIGIADS Ticket: ${formData.websiteUrl}`,
              description: descParts.join(' | '),
            },
            unit_amount: Math.round(result.pricing.totalCostGross * 100),
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
      JSON.stringify({ error: err.message || 'Σφάλμα διασύνδεσης πληρωμής.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
