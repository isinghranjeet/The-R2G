import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUp,
  Award,
  BadgeCheck,
  Check,
  Clock,
  Copy,
  Cuboid,
  Download,
  ExternalLink,
  FileCheck2,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buildPlainTextPdf, isValidMobile } from "@/lib/r2g-demo-logic";
import { getStoredCerts } from "@/lib/r2g-storage";

export function SiteFooter({ onOpenOtp }: { onOpenOtp: () => void }) {
  // Feature 1: Quick Certificate Verifier in Footer
  const [quickCertId, setQuickCertId] = useState("");
  const [quickCertMatch, setQuickCertMatch] = useState<string | null>(null);

  // Feature 2: Engineering Newsletter Subscription
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Feature 3: Instant Callback Mini-Form
  const [callbackPhone, setCallbackPhone] = useState("");

  // Feature 4: Copy State
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Feature 5: Live Faridabad Lab Open/Closed Check (9 AM - 7 PM IST)
  const currentHour = new Date().getHours();
  const isLabOpen = currentHour >= 9 && currentHour < 19;

  function handleCopyText(label: string, value: string) {
    navigator.clipboard?.writeText(value);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard!`);
    window.setTimeout(() => setCopiedField(null), 1500);
  }

  function handleQuickCertCheck(e: FormEvent) {
    e.preventDefault();
    const id = quickCertId.trim().toUpperCase();
    if (!id) return;
    const found = getStoredCerts().find((c) => c.certId.toUpperCase() === id);
    if (found) {
      setQuickCertMatch(`Verified: ${found.name} (${found.course})`);
      toast.success(`Valid Credential: ${found.name}`);
    } else {
      setQuickCertMatch("Not found — check ID or retrieve via OTP.");
      toast.error("No certificate found with that ID.");
    }
  }

  function handleNewsletterSubmit(e: FormEvent) {
    e.preventDefault();
    if (!newsletterEmail.includes("@")) return;
    setSubscribed(true);
    toast.success("Subscribed to R2G Weekly CAD/CAM & GD&T Digest!");
    setNewsletterEmail("");
  }

  function handleQuickCallback(e: FormEvent) {
    e.preventDefault();
    if (!isValidMobile(callbackPhone)) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }
    toast.success(`Callback scheduled for +91 ${callbackPhone}!`);
    setCallbackPhone("");
  }

  function handleDownloadBrochure() {
    const blob = new Blob(
      [
        buildPlainTextPdf([
          "R2G LEARN CAD — OFFICIAL 2026 PROSPECTUS & FEE GUIDE",
          "Campus: Sector 35, Main Mathura Road, Faridabad, Haryana 121003",
          "Accreditation: ISO 9001:2015 Certified Design & Prototyping Studio",
          "Programs: SolidWorks (12W), AutoCAD 2D/3D (8W), Siemens NX CAM (12W), CATIA V5 (10W), ANSYS FEA (8W), 3D Printing (6W)",
          "Placement Partners: Maruti Suzuki Vendors, Tata Motors, L&T, Havells, Uno Minda",
          "Admissions Helpline: +91 98765 43210 · admissions@r2glearncad.com",
        ]),
      ],
      { type: "application/pdf" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "R2G-Learn-CAD-Brochure-2026.pdf";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("2026 Institute Brochure downloaded!");
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="site-footer border-t border-slate-800/90 bg-[#060b14] text-slate-300">
      {/* Top Interactive Utility Strip: Newsletter + Instant Callback */}
      <div className="border-b border-slate-800/80 bg-[#091222]">
        <div className="site-container grid gap-6 py-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-amber-400 uppercase">
              <Sparkles className="h-3.5 w-3.5" /> R2G ENGINEERING DISPATCH
            </span>
            <h3 className="mt-1 text-xl font-bold text-white">
              Get weekly GD&amp;T blueprints, CAD shortcuts &amp; NCR hiring alerts.
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="mt-3 flex max-w-md gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your engineering email..."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-500"
              />
              <Button type="submit" size="sm" className="gold-button px-4 text-xs">
                {subscribed ? (
                  <>
                    <Check className="mr-1 h-3.5 w-3.5" /> Subscribed
                  </>
                ) : (
                  <>
                    <Send className="mr-1 h-3.5 w-3.5" /> Join Free
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 lg:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-white">Need a quick fee or batch callback?</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  isLabOpen
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-amber-500/15 text-amber-300"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {isLabOpen ? "Faridabad Lab Open Now" : "Opens 9:00 AM IST"}
              </span>
            </div>
            <form onSubmit={handleQuickCallback} className="mt-3 flex gap-2">
              <input
                type="tel"
                maxLength={10}
                required
                value={callbackPhone}
                onChange={(e) => setCallbackPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="10-digit mobile number"
                className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white"
              />
              <Button type="submit" size="sm" variant="outline" className="border-amber-400/40 text-xs text-amber-300 hover:bg-amber-400/10">
                <Phone className="mr-1 h-3.5 w-3.5" /> Request Call
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Grid */}
      <div className="site-container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand, ISO Badge & Brochure Download */}
          <div className="space-y-4">
            <Link className="brand-lockup footer-brand" to="/">
              <span className="brand-mark"><Cuboid /></span>
              <span className="brand-text">
                <strong>R2G LEARN CAD</strong>
                <small>INSTITUTE OF DESIGN &amp; DRAFTING</small>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              40 years of engineering mindset. Practical CAD/CAM, FEA simulation, and 3D prototyping training in Faridabad.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 rounded border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                <ShieldCheck className="h-3.5 w-3.5" /> ISO 9001:2015
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                <Award className="h-3.5 w-3.5" /> 15,000+ Alumni
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                className="border-slate-700 text-xs"
                onClick={handleDownloadBrochure}
              >
                <Download className="mr-1.5 h-3.5 w-3.5 text-amber-400" /> 2026 Brochure
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300 hover:bg-emerald-500/20"
                asChild
              >
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent("Hi R2G Learn CAD! I would like to know about upcoming CAD/CAM batches.")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Column 2: Explore Platform Pages */}
          <div>
            <h4 className="mb-3.5 text-xs font-semibold tracking-wider text-amber-400 uppercase">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/about" className="transition hover:text-white">About R2G Lab &amp; Heritage</Link></li>
              <li><Link to="/courses" className="transition hover:text-white">All CAD/CAM &amp; FEA Courses</Link></li>
              <li><Link to="/printing" className="transition hover:text-white">3D Printing &amp; Prototyping Lab</Link></li>
              <li><Link to="/placements" className="transition hover:text-white">Student Placements &amp; Packages</Link></li>
              <li><Link to="/blog" className="transition hover:text-white">Engineering Journal &amp; Guides</Link></li>
              <li><Link to="/contact" className="transition hover:text-white">Faridabad Campus &amp; Map</Link></li>
              <li className="pt-1">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400/90 hover:text-amber-300"
                >
                  <LockKeyhole className="h-3.5 w-3.5" /> Staff &amp; Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Instant Credential Verification Widget */}
          <div className="space-y-3">
            <h4 className="mb-3.5 text-xs font-semibold tracking-wider text-amber-400 uppercase">
              Credential Services
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Instant HR &amp; student certificate lookup by ID, or retrieve via registered mobile OTP.
            </p>
            <form onSubmit={handleQuickCertCheck} className="space-y-2">
              <div className="flex gap-1.5">
                <input
                  value={quickCertId}
                  onChange={(e) => setQuickCertId(e.target.value)}
                  placeholder="R2G-2026-CAD-8941"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-white"
                />
                <Button type="submit" size="sm" className="gold-button px-3 text-xs">
                  Check
                </Button>
              </div>
              {quickCertMatch && (
                <p className="rounded border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-[11px] text-emerald-300">
                  {quickCertMatch}
                </p>
              )}
            </form>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between border-amber-400/30 bg-amber-400/10 text-xs text-amber-300 hover:bg-amber-400/20"
              onClick={onOpenOtp}
            >
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="h-3.5 w-3.5" /> Retrieve via Mobile OTP
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Column 4: Faridabad Campus Contact & Copy Tools */}
          <div className="space-y-3 text-sm text-slate-400">
            <h4 className="mb-3.5 text-xs font-semibold tracking-wider text-amber-400 uppercase">
              Faridabad Campus
            </h4>
            <div className="flex items-start justify-between gap-2">
              <p className="flex items-start gap-2 text-xs leading-relaxed">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>Sector 35, Main Mathura Road, Near Ashoka Enclave, Faridabad, Haryana 121003</span>
              </p>
              <button
                type="button"
                onClick={() =>
                  handleCopyText("Address", "Sector 35, Main Mathura Road, Faridabad, Haryana 121003")
                }
                className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-white"
                title="Copy address"
              >
                {copiedField === "Address" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <a href="tel:+919876543210" className="flex items-center gap-2 text-xs hover:text-white">
                <Phone className="h-4 w-4 shrink-0 text-amber-400" /> +91 98765 43210
              </a>
              <button
                type="button"
                onClick={() => handleCopyText("Phone", "+919876543210")}
                className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-white"
                title="Copy phone"
              >
                {copiedField === "Phone" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <p className="flex items-center gap-2 text-xs">
              <Mail className="h-4 w-4 shrink-0 text-amber-400" />
              <a href="mailto:admissions@r2glearncad.com" className="hover:text-white">
                admissions@r2glearncad.com
              </a>
            </p>

            <p className="flex items-center gap-2 text-xs">
              <Clock className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Mon – Sun: 9:00 AM – 7:00 PM</span>
            </p>

            <a
              href="https://maps.google.com/?q=28.3767,77.3044"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 pt-1 text-xs font-medium text-amber-400 hover:underline"
            >
              Open in Google Maps (28°22&apos;36&quot;N) <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Back-to-Top Bar */}
      <div className="border-t border-slate-800/80 bg-[#04080f]">
        <div className="site-container flex flex-wrap items-center justify-between gap-4 py-4 text-xs text-slate-500">
          <span>© 2026 R2G Learn CAD · Institute of Design &amp; Drafting</span>
          <span className="font-mono tracking-widest text-slate-400">LEARN · DESIGN · PROTOTYPE</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 font-semibold text-amber-400 hover:text-amber-300"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}