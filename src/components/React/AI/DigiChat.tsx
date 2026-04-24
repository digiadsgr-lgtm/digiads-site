"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DigiLeadForm from "./DigiLeadForm";
import DigiQuickReplies from "./DigiQuickReplies";

type Role = "user" | "assistant";
interface Message {
  id: string;
  role: Role;
  content: string;
}

// Simple markdown-lite renderer
function renderText(text: string) {
  const parts = text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:white">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .split("\n");
  return parts.map((line, i) => (
    <span key={i}>
      <span dangerouslySetInnerHTML={{ __html: line }} />
      {i < parts.length - 1 && <br />}
    </span>
  ));
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", marginBottom: "12px" }}>
      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#00d9ff,#0055ff)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color: "#010205", fontWeight: 900, fontSize: "10px" }}>D</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", borderBottomLeftRadius: "4px", padding: "12px 16px" }}>
        <div style={{ display: "flex", gap: "6px", alignItems: "center", height: "16px" }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="animate-bounce"
              style={{ width: "6px", height: "6px", background: "#00d9ff", borderRadius: "50%", display: "inline-block", animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DigiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowNotification(true), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (showNotification) {
      const t = setTimeout(() => setShowNotification(false), 10000);
      return () => clearTimeout(t);
    }
  }, [showNotification]);

  useEffect(() => {
    if (isOpen) setShowNotification(false);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: "greeting",
        role: "assistant",
        content: "Γεια σου! 👋 Είμαι ο **DIGI**, ο ψηφιακός σύμβουλος της DIGIADS.\n\nΕίτε ψάχνεις για ιστοσελίδα, Google Ads, SEO ή τίποτα συγκεκριμένο ακόμα — είμαι εδώ να σε βοηθήσω.\n\n**Πες μου, με τι ασχολείται η επιχείρησή σου;** 🚀",
      }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !showLeadForm) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, showLeadForm]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);
    const newCount = exchangeCount + 1;
    setExchangeCount(newCount);

    try {
      const res = await fetch("/api/digi-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          exchangeCount: newCount,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: "assistant", content: data.message ?? "Συγγνώμη, κάτι πήγε στραβά." }]);

      if (data.captureLeads && !showLeadForm && !leadSubmitted) {
        setTimeout(() => setShowLeadForm(true), 1500);
      }
    } catch {
      setMessages((prev) => [...prev, { id: `err-${Date.now()}`, role: "assistant", content: "Συγγνώμη, δεν μπόρεσα να συνδεθώ. Γράψε μας στο **info@digiads.gr** 🙏" }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, exchangeCount, showLeadForm, leadSubmitted]);

  const handleLeadSubmit = async (data: { name: string; email: string; phone: string; service: string }) => {
    const summary = messages.slice(-6).map((m) => `${m.role === "user" ? "Πελάτης" : "DIGI"}: ${m.content}`).join("\n");
    const res = await fetch("/api/send-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, chatSummary: summary }),
    });
    if (res.ok) {
      setLeadSubmitted(true);
      setShowLeadForm(false);
      setMessages((prev) => [...prev, {
        id: `ok-${Date.now()}`,
        role: "assistant",
        content: `Τέλεια, **${data.name}**! ✅\n\nΣου έστειλα email επιβεβαίωσης στο **${data.email}**.\n\nΗ ομάδα μας θα σε επικοινωνήσει σύντομα με πλήρη πρόταση. Ανυπομονούμε να συνεργαστούμε! 🚀`,
      }]);
    }
  };

  return (
    <>
      {/* Floating button */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9998, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              onClick={() => setIsOpen(true)}
              style={{ background: "#060b1a", border: "1px solid rgba(0,217,255,0.2)", borderRadius: "16px", borderBottomRightRadius: "4px", padding: "12px 16px", maxWidth: "220px", cursor: "pointer", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
            >
              <p style={{ color: "white", fontSize: "12px", fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
                👋 Γεια! Είμαι ο <strong style={{ color: "#00d9ff" }}>DIGI</strong>. Μπορώ να σε βοηθήσω να βρεις τη σωστή λύση!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen((v) => !v)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Άνοιξε τον DIGI chat"
          style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg,#00d9ff,#0055ff)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,217,255,0.3)", position: "relative" }}
        >
          {!isOpen && <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,217,255,0.3)", animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.svg key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#010205" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#010205" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{
              position: "fixed", bottom: "96px", right: "24px", zIndex: 9997,
              width: "380px", maxWidth: "calc(100vw - 1.5rem)",
              height: "560px", maxHeight: "calc(100vh - 8rem)",
              display: "flex", flexDirection: "column",
              background: "rgba(6,11,26,0.97)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px",
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,217,255,0.05)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)", flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#00d9ff,#0055ff)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,217,255,0.2)" }}>
                  <span style={{ color: "#010205", fontWeight: 900, fontSize: "14px" }}>D</span>
                </div>
                <span style={{ position: "absolute", bottom: 0, right: 0, width: "12px", height: "12px", background: "#22c55e", borderRadius: "50%", border: "2px solid #060b1a" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "white", fontWeight: 700, fontSize: "14px", margin: 0 }}>DIGI</p>
                <p style={{ color: "#00d9ff", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.1em", margin: 0 }}>Virtual Sales Agent · Online</p>
              </div>
              {!leadSubmitted && (
                <button
                  onClick={() => setShowLeadForm((v) => !v)}
                  title="Αίτηση πρότασης"
                  style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(0,217,255,0.1)", border: "1px solid rgba(0,217,255,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#00d9ff" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", position: "relative" }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: "flex", alignItems: "flex-end", gap: "10px", marginBottom: "12px", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                  {msg.role === "assistant" && (
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#00d9ff,#0055ff)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: "2px" }}>
                      <span style={{ color: "#010205", fontWeight: 900, fontSize: "10px" }}>D</span>
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      maxWidth: "80%",
                      padding: "12px 16px",
                      borderRadius: "16px",
                      borderBottomRightRadius: msg.role === "user" ? "4px" : "16px",
                      borderBottomLeftRadius: msg.role === "assistant" ? "4px" : "16px",
                      fontSize: "13px",
                      lineHeight: 1.6,
                      background: msg.role === "user" ? "rgba(0,217,255,0.12)" : "rgba(255,255,255,0.05)",
                      border: msg.role === "user" ? "1px solid rgba(0,217,255,0.2)" : "1px solid rgba(255,255,255,0.07)",
                      color: msg.role === "user" ? "white" : "rgba(255,255,255,0.85)",
                    }}
                  >
                    {renderText(msg.content)}
                  </motion.div>
                </div>
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />

              <AnimatePresence>
                {showLeadForm && !leadSubmitted && (
                  <DigiLeadForm onSubmit={handleLeadSubmit} onSkip={() => setShowLeadForm(false)} />
                )}
              </AnimatePresence>
            </div>

            {/* Quick replies */}
            {!showLeadForm && (
              <DigiQuickReplies onSelect={sendMessage} disabled={isTyping} exchangeCount={exchangeCount} />
            )}

            {/* Input */}
            {!showLeadForm && (
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                style={{ display: "flex", gap: "8px", padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Γράψε το μήνυμά σου..."
                  disabled={isTyping}
                  maxLength={500}
                  style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "10px 16px", fontSize: "13px", color: "white", outline: "none", opacity: isTyping ? 0.5 : 1 }}
                />
                <motion.button
                  type="submit"
                  disabled={isTyping || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ width: "40px", height: "40px", flexShrink: 0, background: "linear-gradient(135deg,#00d9ff,#0055ff)", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: (isTyping || !input.trim()) ? 0.4 : 1 }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#010205" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </form>
            )}

            <div style={{ padding: "8px 16px 12px", textAlign: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", fontFamily: "monospace", letterSpacing: "0.2em" }}>POWERED BY DIGIADS AI</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </>
  );
}
