import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { buildLeadConfirmationEmail, buildOwnerNotificationEmail } from '../../lib/digiKnowledgeBase';

export const prerender = false;

interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  chatSummary: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as LeadPayload;
    const { name, email, phone, service, chatSummary } = body;

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: 'Συμπλήρωσε όνομα και email' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = (import.meta.env.SMTP_EMAIL || process.env.SMTP_EMAIL || '').trim();
    const pass = (import.meta.env.SMTP_PASSWORD || process.env.SMTP_PASSWORD || '').trim();
    const notificationEmail = (import.meta.env.NOTIFICATION_EMAIL || process.env.NOTIFICATION_EMAIL || 'digiadsgr@gmail.com').trim();

    if (!user || !pass) {
      console.error('Missing SMTP credentials in environment variables.');
      return new Response(
        JSON.stringify({ success: false, error: 'Το σύστημα αποστολής δεν έχει ρυθμιστεί.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    const leadHtml = buildLeadConfirmationEmail({ name, service: service ?? '', chatSummary });
    const notifyHtml = buildOwnerNotificationEmail({ name, email, phone: phone ?? '', service: service ?? '', chatSummary });

    // Send the email to the lead
    const leadResult = await transporter.sendMail({
      from: `"DIGIADS Virtual Agent" <${user}>`,
      to: email,
      replyTo: notificationEmail,
      subject: 'Επιβεβαίωση Αίτησης — DIGIADS',
      html: leadHtml,
    }).catch(err => {
      console.error('Error sending lead email:', err);
      return null;
    });

    // Send the notification to the owner
    const notifyResult = await transporter.sendMail({
      from: `"DIGIADS Virtual Agent" <${user}>`,
      to: notificationEmail,
      replyTo: email,
      subject: `Νέο Lead: ${name} 🎯`,
      html: notifyHtml,
    }).catch(err => {
      console.error('Error sending owner email:', err);
      return null;
    });

    if (!leadResult && !notifyResult) {
      return new Response(
        JSON.stringify({ success: false, error: 'Απέτυχε η αποστολή. Επικοινώνησε μαζί μας στο info@digiads.gr' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Η αίτηση ελήφθη! Σου στείλαμε email επιβεβαίωσης.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Lead send critical error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Αποτυχία συστήματος' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
