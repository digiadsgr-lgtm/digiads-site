"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent({ lang = 'el' }: { lang?: 'el' | 'en' }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if consent is already given
    const consent = localStorage.getItem("digiads_cookie_consent");
    if (!consent) {
      setShow(true);
    } else {
      // If already granted, ensure dataLayer has the grant state
      // (This will normally happen via GTM triggers on load, but we can set defaults)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
          event: "consent_status_loaded",
          consent_status: consent
      });
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("digiads_cookie_consent", "all");
    setShow(false);
    
    // GTM DataLayer Push
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "consent_update",
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted"
    });
  };

  const handleDeclineAll = () => {
    localStorage.setItem("digiads_cookie_consent", "rejected");
    setShow(false);
    
    // GTM DataLayer Push
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "consent_update",
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
  };

  const t = {
      el: {
          title: "Η Ιδιωτικότητά σας",
          desc: "Χρησιμοποιούμε τα cookies που είναι αναγκαία για τη διατήρηση της σύνδεσής σας στις ηλεκτρονικές υπηρεσίες της Ιστοσελίδας μας και για την αποθήκευση των επιλογών σας. Με τη συγκατάθεσή σας και μόνο θα χρησιμοποιήσουμε προαιρετικά cookies Στατιστικών και Εμπορικής Προώθησης.",
          accept: "Αποδοχή Όλων",
          decline: "Απόρριψη",
          policy: "Πολιτική Απορρήτου",
          link: "/privacy-policy"
      },
      en: {
          title: "Your Privacy",
          desc: "We use cookies to enhance your browsing experience, analyze our traffic, and optimize our campaigns (Google/Meta Ads). Thank you for your trust.",
          accept: "Accept All",
          decline: "Decline",
          policy: "Privacy Policy",
          link: "/en/privacy-policy"
      }
  }[lang];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-0 sm:bottom-6 sm:right-6 sm:max-w-sm w-full z-[100] p-6 bg-[#030509]/95 backdrop-blur-xl border border-white/10 shadow-2xl sm:rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-[#00d9ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-white font-bold text-lg">{t.title}</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {t.desc} <a href={t.link} className="text-[#00d9ff] hover:underline whitespace-nowrap">{t.policy}</a>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleAcceptAll}
              className="flex-1 px-4 py-2.5 bg-[#00d9ff] hover:bg-white text-black font-bold text-sm tracking-wider uppercase rounded-xl transition-colors duration-300"
            >
              {t.accept}
            </button>
            <button 
              onClick={handleDeclineAll}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-sm rounded-xl transition-colors duration-300"
            >
              {t.decline}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
