import { useState, useEffect } from "react";

const bentoData = {
  el: {
    badge: "Enterprise Portfolio",
    titleStart: "Τα Ψηφιακά Συστήματά μας ",
    titleEnd: "σε παραγωγή.",
    subhead: "Δεν στήνουμε απλά websites. Παραδίδουμε custom-made, Cloud-Native συστήματα που δίνουν λύσεις και επεκτείνουν το επιχειρηματικό σας πεδίο.",
  },
  en: {
    badge: "Enterprise Portfolio",
    titleStart: "Our Digital Systems ",
    titleEnd: "in production.",
    subhead: "We don't just build websites. We deliver custom-made, Cloud-Native systems that provide solutions and expand your business domain.",
  }
};

const portfolioItems = [
  { id: 1, name: "Guest First", type: "Hospitality System", logo: "/logo/Guestfirstgr-logo.svg", url: "https://guestfirst.gr/", colSpan: "md:col-span-2", rowSpan: "md:row-span-1" },
  { id: 2, name: "Άγιος Παύλος", type: "Tourism / Hospitality", logo: "/logo/Agiospavlos.gr-logo.svg", url: "https://www.agiospavlos.gr/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { id: 3, name: "InShot", type: "Creative Portfolio", logo: "/logo/Inshotgr-Logo.webp", url: "https://inshot.gr/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { id: 4, name: "Corallia Villas", type: "Luxury Property", logo: "/logo/corallia-villas-logo.webp", url: "https://corallia-villas.com/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { id: 5, name: "Evergreen Tours", type: "Travel Operations", logo: "/logo/evergreen-tours_logo.webp", url: "https://evergreen-tours.com/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { id: 6, name: "Gadgetshop", type: "E-Commerce", logo: "/logo/Gadgetshop-logo.svg", url: "https://www.gadgetshoprethimno.gr/", colSpan: "md:col-span-2", rowSpan: "md:row-span-1" },
  { id: 7, name: "Kipo Paradiso", type: "E-Commerce", logo: "/logo/kipoparadiso.webp", hasWhiteBg: true, url: "https://kipoparadiso.gr/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { id: 8, name: "Το Φυστίκι Που Κυλάει", type: "Creator Platform", logo: "/logo/fystiki.webp", hasWhiteBg: true, url: "https://fystikipoykylaei.gr/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { id: 9, name: "Alouminia Papadakis", type: "B2B Construction", logo: "/logo/alouminia.webp", hasWhiteBg: true, url: "https://alouminia-papadakis.gr/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { id: 10, name: "Rimondi", type: "Hospitality Resort", logo: "/logo/rimondi.webp", hasWhiteBg: true, url: "https://rimondi.com.gr/", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" }
];

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

        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[260px] gap-6 transition-all duration-[2000ms] ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          {portfolioItems.map((item, i) => (
            <a 
              key={item.id} 
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative rounded-3xl overflow-hidden bg-[#050814] border border-white/10 hover:border-[#00d9ff]/50 hover:shadow-[0_0_60px_rgba(0,217,255,0.15)] transition-all duration-700 cursor-pointer flex flex-col items-center justify-center p-8 ${item.colSpan} ${item.rowSpan}`}
              style={{ transitionDelay: `${i * 50}ms` }}
              title={`Visit ${item.name}`}
            >
              <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,217,255,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="absolute -inset-[2px] bg-gradient-to-br from-transparent via-[#00d9ff]/0 to-transparent group-hover:via-[#00d9ff]/20 rounded-3xl z-0 transition-all duration-[1500ms] pointer-events-none" />

              <div className="relative z-10 w-full h-[60%] flex items-center justify-center pointer-events-none transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-2">
                 <div className="relative w-full max-w-[200px] h-full flex items-center justify-center">
                   {item.hasWhiteBg ? (
                     <div className="relative w-full h-[80px] bg-white rounded-xl shadow-lg flex items-center justify-center p-2 overflow-hidden ring-1 ring-white/20">
                       <img
                         src={item.logo}
                         alt={`${item.name} Logo`}
                         className="w-full h-full object-contain p-2"
                         loading="lazy"
                       />
                     </div>
                   ) : (
                     <img
                       src={item.logo}
                       alt={`${item.name} Logo`}
                       className="w-full h-full object-contain"
                       loading="lazy"
                     />
                   )}
                 </div>
              </div>

              <div className="absolute bottom-6 left-8 z-20 w-max text-left">
                <p className="text-[#00d9ff] font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">{item.type}</p>
                <h3 className="text-white text-base sm:text-lg font-bold font-montserrat tracking-tight opacity-50 group-hover:opacity-100 transition-opacity duration-500">{item.name}</h3>
              </div>

              <div className="absolute bottom-8 right-8 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm hover:bg-[#00d9ff] hover:text-black hover:border-transparent transition-colors">
                  <svg className="w-4 h-4 text-white hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
