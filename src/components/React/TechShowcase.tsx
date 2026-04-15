"use client";

import { useEffect, useState } from "react";

export default function TechShowcase({ lang = 'el' }: { lang?: 'el' | 'en' }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = {
      el: {
          cat: "Web Architecture",
          title1: "Αισθητική που εμπνέει. ",
          title2: "Τεχνολογία που συναρπάζει.",
          desc: "Σχεδιάζουμε ψηφιακές εμπειρίες που καθηλώνουν. Kάθε γραμμή κώδικα βελτιστοποιείται για να προσφέρει αξεπέραστη ταχύτητα, κορυφαία ασφάλεια και διεθνή πρότυπα UX/UI.",
          c1: { title: "Lighthouse Verified", desc: "Απόλυτη εναρμόνιση με τα ποιοτικά κριτήρια της Google. Αψεγάδιαστη απόδοση σε Performance, Accessibility και SEO, προσφέροντας την ιδανική βάση για οργανική ανάπτυξη." },
          c2: { title: "Instant Render (Astro)", desc: "Ο χρόνος φόρτωσης εκμηδενίζεται. Χρησιμοποιώντας SSG (Static Site Generation), η εμπειρία πλοήγησης είναι ακαριαία, κρατώντας την προσοχή του επισκέπτη." },
          c3: { title: "Serverless Security", desc: "Βασισμένοι σε decoupled συστήματα (Headless), εξαλείφουμε τα παραδοσιακά κενά ασφαλείας του WordPress. Ο κώδικας σας παραμένει απροσπέλαστος." }
      },
      en: {
          cat: "Web Architecture",
          title1: "Aesthetics that inspire. ",
          title2: "Technology that thrills.",
          desc: "We design digital experiences that captivate. Every line of code is optimized to deliver unparalleled speed, top-tier security, and international UX/UI standards.",
          c1: { title: "Lighthouse Verified", desc: "Absolute compliance with Google's quality criteria. Flawless performance in Performance, Accessibility, and SEO, providing the ideal foundation for organic growth." },
          c2: { title: "Instant Render (Astro)", desc: "Load time is eliminated. Using SSG (Static Site Generation), the browsing experience is instantaneous, retaining the visitor's attention." },
          c3: { title: "Serverless Security", desc: "Based on decoupled systems (Headless), we eliminate traditional WordPress security gaps. Your code remains impenetrable." }
      }
  };

  const t = content[lang];

  return (
    <section id="tech" className="py-40 relative bg-[#010205] overflow-hidden border-t border-[#00d9ff]/10">
      {/* Background Zen Grid */}
      <div className="absolute inset-0 z-0 opacity-10">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [perspective:1000px] [transform:rotateX(70deg)_translateY(-50px)_scale(3)] [transform-origin:top_center]" />
      </div>
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Sophisticated Header - No Catchphrases, Just Quality */}
        <div className="text-center mb-24 flex flex-col items-center">
          <div className="inline-flex items-center gap-4 mb-6">
             <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#00d9ff]" />
             <h2 className="text-[#00d9ff] font-mono text-sm tracking-[0.4em] uppercase">{t.cat}</h2>
             <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#00d9ff]" />
          </div>
          <h3 className="text-4xl md:text-6xl font-light text-white font-montserrat tracking-tight leading-tight max-w-3xl">
            {t.title1}<br/>
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-500">
              {t.title2}
            </span>
          </h3>
          <p className="mt-8 text-slate-400 max-w-2xl text-lg font-light">
            {t.desc}
          </p>
        </div>

        {/* 3D Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className={`group relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-transparent transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative h-full bg-[#030509] p-10 rounded-[23px] overflow-hidden">
               {/* Hover Glow */}
               <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-[#00d9ff] rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-all duration-700" />
               
               <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-6 font-montserrat">
                 100<span className="text-xl font-light">/100</span>
               </div>
               <h4 className="text-xl text-white font-bold mb-4">{t.c1.title}</h4>
               <p className="text-slate-400 font-light text-sm leading-relaxed">
                 {t.c1.desc}
               </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className={`group relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-transparent transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative h-full bg-[#030509] p-10 rounded-[23px] overflow-hidden">
               {/* Hover Glow */}
               <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-purple-500 rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-all duration-700" />
               
               <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-6 font-montserrat">
                  &lt;1s
               </div>
               <h4 className="text-xl text-white font-bold mb-4">{t.c2.title}</h4>
               <p className="text-slate-400 font-light text-sm leading-relaxed">
                 {t.c2.desc}
               </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className={`group relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-transparent transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative h-full bg-[#030509] p-10 rounded-[23px] overflow-hidden">
               {/* Hover Glow */}
               <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-emerald-500 rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-all duration-700" />
               
               <div className="flex items-center gap-3 mb-6">
                 <div className="relative flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                 </div>
                 <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 font-montserrat">
                   Vault
                 </div>
               </div>
               
               <h4 className="text-xl text-white font-bold mb-4">{t.c3.title}</h4>
               <p className="text-slate-400 font-light text-sm leading-relaxed">
                 {t.c3.desc}
               </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
