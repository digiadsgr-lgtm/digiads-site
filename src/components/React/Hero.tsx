"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface HeroProps {
  lang: 'el' | 'en';
}

const content = {
  el: {
    badge: "Digital Marketing Agency · Κρήτη",
    headlines: ["GROWTH.", "ΑΠΟΤΕΛΕΣΜΑΤΑ.", "ΕΠΕΚΤΑΣΗ.", "ΚΥΡΙΑΡΧΙΑ."],
    subhead: "Δεν είναι απλώς διαφήμιση. Είναι μεθοδική χρήση συστημάτων και growth hacking για αύξηση καθαρής κερδοφορίας και οικοδόμηση κορυφαίου Brand Equity.",
    ctaPrimary: "Start Growth",
    ctaSecondary: "Free AI Audit →",
  },
  en: {
    badge: "Digital Marketing Agency · Crete",
    headlines: ["GROWTH.", "RESULTS.", "REVENUE.", "DOMINANCE."],
    subhead: "It's not just advertising. It's the methodical use of systems and growth hacking to increase net profitability and build top-tier Brand Equity.",
    ctaPrimary: "Start Growth",
    ctaSecondary: "Free AI Audit →",
  }
};

export default function Hero({ lang = 'el' }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const data = content[lang];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % data.headlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [data.headlines.length]);

  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#010205]">
      {/* Ultra-Fast Static CSS Background (Zero WebGL Overhead) */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[#00d9ff]/[0.02] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00d9ff] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />
         <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10" />
      </div>

      {/* Layered Gradient Overlays */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#010205_75%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010205] via-transparent to-[#010205]/50" />
      </div>

      {/* Main Content */}
      <div className="relative z-[2] container mx-auto px-6 pt-20">
        <div className={`flex flex-col items-center text-center transform transition-all duration-[2500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
          
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d9ff] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d9ff]" />
            </span>
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/60 uppercase">{data.badge}</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[140px] font-light tracking-tighter leading-[0.9] mb-4 font-montserrat text-white">
            DATA-DRIVEN.
          </h1>
          <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-[140px] font-light tracking-tighter leading-[0.9] mb-4 font-montserrat">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-600">
              AI-POWERED.
            </span>
          </h2>
          
          {/* Animated rotating word */}
          <div className="h-[60px] sm:h-[80px] md:h-[100px] lg:h-[150px] overflow-hidden relative">
            <motion.h2
              key={headlineIndex}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-8xl lg:text-[140px] font-black tracking-tighter leading-[0.9] font-montserrat text-[#00d9ff]"
            >
              {data.headlines[headlineIndex]}
            </motion.h2>
          </div>

          {/* Subhead */}
          <motion.p
            className="max-w-3xl text-base sm:text-lg md:text-xl text-slate-400 font-light mt-8 mb-14 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.2 }}
          >
            {data.subhead.split('μεθοδική χρήση συστημάτων').map((part, i, arr) => 
               i < arr.length - 1 ? <span key={i}>{part}<strong className="text-white font-medium">μεθοδική χρήση συστημάτων</strong></span> : <span key={i}>{part}</span>
            )}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <a
              href="#services"
              className="group relative px-10 py-5 bg-[#00d9ff] text-black rounded-full font-bold text-sm tracking-[0.15em] uppercase overflow-hidden hover:shadow-[0_10px_40px_rgba(0,217,255,0.4)] hover:scale-[1.03] transition-all duration-500"
            >
              <span className="relative z-10">{data.ctaPrimary}</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="absolute inset-0 flex items-center justify-center text-black font-bold text-sm tracking-[0.15em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">{data.ctaPrimary}</span>
            </a>
            <a
              href="#audit"
              className="px-10 py-5 border border-white/10 text-white rounded-full font-medium text-sm tracking-[0.15em] uppercase hover:bg-white/5 hover:border-white/20 transition-all duration-500"
            >
              {data.ctaSecondary}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[2]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1 h-1.5 rounded-full bg-white"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
