import type Stripe from 'stripe';
import nodemailer from 'nodemailer';

const CHUNK_SIZE = 480;

export function buildStripeTicketMetadata(formData: any, result: any): Record<string, string> {
  const meta: Record<string, string> = {
    fullName: String(formData.fullName || '').slice(0, 480),
    afm: String(formData.afm || '').slice(0, 50),
    companyDetails: String(formData.companyDetails || '').slice(0, 480),
    website: String(formData.websiteUrl || '').slice(0, 480),
    ticketType: String(result.ticketType || 'STANDARD'),
    hours: String(result.pricing?.totalHours || 0),
    laborCost: String(result.pricing?.laborCost || 0),
    baseFee: String(result.pricing?.baseFee || 50),
    urgentSurcharge: String(result.pricing?.urgentSurcharge || 0),
    totalCostNet: String(result.pricing?.totalCostNet || 0),
    vatAmount: String(result.pricing?.vatAmount || 0),
    totalCostGross: String(result.pricing?.totalCostGross || 0),
    etd: String(result.schedule?.etdFormatted || '').slice(0, 480),
    riskLevel: String(result.analysis?.riskLevel || 'LOW'),
  };

  // Encode rawRequest in chunks of 480 chars (up to 10 chunks = 4800 chars)
  const rawReq = String(formData.rawRequest || '');
  const reqChunks = Math.min(10, Math.ceil(rawReq.length / CHUNK_SIZE));
  meta.rawReqChunks = String(reqChunks);
  for (let i = 0; i < reqChunks; i++) {
    meta[`rawReq_${i}`] = rawReq.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
  }

  // Encode AI tasks in chunks of 480 chars (up to 15 chunks = 7200 chars)
  const tasksFormatted = (result.analysis?.tasks || [])
    .map(
      (t: any) =>
        `#${t.executionOrder} [${t.technicalCategory}] ${t.title} (${t.estimatedHours}h): ${t.technicalDescription}`
    )
    .join('\n');
  const taskChunks = Math.min(15, Math.ceil(tasksFormatted.length / CHUNK_SIZE));
  meta.taskChunks = String(taskChunks);
  for (let i = 0; i < taskChunks; i++) {
    meta[`tasks_${i}`] = tasksFormatted.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
  }

  // Encode missingInformationWarnings
  const warningsFormatted = (result.analysis?.missingInformationWarnings || []).join(' | ');
  if (warningsFormatted) {
    meta.warnings = warningsFormatted.slice(0, 480);
  }

  return meta;
}

export function reconstructFromMetadata(meta: Record<string, string>) {
  const reqChunks = parseInt(meta.rawReqChunks || '0', 10);
  let rawRequest = '';
  for (let i = 0; i < reqChunks; i++) {
    rawRequest += meta[`rawReq_${i}`] || '';
  }

  const taskChunks = parseInt(meta.taskChunks || '0', 10);
  let tasksText = '';
  for (let i = 0; i < taskChunks; i++) {
    tasksText += meta[`tasks_${i}`] || '';
  }

  return {
    fullName: meta.fullName || '-',
    afm: meta.afm || '-',
    companyDetails: meta.companyDetails || '-',
    website: meta.website || '-',
    ticketType: meta.ticketType || 'STANDARD',
    hours: meta.hours || '0',
    laborCost: meta.laborCost || '0',
    baseFee: meta.baseFee || '50',
    urgentSurcharge: meta.urgentSurcharge || '0',
    totalCostNet: meta.totalCostNet || '0',
    vatAmount: meta.vatAmount || '0',
    totalCostGross: meta.totalCostGross || '0',
    etd: meta.etd || '-',
    riskLevel: meta.riskLevel || '-',
    rawRequest: rawRequest || '-',
    tasksList: tasksText ? tasksText.split('\n').filter(Boolean) : [],
    warnings: meta.warnings ? meta.warnings.split(' | ').filter(Boolean) : [],
  };
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendPaidTicketNotification(
  stripe: Stripe,
  session: Stripe.Checkout.Session
): Promise<boolean> {
  const meta = session.metadata || {};
  if (meta.emailSent === 'true') {
    return true;
  }

  const info = reconstructFromMetadata(meta);
  const amountPaid = ((session.amount_total || 0) / 100).toFixed(2);
  const customerEmail = session.customer_details?.email || '';

  const user = (import.meta.env.SMTP_EMAIL || process.env.SMTP_EMAIL || '').trim();
  const pass = (import.meta.env.SMTP_PASSWORD || process.env.SMTP_PASSWORD || '').trim();
  const notificationEmail = (
    import.meta.env.NOTIFICATION_EMAIL ||
    process.env.NOTIFICATION_EMAIL ||
    'digiadsgr@gmail.com'
  ).trim();

  if (!user || !pass) {
    console.warn('[Ticket Notification] Missing SMTP credentials, logging ticket only.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  const tasksHtml =
    info.tasksList.length > 0
      ? `<ol style="padding-left:20px;margin:8px 0;">${info.tasksList
          .map(
            (t) =>
              `<li style="margin-bottom:8px;line-height:1.5;color:#1e293b;">${escapeHtml(t)}</li>`
          )
          .join('')}</ol>`
      : '<p>—</p>';

  const warningsHtml =
    info.warnings.length > 0
      ? `<div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:12px;margin-top:16px;">
          <strong>Διευκρινίσεις που εντόπισε το AI:</strong>
          <ul style="margin:6px 0 0 0;padding-left:18px;">
            ${info.warnings.map((w) => `<li>${escapeHtml(w)}</li>`).join('')}
          </ul>
        </div>`
      : '';

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
      <div style="background:#0f172a;color:#ffffff;padding:20px 24px;">
        <h2 style="margin:0;color:#FFBF00;">✅ Νέο Εξοφλημένο Ticket — DIGIADS</h2>
        <p style="margin:6px 0 0 0;font-size:13px;color:#cbd5e1;">
          Τύπος: <strong>${escapeHtml(info.ticketType)}</strong> | Εξοφλημένο Ποσό: <strong>${amountPaid}€</strong> | ETD: <strong>${escapeHtml(info.etd)}</strong>
        </p>
      </div>

      <div style="padding:24px;">
        <h3 style="margin-top:0;color:#0f172a;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">
          1. Στοιχεία Πελάτη & Τιμολόγησης
        </h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
          <tr><td style="padding:6px 0;color:#64748b;width:180px;">Ονοματεπώνυμο:</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(info.fullName)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">ΑΦΜ:</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(info.afm)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Στοιχεία Επιχείρησης:</td><td style="padding:6px 0;font-weight:bold;">${escapeHtml(info.companyDetails)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Ιστοσελίδα:</td><td style="padding:6px 0;"><a href="${escapeHtml(info.website)}">${escapeHtml(info.website)}</a></td></tr>
          ${customerEmail ? `<tr><td style="padding:6px 0;color:#64748b;">Email Πληρωμής (Stripe):</td><td style="padding:6px 0;">${escapeHtml(customerEmail)}</td></tr>` : ''}
        </table>

        <h3 style="color:#0f172a;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">
          2. Τι Ζήτησε ο Πελάτης (Αυτούσιο Αίτημα)
        </h3>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;white-space:pre-wrap;font-size:14px;line-height:1.6;color:#0f172a;margin-bottom:20px;">${escapeHtml(info.rawRequest)}</div>

        <h3 style="color:#0f172a;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">
          3. Τεχνική Ανάλυση & Ιεράρχηση Εργασιών (AI)
        </h3>
        <p style="font-size:13px;color:#475569;margin:4px 0 10px 0;">
          Συνολικές Εργατοώρες: <strong>${escapeHtml(info.hours)}h</strong> | Πολυπλοκότητα: <strong>${escapeHtml(info.riskLevel)}</strong>
        </p>
        ${tasksHtml}
        ${warningsHtml}

        <h3 style="color:#0f172a;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:24px;">
          4. Οικονομική Ανάλυση & Παράδοση
        </h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:5px 0;color:#64748b;width:180px;">Κόστος Εργασιών (${escapeHtml(info.hours)}h):</td><td style="padding:5px 0;">${escapeHtml(info.laborCost)}€</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Πάγιο (Base Fee):</td><td style="padding:5px 0;">${escapeHtml(info.baseFee)}€</td></tr>
          ${info.ticketType === 'URGENT' ? `<tr><td style="padding:5px 0;color:#d97706;">Επείγουσα Προτεραιότητα:</td><td style="padding:5px 0;color:#d97706;">+${escapeHtml(info.urgentSurcharge)}€</td></tr>` : ''}
          <tr><td style="padding:5px 0;color:#64748b;">Καθαρή Αξία (Net):</td><td style="padding:5px 0;">${escapeHtml(info.totalCostNet)}€</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">ΦΠΑ (24%):</td><td style="padding:5px 0;">${escapeHtml(info.vatAmount)}€</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;font-size:16px;color:#0f172a;">Τελικό Ποσό (Εξοφλήθηκε):</td><td style="padding:8px 0;font-weight:bold;font-size:16px;color:#059669;">${amountPaid}€</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Εκτιμώμενη Παράδοση (ETD):</td><td style="padding:5px 0;font-weight:bold;">${escapeHtml(info.etd)}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Stripe Session ID:</td><td style="padding:5px 0;font-family:monospace;font-size:12px;">${escapeHtml(session.id)}</td></tr>
        </table>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"DIGIADS Ticketing System" <${user}>`,
    to: notificationEmail,
    replyTo: customerEmail || undefined,
    subject: `✅ Νέο Εξοφλημένο Ticket (${info.ticketType}) - ${info.website} [${amountPaid}€]`,
    html,
  });

  // Mark session metadata as emailSent = 'true' to avoid duplicate emails between webhook and success page
  try {
    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...meta,
        emailSent: 'true',
      },
    });
  } catch (updateErr) {
    console.warn('[Ticket Notification] Could not mark emailSent on session:', updateErr);
  }

  return true;
}
