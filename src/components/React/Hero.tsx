"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface HeroProps {
  lang: 'el' | 'en';
}

const content = {
  el: {
    badge: "Digital Authority Platform · Rethymno",
    headlines: ["DOMINATE.", "EXPAND.", "CONVERT.", "REVENUE."],
    subhead: "Σταματήστε να ξοδεύετε σε απλές διαφημίσεις. Χτίζουμε Cloud-Native οικοσυστήματα και data-driven marketing funnels που μετατρέπουν το Brand σας σε Market Leader.",
    ctaPrimary: "ΚΥΡΙΑΡΧΗΣΤΕ ΣΤΗΝ ΑΓΟΡΑ",
    ctaSecondary: "Free System Audit →",
  },
  en: {
    badge: "Digital Authority Platform · Rethymno",
    headlines: ["DOMINATE.", "EXPAND.", "CONVERT.", "REVENUE."],
    subhead: "Stop spending on basic ads. We build Cloud-Native ecosystems and data-driven marketing funnels that transform your Brand into a Market Leader.",
    ctaPrimary: "CLAIM YOUR MARKET SHARE",
    ctaSecondary: "Free System Audit →",
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
    }, 3500);
    return () => clearInterval(interval);
  }, [data.headlines.length]);

  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#000000]">
      {/* Liquid Cyber CSS Background (Zero GPU Overhead) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[#00d9ff]/[0.015] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
         <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00d9ff] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse" />
         <div className="absolute bottom-[-100px] right-1/4 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10" />
      </div>

      {/* Deep Shadow Gradient Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000000_80%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/60 via-transparent to-[#000000]" />
      </div>

      {/* Semantic Content Hierarchy */}
      <div className="relative z-[2] container mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
          
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-[#00d9ff]/20 bg-[#00d9ff]/10 backdrop-blur-xl saturate-[1.5] mb-12 shadow-[0_0_30px_rgba(0,217,255,0.1)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d9ff]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-[#00d9ff] font-bold uppercase">{data.badge}</span>
          </motion.div>

          {/* Staggered Text Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[130px] font-black tracking-tighter leading-[0.85] mb-2 font-montserrat text-white">
              DATA-DRIVEN.
            </h1>
            <div className="text-4xl sm:text-6xl md:text-8xl lg:text-[130px] font-black tracking-tighter leading-[0.85] mb-6 font-montserrat">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 drop-shadow-lg">
                AI-POWERED.
              </span>
            </div>
            
            {/* Animated Morphing Keyword */}
            <div className="h-[50px] sm:h-[80px] md:h-[100px] lg:h-[140px] overflow-hidden relative w-full flex justify-center">
              <motion.h2
                key={headlineIndex}
                initial={{ y: "100%", opacity: 0, rotateX: 45 }}
                animate={{ y: "0%", opacity: 1, rotateX: 0 }}
                exit={{ y: "-100%", opacity: 0, rotateX: -45 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-8xl lg:text-[130px] font-black tracking-tighter leading-[0.85] font-montserrat text-[#00d9ff] drop-shadow-[0_0_40px_rgba(0,217,255,0.4)]"
                style={{ transformOrigin: "bottom center" }}
              >
                {data.headlines[headlineIndex]}
              </motion.h2>
            </div>
          </motion.div>

          {/* Subhead CRO Optimization */}
          <motion.p
            className="max-w-2xl text-base md:text-xl text-slate-400 font-light mt-10 mb-14 leading-relaxed tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            {data.subhead}
          </motion.p>

          {/* Magnetic CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href="#services"
              className="group relative px-10 py-5 bg-gradient-to-r from-[#00d9ff] to-blue-500 text-black rounded-full font-black text-sm tracking-[0.2em] uppercase overflow-hidden hover:shadow-[0_0_50px_rgba(0,217,255,0.6)] hover:scale-[1.05] transition-all duration-500 w-full sm:w-auto text-center"
            >
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="relative z-10 mix-blend-difference text-white group-hover:text-black transition-colors duration-500">{data.ctaPrimary}</span>
            </a>
            <a
              href="#audit"
              className="px-10 py-5 border border-white/20 text-white rounded-full font-bold text-sm tracking-[0.2em] uppercase hover:bg-white/10 hover:border-white/40 backdrop-blur-md transition-all duration-500 w-full sm:w-auto text-center"
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
