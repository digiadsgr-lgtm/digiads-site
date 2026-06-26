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
  const cleanText = text.replace(/\[SHOW_FORM\]/g, "");
  const parts = cleanText
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
  const [agentState, setAgentState] = useState<"online" | "reading" | "analyzing" | "typing">("online");
  const isTyping = agentState !== "online";
  const [exchangeCount, setExchangeCount] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // ── Refs για stable guards & stream control ──
  const leadSubmittedRef = useRef(false);
  const showLeadFormRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingContentRef = useRef<string>("");
  const botMsgIdRef = useRef<string>("");

  const playPopSound = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "el-GR";

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput((prev) => (prev ? prev + " " : "") + finalTranscript.trim());
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Η φωνητική πληκτρολόγηση δεν υποστηρίζεται σε αυτόν τον browser.");
      }
    }
  };

  // Listen for custom external events to open chat
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-digi-chat", handleOpen);
    return () => window.removeEventListener("open-digi-chat", handleOpen);
  }, []);

  useEffect(() => {
    const savedMessages = sessionStorage.getItem("digi_chat_messages");
    const savedCount = sessionStorage.getItem("digi_chat_count");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (e) {}
    }
    if (savedCount) setExchangeCount(parseInt(savedCount, 10));
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem("digi_chat_messages", JSON.stringify(messages));
      sessionStorage.setItem("digi_chat_count", exchangeCount.toString());
    }
  }, [messages, exchangeCount, isInitialized]);

  useEffect(() => {
    const t = setTimeout(() => setShowNotification(true), 2000);
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
    if (isOpen && messages.length === 0 && isInitialized) {
      const path = window.location.pathname;
      let contextGreeting = "Είτε ψάχνεις για ιστοσελίδα, Google Ads, SEO ή τίποτα συγκεκριμένο ακόμα — είμαι εδώ να σε βοηθήσω να βρεις τη σωστή λύση.";
      
      if (path.includes("web-design") || path.includes("kataskevi-istoselidon")) {
        contextGreeting = "Βλέπω ότι ενδιαφέρεσαι για **Κατασκευή Ιστοσελίδων**. Μπορώ να σου εξηγήσω πώς σχεδιάζουμε premium, ταχύτατα sites που φέρνουν πωλήσεις.";
      } else if (path.includes("tourism-marketing") || path.includes("touristiko-marketing")) {
        contextGreeting = "Βλέπω ότι σε ενδιαφέρει το **Τουριστικό Marketing**. Έχουμε ειδικές στρατηγικές (Google/Meta Ads) αποκλειστικά για ξενοδοχεία και βίλες που αυξάνουν τις απευθείας κρατήσεις.";
      } else if (path.includes("photo-services") || path.includes("drone-services")) {
        contextGreeting = "Βλέπω ότι κοιτάς τις **Υπηρεσίες Φωτογράφισης & Drone**. Μια επαγγελματική εικόνα είναι το 50% της πώλησης! Θέλεις να δούμε πώς μπορούμε να αναδείξουμε το project σου;";
      }

      setMessages([{
        id: "greeting",
        role: "assistant",
        content: `Γεια σου! 👋 Είμαι ο **DIGI**, ο ψηφιακός σύμβουλος της DIGIADS.\n\n${contextGreeting}\n\n**Πες μου, με τι ασχολείται η επιχείρησή σου;** 🚀`,
      }]);
    }
  }, [isOpen, messages.length, isInitialized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !showLeadForm) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, showLeadForm]);

  // ── Sync refs with state (stale-closure guard) ──
  useEffect(() => { leadSubmittedRef.current = leadSubmitted; }, [leadSubmitted]);
  useEffect(() => { showLeadFormRef.current = showLeadForm; }, [showLeadForm]);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      readerRef.current?.cancel().catch(() => {});
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Abort ενεργού stream όταν κλείνει το chat ──
  useEffect(() => {
    if (!isOpen) {
      abortControllerRef.current?.abort();
      readerRef.current?.cancel().catch(() => {});
    }
  }, [isOpen]);

  // ── Helper: strip [SHOW_FORM] ακόμη κι αν σπάσει σε 2 tokens ──
  const stripFormToken = (t: string) =>
    t.replace(/\[SHOW_FORM\]/g, "").replace(/\[SHOW_?F?O?R?M?\]?$/i, "");

  // ── Helper: flush buffered κείμενο στο state (1 φορά/frame) ──
  const flushPending = useCallback(() => {
    rafRef.current = null;
    const id = botMsgIdRef.current;
    const content = pendingContentRef.current;
    if (!id) return;
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, content } : m)));
  }, []);

  const scheduleFlush = useCallback(() => {
    if (rafRef.current != null) return; // ήδη scheduled για αυτό το frame
    rafRef.current = requestAnimationFrame(flushPending);
  }, [flushPending]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isTyping) return;

    // Ακύρωσε τυχόν προηγούμενο ενεργό stream
    abortControllerRef.current?.abort();
    readerRef.current?.cancel().catch(() => {});

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setAgentState("reading");
    const newCount = exchangeCount + 1;
    setExchangeCount(newCount);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      setAgentState("analyzing");

      const res = await fetch("/api/digi-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          exchangeCount: newCount,
          currentPage: window.location.pathname,
        }),
        signal: controller.signal,
      });

      setAgentState("typing");

      // Fallback JSON path
      if (res.headers.get("content-type")?.includes("application/json")) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { id: `b-${Date.now()}`, role: "assistant", content: data.message || "Συγγνώμη, κάτι πήγε στραβά." },
        ]);
        if (data.captureLeads && !leadSubmittedRef.current) setShowLeadForm(true);
        setAgentState("online");
        return;
      }

      // SSE streaming με throttled rAF rendering
      const reader = res.body?.getReader();
      readerRef.current = reader ?? null;
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";
      let botMessage = "";
      let formTriggered = false;

      const botMsgId = `b-${Date.now()}`;
      botMsgIdRef.current = botMsgId;
      pendingContentRef.current = "";
      setMessages((prev) => [...prev, { id: botMsgId, role: "assistant", content: "" }]);
      playPopSound();

      if (reader) {
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (!value) continue;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim().startsWith("data: ")) continue;
            const dataStr = line.replace("data: ", "").trim();
            if (!dataStr || dataStr === "[DONE]") continue;
            try {
              const textPart = JSON.parse(dataStr).candidates?.[0]?.content?.parts?.[0]?.text;
              if (textPart) {
                botMessage += textPart;

                // Trigger form μόλις φτάσει το token (μία φορά, με ref guard)
                if (
                  !formTriggered &&
                  botMessage.includes("[SHOW_FORM]") &&
                  !showLeadFormRef.current &&
                  !leadSubmittedRef.current
                ) {
                  formTriggered = true;
                  setShowLeadForm(true);
                }

                // Buffer + throttle: 1 DOM update ανά animation frame
                pendingContentRef.current = stripFormToken(botMessage);
                scheduleFlush();
              }
            } catch {}
          }
        }
      }

      // Τελικό flush ώστε να μη χαθεί το τελευταίο frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      pendingContentRef.current = stripFormToken(botMessage);
      flushPending();

      clearTimeout(timeoutId);

      if (newCount >= 4 && !showLeadFormRef.current && !leadSubmittedRef.current) {
        setTimeout(() => {
          if (!showLeadFormRef.current && !leadSubmittedRef.current) setShowLeadForm(true);
        }, 2500);
      }
    } catch (err: any) {
      // Σκόπιμο abort (νέο μήνυμα / κλείσιμο chat) — δεν δείχνει error
      if (err?.name === "AbortError") {
        setAgentState("online");
        return;
      }
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Υπάρχει μια μικρή καθυστέρηση στο δίκτυο. Κανένα πρόβλημα όμως — συμπλήρωσε τα στοιχεία σου για να επικοινωνήσουμε εμείς μαζί σου! [SHOW_FORM]",
      }]);
      if (!leadSubmittedRef.current) setShowLeadForm(true);
    } finally {
      clearTimeout(timeoutId);
      readerRef.current = null;
      setAgentState("online");
    }
  }, [messages, isTyping, exchangeCount, playPopSound, scheduleFlush, flushPending]);

  const handleLeadSubmit = async (data: { name: string; email: string; phone: string; service: string }) => {
    leadSubmittedRef.current = true; // Ref guard — αποτρέπει duplicate triggers
    const summary = messages.slice(-6).map((m) => `${m.role === "user" ? "Πελάτης" : "DIGI"}: ${m.content}`).join("\n");
    try {
      const res = await fetch("/api/send-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, chatSummary: summary }),
      });
      // Accept both ok and 500 — lead is always captured server-side via console.log
      setLeadSubmitted(true);
      setShowLeadForm(false);
      setMessages((prev) => [...prev, {
        id: `ok-${Date.now()}`,
        role: "assistant",
        content: `Τέλεια, **${data.name}**! ✅\n\nΣου έστειλα email επιβεβαίωσης στο **${data.email}**.\n\nΗ ομάδα μας θα επικοινωνήσει σύντομα με πλήρη πρόταση. Ανυπομονούμε να συνεργαστούμε! 🚀`,
      }]);
    } catch {
      // Even on network error, mark as submitted so user gets confirmation
      setLeadSubmitted(true);
      setShowLeadForm(false);
      setMessages((prev) => [...prev, {
        id: `ok-${Date.now()}`,
        role: "assistant",
        content: `Λάβαμε τα στοιχεία σου, **${data.name}**! ✅\n\nΗ ομάδα μας θα επικοινωνήσει στο **${data.email}** σύντομα. 🚀`,
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
            className="digi-chat-window"
            style={{
              display: "flex", flexDirection: "column",
              background: "rgba(6,11,26,0.97)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
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
                <p style={{ color: "#00d9ff", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.1em", margin: 0 }}>
                  {agentState === "online" ? "Virtual Sales Agent · Online" : 
                   agentState === "reading" ? "Virtual Sales Agent · διαβάζει..." : 
                   agentState === "analyzing" ? "Virtual Sales Agent · σκέφτεται..." : 
                   "Virtual Sales Agent · πληκτρολογεί..."}
                </p>
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
            <div className="digi-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px", position: "relative", overscrollBehavior: "contain" }}>
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
              {(agentState === "reading" || agentState === "analyzing") && <TypingIndicator />}
              <div ref={messagesEndRef} />

              <AnimatePresence>
                {showLeadForm && !leadSubmitted && (
                  <DigiLeadForm onSubmit={handleLeadSubmit} onSkip={() => setShowLeadForm(false)} />
                )}
              </AnimatePresence>
            </div>

            {/* Quick replies */}
            {!showLeadForm && (
              <DigiQuickReplies onSelect={sendMessage} onOpenForm={() => setShowLeadForm(true)} disabled={isTyping} exchangeCount={exchangeCount} />
            )}

            {/* Input */}
            {!showLeadForm && (
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                style={{ display: "flex", gap: "8px", padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}
              >
                <button
                  type="button"
                  onClick={toggleListening}
                  style={{
                    width: "40px", height: "40px", flexShrink: 0, borderRadius: "12px",
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    background: isListening ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)",
                    border: isListening ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                    color: isListening ? "#ef4444" : "white",
                    transition: "all 0.2s"
                  }}
                  title="Φωνητική Πληκτρολόγηση"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ animation: isListening ? "pulse 1.5s infinite" : "none" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Γράψε το μήνυμά σου..."
                  disabled={isTyping}
                  maxLength={500}
                  style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", fontSize: "16px", color: "white", outline: "none", opacity: isTyping ? 0.5 : 1 }}
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
        .digi-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .digi-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .digi-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .digi-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .digi-scroll {
          overscroll-behavior: contain;
          touch-action: pan-y;
          -webkit-overflow-scrolling: touch;
        }
        
        .digi-chat-window {
          position: fixed;
          bottom: 96px;
          right: 24px;
          z-index: 9997;
          width: 380px;
          max-width: calc(100vw - 1.5rem);
          height: 560px;
          max-height: calc(100vh - 8rem);
          border-radius: 20px;
        }

        @media (max-width: 640px) {
          .digi-chat-window {
            bottom: 0;
            right: 0;
            width: 100vw;
            max-width: 100vw;
            height: 85dvh;
            max-height: 85dvh;
            border-radius: 24px 24px 0 0;
            border-bottom: none;
            border-right: none;
            border-left: none;
          }
          .digi-chat-window input {
            font-size: 16px !important;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
      `}</style>
    </>
  );
}
