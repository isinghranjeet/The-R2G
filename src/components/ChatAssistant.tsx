import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Check,
  Copy,
  Download,
  ExternalLink,
  MessageCircle,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buildPlainTextPdf } from "@/lib/r2g-demo-logic";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  bullets?: string[];
  actionLabel?: string;
  actionTo?: "/courses" | "/printing" | "/placements" | "/contact";
  downloadTitle?: string;
  followUps?: string[];
  feedback?: "up" | "down" | null;
}

interface AiReplyPayload {
  text: string;
  bullets?: string[];
  actionLabel?: string;
  actionTo?: "/courses" | "/printing" | "/placements" | "/contact";
  downloadTitle?: string;
  followUps: string[];
}

const initialSuggestions = [
  "Which CAD software should a Mechanical fresher learn first?",
  "SolidWorks vs CATIA V5 for Automotive jobs?",
  "What are the fees, EMI & weekend batch timings?",
  "How does the 3D Printing & Prototyping lab work?",
];

function getTimeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function generateAiResponse(rawQuery: string): AiReplyPayload {
  const q = rawQuery.toLowerCase();

  if (q.includes("catia") || q.includes("solidworks") || q.includes("compare") || q.includes("vs")) {
    return {
      text: "Choosing between SolidWorks and CATIA V5 depends directly on the industry vertical you are targeting in Delhi-NCR:",
      bullets: [
        "SolidWorks (12 Weeks · ₹14,500): Best for general machine design, sheet-metal fabrication, SPMs, and product startups. Easier learning curve with fast assembly workflows.",
        "CATIA V5 (10 Weeks · ₹16,500): Industry standard for Tier-1 Automotive OEMs (Maruti Suzuki, Tata Motors, Uno Minda) for Body-in-White (BIW) and Class-A surfacing.",
        "Pro Tip: 70% of our placed freshers start with SolidWorks + GD&T and add CATIA or ANSYS based on interview targets.",
      ],
      actionLabel: "Compare All Tracks Side-by-Side",
      actionTo: "/courses",
      downloadTitle: "SolidWorks-vs-CATIA-Career-Guide",
      followUps: [
        "What is the salary package after SolidWorks?",
        "Show me weekend batch timings",
        "Do I need a high-end laptop?",
      ],
    };
  }

  if (q.includes("fee") || q.includes("cost") || q.includes("price") || q.includes("emi") || q.includes("weekend") || q.includes("batch")) {
    return {
      text: "Here is the current 2026 fee & batch availability breakdown for our Sector 35, Faridabad campus:",
      bullets: [
        "Program Fees: Range from ₹7,500 (3D Printing) to ₹18,500 (Siemens NX CAD/CAM). Combo tracks get an automatic 20% scholarship discount.",
        "0% Interest EMI: Available in 3, 6, or 9 monthly installments starting around ₹1,500/month.",
        "Weekend Professional Batch: Sat & Sun (10:00 AM – 2:00 PM) — Currently 1 workstation seat left.",
        "Weekday Batches: Mon – Fri Morning (10 AM) & Evening (5 PM) — 3 seats open.",
      ],
      actionLabel: "Open Fee & EMI Calculator",
      actionTo: "/courses",
      followUps: [
        "How do I book a free live demo?",
        "Is online live training available?",
        "Tell me about placement support",
      ],
    };
  }

  if (q.includes("3d print") || q.includes("prototype") || q.includes("stl") || q.includes("step") || q.includes("lab")) {
    return {
      text: "Our Sector 35 Faridabad facility houses an active FDM & SLA Rapid Prototyping Lab where students and companies print functional parts:",
      bullets: [
        "Technologies: Industrial FDM (300×300×400 mm build volume) & 50-micron High-Detail SLA Resin.",
        "Materials Supported: PLA, ABS, PETG, Carbon-Fiber Nylon, and Tough Engineering Resin.",
        "Student Advantage: Every 12-week CAD trainee slices and 3D-prints their own capstone assembly at zero extra lab fee.",
      ],
      actionLabel: "Get Instant 3D Print Quote",
      actionTo: "/printing",
      followUps: [
        "What file formats do you accept?",
        "How long is the 3D printing course?",
      ],
    };
  }

  if (q.includes("placement") || q.includes("job") || q.includes("salary") || q.includes("package") || q.includes("company")) {
    return {
      text: "We provide 100% placement assistance backed by a verified capstone portfolio and mock CAD technical tests:",
      bullets: [
        "Recent Fresher Packages: ₹3.8 LPA to ₹5.2 LPA across NCR manufacturing & R&D hubs.",
        "Active Hiring Partners: Maruti Suzuki vendors, Tata Motors, L&T Technology Services, Havells, Uno Minda, and Escorts Kubota.",
        "Credential Verification: Every certificate carries a live QR & ID (e.g., R2G-2026-CAD-8941) verifiable by HR teams.",
      ],
      actionLabel: "View Alumni Placement Wall",
      actionTo: "/placements",
      followUps: [
        "Which software has the highest hiring demand?",
        "Book a 1-on-1 career counseling call",
      ],
    };
  }

  if (q.includes("laptop") || q.includes("spec") || q.includes("system") || q.includes("ram")) {
    return {
      text: "You don’t need to buy a workstation immediately—our Sector 35 studio provides dedicated i7/Ryzen 7 RTX workstations. For home practice:",
      bullets: [
        "AutoCAD & 3D Printing: Intel Core i5 / Ryzen 5, 8GB RAM, Windows 10/11.",
        "SolidWorks, CATIA & Siemens NX: Core i5/i7 (11th Gen+), 16GB RAM, 512GB NVMe SSD, and 4GB NVIDIA GPU.",
      ],
      followUps: [
        "Can I practice in the Faridabad lab after class?",
        "Compare SolidWorks vs Siemens NX",
      ],
    };
  }

  if (q.includes("hi") || q.includes("hello") || q.includes("namaste") || q.includes("hey")) {
    return {
      text: "Namaste! I’m R2G AI, your CAD/CAM & 3D Prototyping career advisor. Tell me your engineering branch (Mechanical, Civil, Diploma, or Working Professional) and I’ll map out the best software stack for you.",
      followUps: initialSuggestions.slice(0, 3),
    };
  }

  return {
    text: "For mechanical & product design careers, I recommend a structured 3-step roadmap at R2G Learn CAD:",
    bullets: [
      "Step 1 (Core Drafting): Master 2D/3D orthographic standards & GD&T in AutoCAD.",
      "Step 2 (Parametric 3D): Build sheet-metal, weldment, and assembly projects in SolidWorks or CATIA V5.",
      "Step 3 (Validation & Print): Run stress checks in ANSYS and print a physical prototype in our Faridabad lab.",
    ],
    actionLabel: "Explore Full 12-Week Curriculum",
    actionTo: "/courses",
    downloadTitle: "R2G-Engineering-Career-Roadmap",
    followUps: [
      "What are the fees and EMI options?",
      "SolidWorks vs CATIA for Automotive?",
      "Show me recent student placements",
    ],
  };
}

export function ChatAssistant({ onOpenCounselor }: { onOpenCounselor: () => void }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [streamingPayload, setStreamingPayload] = useState<AiReplyPayload | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      text: "Hi! I’m R2G AI Advisor. Ask me anything about CAD/CAM courses, fees, SolidWorks vs CATIA, or 3D printing prototypes.",
      timestamp: getTimeNow(),
      followUps: initialSuggestions,
    },
  ]);

  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking, streamingText]);

  // Simulate realistic LLM thinking + token-by-token streaming
  function sendPrompt(questionText: string) {
    const trimmed = questionText.trim();
    if (!trimmed || isThinking || streamingPayload) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: getTimeNow(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    const payload = generateAiResponse(trimmed);

    window.setTimeout(() => {
      setIsThinking(false);
      setStreamingPayload(payload);
      setStreamingText("");

      const words = payload.text.split(" ");
      let index = 0;

      const streamInterval = window.setInterval(() => {
        index += 1;
        setStreamingText(words.slice(0, index).join(" "));

        if (index >= words.length) {
          window.clearInterval(streamInterval);
          const finalBotMsg: ChatMessage = {
            id: `b-${Date.now()}`,
            role: "assistant",
            text: payload.text,
            timestamp: getTimeNow(),
            bullets: payload.bullets,
            actionLabel: payload.actionLabel,
            actionTo: payload.actionTo,
            downloadTitle: payload.downloadTitle,
            followUps: payload.followUps,
            feedback: null,
          };
          setMessages((prev) => [...prev, finalBotMsg]);
          setStreamingPayload(null);
          setStreamingText("");
        }
      }, 32);
    }, 650);
  }

  function handleCopy(msg: ChatMessage) {
    const fullText = [msg.text, ...(msg.bullets ?? [])].join("\n• ");
    navigator.clipboard.writeText(fullText);
    setCopiedId(msg.id);
    toast.success("Response copied to clipboard.");
    window.setTimeout(() => setCopiedId(null), 1500);
  }

  function handleFeedback(id: string, type: "up" | "down") {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: m.feedback === type ? null : type } : m))
    );
    toast.success("Thanks for training R2G AI!");
  }

  function handleDownloadGuide(title: string, msg: ChatMessage) {
    const blob = new Blob(
      [
        buildPlainTextPdf([
          "R2G LEARN CAD — AI COUNSELOR BRIEF",
          title.replaceAll("-", " "),
          msg.text,
          ...(msg.bullets ?? []),
          "Campus: Sector 35, Faridabad · Helpline: +91 98765 43210",
        ]),
      ],
      { type: "application/pdf" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.pdf`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Career guide PDF downloaded.");
  }

  function handleVoiceInput() {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setInput(transcript);
        sendPrompt(transcript);
      }
    };
    recognition.start();
  }

  function resetChat() {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: "assistant",
        text: "Conversation cleared. How can I help you plan your CAD/CAM or 3D printing journey today?",
        timestamp: getTimeNow(),
        followUps: initialSuggestions,
      },
    ]);
    setStreamingPayload(null);
    setStreamingText("");
    setIsThinking(false);
  }

  const latestFollowUps =
    !isThinking && !streamingPayload ? messages[messages.length - 1]?.followUps ?? [] : [];

  return (
    <>
      <Button
        className="chat-launcher"
        aria-label="Ask R2G AI career counselor"
        onClick={() => setChatOpen((v) => !v)}
      >
        {chatOpen ? <X /> : <MessageCircle />}
        <span>Ask R2G AI</span>
      </Button>

      {chatOpen && (
        <div className="chat-widget flex max-h-[82vh] w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-700/90 bg-[#08101e] shadow-2xl sm:w-[400px]">
          {/* Header */}
          <div className="chat-header flex items-center justify-between border-b border-slate-800 bg-[#0b1526] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="chat-avatar flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-400">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <b className="block text-sm text-white">R2G AI Career Counselor</b>
                <small className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <i className="live-dot" /> ONLINE · CAD/CAM &amp; LAB SPECIALIST
                </small>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                title="New conversation"
                aria-label="Reset chat"
                className="h-8 w-8 text-slate-400 hover:text-white"
                onClick={resetChat}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close chat"
                className="h-8 w-8 text-slate-400 hover:text-white"
                onClick={() => setChatOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable Message Stream */}
          <div className="chat-body flex-1 space-y-4 overflow-y-auto p-4 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div className="mb-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                  {msg.role === "assistant" ? (
                    <>
                      <Bot className="h-3 w-3 text-amber-400" /> R2G AI · {msg.timestamp}
                    </>
                  ) : (
                    <>
                      You · {msg.timestamp} <User className="h-3 w-3 text-sky-400" />
                    </>
                  )}
                </div>

                {msg.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-amber-400 px-3.5 py-2.5 font-medium text-slate-950">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-[92%] space-y-2.5 rounded-2xl rounded-tl-sm border border-slate-800 bg-slate-900/90 p-3.5 text-slate-200">
                    <p className="leading-relaxed">{msg.text}</p>

                    {msg.bullets && (
                      <ul className="space-y-1.5 border-l-2 border-amber-400/50 pl-3 text-xs leading-relaxed text-slate-300">
                        {msg.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    )}

                    {/* Smart Action Buttons inside AI bubble */}
                    {(msg.actionTo || msg.downloadTitle) && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.actionTo && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 border-amber-400/40 bg-amber-400/10 text-xs text-amber-300 hover:bg-amber-400/20"
                            asChild
                          >
                            <Link to={msg.actionTo} onClick={() => setChatOpen(false)}>
                              {msg.actionLabel} <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                        {msg.downloadTitle && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-slate-300 hover:text-white"
                            onClick={() => handleDownloadGuide(msg.downloadTitle!, msg)}
                          >
                            <Download className="mr-1 h-3 w-3" /> Save PDF
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Message Utility Toolbar (Copy + Thumbs Up/Down) */}
                    {msg.id !== "welcome-msg" && (
                      <div className="flex items-center justify-end gap-1 border-t border-slate-800/80 pt-1.5 text-slate-500">
                        <button
                          type="button"
                          onClick={() => handleCopy(msg)}
                          className="rounded p-1 hover:bg-slate-800 hover:text-slate-200"
                          title="Copy answer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg.id, "up")}
                          className={`rounded p-1 hover:bg-slate-800 ${
                            msg.feedback === "up" ? "text-emerald-400" : ""
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg.id, "down")}
                          className={`rounded p-1 hover:bg-slate-800 ${
                            msg.feedback === "down" ? "text-rose-400" : ""
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Animated Thinking Dots */}
            {isThinking && (
              <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3.5 py-2.5 text-xs text-amber-300">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                <span>Analyzing CAD curriculum &amp; lab data…</span>
              </div>
            )}

            {/* Live Word-by-Word Streaming Bubble */}
            {streamingPayload && (
              <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-amber-400/30 bg-slate-900/90 p-3.5 text-slate-200">
                <p className="leading-relaxed">
                  {streamingText}
                  <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-amber-400" />
                </p>
              </div>
            )}

            {/* Contextual Follow-Up Chips */}
            {latestFollowUps.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                  Suggested Follow-Ups
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {latestFollowUps.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => sendPrompt(chip)}
                      className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-left text-xs text-slate-300 transition hover:border-amber-400/60 hover:text-amber-300"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>

          {/* Input Bar with Voice Mic */}
          <form
            className="chat-input flex items-center gap-1.5 border-t border-slate-800 bg-[#0b1526] px-3 py-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              sendPrompt(input);
            }}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleVoiceInput}
              className={`h-8 w-8 shrink-0 ${isListening ? "animate-pulse text-rose-400" : "text-slate-400 hover:text-amber-300"}`}
              title="Ask with voice"
              aria-label="Voice input"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about SolidWorks, fees, jobs…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <Button
              variant="ghost"
              size="icon"
              type="submit"
              disabled={!input.trim() || isThinking}
              className="h-8 w-8 shrink-0 text-amber-400 hover:bg-amber-400/15"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Bottom Human Counselor Escalation */}
          <Button
            className="counselor-call w-full rounded-none border-t border-amber-400/20 bg-amber-400/10 py-2.5 text-xs font-semibold text-amber-300 hover:bg-amber-400/20"
            onClick={() => {
              setChatOpen(false);
              onOpenCounselor();
            }}
          >
            Talk to a Senior Human Counselor <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </>
  );
}