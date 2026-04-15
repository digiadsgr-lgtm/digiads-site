import { useState, useEffect } from "react";

const data = {
    badge: "Enterprise Impact / Portfolio",
    titleStart: "Τα Ψηφιακά Οικοσυστήματά μας ",
    titleEnd: "στο απόγειο.",
    subhead: "Δεν παραδίδουμε απλά websites, αλλά Cloud-Native μηχανές κερδοφορίας. Παρακάτω βλέπετε συστήματα που δίνουν λύσεις, αυτοματοποιούν διαδικασίες και κυριαρχούν στην αγορά (Dominate).",
};

const featuredProjects = [
  {
    id: 1,
    name: "Luxury Tourism Engine",
    client: "Sanus Creta / Corallia Villas",
    image: "/visuals/tourism_luxury.png",
    tags: ["Direct Bookings", "Web Design", "SEO"],
    url: "/touristiko-marketing"
  },
  {
    id: 2,
    name: "Aesthetic Viral Growth",
    client: "E-Commerce & Retail Brands",
    image: "/visuals/social_media_viral.png",
    tags: ["Social Media", "Content Creation", "TikTok"],
    url: "/digital-marketing/social-media-management"
  }
];

const clientLogos = [
  "/logo/Sanus.webp",
  "/logo/Guestfirstgr-logo.svg",
  "/logo/alouminia.webp",
  "/logo/Agiospavlos.gr-logo.svg",
  "/logo/titho.webp",
  "/logo/leatheraki.webp",
  "/logo/corallia-villas-logo.webp",
  "/logo/evergreen-tours_logo.webp"
];

export default function BentoGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="portfolio" className="py-32 bg-[#02040A] relative z-10 w-full overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#00d9ff] rounded-[100%] blur-[200px] opacity-[0.02] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-sm font-mono tracking-[0.3em] text-[#00d9ff] uppercase mb-4">{data.badge}</h2>
            <h2 className="text-4xl md:text-6xl font-black text-white font-montserrat max-w-2xl leading-tight tracking-tight">
              {data.titleStart} <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">{data.titleEnd}</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-slate-400 font-light leading-relaxed text-sm md:text-base">
              {data.subhead}
            </p>
          </div>
        </div>

        {/* Featured Massive Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {featuredProjects.map((project) => (
                <a href={project.url} key={project.id} className="group relative block rounded-[2rem] overflow-hidden bg-[#090b14] border border-white/5 aspect-[4/3] md:aspect-square lg:aspect-[4/3]">
                    <div className="absolute inset-0">
                        <img 
                            src={project.image} 
                            alt={project.name} 
                            className="w-full h-full object-cover scale-[1.02] group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-80 group-hover:opacity-100"
                            loading="lazy"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                    
                    <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-4">
                        <div className="flex gap-2 flex-wrap">
                            {project.tags.map(tag => (
                                <span key={tag} className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wider uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div>
                            <p className="text-[#00d9ff] font-mono text-sm mb-1">{project.client}</p>
                            <h3 className="text-white text-3xl font-black tracking-tight">{project.name}</h3>
                        </div>
                    </div>
                </a>
            ))}
        </div>

        {/* Infinite Client Ticker */}
        <div className="border-t border-b border-white/5 py-12 relative overflow-hidden flex bg-white/[0.01]">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#02040A] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#02040A] to-transparent z-10 pointer-events-none"></div>
            
            {/* Ticker Animation Container */}
            <div className="flex gap-8 items-center px-8 w-max relative animate-marquee hover:[animation-play-state:paused]">
                {/* Double the array for seamless infinite scrolling */}
                {[...clientLogos, ...clientLogos].map((logo, idx) => (
                    <div key={idx} className="h-24 w-[200px] bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center px-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                        <img 
                            src={logo} 
                            alt="Client Logo" 
                            className="max-h-12 max-w-full object-contain filter drop-shadow-xl" 
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
            
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>

      </div>
    </section>
  );
}
