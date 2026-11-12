import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Move3D,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isValidMobile } from "@/lib/r2g-demo-logic";
import { getStoredLeads, saveStoredLeads } from "@/lib/r2g-storage";
import { courses } from "@/data/r2g-data";

const tracks = [
  {
    id: "cad",
    label: "Mechanical CAD",
    title: "CAD/CAM & 3D Printing",
    description:
      "Hands-on training on SolidWorks, AutoCAD 2D/3D, Siemens NX, CATIA, Creo and ANSYS, with real industrial projects.",
    tools: ["SolidWorks", "AutoCAD 2D/3D", "CATIA V5", "GD&T"],
    packageRange: "4.2 – 5.8 LPA",
    course: "SolidWorks Masterclass",
  },
  {
    id: "cam",
    label: "CNC & Tooling",
    title: "Siemens NX & CNC CAM",
    description:
      "Master multi-axis CNC toolpaths, core-cavity mold design, and production manufacturing workflows on industrial workstations.",
    tools: ["Siemens NX", "NX CAM", "Mold Design", "G-Code"],
    packageRange: "4.5 – 6.5 LPA",
    course: "Siemens NX & CAM",
  },
  {
    id: "print",
    label: "3D Prototyping",
    title: "Additive Lab & 3D Printing",
    description:
      "Design parametric assemblies and fabricate functional FDM & SLA physical prototypes inside our Sector 35 Faridabad lab.",
    tools: ["FDM & SLA", "Cura Slicer", "DFM Analysis", "Prototyping"],
    packageRange: "3.6 – 5.0 LPA",
    course: "3D Printing & Prototyping",
  },
];

interface HeroSectionProps {
  onBookingSuccess: (data: { name: string; mobile: string; course: string }) => void;
}

// Clean Interactive CAD Blueprint & Cursor-Reactive Vector Canvas
function CadBlueprintBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const mouse = { x: -9999, y: -9999, active: false };

    const nodes = Array.from({ length: 36 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      isGold: i % 4 === 0,
    }));

    let angle = 0;

    const drawGearOutline = (
      cx: number,
      cy: number,
      radius: number,
      teeth: number,
      rot: number,
      stroke: string
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;

      ctx.beginPath();
      for (let i = 0; i < teeth * 4; i++) {
        const idx = Math.floor(i / 4);
        const step = i % 4;
        const r = step === 0 || step === 3 ? radius * 0.88 : radius;
        const a = ((idx + step * 0.25) / teeth) * Math.PI * 2;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.36, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      angle += 0.0018;

      // Subtle Interlocking Blueprint Gears
      drawGearOutline(width * 0.46, height * 0.28, 92, 16, angle, "rgba(245, 197, 66, 0.09)");
      drawGearOutline(
        width * 0.46 + 148,
        height * 0.28 + 48,
        60,
        12,
        -angle * 1.33,
        "rgba(56, 189, 248, 0.08)"
      );

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]!;
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j]!;
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(148, 163, 184, ${(1 - dist / 140) * 0.12})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        if (mouse.active) {
          const mDist = Math.hypot(mouse.x - n.x, mouse.y - n.y);
          if (mDist < 165) {
            ctx.strokeStyle = `rgba(245, 197, 66, ${(1 - mDist / 165) * 0.38})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = n.isGold ? "rgba(245, 197, 66, 0.5)" : "rgba(56, 189, 248, 0.4)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.isGold ? 2.2 : 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // CAD Cursor Crosshair & Live Coordinates
      if (mouse.active) {
        ctx.strokeStyle = "rgba(245, 197, 66, 0.24)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(mouse.x - 14, mouse.y);
        ctx.lineTo(mouse.x + 14, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 14);
        ctx.lineTo(mouse.x, mouse.y + 14);
        ctx.stroke();

        ctx.fillStyle = "rgba(245, 197, 66, 0.5)";
        ctx.font = "10px monospace";
        ctx.fillText(`X:${Math.round(mouse.x)} Y:${Math.round(mouse.y)}`, mouse.x + 10, mouse.y - 8);
      }
    };

    render();

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active =
        mouse.x >= 0 && mouse.x <= rect.width && mouse.y >= 0 && mouse.y <= rect.height;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

export function HeroSection({ onBookingSuccess }: HeroSectionProps) {
  const [activeTrack, setActiveTrack] = useState(tracks[0]!);
  const [learningMode, setLearningMode] = useState<"Offline Lab" | "Live Online">("Offline Lab");
  const [booking, setBooking] = useState({
    name: "",
    mobile: "",
    course: courses[0]?.title ?? "SolidWorks Masterclass",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [countdown, setCountdown] = useState(3 * 3600 + 42 * 60 + 18);
  const bookingFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const tick = window.setInterval(
      () => setCountdown((v) => (v > 0 ? v - 1 : 3 * 3600 + 42 * 60)),
      1000
    );
    return () => window.clearInterval(tick);
  }, []);

  const secs = String(countdown % 60).padStart(2, "0");
  const mins = String(Math.floor(countdown / 60) % 60).padStart(2, "0");
  const hours = String(Math.floor(countdown / 3600)).padStart(2, "0");

  function handleSelectTrack(track: (typeof tracks)[number]) {
    setActiveTrack(track);
    setBooking((prev) => ({ ...prev, course: track.course }));
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidMobile(booking.mobile)) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }
    setBookingLoading(true);
    window.setTimeout(() => {
      const existingLeads = getStoredLeads();
      saveStoredLeads([
        {
          id: `LD-${Math.floor(200 + Math.random() * 799)}`,
          name: booking.name.trim(),
          mobile: booking.mobile,
          course: `${booking.course} (${learningMode})`,
          batch: "Weekend Professional",
          status: "Pending",
          date: "Today",
        },
        ...existingLeads,
      ]);

      setBookingLoading(false);
      onBookingSuccess(booking);
      toast.success("Your demo class is reserved & synced with Admin Portal!");
      bookingFormRef.current?.reset();
    }, 750);
  }

  return (
    <section className="hero-section relative overflow-hidden" id="home">
      <div className="hero-grid-overlay" aria-hidden="true" />
      <CadBlueprintBackground />
      <div className="hero-glow hero-glow-blue" />
      <div className="hero-glow hero-glow-gold" />

      <div className="site-container hero-content relative z-10">
        {/* Left Column: Original Signature Layout + Smart Track Switcher */}
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">
            <span /> ADMISSIONS OPEN <i>·</i> INDUSTRY 4.0 CAD / CAM &amp; ADDITIVE LAB
          </span>

          <h1>
            Master Industrial<br />
            <span>{activeTrack.title}</span>
          </h1>

          <p className="hero-description">{activeTrack.description}</p>

          {/* Clean Track Switcher + Live Stack Summary */}
          <div className="mt-5 space-y-3">
            <div className="inline-flex flex-wrap gap-1.5 rounded-xl border border-slate-800/90 bg-slate-950/75 p-1">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectTrack(track)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                    activeTrack.id === track.id
                      ? "bg-amber-400 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {track.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              {activeTrack.tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900/70 px-2.5 py-1 font-mono text-[11px] text-slate-200"
                >
                  <CheckCircle2 className="h-3 w-3 text-amber-400" /> {tool}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-300">
                <BriefcaseBusiness className="h-3 w-3" /> {activeTrack.packageRange}
              </span>
            </div>
          </div>

          <div className="hero-actions mt-6">
            <Button className="gold-button" asChild>
              <a href="#courses">
                Explore All Courses <ArrowDown />
              </a>
            </Button>
            <Button className="portal-button" variant="outline" asChild>
              <a href="#viewer">
                <Move3D /> Explore 3D Lab
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-semibold text-amber-300 hover:bg-amber-400/10"
              asChild
            >
              <Link to="/quiz">
                <Sparkles className="mr-1 h-3.5 w-3.5" /> 60s Skill Quiz →
              </Link>
            </Button>
          </div>

          <div className="hero-proof">
            <span className="proof-icon"><BadgeCheck /></span>
            <span>
              <strong>15,000+</strong> engineers trained <i>·</i> <strong>4.9 / 5</strong> rating <i>·</i> 100% placement assistance
            </span>
          </div>

          <div className="hero-footnote">
            <span className="hero-footnote-rule" />
            <span>
              FOUNDED ON PRACTICAL WORK<br />
              <b>ENGINEERED FOR YOUR NEXT STEP</b>
            </span>
          </div>
        </div>

        {/* Right Column: Original Demo Card + Offline/Online Quick Toggle */}
        <div className="demo-card" id="demo">
          <div className="demo-card-heading">
            <span className="demo-icon"><GraduationCap /></span>
            <span className="eyebrow">YOUR NEXT STEP STARTS HERE</span>
          </div>
          <h2>Book a free live demo.</h2>
          <p>Reserve your place in a practical software session.</p>

          <div className="urgent-banner">
            <span className="live-dot" />
            <span>
              <b>WEEKEND BATCH — LIMITED SEATS</b>
              <small>Sector 35 campus · 1 seat currently available</small>
            </span>
            <strong className="urgent-timer">
              {hours}:{mins}:{secs}
            </strong>
          </div>

          {/* Compact Mode Toggle */}
          <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg border border-slate-800 bg-slate-950/90 p-1 text-xs">
            {(["Offline Lab", "Live Online"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setLearningMode(m)}
                className={`rounded-md py-1.5 font-semibold transition ${
                  learningMode === m
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {m === "Offline Lab" ? "Faridabad Lab" : "Live Online"}
              </button>
            ))}
          </div>

          <form ref={bookingFormRef} className="demo-form" onSubmit={submitBooking}>
            <label>
              FULL NAME
              <input
                name="name"
                placeholder="e.g. Rahul Sharma"
                value={booking.name}
                onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                required
              />
            </label>
            <label>
              MOBILE NUMBER
              <input
                name="mobile"
                type="tel"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={booking.mobile}
                onChange={(e) =>
                  setBooking({ ...booking, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })
                }
                required
              />
            </label>
            <label>
              SELECT INTERESTED COURSE
              <select
                name="course"
                value={booking.course}
                onChange={(e) => setBooking({ ...booking, course: e.target.value })}
              >
                {courses.map((c) => (
                  <option key={c.title}>{c.title}</option>
                ))}
                <option>CATIA</option>
                <option>ANSYS</option>
              </select>
            </label>
            <Button className="gold-button demo-submit" type="submit" disabled={bookingLoading}>
              {bookingLoading ? (
                <>
                  <span className="spinner" /> Reserving your class…
                </>
              ) : (
                <>
                  RESERVE MY DEMO <ArrowRight />
                </>
              )}
            </Button>
          </form>

          <div className="demo-footnote">
            <ShieldCheck /> No fees. No pressure. Just practical learning.
          </div>
        </div>
      </div>

      <div className="hero-signature relative z-10">
        <span>R2G / CAD</span>
        <span>28° 22&apos; 36.2&quot; N&nbsp; 77° 18&apos; 15.8&quot; E</span>
        <span>40 YEARS OF ENGINEERING MINDSET</span>
      </div>
    </section>
  );
}