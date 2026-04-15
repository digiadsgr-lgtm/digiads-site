import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const testimonialsData = {
  el: {
    badge: "Client Stories",
    titleStart: "Αυτό που λένε ",
    titleHighlight: "οι πελάτες μας.",
    items: [
      {
        name: "Γιάννης Κ.",
        role: "Ιδιοκτήτης, GuestFirst.gr",
        quote: "Η DIGIADS μετέτρεψε τελείως τον τρόπο που λειτουργεί η επιχείρησή μας online. Από τη στιγμή που ανέλαβαν, οι απευθείας κρατήσεις αυξήθηκαν κατά 340%.",
        rating: 5,
      },
      {
        name: "Μαρία Π.",
        role: "CEO, Corallia Villas",
        quote: "Η ιστοσελίδα που μας έφτιαξαν είναι ένα αρχιτεκτονικό αριστούργημα. Οι πελάτες μας μένουν εντυπωσιασμένοι πριν καν φτάσουν στη βίλα.",
        rating: 5,
      },
      {
        name: "Νίκος Μ.",
        role: "Ιδιοκτήτης, Gadgetshop",
        quote: "Το e-shop μας φτιάχτηκε σε χρόνο ρεκόρ και η ταχύτητα είναι αδιανόητη. 100/100 Lighthouse. Οι πωλήσεις αυξήθηκαν 90% τον πρώτο μήνα.",
        rating: 5,
      },
      {
        name: "Ελένη Δ.",
        role: "Marketing Manager, Rimondi Boutique Hotel",
        quote: "Η στρατηγική τους στο Tourism Marketing ήταν game-changer. Αξιόπιστοι, δημιουργικοί, πάντα ένα βήμα μπροστά. Ανεπιφύλακτα!",
        rating: 5,
      },
    ]
  },
  en: {
    badge: "Client Stories",
    titleStart: "What our ",
    titleHighlight: "clients say.",
    items: [
      {
        name: "Yiannis K.",
        role: "Owner, GuestFirst.gr",
        quote: "DIGIADS completely transformed how our business operates online. Since they took over, direct bookings increased by 340%.",
        rating: 5,
      },
      {
        name: "Maria P.",
        role: "CEO, Corallia Villas",
        quote: "The website they built for us is an architectural masterpiece. Our clients are impressed before they even arrive at the villa.",
        rating: 5,
      },
      {
        name: "Nikos M.",
        role: "Owner, Gadgetshop",
        quote: "Our e-shop was built in record time and the speed is unbelievable. 100/100 Lighthouse. Sales increased 90% in the first month.",
        rating: 5,
      },
      {
        name: "Eleni D.",
        role: "Marketing Manager, Rimondi Boutique Hotel",
        quote: "Their strategy in Tourism Marketing was a game-changer. Reliable, creative, always a step ahead. Highly recommended!",
        rating: 5,
      },
    ]
  }
};

export default function Testimonials({ lang = 'el' }: { lang?: 'el' | 'en' }) {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });
  const data = testimonialsData[lang];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % data.items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [data.items.length]);

  return (
    <section className="py-32 relative bg-[#010205] overflow-hidden" ref={sectionRef}>
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-[#00d9ff] font-mono text-sm tracking-[0.4em] uppercase mb-4">{data.badge}</h2>
          <p className="text-4xl md:text-5xl font-black text-white font-montserrat tracking-tight">
            {data.titleStart} <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">{data.titleHighlight}</span>
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-8">
                {[...Array(data.items[current].rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-white font-light leading-relaxed mb-10 max-w-3xl mx-auto italic">
                &ldquo;{data.items[current].quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div>
                <p className="text-white font-semibold text-lg">{data.items[current].name}</p>
                <p className="text-slate-500 text-sm font-mono tracking-wider">{data.items[current].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {data.items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                i === current ? "w-8 bg-[#00d9ff]" : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
