import { lazy, Suspense, useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Cuboid,
  Download,
  FileBox,
  FileCheck2,
  Gauge,
  GraduationCap,
  Layers3,
  Move3D,
  Phone,
  Printer,
  ShieldCheck,
  Sparkles,
  Trophy,
  UsersRound,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SiteFooter } from "@/components/SiteFooter";
import { ChatAssistant } from "@/components/ChatAssistant";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { buildPlainTextPdf, isValidDemoOtp, isValidMobile } from "@/lib/r2g-demo-logic";
import { downloadStyledCertificatePdf } from "@/lib/certificate-pdf";
import { getStoredCerts, type CertRecord } from "@/lib/r2g-storage";
import {
  alumni,
  courses,
  curriculum,
  domains,
  materials,
  projects,
  softwareChoices,
} from "@/data/r2g-data";

const CadViewer = lazy(() => import("@/components/CadViewer"));

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "R2G Learn CAD | Industrial Design, CAD/CAM & 3D Printing Lab" },
      {
        name: "description",
        content:
          "Hands-on CAD/CAM, FEA simulation, and 3D printing training at R2G Learn CAD, Sector 35, Faridabad.",
      },
    ],
  }),
});

type DialogKind = "booking" | "otp" | "quote" | "counselor" | null;

const labStages = [
  {
    step: "01",
    title: "CAD Modeling & DFM Check",
    metric: "Tolerance: ±0.05 mm",
    detail: "Design parametric parts in SolidWorks or NX, verify wall thickness, overhangs, and export watertight .STL / .STEP meshes.",
  },
  {
    step: "02",
    title: "Toolpath Slicing & FDM/SLA Print",
    metric: "50µm Resin · 300mm FDM",
    detail: "Configure infill gyroid patterns, tree supports, and bed adhesion on our Sector 35 industrial 3D printers.",
  },
  {
    step: "03",
    title: "Physical Vernier QA & Fit Test",
    metric: "100% Portfolio Verified",
    detail: "Inspect physical prototypes with digital vernier calipers, test mating gears, and document design iterations.",
  },
];

function downloadPdf(name: string, lines: string[]) {
  const blob = new Blob([buildPlainTextPdf(lines)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.pdf`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success("Your file has been downloaded.");
}

function HomePage() {
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [countdown, setCountdown] = useState(3 * 3600 + 42 * 60 + 18);
  const [booking, setBooking] = useState({
    name: "",
    mobile: "",
    course: courses[0]?.title ?? "SolidWorks Masterclass",
  });

  // Certificate Verification & Multi-Cert OTP State
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState<CertRecord | null>(null);
  const [otpMatchedCerts, setOtpMatchedCerts] = useState<CertRecord[]>([]);
  const [scanning, setScanning] = useState(false);

  // Interactive Filters & Simulators
  const [filter, setFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [activeLabStage, setActiveLabStage] = useState(0);
  const [project, setProject] = useState<(typeof projects)[number] | null>(null);
  const [compare, setCompare] = useState(54);
  const [domain, setDomain] = useState("Mechanical");
  const [chosenSoftware, setChosenSoftware] = useState<string[]>(["SolidWorks", "3D Printing"]);
  const [mode, setMode] = useState("Offline Faridabad Lab");
  const [batch, setBatch] = useState("Weekend Professional");
  const [infill, setInfill] = useState([35]);
  const [layer, setLayer] = useState([0.2]);
  const [material, setMaterial] = useState("PLA");
  const [file, setFile] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpResult, setOtpResult] = useState("");
  const [domainStep, setDomainStep] = useState(0);

  const secs = String(countdown % 60).padStart(2, "0");
  const mins = String(Math.floor(countdown / 60) % 60).padStart(2, "0");
  const hours = String(Math.floor(countdown / 3600)).padStart(2, "0");

  const courseDuration = 30 + chosenSoftware.length * 30;
  const courseFee = Math.round(
    courseDuration * 240 * (mode === "Offline Faridabad Lab" ? 1.12 : 1) * 0.85
  );
  const printWeight = Math.round((infill[0] ?? 35) * 0.74 + (layer[0] ?? 0.2) * 63 + 18);
  const materialFactor: Record<string, number> = {
    PLA: 5,
    ABS: 6,
    PETG: 7,
    "Carbon Fiber": 16,
    "Tough Resin": 22,
  };
  const printCost = printWeight * (materialFactor[material] ?? 5);
  const printMinutes = Math.round(110 + (infill[0] ?? 35) * 2.8 + (0.3 - (layer[0] ?? 0.2)) * 180);

  const filteredProjects =
    filter === "All" ? projects : projects.filter((item) => item.category === filter);
  const filteredAlumni =
    companyFilter === "All" ? alumni : alumni.filter((person) => person.company === companyFilter);

  useEffect(() => {
    const tick = window.setInterval(
      () => setCountdown((v) => (v > 0 ? v - 1 : 3 * 3600 + 42 * 60)),
      1000
    );
    return () => window.clearInterval(tick);
  }, []);

  function verifyCertificate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCertificate(null);
    setScanning(true);
    window.setTimeout(() => {
      setScanning(false);
      const allCerts = getStoredCerts();
      const found =
        allCerts.find((c) => c.certId.toUpperCase() === certificateId.trim().toUpperCase()) ?? null;
      setCertificate(found);
      if (found) toast.success(`Certificate verified for ${found.name}!`);
      else toast.error("No matching certificate found. Check ID or issue from Admin.");
    }, 650);
  }

  function addCalendarEvent() {
    const date = new Date(Date.now() + 86400000);
    const start = date.toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}/, "");
    const end = new Date(date.getTime() + 3600000)
      .toISOString()
      .replaceAll(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("R2G Learn CAD — Free Demo Class")}&dates=${start}/${end}&details=${encodeURIComponent(`Course: ${booking.course} · R2G Learn CAD, Sector 35, Faridabad`)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const currentStage = labStages[activeLabStage] ?? labStages[0]!;

  return (
    <main className="r2g-site">
      <Toaster position="top-right" richColors />
      <Navbar />

      {/* Upgraded Interactive Hero Section */}
      <HeroSection
        onBookingSuccess={(data) => {
          setBooking(data);
          setDialog("booking");
        }}
      />

      {/* Interactive Institute Metrics & Quick Jump Strip */}
      <section className="metrics-strip">
        <div className="site-container metrics-grid">
          <div className="metric">
            <strong>15,000<span>+</span></strong>
            <small>ENGINEERS TRAINED</small>
          </div>
          <div className="metric">
            <strong>120<span>+</span></strong>
            <small>NCR HIRING PARTNERS</small>
          </div>
          <div className="metric">
            <strong>2,400<span>+</span></strong>
            <small>3D PROTOTYPES PRINTED</small>
          </div>
          <div className="metric">
            <strong>4.9<span>/5</span></strong>
            <small>LEARNER RATING</small>
          </div>
        </div>
      </section>

      {/* Interactive 3D Digital Twin Section (Multi-Gear Planetary + Exploded View) */}
      <section className="section-space viewer-section" id="viewer">
        <div className="site-container viewer-layout">
          <div className="viewer-copy">
            <span className="eyebrow section-eyebrow">DIGITAL TWIN 01 / KINEMATICS &amp; EXPLODED VIEW</span>
            <h2>
              Turn geometry<br />into <span>understanding.</span>
            </h2>
            <p>
              Inspect multi-part mechanical assemblies live in your browser. Switch between a Planetary Gearbox, Turbine Rotor, and Brake Disc—and drag the <strong>Explode</strong> slider to study part mates.
            </p>
            <div className="model-specs">
              <div>
                <span>ASSEMBLIES</span>
                <b>Planetary · Turbine · Rotor</b>
              </div>
              <div>
                <span>KINEMATICS</span>
                <b>Sun / Planet Gear Ratio</b>
              </div>
              <div>
                <span>INSPECTION</span>
                <b>Exploded View · X-Ray · Mesh</b>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button className="gold-button" size="sm" asChild>
                <Link to="/printing">
                  Upload Your Own .STL File <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="border-slate-700" asChild>
                <Link to="/quiz">
                  <Trophy className="mr-1.5 h-3.5 w-3.5 text-amber-400" /> Test CAD Skills
                </Link>
              </Button>
            </div>
          </div>

          <div className="cad-panel">
            <div className="cad-panel-top">
              <span><i className="status-pip" /> INTERACTIVE CAD DIGITAL TWIN</span>
              <span>WEBGL 2.0</span>
            </div>
            <Suspense
              fallback={
                <div className="flex h-96 items-center justify-center text-xs text-slate-400">
                  Initializing 3D CAD Engine…
                </div>
              }
            >
              <CadViewer />
            </Suspense>
            <div className="cad-panel-footer">
              <span>MULTI-PART KINEMATIC VIEWPORT</span>
              <span>ISO 286 · MILLIMETERS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Courses Section */}
      <section className="courses-section section-space" id="courses">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow section-eyebrow">LEARN BY MAKING / 01—04</span>
              <h2>Skills built for<br />the real world.</h2>
              <p>Choose a path. Build practical skills. Leave with work you can show.</p>
            </div>
            <Link className="text-link" to="/courses">
              Compare all 6 tracks &amp; EMI <ArrowRight />
            </Link>
          </div>
          <div className="course-grid">
            {courses.map((course, index) => {
              const Icon = course.icon;
              return (
                <article className="course-card" key={course.title}>
                  <div className="course-card-top">
                    <span className="course-icon"><Icon /></span>
                    <span className="course-number">0{index + 1}</span>
                  </div>
                  <span className="eyebrow course-label">{course.label}</span>
                  <h3>{course.title}</h3>
                  <p>{course.copy}</p>
                  <div className="software-tags">
                    {course.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="seat-indicator">
                    <span className="live-dot" /> {course.seats} seats this intake{" "}
                    <span className="seat-bar">
                      <i style={{ width: `${Math.min(course.seats * 13, 80)}%` }} />
                    </span>
                  </div>
                  <div className="course-card-bottom">
                    <span className="duration"><Clock3 /> {course.duration}</span>
                    <div className="course-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          downloadPdf(
                            `${course.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}-syllabus`,
                            [course.title, "R2G LEARN CAD", course.copy, ...course.tags]
                          )
                        }
                      >
                        <ArrowDownToLine /> Syllabus
                      </Button>
                      <Button className="course-enroll" variant="outline" size="sm" asChild>
                        <a href="#demo">Enroll <ArrowRight /></a>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3-Step Interactive Course Builder */}
      <section className="section-space finder-section" id="course-finder">
        <div className="site-container finder-layout">
          <div className="finder-intro">
            <span className="eyebrow section-eyebrow">YOUR LEARNING PATH / 03 STEPS</span>
            <h2>Find your<br />next <span>design tool.</span></h2>
            <p>Build a practical course combination around the work you want to do.</p>
            <div className="finder-progress">
              {[0, 1, 2].map((i) => (
                <span className={domainStep === i ? "active" : domainStep > i ? "complete" : ""} key={i}>
                  0{i + 1}
                </span>
              ))}
            </div>
            <div className="finder-callout">
              <Sparkles />
              <span>
                Current estimate<br />
                <b>Scholarship seats are available</b>
              </span>
            </div>
          </div>
          <div className="finder-workspace">
            <div className="finder-step-line">
              <span>STEP 0{domainStep + 1} OF 03</span>
              <span>COURSE BUILDER</span>
            </div>
            {domainStep === 0 ? (
              <div className="finder-step">
                <h3>What do you want to design?</h3>
                <div className="option-grid">
                  {domains.map((d) => (
                    <Button
                      key={d}
                      variant="outline"
                      className={domain === d ? "selected-option" : "option-button"}
                      onClick={() => setDomain(d)}
                    >
                      {domain === d && <Check />} {d}
                    </Button>
                  ))}
                </div>
              </div>
            ) : domainStep === 1 ? (
              <div className="finder-step">
                <h3>Choose your software stack.</h3>
                <div className="option-grid">
                  {softwareChoices.map((s) => (
                    <Button
                      key={s}
                      variant="outline"
                      className={chosenSoftware.includes(s) ? "selected-option" : "option-button"}
                      onClick={() =>
                        setChosenSoftware((prev) =>
                          prev.includes(s) ? prev.filter((v) => v !== s) : [...prev, s]
                        )
                      }
                    >
                      {chosenSoftware.includes(s) && <Check />} {s}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="finder-step">
                <h3>Choose your learning mode.</h3>
                <div className="option-grid">
                  {["Offline Faridabad Lab", "Live Online Interactive"].map((v) => (
                    <Button
                      key={v}
                      variant="outline"
                      className={mode === v ? "selected-option" : "option-button"}
                      onClick={() => setMode(v)}
                    >
                      {mode === v && <Check />} {v}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="finder-result">
              <div className="result-stat">
                <span>ESTIMATED DURATION</span>
                <b>
                  {courseDuration} hours <small>· {Math.max(1, Math.round(courseDuration / 40))} months</small>
                </b>
              </div>
              <div className="result-stat">
                <span>SCHOLARSHIP ESTIMATE</span>
                <b>
                  ₹{courseFee.toLocaleString("en-IN")} <small>· 15% estimate</small>
                </b>
              </div>
              <div className="result-stack">
                <span>YOUR SYLLABUS</span>
                <div>
                  {[domain, ...chosenSoftware].map((v) => (
                    <span key={v}><Check /> {v}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="finder-actions">
              <Button variant="ghost" onClick={() => setDomainStep((s) => Math.max(s - 1, 0))} disabled={!domainStep}>
                Back
              </Button>
              {domainStep < 2 ? (
                <Button className="gold-button" onClick={() => setDomainStep((s) => Math.min(s + 1, 2))}>
                  Continue <ArrowRight />
                </Button>
              ) : (
                <Button
                  className="gold-button"
                  onClick={() => {
                    setBooking({
                      ...booking,
                      course: chosenSoftware[0] ? `${chosenSoftware[0]} · ${domain}` : domain,
                    });
                    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
                    toast.success("Your course path is ready.");
                  }}
                >
                  Claim scholarship seat <ArrowRight />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Live Batch Availability */}
      <section className="section-space batch-section">
        <div className="site-container batch-layout">
          <div className="batch-copy">
            <span className="eyebrow section-eyebrow">BATCH AVAILABILITY / LIVE</span>
            <h2>Pick a time<br />that <span>works.</span></h2>
            <div className="countdown-clock">
              <Clock3 />
              <span>NEXT INTAKE CLOSES IN</span>
              <b>{hours}<i>:</i>{mins}<i>:</i>{secs}</b>
            </div>
          </div>
          <div className="batch-workspace">
            <Tabs value={batch} onValueChange={setBatch}>
              <TabsList className="r2g-tabs">
                <TabsTrigger value="Weekday Morning">Weekday Morning</TabsTrigger>
                <TabsTrigger value="Weekend Professional">Weekend Professional</TabsTrigger>
              </TabsList>
              <TabsContent value="Weekday Morning" className="batch-tab-content">
                <BatchPanel label="WEEKDAY MORNING" days="Monday — Friday" time="10:00 AM — 1:00 PM" seats={3} />
              </TabsContent>
              <TabsContent value="Weekend Professional" className="batch-tab-content">
                <BatchPanel label="WEEKEND PROFESSIONAL" days="Saturday — Sunday" time="10:00 AM — 2:00 PM" seats={1} />
              </TabsContent>
            </Tabs>
            <div className="batch-footer">
              <span><i className="live-dot" /> SEATS UPDATE IN REAL TIME</span>
              <Button
                className="gold-button"
                onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
              >
                Reserve your seat <ArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Upgraded Interactive 3D Printing & Prototyping Lab Pipeline */}
      <section className="lab-section section-space" id="lab">
        <div className="site-container lab-layout">
          <div className="rounded-2xl border border-slate-800 bg-[#081120] p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400">
                <span className="live-dot" /> SECTOR 35 ADDITIVE WORKFLOW
              </span>
              <span className="font-mono text-xs text-slate-400">STAGE {currentStage.step} / 03</span>
            </div>

            <div className="mt-5 space-y-2.5">
              {labStages.map((st, idx) => (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => setActiveLabStage(idx)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                    activeLabStage === idx
                      ? "border-amber-400 bg-amber-400/15 text-white"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400">STEP {st.step}</span>
                    <b className="block text-base">{st.title}</b>
                  </div>
                  <span className="rounded bg-slate-900 px-2.5 py-1 font-mono text-[11px] text-emerald-300">
                    {st.metric}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/90 p-4 text-xs leading-relaxed text-slate-300">
              <b className="mb-1 block text-amber-300">Lab Standard:</b>
              {currentStage.detail}
            </div>
          </div>

          <div className="lab-copy">
            <span className="eyebrow section-eyebrow">FROM SCREEN TO REAL WORLD</span>
            <h2>Make it. Print it.<br /><span>See it work.</span></h2>
            <p>
              Step beyond the screen. Explore how a digital design becomes a physical prototype, from the first parametric model to a part you can hold and measure.
            </p>
            <div className="lab-points">
              <div>
                <span className="point-icon"><Cuboid /></span>
                <span><strong>Design with intent</strong><small>Model practical, production-minded parts.</small></span>
              </div>
              <div>
                <span className="point-icon"><Printer /></span>
                <span><strong>Print a real prototype</strong><small>Learn FDM &amp; SLA additive manufacturing hands-on.</small></span>
              </div>
              <div>
                <span className="point-icon"><Check /></span>
                <span><strong>Test and refine</strong><small>Validate tolerances with digital vernier inspection.</small></span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                className="navy-action"
                onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
              >
                Quick Cost Estimator <ArrowRight />
              </Button>
              <Button className="gold-button" asChild>
                <Link to="/printing">Open Live 3D .STL Viewer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Slicer Cost Estimator */}
      <section className="section-space estimator-section" id="calculator">
        <div className="site-container estimator-layout">
          <div className="estimator-intro">
            <span className="eyebrow section-eyebrow">3D PRINTING LAB / COST ESTIMATOR</span>
            <h2>Prototype before<br /><span>you produce.</span></h2>
            <p>Estimate your print from basic slicer settings, or open our full 3D STL Mesh Viewer for exact volume pricing.</p>
            <div className="estimator-mark">
              <FileBox /> FDM / SLA · 5 MATERIALS<br />ESTIMATE ONLY
            </div>
          </div>
          <div className="calculator-panel">
            <div className="calculator-title">
              <div>
                <span className="eyebrow">PRINT CONFIGURATION</span>
                <h3>Set your material &amp; detail.</h3>
              </div>
              <span className="calc-live"><i className="live-dot" /> LIVE ESTIMATE</span>
            </div>
            <div className="material-row">
              <span>MATERIAL</span>
              <div>
                {materials.map((m) => (
                  <Button
                    key={m}
                    variant="outline"
                    size="sm"
                    className={material === m ? "material-selected" : "material-pill"}
                    onClick={() => setMaterial(m)}
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>
            <div className="slider-row">
              <div className="slider-label">
                <span>INFILL DENSITY</span>
                <b>{infill[0]}%</b>
              </div>
              <Slider value={infill} min={10} max={100} step={5} onValueChange={setInfill} />
            </div>
            <div className="slider-row">
              <div className="slider-label">
                <span>LAYER HEIGHT</span>
                <b>{layer[0]?.toFixed(2)} mm</b>
              </div>
              <Slider value={layer} min={0.1} max={0.3} step={0.05} onValueChange={setLayer} />
            </div>
            <div className="print-stats">
              <div>
                <span>PRINT TIME</span>
                <b>{Math.floor(printMinutes / 60)}h {printMinutes % 60}m</b>
              </div>
              <div>
                <span>FILAMENT / RESIN</span>
                <b>{printWeight} <small>g</small></b>
              </div>
              <div>
                <span>EST. PROTOTYPE</span>
                <b>₹{printCost.toLocaleString("en-IN")}</b>
              </div>
            </div>
            <Button className="gold-button print-submit" onClick={() => setDialog("quote")}>
              <FileBox /> Submit CAD file for prototype print <ArrowRight />
            </Button>
          </div>
        </div>
      </section>

      {/* Student Project Hub */}
      <section className="section-space project-section" id="projects">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow section-eyebrow">STUDENT PROJECT HUB / SELECTED WORK</span>
              <h2>Designed to be<br /><span>shown.</span></h2>
            </div>
            <span className="project-count">0{filteredProjects.length} / 04 PROJECTS</span>
          </div>
          <div className="filter-tabs">
            {["All", "Automotive", "Aerospace", "3D Prototype Lab", "Sheet Metal"].map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                className={filter === category ? "filter-active" : "filter-button"}
                onClick={() => setFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="project-grid">
            {filteredProjects.map((item, i) => (
              <button
                type="button"
                className={`project-card project-card-${i + 1}`}
                key={item.title}
                onClick={() => {
                  setProject(item);
                  setCompare(54);
                }}
              >
                <span className="project-art">
                  <span className="blueprint-lines" />
                  <span className="project-glyph">
                    {i === 0 ? <Cuboid /> : i === 1 ? <Move3D /> : i === 2 ? <Printer /> : <Layers3 />}
                  </span>
                  <span className="project-label">R2G / PROJECT 0{i + 1}</span>
                  <span className="project-open"><ArrowRight /></span>
                </span>
                <span className="project-details">
                  <span className="eyebrow">{item.category.toUpperCase()} · {item.software}</span>
                  <b>{item.title}</b>
                  <span className="project-student">
                    {item.student} <i>·</i> Placed at {item.company}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Filterable Alumni Placement Wall */}
      <section className="section-space placement-section" id="career">
        <div className="site-container placement-layout">
          <div className="placement-intro">
            <span className="eyebrow section-eyebrow">R2G ALUMNI / PLACEMENT WALL</span>
            <h2>Engineering<br />talent, <span>in motion.</span></h2>
            <p className="mt-2 text-xs text-slate-400">Filter placed alumni by hiring company:</p>
            <div className="placement-companies">
              {["All", "MARUTI SUZUKI", "TATA MOTORS", "L&T", "HAVELLS", "UNO MINDA"].map((comp) => {
                const formatted =
                  comp === "All"
                    ? "All"
                    : comp === "L&T"
                      ? "L&T"
                      : comp
                          .split(" ")
                          .map((w) => w[0] + w.slice(1).toLowerCase())
                          .join(" ");
                const isSelected = companyFilter === formatted;
                return (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => setCompanyFilter(formatted)}
                    className={`cursor-pointer transition ${
                      isSelected ? "!border-amber-400 !bg-amber-400/20 !text-amber-300" : ""
                    }`}
                  >
                    {comp}
                  </button>
                );
              })}
            </div>
            <div className="salary-ticker">
              <span><Activity /> TOP FRESHER CTC</span>
              <b>5.2 <small>LPA</small></b>
              <i>·</i>
              <span>MECHANICAL CAD DESIGN</span>
            </div>
            <div className="mt-5">
              <Link className="text-link" to="/placements">
                Explore all placements <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="alumni-list">
            {filteredAlumni.map((person, i) => (
              <article className="alumni-row" key={person.name}>
                <div className="alumni-index">0{i + 1}</div>
                <div className="alumni-monogram">
                  {person.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div className="alumni-info">
                  <b>{person.name}</b>
                  <span>{person.role}</span>
                </div>
                <div className="alumni-company">
                  <span>PLACED AT</span>
                  <b>{person.company}</b>
                  <span>CLASS OF {person.year}</span>
                </div>
                <span className="package-tag">{person.package}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Live Certificate Verification Section */}
      <section className="certificate-section section-space" id="certificate">
        <div className="site-container certificate-layout">
          <div className="certificate-intro">
            <span className="eyebrow hero-eyebrow"><span /> YOUR WORK, RECOGNIZED</span>
            <h2>Credentials you<br />can <span>stand behind.</span></h2>
            <p className="mt-2 text-sm text-slate-300">
              Verify any R2G certificate ID or retrieve all your credentials via mobile OTP.
            </p>
            <div className="certificate-seal">
              <ShieldCheck />
              <span>INSTITUTE<br />VERIFICATION</span>
            </div>
          </div>
          <div className="verify-panel">
            <div className="verify-panel-title">
              <span className="verify-icon"><BadgeCheck /></span>
              <div>
                <span className="eyebrow">CERTIFICATE SERVICES</span>
                <h3>Verify a certificate</h3>
              </div>
            </div>
            <form className="verify-form" onSubmit={verifyCertificate}>
              <label htmlFor="certificate-id">CERTIFICATE ID</label>
              <div className="verify-input-row">
                <input
                  id="certificate-id"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="e.g. R2G-2026-CAD-8941"
                />
                <Button className="gold-button" type="submit" disabled={scanning}>
                  {scanning ? "Checking…" : <>Verify Credential <ArrowRight /></>}
                </Button>
              </div>
            </form>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="sample-pill"
                onClick={() => {
                  setCertificateId("R2G-2026-CAD-8941");
                  setCertificate(null);
                }}
              >
                Try sample ID <ArrowRight />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="sample-pill text-amber-300"
                onClick={() => {
                  setOtp("");
                  setOtpPhone("");
                  setOtpResult("");
                  setOtpMatchedCerts([]);
                  setDialog("otp");
                }}
              >
                Retrieve by Mobile OTP <ArrowRight />
              </Button>
            </div>

            {certificate && (
              <div className="verified-card">
                <div className="verified-card-top">
                  <span><BadgeCheck /> VERIFIED CREDENTIAL</span>
                </div>
                <h3>{certificate.name}</h3>
                <p>{certificate.course}</p>
                <div className="certificate-meta">
                  <span>ISSUED<br /><b>{certificate.year}</b></span>
                  <span>CREDENTIAL<br /><b>{certificateId.toUpperCase()}</b></span>
                </div>
                <Button
                  className="gold-button"
                  size="sm"
                  onClick={() =>
                    downloadStyledCertificatePdf({
                      name: certificate.name,
                      course: certificate.course,
                      year: certificate.year,
                      certId: certificateId.toUpperCase(),
                    })
                  }
                >
                  <Download /> Download Official Certificate (PDF)
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 12-Week Curriculum */}
      <section className="section-space curriculum-section">
        <div className="site-container curriculum-layout">
          <div className="curriculum-intro">
            <span className="eyebrow section-eyebrow">INDUSTRIAL CAD / CAM ROADMAP</span>
            <h2>From first sketch<br />to <span>final prototype.</span></h2>
            <div className="curriculum-total">
              <b>12</b>
              <span>WEEKS OF<br />GUIDED DESIGN</span>
            </div>
            <Button
              className="outline-action"
              variant="outline"
              onClick={() =>
                downloadPdf(
                  "R2G-12-week-curriculum",
                  curriculum.map((w) => `Week ${w[0]}: ${w[1]}`)
                )
              }
            >
              <Download /> Download complete curriculum
            </Button>
          </div>
          <div className="curriculum-list">
            <Accordion type="single" collapsible defaultValue="week-1">
              {curriculum.map(([week, title, details, milestone]) => (
                <AccordionItem key={week} value={`week-${week}`} className="curriculum-item">
                  <AccordionTrigger className="curriculum-trigger">
                    <span className="curriculum-week">{week}</span>
                    <span className="curriculum-title">{title}<small>WEEK {week}</small></span>
                    <ChevronDown />
                  </AccordionTrigger>
                  <AccordionContent className="curriculum-content">
                    <p>{details}</p>
                    <div className="milestone-line">
                      <span>PROJECT MILESTONE</span>
                      <b>{milestone}</b>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-space footer-cta">
        <div className="site-container footer-cta-content">
          <div>
            <span className="eyebrow">DESIGNED AROUND YOUR NEXT STEP</span>
            <h2>Let’s build your next<br /><span>engineering chapter.</span></h2>
          </div>
          <Button
            className="gold-button"
            onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
          >
            Reserve a free demo <ArrowRight />
          </Button>
          <span className="footer-coordinate">
            R2G LEARN CAD<br />SECTOR 35 · FARIDABAD
          </span>
        </div>
      </section>

      <SiteFooter
        onOpenOtp={() => {
          setOtp("");
          setOtpPhone("");
          setOtpResult("");
          setOtpMatchedCerts([]);
          setDialog("otp");
        }}
      />
      <ChatAssistant onOpenCounselor={() => setDialog("counselor")} />

      {/* Interactive Modals */}
      <Dialog open={dialog !== null} onOpenChange={(open) => { if (!open) setDialog(null); }}>
        <DialogContent className="r2g-dialog">
          <DialogHeader>
            <DialogTitle>
              {dialog === "booking"
                ? "Your demo class is reserved."
                : dialog === "otp"
                  ? "Retrieve your certificates"
                  : dialog === "quote"
                    ? "Submit a prototype request"
                    : "Book a counselor call"}
            </DialogTitle>
            <DialogDescription>
              {dialog === "booking"
                ? `Thanks, ${booking.name}. Our team will call you shortly.`
                : "Complete the details below."}
            </DialogDescription>
          </DialogHeader>

          {dialog === "booking" && (
            <div className="booking-summary">
              <div><span>LEARNER</span><b>{booking.name}</b></div>
              <div><span>INTEREST</span><b>{booking.course}</b></div>
              <div><span>CONTACT</span><b>+91 {booking.mobile}</b></div>
              <Button className="gold-button" onClick={addCalendarEvent}>
                <CalendarDays /> Add to Google Calendar
              </Button>
            </div>
          )}

          {dialog === "otp" && (
            <form
              className="modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!isValidMobile(otpPhone)) {
                  setOtpResult("Enter a 10-digit mobile number.");
                  return;
                }
                if (!isValidDemoOtp(otp)) {
                  setOtpResult("Demo OTP is 1234.");
                  return;
                }
                const matches = getStoredCerts().filter((c) => c.mobile === otpPhone);
                setOtpMatchedCerts(matches);
                if (matches.length === 0) {
                  setOtpResult("No certificate issued for this mobile yet. Generate it from Admin Backend first!");
                  return;
                }
                setOtpResult(`Verified! Found ${matches.length} certificate(s) for ${matches[0]!.name}.`);
                setCertificateId(matches[0]!.certId);
                setCertificate(matches[0]!);
                toast.success(`Loaded ${matches.length} certificate(s)!`);
              }}
            >
              <label>
                REGISTERED MOBILE
                <input
                  type="tel"
                  maxLength={10}
                  value={otpPhone}
                  onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 9876543210 or 9811223344"
                  required
                />
              </label>
              <label>
                4-DIGIT DEMO OTP
                <input
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="1234"
                  required
                />
              </label>
              <Button className="gold-button" type="submit">
                <ShieldCheck /> Verify credentials
              </Button>

              {otpResult && (
                <div className="otp-result space-y-2">
                  <p>{otpResult}</p>
                  {otpMatchedCerts.map((item) => (
                    <div
                      key={item.certId}
                      className="flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-950/90 p-2.5 text-xs"
                    >
                      <div>
                        <b className="block text-white">{item.course}</b>
                        <span className="font-mono text-amber-300">{item.certId}</span>
                      </div>
                      <Button
                        size="sm"
                        className="gold-button h-7 text-xs"
                        onClick={() =>
                          downloadStyledCertificatePdf({
                            name: item.name,
                            course: item.course,
                            year: item.year,
                            certId: item.certId,
                          })
                        }
                      >
                        <Download className="mr-1 h-3 w-3" /> PDF
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </form>
          )}

          {dialog === "quote" && (
            <form
              className="modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success(`Prototype request staged for ${file}.`);
                setDialog(null);
              }}
            >
              <label>PROJECT NAME<input placeholder="e.g. Gear housing prototype" required /></label>
              <label>CAD FILE<input type="file" onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")} required /></label>
              {file && <p className="file-selected"><FileCheck2 /> {file}</p>}
              <Button className="gold-button" type="submit"><Printer /> Prepare print request</Button>
            </form>
          )}

          {dialog === "counselor" && (
            <form
              className="modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Counselor call request noted.");
                setDialog(null);
              }}
            >
              <label>YOUR NAME<input required /></label>
              <label>MOBILE NUMBER<input type="tel" maxLength={10} required /></label>
              <Button className="gold-button" type="submit"><Phone /> Request a call</Button>
            </form>
          )}

          {dialog === "booking" && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialog(null)}>Close</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Project 2D Blueprint vs 3D Model Comparison Modal */}
      <Dialog open={Boolean(project)} onOpenChange={(open) => { if (!open) setProject(null); }}>
        <DialogContent className="project-dialog">
          <DialogHeader>
            <DialogTitle>{project?.title}</DialogTitle>
            <DialogDescription>{project?.category} · {project?.software}</DialogDescription>
          </DialogHeader>
          {project && (
            <div className="project-detail">
              <div className="compare-visual">
                <div className="compare-blueprint">
                  <span>2D · BLUEPRINT</span>
                  <span className="compare-part"><Cuboid /></span>
                </div>
                <div className="compare-render" style={{ clipPath: `inset(0 0 0 ${compare}%)` }}>
                  <span>3D · SHADED MODEL</span>
                  <span className="compare-part"><Cuboid /></span>
                </div>
                <input
                  className="compare-range"
                  type="range"
                  min="15"
                  max="85"
                  value={compare}
                  onChange={(e) => setCompare(Number(e.target.value))}
                />
              </div>
              <div className="project-quote">
                <span>STUDENT / {project.student.toUpperCase()}</span>
                <p>“{project.quote}”</p>
                <b><BriefcaseBusiness /> Placed at {project.company}</b>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function BatchPanel({ label, days, time, seats }: { label: string; days: string; time: string; seats: number }) {
  return (
    <div className="batch-panel">
      <div className="batch-panel-top">
        <span className="eyebrow">{label}</span>
        <span className="seat-critical">
          <i className="live-dot" /> {seats === 1 ? "CRITICAL · 1 SEAT LEFT" : `${seats} SEATS LEFT`}
        </span>
      </div>
      <h3>{days}</h3>
      <p>{time} · Sector 35 studio</p>
      <div className="batch-facts">
        <span><UsersRound /> Small focused cohort</span>
        <span><CheckCircle2 /> Instructor-led practical work</span>
        <span><CalendarDays /> New intake every month</span>
      </div>
    </div>
  );
}