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

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16' as any,
    });

    const { result, formData } = await request.json();

    const baseUrl =
      import.meta.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      url.origin ||
      'https://www.digiads.gr';

    const metadata = buildStripeTicketMetadata(formData, result);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `DIGIADS Ticket: ${formData.websiteUrl}`,
              description: `Εργατοώρες: ${result.pricing.totalHours}h | ETD: ${result.schedule.etdFormatted} | ΑΦΜ: ${formData.afm}`,
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
