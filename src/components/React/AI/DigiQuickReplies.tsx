"use client";

interface DigiQuickRepliesProps {
  onSelect: (text: string) => void;
  onOpenForm: () => void;
  disabled: boolean;
  exchangeCount: number;
}

const INITIAL_REPLIES = [
  { label: "💻 Θέλω ιστοσελίδα", value: "Θέλω να φτιάξω μια επαγγελματική ιστοσελίδα" },
  { label: "🛒 Θέλω e-shop", value: "Ενδιαφέρομαι για κατασκευή eshop" },
  { label: "📈 Google Ads", value: "Θέλω διαφήμιση στο Google και Facebook" },
  { label: "🔍 SEO", value: "Θέλω να ανεβώ στο Google οργανικά" },
  { label: "🏨 Tourism marketing", value: "Έχω τουριστική επιχείρηση και θέλω περισσότερες κρατήσεις" },
  { label: "💰 Τιμές;", value: "Πόσο κοστίζουν οι υπηρεσίες σας;" },
];

const FOLLOWUP_REPLIES = [
  { label: "📋 Θέλω πρόταση", value: "Θέλω να μου στείλεις εξατομικευμένη πρόταση" },
  { label: "🎯 Περισσότερες πληροφορίες", value: "Πες μου περισσότερα για αυτή την υπηρεσία" },
  { label: "⭐ Αποτελέσματα;", value: "Τι αποτελέσματα έχετε για παρόμοιες επιχειρήσεις;" },
  { label: "⏱ Χρόνος;", value: "Πόσο καιρό παίρνει να δω αποτελέσματα;" },
];

export default function DigiQuickReplies({ onSelect, onOpenForm, disabled, exchangeCount }: DigiQuickRepliesProps) {
  const replies = exchangeCount === 0 ? INITIAL_REPLIES : FOLLOWUP_REPLIES;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-white/5">
      <button
        onClick={onOpenForm}
        disabled={disabled}
        className="text-xs bg-gradient-to-r from-[#00d9ff]/20 to-[#0055ff]/20 hover:from-[#00d9ff]/40 hover:to-[#0055ff]/40 border border-[#00d9ff]/40 text-white rounded-full px-3 py-1.5 font-bold transition-all duration-200 shadow-[0_0_10px_rgba(0,217,255,0.15)] disabled:opacity-40 whitespace-nowrap"
      >
        📝 Αίτηση Προσφοράς
      </button>
      {replies.map((r) => (
        <button
          key={r.value}
          onClick={() => onSelect(r.value)}
          disabled={disabled}
          className="text-xs bg-white/5 hover:bg-[#00d9ff]/10 border border-white/10 hover:border-[#00d9ff]/30 text-slate-300 hover:text-[#00d9ff] rounded-full px-3 py-1.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
