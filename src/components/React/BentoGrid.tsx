import { useState, useEffect } from "react";

const bentoData = {
  el: {
    badge: "Enterprise Impact / Portfolio",
    titleStart: "Τα Ψηφιακά Οικοσυστήματά μας ",
    titleEnd: "στο απόγειο.",
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const portfolioItems = [
  { id: 1, name: "Guest First", type: "Hospitality System", logo: "/logo/Guestfirstgr-logo.svg", url: "https://guestfirst.gr/", colSpan: "md:col-span-2", rowSpan: "md:row-span-1" },
  { id: 2, name: "Άγιος Παύλος", type: "Tourism / Hospitality", logo: "/logo/Agiospavlos.gr-logo.svg", url: "https://www.agiospavlos.gr/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { id: 3, name: "Pela Suites", type: "Luxury Villas", logo: "/logo/Pela-suites-1-1.svg", url: "https://pelasuites.com/", colSpan: "md:col-span-1", rowSpan: "md:row-span-2" },
  { id: 4, name: "Xrisi", type: "Corporate Transport", logo: "/logo/Xrisilogowhite.svg", url: "https://xrisitransport.gr/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { id: 5, name: "Bespoke", type: "Property Management", logo: "/logo/bespoke-1.svg", url: "https://bespokeproperty.gr/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { id: 6, name: "Baxevanis", type: "E-shop / Retail", logo: "/logo/Baxevanis-logo-.svg", url: "https://baxevanis.gr/", colSpan: "md:col-span-2", rowSpan: "md:row-span-1" },
  { id: 7, name: "InShot", type: "Creative Portfolio", logo: "/logo/Inshotgr-Logo.webp", url: "https://inshot.gr/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { id: 8, name: "Corallia Villas", type: "Luxury Property", logo: "/logo/corallia-villas-logo.webp", url: "https://corallia-villas.com/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { id: 9, name: "Evergreen Tours", type: "Travel Operations", logo: "/logo/evergreen-tours_logo.webp", url: "https://evergreen-tours.com/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { id: 10, name: "Rimondi", type: "Hospitality Resort", logo: "/logo/rimondi.webp", hasWhiteBg: true, url: "https://rimondi.com.gr/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
];

function BentoItem({ item, lang }: { item: any, lang: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Dynamic parallax transforms depending on index/position
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", item.id % 2 === 0 ? "15%" : "-15%"]);
  const scaleParallax = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  return (
    <motion.a
      ref={ref}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative overflow-hidden rounded-3xl bg-[#050814] border border-white/5 flex items-center justify-center p-8 transition-colors hover:border-[#00d9ff]/30 ${item.colSpan} ${item.rowSpan} min-h-[250px]`}
      data-cursor-text="VISIT"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <motion.div 
        className="w-full h-full flex flex-col items-center justify-center gap-6"
        style={{ y: yParallax, scale: scaleParallax }}
      >
        <div className="w-[180px] h-[80px] relative transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-translate-y-2">
          {item.logo ? (
            <img src={item.logo} alt={item.name} className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
          ) : (
            <div className="w-full h-full bg-white/5 rounded-lg flex items-center justify-center text-slate-500">Logo missing</div>
          )}
        </div>
        <div className="absolute bottom-4 left-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
           <span className="text-[#00d9ff] font-mono text-xs uppercase tracking-widest">{item.type}</span>
           <h3 className="text-white font-bold text-lg">{item.name}</h3>
        </div>
      </motion.div>
    </motion.a>
  );
}

export default function BentoGrid({ lang = 'el' }: { lang?: 'el' | 'en' }) {
  const [mounted, setMounted] = useState(false);
  const data = bentoData[lang];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="portfolio" className="py-32 bg-[#02040A] relative z-10 w-full overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#00d9ff] rounded-[100%] blur-[200px] opacity-[0.02] pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-6">
        
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-sm font-mono tracking-[0.3em] text-[#00d9ff] uppercase mb-4">{data.badge}</h2>
            <h2 className="text-4xl md:text-6xl font-black text-white font-montserrat max-w-2xl leading-tight tracking-tight">
              {data.titleStart} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">{data.titleEnd}</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-slate-400 font-light leading-relaxed text-sm md:text-base">
              {data.subhead}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-6">
          {portfolioItems.map((item) => (
            <BentoItem key={item.id} item={item} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
