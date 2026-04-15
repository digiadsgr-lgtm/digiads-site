import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AuditResult {
  performance: number;
  seo: number;
  security: number;
  mobile: number;
  issues: string[];
  opportunities: string[];
}

const mockAudit = (url: string, lang: 'el' | 'en'): AuditResult => {
  const seed = url.length % 40;
  return {
    performance: Math.max(25, Math.min(68, 30 + seed)),
    seo: Math.max(20, Math.min(55, 25 + seed * 0.8)),
    security: Math.max(30, Math.min(70, 40 + seed * 0.5)),
    mobile: Math.max(35, Math.min(60, 35 + seed * 0.7)),
    issues: lang === 'el' ? [
      "Αργός χρόνος φόρτωσης (LCP > 4s)",
      "Δεν υπάρχει SSL/HTTPS configuration",
      "Μη βελτιστοποιημένες εικόνες (> 2MB)",
      "Χαμηλό Core Web Vitals score",
      "Ελλιπές Schema.org markup",
    ] : [
      "Slow load time (LCP > 4s)",
      "Missing SSL/HTTPS configuration",
      "Unoptimized images (> 2MB)",
      "Low Core Web Vitals score",
      "Missing Schema.org markup",
    ],
    opportunities: lang === 'el' ? [
      "Μετάβαση σε Astro/Next.js → +300% ταχύτητα",
      "Image optimization → -80% μέγεθος σελίδας",
      "SEO restructuring → +150% organic traffic",
      "Mobile-first redesign → +90% conversions",
    ] : [
      "Migrate to Astro/Next.js → +300% speed",
      "Image optimization → -80% page size",
      "SEO restructuring → +150% organic traffic",
      "Mobile-first redesign → +90% conversions",
    ],
  };
};

function CircularScore({ score, label, color, delay }: { score: number; label: string; color: string; delay: number }) {
  const [displayScore, setDisplayScore] = useState(0);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        if (current >= score) {
          clearInterval(interval);
          setDisplayScore(score);
        } else {
          setDisplayScore(current);
        }
      }, 20);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [score, delay]);

  const getScoreColor = (s: number) => {
    if (s >= 80) return "#22c55e";
    if (s >= 50) return "#eab308";
    return "#ef4444";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke={getScoreColor(displayScore)}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-white font-montserrat">{displayScore}</span>
        </div>
      </div>
      <span className="text-xs font-mono tracking-widest uppercase text-slate-400">{label}</span>
    </div>
  );
}

const contentData = {
  el: {
    badge: "AI-Powered Analysis",
    titleStart: "Πόσο γρήγορη είναι",
    titleEnd: "η ιστοσελίδα σας;",
    subhead: "Βάλτε το URL σας και η AI μας θα αναλύσει σε πραγματικό χρόνο την απόδοση, ασφάλεια και SEO score του site σας.",
    placeholder: "https://your-website.gr",
    btnAudit: "Audit Now",
    btnScanning: "Analyzing...",
    scanSteps: [
      "Σύνδεση με τον server...",
      "Ανάλυση DOM structure...",
      "Έλεγχος Core Web Vitals...",
      "SEO Schema analysis...",
      "Mobile responsiveness check...",
      "Security audit...",
      "Δημιουργία αναφοράς...",
    ],
    resultsTitleIssues: "Κρίσιμα Ευρήματα",
    resultsTitleOpp: "Ευκαιρίες Ανάπτυξης",
    cta1: "Θέλετε να δείτε ",
    cta2: " στα αποτελέσματά σας;",
    ctaBtn: "Κλείστε Δωρεάν Συνεδρία",
  },
  en: {
    badge: "AI-Powered Analysis",
    titleStart: "How fast is",
    titleEnd: "your website?",
    subhead: "Enter your URL and our AI will analyze your site's performance, security, and SEO score in real time.",
    placeholder: "https://your-website.com",
    btnAudit: "Audit Now",
    btnScanning: "Analyzing...",
    scanSteps: [
      "Connecting to server...",
      "Analyzing DOM structure...",
      "Checking Core Web Vitals...",
      "SEO Schema analysis...",
      "Mobile responsiveness check...",
      "Security audit...",
      "Generating report...",
    ],
    resultsTitleIssues: "Critical Issues",
    resultsTitleOpp: "Growth Opportunities",
    cta1: "Do you want to see a ",
    cta2: " on your results?",
    ctaBtn: "Book a Free Session",
  }
}

export default function SiteAuditor({ lang = 'el' }: { lang?: 'el' | 'en' }) {
  const [url, setUrl] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const content = contentData[lang];

  const runAudit = async () => {
    if (!url.trim()) return;
    setIsAuditing(true);
    setResult(null);
    setProgress(0);

    const steps = content.scanSteps;

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300));
      setProgress(((i + 1) / steps.length) * 100);
    }

    setResult(mockAudit(url, lang));
    setIsAuditing(false);
  };

  return (
    <section className="py-32 relative bg-[#010205] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00d9ff] rounded-full blur-[300px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#00d9ff]/20 bg-[#00d9ff]/5 backdrop-blur-md mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d9ff] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d9ff]" />
            </span>
            <span className="text-[11px] font-mono tracking-[0.3em] text-[#00d9ff] uppercase">{content.badge}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white font-montserrat tracking-tight mb-6">
            {content.titleStart} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-blue-500">{content.titleEnd}</span>
          </h2>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
            {content.subhead}
          </p>
        </div>

        {/* Input Area */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#00d9ff]/50 via-blue-500/50 to-purple-500/50 rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 blur-[1px]" />
            <div className="relative flex items-center bg-[#050814] rounded-2xl border border-white/10 overflow-hidden flex-col sm:flex-row">
              <div className="pl-5 text-slate-500 hidden sm:block">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runAudit()}
                placeholder={content.placeholder}
                className="w-full flex-1 bg-transparent px-5 py-5 text-white placeholder-slate-600 outline-none font-mono text-sm"
              />
              <button
                onClick={runAudit}
                disabled={isAuditing || !url.trim()}
                className="w-full sm:w-auto px-8 py-4 sm:mr-2 sm:my-2 bg-[#00d9ff] text-black font-bold text-sm tracking-wider sm:rounded-xl hover:bg-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed uppercase"
              >
                {isAuditing ? content.btnScanning : content.btnAudit}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <AnimatePresence>
          {isAuditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto mb-16"
            >
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00d9ff] to-blue-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs font-mono text-slate-500 mt-3 text-center tracking-wider">
                Scanning {url}...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Score Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 p-8 bg-[#050814]/50 border border-white/5 rounded-3xl backdrop-blur-sm">
                <CircularScore score={result.performance} label="Performance" color="#ef4444" delay={0} />
                <CircularScore score={result.seo} label="SEO" color="#eab308" delay={200} />
                <CircularScore score={result.security} label="Security" color="#ef4444" delay={400} />
                <CircularScore score={result.mobile} label="Mobile" color="#eab308" delay={600} />
              </div>

              {/* Issues & Opportunities */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#050814] border border-red-500/10 rounded-3xl p-8">
                  <h3 className="text-lg font-bold text-red-400 mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    {content.resultsTitleIssues}
                  </h3>
                  <ul className="space-y-4">
                    {result.issues.map((issue, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="text-sm text-slate-400 flex items-start gap-3"
                      >
                        <span className="text-red-500 mt-0.5">✕</span>
                        {issue}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#050814] border border-[#00d9ff]/10 rounded-3xl p-8">
                  <h3 className="text-lg font-bold text-[#00d9ff] mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00d9ff]" />
                    {content.resultsTitleOpp}
                  </h3>
                  <ul className="space-y-4">
                    {result.opportunities.map((opp, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 + i * 0.1 }}
                        className="text-sm text-slate-400 flex items-start gap-3"
                      >
                        <span className="text-[#00d9ff] mt-0.5">→</span>
                        {opp}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA after results */}
              <motion.div
                className="text-center mt-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <p className="text-slate-400 mb-6 text-lg">
                  {content.cta1}<strong className="text-white">100/100</strong>{content.cta2}
                </p>
                <a
                  href="mailto:info@digiads.gr"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#00d9ff] to-blue-500 text-black font-bold rounded-full hover:shadow-[0_10px_40px_rgba(0,217,255,0.3)] hover:scale-105 transition-all duration-500 text-sm tracking-wider uppercase"
                >
                  {content.ctaBtn}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
