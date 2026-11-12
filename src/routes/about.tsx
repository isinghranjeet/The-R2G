import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  Factory,
  FileCheck2,
  GraduationCap,
  Layers,
  MapPin,
  Monitor,
  Phone,
  Printer,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { buildPlainTextPdf } from "@/lib/r2g-demo-logic";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us | R2G Learn CAD — Institute of Design & Drafting, Faridabad" },
      {
        name: "description",
        content:
          "Discover R2G Learn CAD in Sector 35, Faridabad. 40 years of engineering mindset, ISO 9001:2015 certified CAD/CAM & 3D printing labs, and industry mentors.",
      },
    ],
  }),
});

const milestones = [
  {
    year: "1986",
    title: "Foundational Drafting & Tooling Roots",
    detail:
      "Started with manual precision engineering drafting, jig-fixture design, and industrial tooling consultancy for Faridabad-Ballabgarh manufacturing units.",
  },
  {
    year: "2004",
    title: "Transition to 3D Parametric CAD",
    detail:
      "Introduced dedicated AutoCAD and SolidWorks training workstations to help mechanical engineers move from 2D blueprints to associative 3D assemblies.",
  },
  {
    year: "2016",
    title: "Automotive BIW & CAE Expansion",
    detail:
      "Added CATIA V5 surface modeling, Siemens NX CAM toolpath programming, and ANSYS structural simulation modules aligned with Tier-1 OEM standards.",
  },
  {
    year: "2022",
    title: "Industry 4.0 Additive & 3D Printing Lab",
    detail:
      "Commissioned an in-house FDM and SLA rapid prototyping bay so every student converts digital CAD models into physical, tested parts.",
  },
  {
    year: "2026",
    title: "15,000+ Engineers Trained Across NCR",
    detail:
      "ISO 9001:2015 certified campus in Sector 35, Faridabad, partnering with 120+ automotive, sheet-metal, and product design employers.",
  },
];

const labZones = [
  {
    id: "cad-studio",
    name: "CAD Design Studio",
    stations: "24 Dual-Monitor Workstations",
    specs: "Intel Core i7 / Ryzen 7 · 32GB RAM · NVIDIA Quadro / RTX Graphics",
    software: "SolidWorks 2025, AutoCAD Mechanical, CATIA V5, Creo Parametric",
    description:
      "Ergonomic design studio built for long-hour parametric assembly modeling, GD&T detailing, and live instructor screen-casting.",
  },
  {
    id: "cam-cnc",
    name: "CAM & Tooling Bay",
    stations: "12 High-Speed Compute Nodes",
    specs: "Multi-axis Toolpath Simulation · Post-Processor Verification",
    software: "Siemens NX CAM, Mastercam, Delcam PowerMill",
    description:
      "Focused on 3-axis and 5-axis milling strategies, turning cycles, mold cavity extraction, and collision-free G-code generation.",
  },
  {
    id: "additive-lab",
    name: "3D Printing & Prototyping Lab",
    stations: "8 Industrial FDM & SLA Printers",
    specs: "300×300×400 mm Build Volume · 50-Micron Resin Precision",
    software: "UltiMaker Cura, PrusaSlicer, Chitubox Pro",
    description:
      "Hands-on slicing, support optimization, and tolerance validation using PLA, ABS, PETG, Carbon-Fiber Nylon, and Tough Resin.",
  },
  {
    id: "fea-lab",
    name: "FEA & Simulation Lab",
    stations: "10 Solver Workstations",
    specs: "Multi-core Parallel Solver · Thermal & Structural Stress Analysis",
    software: "ANSYS Workbench, SolidWorks Simulation",
    description:
      "Trainees validate factor of safety, modal frequencies, and topology optimization before releasing drawings for production.",
  },
];

const mentors = [
  {
    name: "Er. Rajeev Sharma",
    role: "Principal Mentor · Automotive BIW & Tooling",
    exp: "18+ Years Industry Experience",
    tools: "CATIA V5 · Siemens NX · GD&T",
    bio: "Former Tier-1 automotive design lead specializing in sheet-metal stamping dies, BIW fixtures, and OEM drawing release standards.",
  },
  {
    name: "Er. Manish Verma",
    role: "Senior Lead · Mechanical Design & FEA",
    exp: "12+ Years Industry Experience",
    tools: "SolidWorks · ANSYS · Creo",
    bio: "Guided 4,500+ mechanical graduates in building production-ready gearbox assemblies, weldments, and structural stress reports.",
  },
  {
    name: "Er. Neha Kulkarni",
    role: "Additive Manufacturing & Prototyping Specialist",
    exp: "9+ Years Industry Experience",
    tools: "3D Printing · Reverse Engineering · Fusion",
    bio: "Leads the Faridabad rapid prototyping lab, helping students and startups iterate physical functional prototypes from CAD files.",
  },
];

const methodologySteps = [
  {
    step: "01",
    title: "2D Blueprint & GD&T Foundations",
    summary: "Master ISO/ASME projection rules, fits, tolerances, and datum reference frames before touching 3D features.",
    deliverable: "Production-grade 2D shop drawing PDF",
  },
  {
    step: "02",
    title: "Parametric 3D Part & Assembly Modeling",
    summary: "Build clean feature trees, sheet-metal flat patterns, and interference-free multi-part mechanical assemblies.",
    deliverable: "Fully constrained 3D CAD assembly",
  },
  {
    step: "03",
    title: "FEA Validation & Design Optimization",
    summary: "Apply real-world boundary loads, verify factor of safety, and reduce part weight without sacrificing stiffness.",
    deliverable: "ANSYS stress & displacement report",
  },
  {
    step: "04",
    title: "3D Print & Physical Tolerance Check",
    summary: "Slice your validated model, print it on our Faridabad lab machines, and measure mating tolerances with digital verniers.",
    deliverable: "Physical prototype + portfolio case study",
  },
];

const aboutFaqs = [
  {
    q: "How is R2G Learn CAD different from regular computer coaching centers?",
    a: "We operate as an engineering design studio rather than a command-memorization class. Every trainee works on real industrial assemblies, learns GD&T shop-floor standards, and prints physical prototypes on our in-house 3D printers.",
  },
  {
    q: "Can B.Tech, Diploma, and ITI students join without prior CAD knowledge?",
    a: "Yes. Our curriculum starts from first-angle/third-angle engineering drawing fundamentals and builds step-by-step up to advanced surfacing, CAM toolpaths, and FEA simulation.",
  },
  {
    q: "Are flexible batches available for working engineers in Faridabad & Delhi-NCR?",
    a: "Yes, we run dedicated Weekend Professional batches (Saturday & Sunday) as well as Weekday Morning and Evening studio slots at our Sector 35 campus.",
  },
  {
    q: "Do employers recognize R2G Learn CAD certificates?",
    a: "Every certificate carries a unique verification ID (e.g., R2G-2026-CAD-8941) verifiable online by HR teams, backed by your graded capstone portfolio and physical prototype.",
  },
];

function AboutPage() {
  // Feature 1: Interactive Timeline State
  const [activeYear, setActiveYear] = useState(milestones[4].year);
  // Feature 2: Lab Zone Tab State
  const [selectedLab, setSelectedLab] = useState(labZones[0].id);
  // Feature 3: Live Workstation Availability Filter
  const [shiftType, setShiftType] = useState<"weekday" | "weekend">("weekend");
  // Feature 4: Mentor Bio Drawer/Highlight
  const [selectedMentor, setSelectedMentor] = useState(0);
  // Feature 5: Methodology Step Simulator
  const [activeMethodStep, setActiveMethodStep] = useState(0);
  // Feature 6 & 7: Modals for ISO Credential & Corporate/College Workshop
  const [isoModalOpen, setIsoModalOpen] = useState(false);
  const [workshopModalOpen, setWorkshopModalOpen] = useState(false);
  const [workshopOrg, setWorkshopOrg] = useState("");
  const [workshopPhone, setWorkshopPhone] = useState("");
  const [workshopType, setWorkshopType] = useState("College B.Tech / Diploma Workshop");

  const currentMilestone = milestones.find((m) => m.year === activeYear) ?? milestones[4];
  const currentMethod = methodologySteps[activeMethodStep] ?? methodologySteps[0];

  // Feature 8: Download Institute Fact-Sheet PDF
  function handleDownloadProfile() {
    downloadPdf("R2G-Learn-CAD-Institute-Profile-2026", [
      "R2G LEARN CAD — INSTITUTE OF DESIGN & DRAFTING",
      "Campus: Sector 35, Main Mathura Road, Faridabad, Haryana 121003",
      "Certification: ISO 9001:2015 Certified Industrial Training Center",
      "Track Record: 15,000+ Engineers Trained · 120+ Hiring Partners · 4.9/5 Rating",
      "Core Labs: SolidWorks, AutoCAD, CATIA V5, Siemens NX CAM, ANSYS FEA & 3D Printing Lab",
      "Helpline: +91 98765 43210 · admissions@r2glearncad.com",
    ]);
  }

  function handleWorkshopSubmit(e: FormEvent) {
    e.preventDefault();
    if (workshopPhone.replace(/\D/g, "").length !== 10) {
      toast.error("Please enter a valid 10-digit contact number.");
      return;
    }
    toast.success(`Workshop request submitted for ${workshopOrg}. Our academic coordinator will call you.`);
    setWorkshopModalOpen(false);
    setWorkshopOrg("");
    setWorkshopPhone("");
  }

  return (
    <main className="r2g-site min-h-screen text-slate-100">
      <Toaster position="top-right" richColors />

      {/* Top Breadcrumb Bar */}
      <div className="border-b border-slate-800/80 bg-[#070d17]">
        <div className="site-container flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-slate-400">
          <Link to="/" className="inline-flex items-center gap-2 font-medium text-amber-400 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <span>SECTOR 35, FARIDABAD · ISO 9001:2015 CERTIFIED DESIGN INSTITUTE</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/70 py-16 lg:py-20">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="eyebrow section-eyebrow">ABOUT R2G LEARN CAD · EST. ENGINEERING HERITAGE</span>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
                40 Years of <span className="text-amber-400">Engineering Mindset.</span>
              </h1>
              <p className="mt-5 text-base leading-relaxed text-slate-300">
                Located in the industrial heart of Sector 35, Faridabad, <strong>R2G Learn CAD</strong> bridges the gap between engineering classrooms and real manufacturing shop floors. We don’t just teach software buttons—we train mechanical, automotive, and product engineers to design manufacturable parts, validate stresses, and print real prototypes.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button className="gold-button" asChild>
                  <Link to="/courses">Explore All Courses <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" className="border-slate-700 bg-slate-900/60" onClick={handleDownloadProfile}>
                  <Download className="mr-1.5 h-4 w-4 text-amber-400" /> Download Institute Profile (PDF)
                </Button>
              </div>
            </div>

            {/* Key Metrics Card */}
            <div className="grid grid-cols-2 gap-4 lg:col-span-5">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                <GraduationCap className="h-6 w-6 text-amber-400" />
                <b className="mt-3 block text-3xl font-bold text-white">15,000+</b>
                <span className="text-xs text-slate-400">ENGINEERS TRAINED</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                <BriefcaseBusiness className="h-6 w-6 text-amber-400" />
                <b className="mt-3 block text-3xl font-bold text-white">120+</b>
                <span className="text-xs text-slate-400">NCR HIRING PARTNERS</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                <Printer className="h-6 w-6 text-amber-400" />
                <b className="mt-3 block text-3xl font-bold text-white">2,400+</b>
                <span className="text-xs text-slate-400">3D PROTOTYPES PRINTED</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                <ShieldCheck className="h-6 w-6 text-amber-400" />
                <b className="mt-3 block text-3xl font-bold text-white">ISO</b>
                <span className="text-xs text-slate-400">9001:2015 CERTIFIED LAB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="site-container py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <Cpu className="h-8 w-8 text-amber-400" />
            <h3 className="mt-4 text-lg font-semibold">Industrial Workstations</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Dedicated high-RAM CAD workstations running SolidWorks, Siemens NX, CATIA V5, Creo, AutoCAD, and ANSYS without lag.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <Users className="h-8 w-8 text-amber-400" />
            <h3 className="mt-4 text-lg font-semibold">Practicing Industry Mentors</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Learn directly from BIW designers, toolmakers, and CAE analysts with hands-on Delhi-NCR automotive and manufacturing experience.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <Award className="h-8 w-8 text-amber-400" />
            <h3 className="mt-4 text-lg font-semibold">ISO 9001:2015 Certified</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Employer-verifiable digital credentials backed by a graded capstone assembly and physical 3D-printed prototype.
            </p>
            <Button
              variant="link"
              className="mt-2 h-auto p-0 text-xs text-amber-400"
              onClick={() => setIsoModalOpen(true)}
            >
              Inspect ISO Accreditation →
            </Button>
          </div>
        </div>
      </section>

      {/* Feature 1: Interactive Evolution Timeline */}
      <section className="border-y border-slate-800/70 bg-[#08101e] py-16">
        <div className="site-container">
          <span className="eyebrow section-eyebrow">OUR JOURNEY / 1986 — 2026</span>
          <h2 className="mt-2 text-3xl font-bold">Four Decades of <span className="text-amber-400">Design Evolution.</span></h2>
          <p className="mt-2 text-sm text-slate-400">Select a milestone year to explore how our training ecosystem evolved.</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {milestones.map((m) => (
              <Button
                key={m.year}
                variant={activeYear === m.year ? "default" : "outline"}
                className={activeYear === m.year ? "gold-button" : "border-slate-700 bg-slate-900/50"}
                onClick={() => setActiveYear(m.year)}
              >
                {m.year}
              </Button>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-amber-400/30 bg-slate-900/80 p-6">
            <span className="text-xs font-bold tracking-wider text-amber-400">MILESTONE · {currentMilestone.year}</span>
            <h3 className="mt-1 text-2xl font-bold text-white">{currentMilestone.title}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">{currentMilestone.detail}</p>
          </div>
        </div>
      </section>

      {/* Feature 2 & 3: Interactive Lab Infrastructure Explorer + Live Workstation Availability */}
      <section className="site-container py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow section-eyebrow">FARIDABAD CAMPUS INFRASTRUCTURE</span>
            <h2 className="mt-2 text-3xl font-bold">Inside Our <span className="text-amber-400">4 Specialized Labs.</span></h2>
          </div>

          {/* Live Shift Seat Toggle */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-xs">
            <span className="px-2 text-slate-400">Lab Seat Status:</span>
            <button
              type="button"
              onClick={() => setShiftType("weekday")}
              className={`rounded px-2.5 py-1 font-medium transition ${
                shiftType === "weekday" ? "bg-amber-400 text-slate-950" : "text-slate-300 hover:text-white"
              }`}
            >
              Weekday (4 Open)
            </button>
            <button
              type="button"
              onClick={() => setShiftType("weekend")}
              className={`rounded px-2.5 py-1 font-medium transition ${
                shiftType === "weekend" ? "bg-amber-400 text-slate-950" : "text-slate-300 hover:text-white"
              }`}
            >
              Weekend (1 Open)
            </button>
          </div>
        </div>

        <Tabs value={selectedLab} onValueChange={setSelectedLab} className="mt-8">
          <TabsList className="flex h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
            {labZones.map((zone) => (
              <TabsTrigger
                key={zone.id}
                value={zone.id}
                className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm data-[state=active]:border-amber-400 data-[state=active]:bg-amber-400/15 data-[state=active]:text-amber-300"
              >
                {zone.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {labZones.map((zone) => (
            <TabsContent key={zone.id} value={zone.id} className="mt-6">
              <div className="grid gap-6 rounded-xl border border-slate-800 bg-slate-900/70 p-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <Monitor className="h-4 w-4" /> {zone.stations} ·{" "}
                    <span className="text-emerald-400">
                      {shiftType === "weekday" ? "4 Workstations Available" : "1 Workstation Left"}
                    </span>
                  </div>
                  <h3 className="mt-2 text-2xl font-bold">{zone.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{zone.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {zone.software.split(", ").map((sw) => (
                      <span
                        key={sw}
                        className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-200"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400">HARDWARE &amp; TOOLING SPECS</span>
                    <p className="mt-2 text-sm font-medium text-slate-200">{zone.specs}</p>
                  </div>
                  <Button className="gold-button mt-6 w-full" asChild>
                    <Link to="/contact">Book Free Lab Trial</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Feature 4: Interactive 4-Stage Engineering Methodology Simulator */}
      <section className="border-y border-slate-800/70 bg-[#08101e] py-16">
        <div className="site-container">
          <span className="eyebrow section-eyebrow">PEDAGOGY / HOW WE TRAIN</span>
          <h2 className="mt-2 text-3xl font-bold">The R2G <span className="text-amber-400">4-Stage Design Loop.</span></h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {methodologySteps.map((item, idx) => (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveMethodStep(idx)}
                className={`rounded-xl border p-5 text-left transition ${
                  activeMethodStep === idx
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                }`}
              >
                <span className="text-xs font-bold text-amber-400">STAGE {item.step}</span>
                <h3 className="mt-2 text-base font-bold text-white">{item.title}</h3>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="max-w-2xl">
              <p className="text-sm leading-relaxed text-slate-300">{currentMethod.summary}</p>
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs">
              <span className="block text-emerald-300">STUDENT DELIVERABLE</span>
              <b className="text-white">{currentMethod.deliverable}</b>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 5: Faculty & Industry Mentors Spotlight */}
      <section className="site-container py-16">
        <span className="eyebrow section-eyebrow">LEADERSHIP &amp; FACULTY</span>
        <h2 className="mt-2 text-3xl font-bold">Learn From <span className="text-amber-400">Practicing Engineers.</span></h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {mentors.map((mentor, idx) => (
            <div
              key={mentor.name}
              onClick={() => setSelectedMentor(idx)}
              className={`cursor-pointer rounded-xl border p-6 transition ${
                selectedMentor === idx
                  ? "border-amber-400 bg-slate-900/90"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400/20 font-bold text-amber-300">
                  {mentor.name.split(" ").slice(1).map((n) => n[0]).join("")}
                </span>
                <span className="rounded bg-slate-800 px-2.5 py-1 text-xs text-amber-300">{mentor.exp}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{mentor.name}</h3>
              <p className="text-xs font-medium text-amber-400">{mentor.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{mentor.bio}</p>
              <div className="mt-4 border-t border-slate-800 pt-3 text-xs text-slate-300">
                <Wrench className="mr-1.5 inline h-3.5 w-3.5 text-amber-400" />
                {mentor.tools}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature 6: FAQ Accordion */}
      <section className="border-t border-slate-800/70 bg-[#08101e] py-16">
        <div className="site-container max-w-4xl">
          <span className="eyebrow section-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="mt-2 text-3xl font-bold">Everything About <span className="text-amber-400">R2G Learn CAD.</span></h2>

          <Accordion type="single" collapsible defaultValue="faq-0" className="mt-8 space-y-3">
            {aboutFaqs.map((item, idx) => (
              <AccordionItem
                key={item.q}
                value={`faq-${idx}`}
                className="rounded-xl border border-slate-800 bg-slate-900/60 px-5"
              >
                <AccordionTrigger className="text-left text-sm font-semibold text-white hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-slate-300">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Campus Visit & Corporate Workshop CTA */}
      <section className="site-container py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-xl border border-amber-400/30 bg-amber-400/10 p-6">
            <div className="flex items-start gap-3">
              <Building2 className="mt-1 h-6 w-6 shrink-0 text-amber-400" />
              <div>
                <b className="text-lg text-white">Visit Our Faridabad Lab</b>
                <p className="mt-1 text-sm text-slate-300">
                  Sector 35, Main Mathura Road, Faridabad, Haryana · Mon–Sun (9 AM – 7 PM)
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="gold-button" asChild>
                <Link to="/contact">Schedule Campus Visit <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" className="border-slate-700" asChild>
                <a href="tel:+919876543210"><Phone className="mr-1.5 h-4 w-4" /> +91 98765 43210</a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex items-start gap-3">
              <Factory className="mt-1 h-6 w-6 shrink-0 text-amber-400" />
              <div>
                <b className="text-lg text-white">College Seminars &amp; Corporate CAD Training</b>
                <p className="mt-1 text-sm text-slate-300">
                  Host a 1-day or 3-day SolidWorks &amp; 3D Printing hands-on bootcamp at your engineering college or plant.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="border-amber-400/40 text-amber-300 hover:bg-amber-400/10" onClick={() => setWorkshopModalOpen(true)}>
                <Sparkles className="mr-1.5 h-4 w-4" /> Request Institutional Workshop
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dialog 1: ISO Accreditation Details */}
      <Dialog open={isoModalOpen} onOpenChange={setIsoModalOpen}>
        <DialogContent className="r2g-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-amber-400" /> ISO 9001:2015 Quality Certification
            </DialogTitle>
            <DialogDescription>
              R2G Learn CAD — Institute of Design &amp; Drafting (Faridabad Campus)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-slate-300">
            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Scope: Industrial CAD/CAM, CAE Simulation &amp; Additive Manufacturing Training</p>
            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Standardized 12-Week Practical Assessment &amp; Capstone Audit</p>
            <p className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-amber-400" /> Online QR &amp; Credential ID Verification for Employers</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog 2: Institutional / Corporate Workshop Booking */}
      <Dialog open={workshopModalOpen} onOpenChange={setWorkshopModalOpen}>
        <DialogContent className="r2g-dialog">
          <DialogHeader>
            <DialogTitle>Book a College or Corporate Workshop</DialogTitle>
            <DialogDescription>
              Our Faridabad faculty conducts live CAD &amp; 3D printing demonstrations across Delhi-NCR.
            </DialogDescription>
          </DialogHeader>
          <form className="modal-form space-y-4" onSubmit={handleWorkshopSubmit}>
            <label className="block text-xs font-semibold text-slate-300">
              COLLEGE / COMPANY NAME
              <input
                required
                value={workshopOrg}
                onChange={(e) => setWorkshopOrg(e.target.value)}
                placeholder="e.g. YMCA Faridabad / Auto Component Plant"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-300">
              COORDINATOR MOBILE
              <input
                required
                type="tel"
                maxLength={10}
                value={workshopPhone}
                onChange={(e) => setWorkshopPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="10-digit mobile number"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-300">
              PROGRAM FORMAT
              <select
                value={workshopType}
                onChange={(e) => setWorkshopType(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              >
                <option>College B.Tech / Diploma Workshop</option>
                <option>Corporate Upskilling (GD&amp;T / SolidWorks / NX)</option>
                <option>Live 3D Printing Demo Day</option>
              </select>
            </label>
            <Button type="submit" className="gold-button w-full">Submit Workshop Request</Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}