import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  GraduationCap,
  Move3D,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isValidMobile } from "@/lib/r2g-demo-logic";
import { getStoredLeads, saveStoredLeads } from "@/lib/r2g-storage";
import { courses } from "@/data/r2g-data";

const tracks = [
  { id: "cad", label: "Mechanical CAD", title: "CAD/CAM & Product Design", course: "SolidWorks Masterclass" },
  { id: "cam", label: "CNC & Tooling", title: "Siemens NX & CNC CAM", course: "Siemens NX & CAM" },
  { id: "print", label: "3D Printing", title: "3D Printing & Prototyping", course: "3D Printing & Prototyping" },
];

interface HeroSectionProps {
  onBookingSuccess: (data: { name: string; mobile: string; course: string }) => void;
}

export function HeroSection({ onBookingSuccess }: HeroSectionProps) {
  const [activeTrack, setActiveTrack] = useState(tracks[0]!);
  const [booking, setBooking] = useState({
    name: "",
    mobile: "",
    course: courses[0]?.title ?? "SolidWorks Masterclass",
  });
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3 * 3600 + 42 * 60 + 18);
  const formRef = useRef<HTMLFormElement>(null);

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

  function selectTrack(track: (typeof tracks)[number]) {
    setActiveTrack(track);
    setBooking((prev) => ({ ...prev, course: track.course }));
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidMobile(booking.mobile)) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      const existing = getStoredLeads();
      saveStoredLeads([
        {
          id: `LD-${Math.floor(200 + Math.random() * 799)}`,
          name: booking.name.trim(),
          mobile: booking.mobile,
          course: booking.course,
          batch: "Weekend Professional",
          status: "Pending",
          date: "Today",
        },
        ...existing,
      ]);
      setLoading(false);
      onBookingSuccess(booking);
      toast.success("Demo class reserved.");
      formRef.current?.reset();
    }, 700);
  }

  return (
    <section className="hero-section relative overflow-hidden" id="home">
      <div className="hero-grid-overlay" aria-hidden="true" />
      <div className="hero-glow hero-glow-blue" />
      <div className="hero-glow hero-glow-gold" />

      <div className="site-container hero-content">
        {/* Clean Left Column */}
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">
            <span /> SECTOR 35, FARIDABAD <i>·</i> ISO 9001:2015 STUDIO
          </span>

          <h1 className="mt-4">
            Master Industrial<br />
            <span>{activeTrack.title}</span>
          </h1>

          <p className="hero-description max-w-xl">
            Practical, workstation-based training on SolidWorks, AutoCAD, Siemens NX, CATIA V5 &amp; 3D Printing with real manufacturing projects.
          </p>

          {/* Minimalist Track Selector */}
          <div className="mt-6 inline-flex flex-wrap gap-1.5 rounded-xl border border-slate-800/90 bg-slate-950/70 p-1.5">
            {tracks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTrack(t)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeTrack.id === t.id
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Only 2 Clean Primary Buttons */}
          <div className="hero-actions mt-7 flex flex-wrap gap-3">
            <Button className="gold-button" asChild>
              <a href="#courses">
                Explore Courses <ArrowDown />
              </a>
            </Button>
            <Button className="portal-button" variant="outline" asChild>
              <a href="#viewer">
                <Move3D /> 3D Lab Preview
              </a>
            </Button>
          </div>

          <div className="hero-proof mt-7">
            <span className="proof-icon"><BadgeCheck /></span>
            <span>
              <strong>15,000+</strong> engineers trained <i>·</i> <strong>4.9/5</strong> rating <i>·</i> 100% placement support
            </span>
          </div>
        </div>

        {/* Clean Right Booking Card */}
        <div className="demo-card" id="demo">
          <div className="demo-card-heading">
            <span className="demo-icon"><GraduationCap /></span>
            <span className="eyebrow">FREE LIVE SESSION</span>
          </div>

          <h2>Book a free demo.</h2>
          <p>Experience a practical CAD session at our Faridabad lab.</p>

          <div className="urgent-banner">
            <span className="live-dot" />
            <span>
              <b>WEEKEND BATCH</b>
              <small>1 workstation seat remaining</small>
            </span>
            <strong className="urgent-timer">
              {hours}:{mins}:{secs}
            </strong>
          </div>

          <form ref={formRef} className="demo-form" onSubmit={submitBooking}>
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
              COURSE TRACK
              <select
                name="course"
                value={booking.course}
                onChange={(e) => setBooking({ ...booking, course: e.target.value })}
              >
                {courses.map((c) => (
                  <option key={c.title}>{c.title}</option>
                ))}
                <option>CATIA V5</option>
                <option>ANSYS FEA</option>
              </select>
            </label>
            <Button className="gold-button demo-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" /> Reserving…
                </>
              ) : (
                <>
                  RESERVE FREE DEMO <ArrowRight />
                </>
              )}
            </Button>
          </form>

          <div className="demo-footnote">
            <ShieldCheck /> No fees. Practical guidance only.
          </div>
        </div>
      </div>

      <div className="hero-signature">
        <span>R2G LEARN CAD</span>
        <span>SECTOR 35 · FARIDABAD</span>
        <span>40 YEARS OF ENGINEERING MINDSET</span>
      </div>
    </section>
  );
}