import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { sendPaidTicketNotification } from '../../../lib/ticketNotification';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const stripeSecretKey =
    import.meta.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  const webhookSecret =
    import.meta.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    return new Response(JSON.stringify({ error: 'Missing STRIPE_SECRET_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event: Stripe.Event;

    if (webhookSecret && signature && !webhookSecret.startsWith('whsec_...')) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      event = JSON.parse(rawBody) as Stripe.Event;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('=== STRIPE TICKET PAID (WEBHOOK) ===', session.id);
      await sendPaidTicketNotification(stripe, session);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[Stripe Webhook Error]:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
