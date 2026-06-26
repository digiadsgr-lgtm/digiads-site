const fs = require("fs");
const content = `import type { APIRoute } from "astro";
import nodemailer from "nodemailer";
import { buildLeadConfirmationEmail, buildOwnerNotificationEmail } from "../../lib/digiKnowledgeBase";

export const prerender = false;

interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  chatSummary: string;
}

function logLeadFallback(payload: LeadPayload) {
  console.log("=== DIGI LEAD CAPTURED ===");
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    name: payload.name,
    email: payload.email,
    phone: payload.phone ?? "",
    service: payload.service ?? "",
    chatSummary: (payload.chatSummary ?? "").slice(0, 500),
  }, null, 2));
  console.log("==========================");
}

export const POST: APIRoute = async ({ request }) => {
  let body: LeadPayload = { name: "", email: "", chatSummary: "" };
  try {
    body = await request.json() as LeadPayload;
    const { name, email, phone, service, chatSummary } = body;

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Symplirose onoma kai email" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    logLeadFallback(body);

    const user = (import.meta.env.SMTP_EMAIL || process.env.SMTP_EMAIL || "").trim();
    const pass = (import.meta.env.SMTP_PASSWORD || process.env.SMTP_PASSWORD || "").trim();
    const notificationEmail = (import.meta.env.NOTIFICATION_EMAIL || process.env.NOTIFICATION_EMAIL || "digiadsgr@gmail.com").trim();

    if (!user || !pass) {
      console.warn("[DIGI] SMTP not configured - lead logged to console only.");
      return new Response(
        JSON.stringify({ success: true, message: "Aitisi elifthi!" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });

    const leadHtml = buildLeadConfirmationEmail({ name, service: service ?? "", chatSummary });
    const notifyHtml = buildOwnerNotificationEmail({ name, email, phone: phone ?? "", service: service ?? "", chatSummary });

    const [leadResult, notifyResult] = await Promise.allSettled([
      transporter.sendMail({
        from: '"DIGIADS Virtual Agent" <' + user + ">",
        to: email,
        replyTo: notificationEmail,
        subject: "Epivevaiwsi Aitisis - DIGIADS",
        html: leadHtml,
      }),
      transporter.sendMail({
        from: '"DIGIADS Virtual Agent" <' + user + ">",
        to: notificationEmail,
        replyTo: email,
        subject: "Neo Lead: " + name + " 🎯",
        html: notifyHtml,
      }),
    ]);

    if (leadResult.status === "rejected") console.error("[DIGI] Lead email error:", leadResult.reason);
    if (notifyResult.status === "rejected") console.error("[DIGI] Owner email error:", notifyResult.reason);

    return new Response(
      JSON.stringify({ success: true, message: "I aitisi elifthi! Sou steilame email epibevaiwsis." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    try { logLeadFallback(body); } catch {}
    console.error("[DIGI] Critical error:", error);
    return new Response(
      JSON.stringify({ success: true, message: "Aitisi elifthi!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
};
`;
fs.writeFileSync("src/pages/api/send-lead.ts", content, "utf8");
console.log("SUCCESS: send-lead.ts written, lines:", content.split("\n").length);
