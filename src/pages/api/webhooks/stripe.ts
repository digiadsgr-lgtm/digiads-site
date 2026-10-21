import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

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

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16' as any,
  });

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
      const meta = session.metadata || {};

      console.log('=== STRIPE TICKET PAID ===', {
        sessionId: session.id,
        amountTotal: (session.amount_total || 0) / 100,
        metadata: meta,
      });

      // Notify DIGIADS team via configured SMTP if available
      const user = (import.meta.env.SMTP_EMAIL || process.env.SMTP_EMAIL || '').trim();
      const pass = (import.meta.env.SMTP_PASSWORD || process.env.SMTP_PASSWORD || '').trim();
      const notificationEmail = (
        import.meta.env.NOTIFICATION_EMAIL ||
        process.env.NOTIFICATION_EMAIL ||
        'digiadsgr@gmail.com'
      ).trim();

      if (user && pass) {
        try {
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { user, pass },
            tls: { rejectUnauthorized: false },
          });

          await transporter.sendMail({
            from: `"DIGIADS Ticketing System" <${user}>`,
            to: notificationEmail,
            subject: `✅ Νέο Εξοφλημένο Ticket (${meta.ticketType || 'STANDARD'}) - ${meta.website || ''}`,
            html: `
              <h2>Νέο Εξοφλημένο Τεχνικό Ticket</h2>
              <ul>
                <li><strong>Ονοματεπώνυμο:</strong> ${meta.fullName || '-'}</li>
                <li><strong>ΑΦΜ:</strong> ${meta.afm || '-'}</li>
                <li><strong>Επιχείρηση:</strong> ${meta.companyDetails || '-'}</li>
                <li><strong>Ιστοσελίδα:</strong> ${meta.website || '-'}</li>
                <li><strong>Τύπος Ticket:</strong> ${meta.ticketType || 'STANDARD'}</li>
                <li><strong>Εργατοώρες:</strong> ${meta.hours || '-'}h</li>
                <li><strong>Εκτιμώμενη Παράδοση (ETD):</strong> ${meta.etd || '-'}</li>
                <li><strong>Ποσό Πληρωμής (με ΦΠΑ):</strong> ${((session.amount_total || 0) / 100).toFixed(2)}€</li>
                <li><strong>Stripe Session ID:</strong> ${session.id}</li>
              </ul>
            `,
          });
        } catch (mailErr) {
          console.error('[Stripe Webhook Email Error]:', mailErr);
        }
      }
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
