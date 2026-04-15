import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const servicesData = {
  el: {
    badge: "Growth Engine",
    titleStart: "Κάθε υπηρεσία, ένα",
    titleEnd: "σύστημα ανάπτυξης.",
    subhead: "Δεν κάνουμε απλά digital marketing. Χτίζουμε ολοκληρωμένα οικοσυστήματα που μετατρέπουν κάθε ψηφιακό touchpoint σε κερδοφόρο asset.",
    items: [
      {
        id: "performance-ads",
        icon: (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
        title: "Performance Ads",
        subtitle: "Google · Meta · TikTok",
        description: "Απόλυτη κυριαρχία μέσω data-driven καμπανιών. Retargeting funnels, lookalike audiences και AI-optimized bidding strategies που συνθλίβουν τον ανταγωνισμό.",
        metrics: ["+127%", "Μέσος ROI"],
        color: "#00d9ff",
        href: "/services/performance-marketing",
      },
      {
        id: "web-design",
        icon: (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        ),
        title: "Web Design & E-shop",
        subtitle: "Next.js · Astro · Headless",
        description: "Ψηφιακά αρχιτεκτονικά αριστουργήματα. Κατασκευή ιστοσελίδων με 100/100 Lighthouse, CRO optimization και cinematic UX/UI που μετατρέπει επισκέπτες σε πελάτες.",
        metrics: ["100/100", "Lighthouse"],
        color: "#a855f7",
        href: "/services/web-design",
      },
      {
        id: "tourism",
        icon: (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        title: "Tourism Marketing",
        subtitle: "Villas · Hotels · Airbnb",
        description: "Απόλυτη εξειδίκευση στον τουριστικό τομέα της Κρήτης. Στρατηγικές προώθησης βιλών, ξενοδοχείων και boutique properties για μέγιστες direct bookings.",
        metrics: ["+340%", "Direct Bookings"],
        color: "#22c55e",
        href: "/services/tourism-marketing",
      },
      {
        id: "branding",
        icon: (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
        title: "Brand Strategy",
        subtitle: "Identity · Social · Content",
        description: "Τοποθετούμε το Brand σας ως τον απόλυτο ηγέτη της αγοράς σας. Social media management, content strategy και visual identity που δημιουργεί loyalty.",
        metrics: ["200+", "5-Star Reviews"],
        color: "#f59e0b",
        href: "/services/brand-strategy",
      },
      {
        id: "seo",
        icon: (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
        title: "SEO & Local SEO",
        subtitle: "Organic · Maps · LLM Ready",
        description: "Κυριαρχία στα οργανικά αποτελέσματα. Technical SEO, Local SEO mastery, Schema markup και LLM optimization για AI-ready παρουσία στα SERPs.",
        metrics: ["#1", "Rankings"],
        color: "#ec4899",
        href: "/services/seo",
      },
      {
        id: "photo-drone",
        icon: (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        title: "Photo & Drone",
        subtitle: "Aerial · Cinematic · 4K",
        description: "Παραγωγή high-end φωτογραφικού και εναέριου υλικού. Επαγγελματική φωτογράφιση, drone videography και 3D virtual tours για maximum impact.",
        metrics: ["4K", "Cinematic"],
        color: "#06b6d4",
        href: "/services/photo-drone",
      },
    ]
  },
  en: {
    badge: "Growth Engine",
    titleStart: "Every service, a",
    titleEnd: "system of growth.",
    subhead: "We don't just do digital marketing. We build complete ecosystems that turn every digital touchpoint into a profitable asset.",
    items: [
      {
        id: "performance-ads",
        icon: (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
        title: "Performance Ads",
        subtitle: "Google · Meta · TikTok",
        description: "Absolute dominance through data-driven campaigns. Retargeting funnels, lookalike audiences, and AI-optimized bidding strategies that crush the competition.",
        metrics: ["+127%", "Avg ROI"],
        color: "#00d9ff",
        href: "/en/services/performance-marketing",
      },
      {
        id: "web-design",
        icon: (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        ),
        title: "Web Design & E-shop",
        subtitle: "Next.js · Astro · Headless",
        description: "Digital architectural masterpieces. Building websites with 100/100 Lighthouse, CRO optimization, and cinematic UX/UI that turns visitors into clients.",
        metrics: ["100/100", "Lighthouse"],
        color: "#a855f7",
        href: "/en/services/web-design",
      },
      {
        id: "tourism",
        icon: (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        title: "Tourism Marketing",
        subtitle: "Villas · Hotels · Airbnb",
        description: "Absolute specialization in Crete's tourism sector. Promotion strategies for villas, hotels, and boutique properties for maximum direct bookings.",
        metrics: ["+340%", "Direct Bookings"],
        color: "#22c55e",
        href: "/en/services/tourism-marketing",
      },
      {
        id: "branding",
        icon: (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
        title: "Brand Strategy",
        subtitle: "Identity · Social · Content",
        description: "Positioning your brand as the absolute leader of your market. Social media management, content strategy, and visual identity that builds loyalty.",
        metrics: ["200+", "5-Star Reviews"],
        color: "#f59e0b",
        href: "/en/services/brand-strategy",
      },
      {
        id: "seo",
        icon: (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
        title: "SEO & Local SEO",
        subtitle: "Organic · Maps · LLM Ready",
        description: "Dominance in organic results. Technical SEO, Local SEO mastery, Schema markup, and LLM optimization for AI-ready presence in SERPs.",
        metrics: ["#1", "Rankings"],
        color: "#ec4899",
        href: "/en/services/seo",
      },
      {
        id: "photo-drone",
        icon: (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        title: "Photo & Drone",
        subtitle: "Aerial · Cinematic · 4K",
        description: "Production of high-end photographic and aerial material. Professional photography, drone videography, and 3D virtual tours for maximum visual impact.",
        metrics: ["4K", "Cinematic"],
        color: "#06b6d4",
        href: "/en/services/photo-drone",
      },
    ]
  }
};

function ServiceCard({ service, index }: { service: any; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      ref={ref}
      href={service.href}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-3xl overflow-hidden cursor-pointer block"
    >
      <div
        className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: `linear-gradient(135deg, ${service.color}30, transparent 50%, ${service.color}15)` }}
      />
      <div className="relative bg-[#050814] border border-white/5 rounded-3xl p-8 md:p-10 h-full group-hover:border-transparent transition-colors duration-500">
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-all duration-700 pointer-events-none"
          style={{ backgroundColor: service.color }}
        />
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-all duration-500 group-hover:scale-110"
          style={{ backgroundColor: `${service.color}10`, borderColor: `${service.color}20`, color: service.color }}
        >
          {service.icon}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white font-montserrat mb-2">{service.title}</h3>
        <p className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: service.color }}>{service.subtitle}</p>
        <p className="text-slate-400 font-light text-sm leading-relaxed mb-8">{service.description}</p>
        <div className="flex items-center gap-4 mt-auto">
          <span className="text-3xl font-black text-white font-montserrat">{service.metrics[0]}</span>
          <span className="text-xs font-mono tracking-wider uppercase text-slate-500">{service.metrics[1]}</span>
        </div>
        <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${service.color}20` }}>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export default function Services({ lang = 'el' }: { lang?: 'el' | 'en' }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" });
  const data = servicesData[lang];

  return (
    <section id="services" className="py-32 relative bg-[#010205] overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <motion.div
          className="mb-20 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#00d9ff]" />
            <h2 className="text-[#00d9ff] font-mono text-sm tracking-[0.4em] uppercase">{data.badge}</h2>
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#00d9ff]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white font-montserrat tracking-tight leading-tight mb-6">
            {data.titleStart} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-purple-500">
              {data.titleEnd}
            </span>
          </h2>
          <p className="text-lg text-slate-400 font-light">
            {data.subhead}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
