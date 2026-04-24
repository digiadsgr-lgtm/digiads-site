import type { APIRoute } from 'astro';
import { buildLeadConfirmationEmail, buildOwnerNotificationEmail } from '../../lib/digiKnowledgeBase';

export const prerender = false;

interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  chatSummary: string;
}

async function sendEmailJS(templateId: string, templateParams: Record<string, string>, apiKeys: { publicKey: string; privateKey: string; serviceId: string }) {
  return fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: apiKeys.serviceId,
      template_id: templateId,
      user_id: apiKeys.publicKey,
      accessToken: apiKeys.privateKey,
      template_params: templateParams,
    }),
  });
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

    const apiKeys = {
      publicKey: import.meta.env.EMAILJS_PUBLIC_KEY ?? '',
      privateKey: import.meta.env.EMAILJS_PRIVATE_KEY ?? '',
      serviceId: import.meta.env.EMAILJS_SERVICE_ID ?? '',
    };

    const templateLead = import.meta.env.EMAILJS_TEMPLATE_LEAD ?? 'template_lead_confirm';
    const templateNotify = import.meta.env.EMAILJS_TEMPLATE_NOTIFY ?? 'template_notify_owner';

    const now = new Date().toLocaleString('el-GR', { timeZone: 'Europe/Athens' });

    // Build beautiful HTML emails
    const leadHtml = buildLeadConfirmationEmail({ name, service: service ?? '', chatSummary });
    const notifyHtml = buildOwnerNotificationEmail({ name, email, phone: phone ?? '', service: service ?? '', chatSummary });

    // Template params — EmailJS template should render {{html_content}} unescaped
    const leadParams: Record<string, string> = {
      to_name: name,
      to_email: email,
      service_interest: service ?? 'Γενική Πληροφόρηση',
      sent_at: now,
      html_content: leadHtml,
    };

    const notifyParams: Record<string, string> = {
      lead_name: name,
      lead_email: email,
      lead_phone: phone ?? 'Δεν δόθηκε',
      lead_service: service ?? 'Δεν διευκρινίστηκε',
      sent_at: now,
      notify_email: import.meta.env.NOTIFICATION_EMAIL ?? 'digiadsgr@gmail.com',
      html_content: notifyHtml,
    };

    // Send both emails in parallel
    const [leadResult, notifyResult] = await Promise.allSettled([
      sendEmailJS(templateLead, leadParams, apiKeys),
      sendEmailJS(templateNotify, notifyParams, apiKeys),
    ]);

    const leadOk = leadResult.status === 'fulfilled' && leadResult.value.ok;
    const notifyOk = notifyResult.status === 'fulfilled' && notifyResult.value.ok;

    if (!leadOk) console.warn('Lead email failed:', leadResult);
    if (!notifyOk) console.warn('Notify email failed:', notifyResult);

    // Return success even if email partially fails — lead is captured
    return new Response(
      JSON.stringify({ success: true, message: 'Η αίτηση ελήφθη! Σου στείλαμε email επιβεβαίωσης.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Lead send error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Αποτυχία αποστολής' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
