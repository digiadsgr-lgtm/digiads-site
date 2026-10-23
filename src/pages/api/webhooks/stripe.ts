import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { sendPaidTicketNotification } from '../../../lib/ticketNotification';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const stripeSecretKey =
    import.meta.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  const webhookSecret =
    import.meta.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret || webhookSecret.startsWith('whsec_...')) {
    return new Response(
      JSON.stringify({ error: 'Server webhook configuration incomplete' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response(
      JSON.stringify({ error: 'Missing stripe-signature header' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const rawBody = await request.text();

    // Always enforce cryptographic signature verification
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === 'paid') {
        console.log('=== STRIPE TICKET PAID (VERIFIED WEBHOOK) ===', session.id);
        await sendPaidTicketNotification(stripe, session);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[Stripe Webhook Verification Error]:', err.message);
    return new Response(JSON.stringify({ error: 'Webhook signature verification failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
