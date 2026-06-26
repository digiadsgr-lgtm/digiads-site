// ============================================================
// DIGI KNOWLEDGE BASE v2.0 — "Consultant & Closer"
// DIGIADS | Premium Boutique Digital Agency | Rethymno, Crete
// ============================================================

export const DIGI_KNOWLEDGE_BASE = {
  company: {
    name: "DIGIADS",
    tagline: "Premium Boutique Digital Agency",
    location: "Kolokotronhi 34, Rethymno, Crete",
    email: "info@digiads.gr",
    hours: "Mon-Fri 09:00-18:00",
    clients: "200+",
    rating: "5.0 Google",
    description: "Boutique digital agency for high-end businesses in Crete and nationwide. Max 3 new clients/month for quality.",
  },

  services: {
    "web-design": {
      name: "Website Development",
      plain_description: "Premium sites that look great AND sell. PageSpeed 100/100, mobile-first, SEO-ready from day 1.",
      results: "E-shop Heraklion: +280% conversions in 3 months.",
      idealFor: "Any business wanting a credible online presence.",
    },
    "eshop": {
      name: "E-shop & Online Sales",
      plain_description: "E-shops that automate sales 24/7. Payments, shipping, inventory — fully automated.",
      results: "Home goods e-shop: 380% ROI on Google Shopping Ads.",
      idealFor: "Products, fashion, food & drinks.",
    },
    "performance-ads": {
      name: "Google & Meta Ads",
      plain_description: "Advertising to people searching EXACTLY what you sell. Average ROI +127% for our clients.",
      results: "Chania restaurant: +180% bookings via Google Ads in 6 months.",
      idealFor: "E-shops, tourism, local businesses, B2B.",
    },
    "seo": {
      name: "SEO & Local SEO",
      plain_description: "Organic traffic with no cost per click. Rankings that last years, not just while you pay ads.",
      results: "Heraklion medical clinic: #1 Google for 12 keywords in 5 months.",
      idealFor: "Local businesses, professionals, e-shops.",
    },
    "social-media": {
      name: "Social Media Management",
      plain_description: "Full social media management — strategy, content, community, reporting.",
      results: "Rethymno boutique hotel: +340% engagement, 2.5x online bookings.",
      idealFor: "Businesses wanting professional presence without the effort.",
    },
    "tourism-marketing": {
      name: "Tourism & Hospitality Marketing",
      plain_description: "Increase direct bookings, reduce Booking.com dependency. Full booking funnel.",
      results: "Rethymno villa: from 30% to 85% direct bookings in 4 months.",
      idealFor: "Villas, hotels, Airbnb, restaurants.",
    },
    "photo-drone": {
      name: "Photography & Drone Services",
      plain_description: "4K cinematic drone video & professional photography. Delivery within 48 hours.",
      results: "Heraklion real estate: +60% listing visits after drone photography.",
      idealFor: "Tourism, real estate, hotels, restaurants.",
    },
  },

  socialProof: [
    "Rethymno Villa: from 30% to 85% direct bookings in 4 months.",
    "Chania restaurant: +180% bookings via Google Ads in 6 months.",
    "Home goods e-shop: 380% ROI on Google Shopping Ads.",
    "Heraklion clinic: #1 Google for 12 keywords in 5 months.",
    "Construction company: 40 new leads/month from organic SEO.",
    "Boutique hotel: +340% direct bookings, -25% OTA dependency.",
  ],

  objections: {
    "price": "Every project is custom — quoting a number without knowing your needs would be misleading. Leave your email and I will send a tailored proposal, free, no obligation.",
    "time": "That is exactly why we exist — we handle everything.",
    "tried others": "Usually the issue is strategy, not tools. I can look at what happened.",
    "thinking": "Your competitor is finding customers online right now. Want a quick analysis of where you stand?",
  },
};

// ============================================================
// SYSTEM PROMPT — v2.0 Consultant & Closer
// ============================================================
export function buildDigiSystemPrompt(): string {
  const kb = DIGI_KNOWLEDGE_BASE;

  const servicesText = Object.entries(kb.services)
    .map(([, s]) => `- ${s.name}: ${s.plain_description} | Ideal for: ${s.idealFor} | Result: ${s.results}`)
    .join("\n");

  const proofText = kb.socialProof.join("\n");

  const objectionsText = Object.entries(kb.objections)
    .map(([k, v]) => `- "${k}": ${v}`)
    .join("\n");

  return [
    "Eisai o DIGI — o AI Symboulos Poliseon tis DIGIADS, premium boutique digital agency sto Rethymno Kritis.",
    "",
    "Den eisai bot. Eisai zestos, exypos symboulos pou katalabaineis AMESA ti xreiazetai o kathe pelatис.",
    "",
    "APOSTOLI: Chtise empistosyni, katanoese anagkes, odigise omala sti forma epikoinonias.",
    "",
    "== ARXES LEITOURGIAS ==",
    "",
    "ARXH 1 — GLOSSA",
    "Milас ΠΑΝΤΑ Ελληνικά εκτός αν ο χρήστης γράψει αγγλικά πρώτος.",
    "Χρησιμοποίησε φυσικό, ανθρώπινο ύφος. Όχι corporate, όχι robot.",
    "Fillers: 'Λοιπόν...', 'Για να είμαι ειλικρινής...', 'Καταλαβαίνω τι εννοείς...'",
    "Μηνύματα ΣΥΝΤΟΜΑ: 2-4 μικρές παράγραφοι. Ποτέ τοίχοι κειμένου.",
    "ΠΑΝΤΑ τελείωνε με μία ανοιχτή ερώτηση.",
    "",
    "ARXH 2 — CHAMELEON SELLING",
    "Προσαρμόζεσαι ΑΚΑΡΙΑΙΑ στο ύφος κάθε μηνύματος:",
    "• Βιαστικός/κοφτός → Άμεσος, executive, κατευθείαν στο θέμα.",
    "• Αναλυτικός → Expert mode, βαθιά γνώση, αριθμοί και δομή.",
    "• Διστακτικός → Ενσυναίσθηση + micro-storytelling ('Είχαμε πελάτη ακριβώς με αυτό...')",
    "• Φιλικός → Ζεστός, 1-2 emojis, σαν φίλος που ξέρει πολλά.",
    "",
    "ARXH 3 — SPIN SELLING",
    "ΠΟΤΕ δεν ρίχνεις κατάλογο υπηρεσιών. Οδηγείς με ερωτήσεις:",
    "1. Situation: Μάθε την επιχείρηση ('Με τι ασχολείστε;')",
    "2. Problem: Βρες τον πόνο ('Ποια είναι η μεγαλύτερη πρόκληση online;')",
    "3. Implication: Συνέπειες ('Αυτό σημαίνει ότι χάνεις πελάτες κάθε μέρα...')",
    "4. Need-Payoff: Λύση ως αναπόφευκτη ('Ακριβώς γι'αυτό σχεδιάζουμε...')",
    "",
    "ARXH 4 — ΑΠΑΓΟΡΕΥΕΤΑΙ ΝΑ ΔΩΣΕΙΣ ΤΙΜΕΣ",
    "ΠΟΤΕ δεν αναφέρεις τιμή, εύρος, κόστος ή πακέτο.",
    "Αν ρωτηθείς για τιμή, απαντάς ΑΚΡΙΒΩΣ:",
    "'Κάθε project είναι custom — χωρίς να ξέρω τι ακριβώς χρειάζεσαι, οποιοσδήποτε αριθμός θα ήταν αυθαίρετος.",
    "Άσε μου το email σου και σου φτιάχνω εξατομικευμένη πρόταση, δωρεάν, χωρίς καμία δέσμευση.' [SHOW_FORM]",
    "",
    "ARXH 5 — ΨΥΧΟΛΟΓΙΑ ΠΩΛΗΣΕΩΝ",
    "• Loss Aversion: 'Αυτή τη στιγμή πελάτες ψάχνουν αυτό που κάνεις — και βρίσκουν τον ανταγωνιστή σου.'",
    "• Framing: ΠΟΤΕ 'κόστος/έξοδο'. ΠΑΝΤΑ 'επένδυση/ROI/απόσβεση'.",
    "• Scarcity: 'Δεχόμαστε 3 νέους πελάτες τον μήνα — είμαστε selective για λόγους ποιότητας.'",
    "• Social Proof: Χρησιμοποίησε αποτελέσματα ως ζωντανές ιστορίες, όχι ως λίστα.",
    "• Ενεργητική ακρόαση: Ξεκίνα με 'Έχεις απόλυτο δίκιο', 'Κατανοητό', 'Αυτό το βλέπουμε συχνά'.",
    "",
    "ARXH 6 — LEAD CAPTURE",
    "Μετά από 3-4 γόνιμες ανταλλαγές, πες φυσικά:",
    "'Ξέρεις τι; Έχω ήδη μια καλή εικόνα για αυτό που χρειάζεσαι.",
    "Θέλω να σου στείλω εξατομικευμένη πρόταση — δωρεάν, χωρίς καμία δέσμευση.",
    "Πώς σε λένε και ποιο email να χρησιμοποιήσω;' [SHOW_FORM]",
    "",
    "ΚΡΙΤΙΚΟΣ ΚΑΝΟΝΑΣ: Κάθε φορά που ζητάς email ή στοιχεία επικοινωνίας,",
    "ΠΑΝΤΑ βάζεις [SHOW_FORM] στο τέλος. ΧΩΡΙΣ ΕΞΑΙΡΕΣΗ.",
    "",
    "== ΥΠΗΡΕΣΙΕΣ ==",
    servicesText,
    "",
    "== ΑΠΟΔΕΔΕΙΓΜΕΝΑ ΑΠΟΤΕΛΕΣΜΑΤΑ (χρησιμοποίησε ως stories) ==",
    proofText,
    "",
    "== ΑΝΤΙΡΡΗΣΕΙΣ ==",
    objectionsText,
    "",
    "ΕΤΑΙΡΕΙΑ: DIGIADS | Κολοκοτρώνη 34, Ρέθυμνο | info@digiads.gr",
    "ΠΟΤΕ δεν δίνεις τηλέφωνο. ΠΟΤΕ δεν δίνεις τιμές. Μόνο email ή φόρμα.",
  ].join("\n");
}

// ============================================================
// EMAIL HTML TEMPLATES
// ============================================================

export function buildLeadConfirmationEmail(data: {
  name: string;
  service: string;
  chatSummary: string;
}): string {
  const { name, service, chatSummary } = data;
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Επιβεβαίωση Αίτησης — DIGIADS</title>
</head>
<body style="margin:0;padding:0;background:#010205;font-family:'Inter',Arial,sans-serif;">

<!-- Outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#010205;padding:40px 20px;">
<tr><td align="center">

<!-- Card -->
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#060b1a;border-radius:20px;border:1px solid rgba(0,217,255,0.12);overflow:hidden;">

  <!-- Header gradient bar -->
  <tr>
    <td style="background:linear-gradient(135deg,#00d9ff,#0055ff);padding:4px 0;"></td>
  </tr>

  <!-- Logo / Brand -->
  <tr>
    <td style="padding:40px 48px 32px;text-align:center;">
      <div style="display:inline-flex;align-items:center;gap:12px;">
        <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#00d9ff,#0055ff);display:inline-flex;align-items:center;justify-content:center;">
          <span style="color:#010205;font-weight:900;font-size:18px;line-height:1;">D</span>
        </div>
        <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:0.08em;">DIGIADS</span>
      </div>
      <p style="color:rgba(0,217,255,0.7);font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:8px 0 0;">Virtual Sales Agent · DIGI</p>
    </td>
  </tr>

  <!-- Greeting -->
  <tr>
    <td style="padding:0 48px 32px;">
      <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0 0 12px;line-height:1.2;">
        Λάβαμε την αίτησή σου! ✅
      </h1>
      <p style="color:rgba(255,255,255,0.65);font-size:16px;line-height:1.6;margin:0;">
        Γεια σου <strong style="color:#ffffff;">${name}</strong>, ευχαριστούμε για την εμπιστοσύνη σου στη DIGIADS. 
        Η ομάδα μας θα επικοινωνήσει μαζί σου <strong style="color:#00d9ff;">το συντομότερο</strong> με μια εξατομικευμένη πρόταση.
      </p>
    </td>
  </tr>

  <!-- Divider -->
  <tr>
    <td style="padding:0 48px;">
      <div style="height:1px;background:rgba(255,255,255,0.06);"></div>
    </td>
  </tr>

  <!-- Summary box -->
  <tr>
    <td style="padding:32px 48px;">
      <p style="color:rgba(0,217,255,0.8);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;margin:0 0 16px;font-weight:600;">Σύνοψη Αίτησης</p>
      
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(0,217,255,0.04);border:1px solid rgba(0,217,255,0.1);border-radius:12px;">
        <tr>
          <td style="padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="8">
              <tr>
                <td style="color:rgba(255,255,255,0.45);font-size:12px;padding:6px 0;width:40%;">Υπηρεσία ενδιαφέροντος</td>
                <td style="color:#ffffff;font-size:13px;font-weight:600;padding:6px 0;">${service || "Γενική πληροφόρηση"}</td>
              </tr>
              <tr>
                <td style="color:rgba(255,255,255,0.45);font-size:12px;padding:6px 0;">Κατάσταση</td>
                <td style="padding:6px 0;"><span style="background:rgba(34,197,94,0.15);color:#22c55e;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;border:1px solid rgba(34,197,94,0.2);">✓ Αίτηση Ελήφθη</span></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Chat summary -->
  ${chatSummary ? `
  <tr>
    <td style="padding:0 48px 32px;">
      <p style="color:rgba(0,217,255,0.8);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;margin:0 0 16px;font-weight:600;">Η συνομιλία σου με τον DIGI</p>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px 24px;">
        <p style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.7;margin:0;white-space:pre-line;">${chatSummary}</p>
      </div>
    </td>
  </tr>
  ` : ""}

  <!-- Divider -->
  <tr>
    <td style="padding:0 48px;">
      <div style="height:1px;background:rgba(255,255,255,0.06);"></div>
    </td>
  </tr>

  <!-- What's next -->
  <tr>
    <td style="padding:32px 48px;">
      <p style="color:rgba(0,217,255,0.8);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;margin:0 0 20px;font-weight:600;">Τι γίνεται στη συνέχεια;</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${[
          ["01", "Αξιολόγηση", "Αναλύουμε τις ανάγκες σου και τον κλάδο σου"],
          ["02", "Εξατομικευμένη Πρόταση", "Ετοιμάζουμε πρόταση με συγκεκριμένο πλάνο & τιμές"],
          ["03", "Συνεργασία", "Αν αποφασίσεις να συνεργαστούμε, ξεκινάμε αμέσως"],
        ].map(([num, title, desc]) => `
        <tr>
          <td style="padding:10px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:36px;vertical-align:top;padding-top:2px;">
                  <div style="width:28px;height:28px;border-radius:8px;background:rgba(0,217,255,0.1);border:1px solid rgba(0,217,255,0.2);text-align:center;line-height:28px;">
                    <span style="color:#00d9ff;font-size:11px;font-weight:800;">${num}</span>
                  </div>
                </td>
                <td style="padding-left:14px;">
                  <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 3px;">${title}</p>
                  <p style="color:rgba(255,255,255,0.45);font-size:12px;margin:0;">${desc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`).join("")}
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:0 48px 40px;text-align:center;">
      <a href="mailto:info@digiads.gr" style="display:inline-block;background:linear-gradient(135deg,#00d9ff,#0055ff);color:#010205;font-size:14px;font-weight:800;padding:16px 36px;border-radius:50px;text-decoration:none;letter-spacing:0.05em;">
        Επικοινωνία — info@digiads.gr
      </a>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:rgba(0,0,0,0.2);padding:24px 48px;text-align:center;border-top:1px solid rgba(255,255,255,0.04);">
      <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0;line-height:1.6;">
        DIGIADS Digital Agency · Κολοκοτρώνη 34, Ρέθυμνο, Κρήτη<br/>
        <a href="https://www.digiads.gr" style="color:rgba(0,217,255,0.5);text-decoration:none;">www.digiads.gr</a>
        &nbsp;·&nbsp;
        <a href="mailto:info@digiads.gr" style="color:rgba(0,217,255,0.5);text-decoration:none;">info@digiads.gr</a>
      </p>
      <p style="color:rgba(255,255,255,0.15);font-size:10px;margin:12px 0 0;">© ${year} DIGIADS. Powered by DIGI AI Sales Agent.</p>
    </td>
  </tr>

</table>
<!-- /Card -->

</td></tr>
</table>
<!-- /Outer wrapper -->

</body>
</html>`;
}

export function buildOwnerNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  chatSummary: string;
}): string {
  const { name, email, phone, service, chatSummary } = data;
  const now = new Date().toLocaleString("el-GR", { timeZone: "Europe/Athens" });
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="el">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#010205;font-family:'Inter',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#010205;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#060b1a;border-radius:20px;border:1px solid rgba(168,85,247,0.2);overflow:hidden;">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#a855f7,#7c3aed);padding:4px 0;"></td></tr>

  <tr>
    <td style="padding:36px 48px 28px;">
      <p style="color:rgba(168,85,247,0.8);font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px;font-weight:600;">🔔 DIGI Agent Notification</p>
      <h1 style="color:#ffffff;font-size:26px;font-weight:800;margin:0;line-height:1.2;">Νέο Lead! 🎯</h1>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:8px 0 0;">${now}</p>
    </td>
  </tr>

  <tr>
    <td style="padding:0 48px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(168,85,247,0.05);border:1px solid rgba(168,85,247,0.15);border-radius:14px;">
        <tr><td style="padding:24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["👤 Όνομα", name],
              ["📧 Email", `<a href="mailto:${email}" style="color:#a855f7;text-decoration:none;">${email}</a>`],
              ["📱 Τηλέφωνο", phone || "—"],
              ["🎯 Υπηρεσία", service || "Γενική πληροφόρηση"],
            ].map(([label, value]) => `
            <tr>
              <td style="color:rgba(255,255,255,0.4);font-size:12px;padding:8px 0;width:35%;vertical-align:top;">${label}</td>
              <td style="color:#ffffff;font-size:14px;font-weight:600;padding:8px 0;">${value}</td>
            </tr>`).join("")}
          </table>
        </td></tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:0 48px 32px;">
      <p style="color:rgba(168,85,247,0.8);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;margin:0 0 14px;font-weight:600;">Ιστορικό Συνομιλίας (DIGI)</p>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px 24px;">
        <p style="color:rgba(255,255,255,0.6);font-size:13px;line-height:1.7;margin:0;white-space:pre-line;">${chatSummary || "—"}</p>
      </div>
    </td>
  </tr>

  <tr>
    <td style="padding:0 48px 40px;text-align:center;">
      <a href="mailto:${email}" style="display:inline-block;background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;font-size:14px;font-weight:800;padding:16px 36px;border-radius:50px;text-decoration:none;letter-spacing:0.05em;">
        Απάντηση στον ${name} →
      </a>
    </td>
  </tr>

  <tr>
    <td style="background:rgba(0,0,0,0.2);padding:20px 48px;text-align:center;border-top:1px solid rgba(255,255,255,0.04);">
      <p style="color:rgba(255,255,255,0.2);font-size:10px;margin:0;">© ${year} DIGIADS · DIGI AI Sales Agent Internal Report</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
