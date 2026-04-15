import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const statsData = {
  el: [
    { value: 127, suffix: "%+", label: "Μέση Αύξηση Τζίρου", icon: "📈" },
    { value: 200, suffix: "+", label: "5-Star Reviews", icon: "⭐" },
    { value: 50, suffix: "+", label: "Active Projects", icon: "🚀" },
    { value: 12, suffix: "+", label: "Χρόνια Εμπειρίας", icon: "🏆" },
  ],
  en: [
    { value: 127, suffix: "%+", label: "Avg Revenue Growth", icon: "📈" },
    { value: 200, suffix: "+", label: "5-Star Reviews", icon: "⭐" },
    { value: 50, suffix: "+", label: "Active Projects", icon: "🚀" },
    { value: 12, suffix: "+", label: "Years Experience", icon: "🏆" },
  ]
};

export default function StatsBar({ lang = 'el' }: { lang?: 'el' | 'en' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const stats = statsData[lang];

  return (
    <section className="relative z-20 -mt-1" ref={ref}>
      <div className="border-y border-white/5 bg-[#02040A]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center py-10 md:py-12 group hover:bg-white/[0.02] transition-colors duration-500"
              >
                <div className="text-2xl mb-3 opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500">
                  {stat.icon}
                </div>
                <span className="text-3xl md:text-4xl lg:text-5xl font-black font-montserrat text-white mb-2 tracking-tight">
                  {isInView ? <AnimatedCounter end={stat.value} suffix={stat.suffix} /> : `0${stat.suffix}`}
                </span>
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#00d9ff] font-mono text-center px-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
