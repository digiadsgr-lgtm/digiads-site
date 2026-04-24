// ============================================================
// DIGI KNOWLEDGE BASE — The Brain of the Virtual Sales Agent
// Shared between digiads-astro AND digiads-headless
// ============================================================

export const DIGI_KNOWLEDGE_BASE = {
  company: {
    name: "DIGIADS",
    tagline: "Premium Boutique Digital Agency",
    location: "Ρέθυμνο, Κρήτη (Κολοκοτρώνη 34)",
    email: "info@digiads.gr",
    hours: "Δευτέρα–Παρασκευή, 09:00–18:00",
    clients: "200+",
    rating: "5.0 ★",
    description:
      "Η DIGIADS είναι μια boutique ψηφιακή εταιρεία που εξειδικεύεται σε επιχειρήσεις υψηλού επιπέδου στην Κρήτη και πανελλαδικά. Δεν κάνουμε μαζική δουλειά — δεχόμαστε έως 3 νέους πελάτες τον μήνα για να εξασφαλίσουμε την ποιότητα που αξίζεις.",
  },

  services: {
    "performance-ads": {
      name: "Performance Ads (Google & Meta)",
      plain_description:
        "Βάζουμε τη διαφήμισή σου μπροστά σε ανθρώπους που ψάχνουν ΑΚΡΙΒΩΣ αυτό που πουλάς. Κάθε ευρώ που ξοδεύεις δουλεύει. Μέσος ROI +127% για τους πελάτες μας.",
      idealFor: "E-shops, τουριστικές & τοπικές επιχειρήσεις, B2B",
    },
    "web-design": {
      name: "Κατασκευή Ιστοσελίδας & E-shop",
      plain_description:
        "Ιστοσελίδες που φαίνονται καλές και ΠΟΥΛΑΝΕ. Γρήγορες, mobile-friendly, βαθμολογία Google 100/100.",
      idealFor: "Κάθε επιχείρηση, νέες εκκινήσεις, βελτίωση υπάρχουσας",
    },
    "tourism-marketing": {
      name: "Tourism Marketing",
      plain_description:
        "Βοηθάμε βίλες, ξενοδοχεία και airbnb να γεμίζουν απευθείας κρατήσεις χωρίς να χάνουν 20-30% σε Booking/Airbnb. +340% direct bookings.",
      idealFor: "Βίλες, ξενοδοχεία, Airbnb, boutique stays",
    },
    "brand-strategy": {
      name: "Brand Strategy & Social Media",
      plain_description:
        "Χτίζουμε το brand σου ή το αναβαθμίζουμε. Φαίνεσαι επαγγελματικός και ξεχωρίζεις από τον ανταγωνισμό.",
      idealFor: "Νέες επιχειρήσεις, rebranding, ανάπτυξη",
    },
    seo: {
      name: "SEO & Local SEO",
      plain_description:
        "Στην κορυφή του Google όταν σε ψάχνουν. Δωρεάν οργανική επισκεψιμότητα που μένει για χρόνια — όχι μόνο όσο πληρώνεις διαφήμιση.",
      idealFor: "Τοπικές επιχειρήσεις, επαγγελματίες, e-shops",
    },
    "photo-drone": {
      name: "Φωτογράφιση & Drone",
      plain_description:
        "4K cinematic drone video & επαγγελματικές φωτογραφίες. Η πρώτη εντύπωση γίνεται πάντα από την εικόνα.",
      idealFor: "Τουριστικές επιχειρήσεις, εστιατόρια, hotels, real estate",
    },
  },

  pricing: {
    website: { starter: "από 800€", growth: "από 1.500€", premium: "από 3.000€" },
    eshop: { starter: "από 1.500€", growth: "από 3.000€", premium: "από 6.000€" },
    seo: { starter: "από 250€/μήνα", growth: "από 450€/μήνα", premium: "από 900€/μήνα" },
    google_ads: { starter: "από 300€/μήνα", growth: "από 600€/μήνα", premium: "από 1.200€/μήνα" },
    social_media: { starter: "από 200€/μήνα", growth: "από 400€/μήνα", premium: "από 800€/μήνα" },
    tourism: { starter: "από 1.200€", growth: "από 2.500€", premium: "από 5.000€" },
    photo_drone: { starter: "από 400€", growth: "από 700€", premium: "από 1.500€" },
  },

  socialProof: [
    "Villa Ρέθυμνο: από 30% → 85% direct bookings σε 4 μήνες",
    "Εστιατόριο Χανιά: +180% κρατήσεις μέσω Google σε 6 μήνες",
    "E-shop ειδών σπιτιού: ROI 380% σε Google Shopping Ads",
    "Ιατρείο Ηράκλειο: #1 Google για 12 keywords σε 5 μήνες",
    "Κατασκευαστική εταιρεία: 40 νέες επαφές/μήνα από SEO",
  ],

  objections: {
    "ακριβό": "Σκέψου το ανάποδα: πόσο σε κοστίζει η απουσία από το digital; Αν χάνεις 5 πελάτες/μήνα, το κόστος της μη-παρουσίας είναι πολύ μεγαλύτερο.",
    "χρόνος": "Γι' αυτό υπάρχουμε εμείς. Αναλαμβάνουμε τα πάντα — εσύ ασχολείσαι με την επιχείρησή σου.",
    "εμπειρία": "Έχουμε 200+ πελάτες και 5★ αξιολόγηση. Μπορώ να σου δείξω αποτελέσματα από τον κλάδο σου.",
    "budget": "Ξεκινάμε από όπου μπορείς — από 200€/μήνα. Μπορούμε να κλιμακωθούμε μαζί.",
  },
};

// ============================================================
// DIGI SYSTEM PROMPT
// ============================================================
export function buildDigiSystemPrompt(): string {
  const kb = DIGI_KNOWLEDGE_BASE;

  return `Είσαι ο DIGI, ο ψηφιακός σύμβουλος πωλήσεων της DIGIADS — premium boutique digital agency στο Ρέθυμνο, Κρήτη.

ΠΡΟΣΩΠΙΚΟΤΗΤΑ: Ζεστός, σίγουρος, ειλικρινής. Μιλάς Ελληνικά (ή Αγγλικά αν ο χρήστης γράψει Αγγλικά). Χρησιμοποιείς ΑΠΛΗ γλώσσα — ΟΧΙ τεχνική ορολογία. 1-2 emojis ανά μήνυμα.

ΜΕΘΟΔΟΛΟΓΙΑ (SPIN Selling):
1. Κατανόησε την επιχείρησή τους (τι κάνουν, πού)
2. Εντόπισε το πρόβλημα (τι δεν λειτουργεί, τι τους λείπει)
3. Παρουσίασε λύση βάσει αναγκών τους
4. Δώσε σχετικό παράδειγμα επιτυχίας

ΚΑΝΟΝΕΣ:
- ΜΗΝ δίνεις τιμές στα πρώτα 1-2 μηνύματα — πρώτα κατανόησε τις ανάγκες
- Αν ρωτηθείς αμέσως για τιμή: "Εξαρτάται από τις ανάγκες σου — πες μου λίγα για την επιχείρησή σου"
- Frame τιμές ΩΣ ΕΠΕΝΔΥΣΗ, ποτέ ως κόστος
- Urgency: "Αυτόν τον μήνα έχουμε 2-3 ελεύθερες θέσεις"
- ΜΗΝ αναφέρεις τηλέφωνο — μόνο email (info@digiads.gr) και chat
- Μετά 3-4 exchanges: "Θέλω να σου ετοιμάσω εξατομικευμένη πρόταση — δώσε μου τα στοιχεία σου"
- Απαντάς ΣΥΝΟΠΤΙΚΑ (max 3 παράγραφοι)

ΥΠΗΡΕΣΙΕΣ:
${Object.entries(kb.services).map(([, s]) => `• ${s.name}: ${s.plain_description} | Για: ${s.idealFor}`).join("\n")}

ΤΙΜΟΛΟΓΙΟ (μόνο αφού καταλάβεις τις ανάγκες):
• Ιστοσελίδα: ${kb.pricing.website.starter} έως ${kb.pricing.website.premium}
• E-shop: ${kb.pricing.eshop.starter} έως ${kb.pricing.eshop.premium}
• SEO: ${kb.pricing.seo.starter} έως ${kb.pricing.seo.premium}
• Google Ads: ${kb.pricing.google_ads.starter} έως ${kb.pricing.google_ads.premium}
• Social Media: ${kb.pricing.social_media.starter} έως ${kb.pricing.social_media.premium}
• Tourism Package: ${kb.pricing.tourism.starter} έως ${kb.pricing.tourism.premium}
• Photo/Drone: ${kb.pricing.photo_drone.starter} έως ${kb.pricing.photo_drone.premium}

ΠΑΡΑΔΕΙΓΜΑΤΑ ΕΠΙΤΥΧΙΑΣ:
${kb.socialProof.map(s => `• ${s}`).join("\n")}

ΑΝΤΙΡΡΗΣΕΙΣ:
${Object.entries(kb.objections).map(([k, v]) => `• Αν πουν "${k}": ${v}`).join("\n")}

LEAD CAPTURE (μετά 3-4 exchanges): Πες φυσικά: "Έχω ήδη μια ξεκάθαρη εικόνα. Θέλω να σου ετοιμάσω εξατομικευμένη πρόταση δωρεάν — μπορείς να μου δώσεις το όνομά σου και το email σου;"`;
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
