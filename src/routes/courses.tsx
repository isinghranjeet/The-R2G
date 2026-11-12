import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Bookmark,
  BriefcaseBusiness,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  Clock3,
  Cpu,
  Cuboid,
  Download,
  Filter,
  Flame,
  GraduationCap,
  Layers3,
  Monitor,
  Percent,
  Phone,
  Printer,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Wrench,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { buildPlainTextPdf, isValidMobile } from "@/lib/r2g-demo-logic";

export const Route = createFileRoute("/courses")({
  component: CoursesPage,
  head: () => ({
    meta: [
      { title: "CAD/CAM, FEA & 3D Printing Courses | R2G Learn CAD Faridabad" },
      {
        name: "description",
        content:
          "Explore industry-certified SolidWorks, AutoCAD, Siemens NX, CATIA V5, ANSYS FEA, and 3D Printing courses at R2G Learn CAD, Sector 35, Faridabad.",
      },
    ],
  }),
});

interface CourseItem {
  id: string;
  title: string;
  category: "Mechanical Design" | "Drafting" | "Manufacturing" | "Simulation" | "Additive Lab";
  level: "Beginner" | "Intermediate" | "Advanced";
  durationWeeks: number;
  hours: number;
  offlineFee: number;
  onlineFee: number;
  seatsLeft: number;
  rating: string;
  salaryRange: string;
  jobRoles: string[];
  software: string[];
  mentor: string;
  labZone: string;
  laptopSpecs: string;
  icon: typeof Cuboid;
  highlights: string[];
  syllabusModules: { week: string; topic: string; project: string }[];
}

const catalogCourses: CourseItem[] = [
  {
    id: "solidworks-masterclass",
    title: "SolidWorks Masterclass",
    category: "Mechanical Design",
    level: "Beginner",
    durationWeeks: 12,
    hours: 90,
    offlineFee: 14500,
    onlineFee: 12000,
    seatsLeft: 3,
    rating: "4.9",
    salaryRange: "3.6 – 5.4 LPA",
    jobRoles: ["Mechanical Design Engineer", "Sheet Metal Engineer", "Product CAD Modeler"],
    software: ["SolidWorks 2025", "SolidWorks Simulation", "PhotoView 360"],
    mentor: "Er. Manish Verma (12+ Yrs Exp)",
    labZone: "CAD Design Studio · Sector 35",
    laptopSpecs: "Windows 10/11 · Core i5/Ryzen 5 · 16GB RAM · 4GB Dedicated GPU",
    icon: Cuboid,
    highlights: [
      "Parametric 3D Part & Feature Tree Mastery",
      "Sheet-Metal Flanges, Bend Allowances & K-Factor",
      "Weldments, Structural Frames & BOM Generation",
      "Top-Down Assembly Motion & Interference Checks",
    ],
    syllabusModules: [
      { week: "Weeks 01–03", topic: "Parametric Sketching, Constraints & Feature Modeling", project: "Cast Iron Gearbox Housing" },
      { week: "Weeks 04–06", topic: "Sheet Metal Design, Forming Tools & Flat Patterns", project: "Industrial Control Panel Enclosure" },
      { week: "Weeks 07–09", topic: "Complex Assemblies, Mates & Exploded BOM Drawings", project: "Planetary Gear Drive Assembly" },
      { week: "Weeks 10–12", topic: "GD&T Production Drawings & Static Stress Intro", project: "Portfolio Capstone + 3D Print" },
    ],
  },
  {
    id: "autocad-2d-3d",
    title: "AutoCAD 2D & 3D Drafting",
    category: "Drafting",
    level: "Beginner",
    durationWeeks: 8,
    hours: 60,
    offlineFee: 8500,
    onlineFee: 7000,
    seatsLeft: 4,
    rating: "4.8",
    salaryRange: "2.8 – 4.2 LPA",
    jobRoles: ["CAD Draftsman", "Production Drawing Engineer", "MEP / Civil Drafter"],
    software: ["AutoCAD Mechanical 2025", "AutoCAD 3D"],
    mentor: "Er. Rajeev Sharma (18+ Yrs Exp)",
    labZone: "Drafting & Standards Bay",
    laptopSpecs: "Windows 10/11 · Core i3/i5 · 8GB RAM · Integrated/2GB GPU",
    icon: Layers3,
    highlights: [
      "ISO First-Angle & Third-Angle Orthographic Projections",
      "Dynamic Blocks, Layer Standards & Xrefs",
      "Surface Finish Symbols, Fits, Tolerances & GD&T",
      "Isometric Piping & 3D Solid Wireframe Modeling",
    ],
    syllabusModules: [
      { week: "Weeks 01–02", topic: "2D Precision Geometry, Snaps, Arrays & Layers", project: "Machine Component Shop Drawing" },
      { week: "Weeks 03–04", topic: "Sectional Views, Auxiliary Views & Hatching", project: "Flanged Valve Assembly Blueprint" },
      { week: "Weeks 05–06", topic: "GD&T Frames, Tolerances & Title Block Standards", project: "CNC Vendor Release Drawing Pack" },
      { week: "Weeks 07–08", topic: "3D Solid Primitives, Boolean Ops & Plot Layouts", project: "3D Bracket & Orthographic Layout" },
    ],
  },
  {
    id: "siemens-nx-cam",
    title: "Siemens NX CAD & CNC CAM",
    category: "Manufacturing",
    level: "Advanced",
    durationWeeks: 12,
    hours: 96,
    offlineFee: 18500,
    onlineFee: 15500,
    seatsLeft: 2,
    rating: "4.9",
    salaryRange: "4.2 – 6.5 LPA",
    jobRoles: ["CNC CAM Programmer", "Tool & Die Designer", "NX Product Engineer"],
    software: ["Siemens NX 2312", "NX Manufacturing CAM", "Post Builder"],
    mentor: "Er. Rajeev Sharma (18+ Yrs Exp)",
    labZone: "CAM & Tooling Bay",
    laptopSpecs: "Windows 10/11 · Core i7/Ryzen 7 · 16GB–32GB RAM · NVIDIA RTX/Quadro",
    icon: Activity,
    highlights: [
      "Synchronous Modeling for Non-Parametric Imports",
      "Core & Cavity Extraction for Injection Molds",
      "3-Axis & 5-Axis Milling Toolpath Generation",
      "G-Code Verification & Collision Simulation",
    ],
    syllabusModules: [
      { week: "Weeks 01–03", topic: "NX Sketching, Synchronous Tech & Solid Modeling", project: "Automotive Die Casting Part" },
      { week: "Weeks 04–06", topic: "Mold Wizard, Parting Lines & Core-Cavity Split", project: "2-Plate Injection Mold Assembly" },
      { week: "Weeks 07–09", topic: "Planar Milling, Cavity Mill & Z-Level Finishing", project: "CNC VMC Machining Setup" },
      { week: "Weeks 10–12", topic: "Tool Library, Post-Processing & Shop Documentation", project: "Verified Fanuc/Siemens G-Code Pack" },
    ],
  },
  {
    id: "catia-v5-automotive",
    title: "CATIA V5 Automotive & Surfacing",
    category: "Mechanical Design",
    level: "Intermediate",
    durationWeeks: 10,
    hours: 80,
    offlineFee: 16500,
    onlineFee: 14000,
    seatsLeft: 2,
    rating: "4.9",
    salaryRange: "4.0 – 6.0 LPA",
    jobRoles: ["BIW Design Engineer", "Automotive Trim Designer", "Class-A Surface Modeler"],
    software: ["CATIA V5-6R2024", "Generative Shape Design", "DMU Kinematics"],
    mentor: "Er. Rajeev Sharma (18+ Yrs Exp)",
    labZone: "CAD Design Studio · Sector 35",
    laptopSpecs: "Windows 10/11 · Core i5/i7 · 16GB RAM · 4GB Dedicated GPU",
    icon: Cpu,
    highlights: [
      "Generative Shape Design (GSD) & Wireframe Surfacing",
      "Curvature Continuity (G0, G1, G2) Analysis",
      "Automotive Plastic Trim Ribs, Bosses & Snap Fits",
      "BIW Spot-Weld Fixture & Kinematics Simulation",
    ],
    syllabusModules: [
      { week: "Weeks 01–03", topic: "Part Design, Boolean Operations & PowerCopies", project: "Forged Connecting Rod Model" },
      { week: "Weeks 04–06", topic: "Generative Shape Design, Sweeps & Multi-Sections", project: "Aerodynamic Car Mirror Housing" },
      { week: "Weeks 07–08", topic: "Plastic B-Side Features & Draft Angle Analysis", project: "Dashboard Bezel Trim Component" },
      { week: "Weeks 09–10", topic: "Assembly Constraints & DMU Kinematics", project: "BIW Welding Clamp Mechanism" },
    ],
  },
  {
    id: "ansys-fea-simulation",
    title: "ANSYS Structural & Thermal FEA",
    category: "Simulation",
    level: "Intermediate",
    durationWeeks: 8,
    hours: 64,
    offlineFee: 15000,
    onlineFee: 12500,
    seatsLeft: 3,
    rating: "4.8",
    salaryRange: "4.2 – 6.2 LPA",
    jobRoles: ["CAE Simulation Engineer", "Structural Validation Analyst", "R&D Design Engineer"],
    software: ["ANSYS Workbench", "ANSYS Mechanical", "SpaceClaim"],
    mentor: "Er. Manish Verma (12+ Yrs Exp)",
    labZone: "FEA & Simulation Lab",
    laptopSpecs: "Windows 10/11 · Core i7/Ryzen 7 · 16GB–32GB RAM · SSD Storage",
    icon: ShieldCheck,
    highlights: [
      "Geometry Cleanup & Mid-Surface Extraction in SpaceClaim",
      "Hexahedral & Tetrahedral Mesh Quality Convergence",
      "Linear Static, Modal Vibration & Buckling Analysis",
      "Steady-State Thermal & Topology Optimization",
    ],
    syllabusModules: [
      { week: "Weeks 01–02", topic: "FEA Theory, Meshing Controls & Aspect Ratio Checks", project: "Meshed Automotive Suspension Arm" },
      { week: "Weeks 03–04", topic: "Static Structural Loads, Contacts & Factor of Safety", project: "Chassis Bracket Load Validation" },
      { week: "Weeks 05–06", topic: "Modal Natural Frequency & Buckling Studies", project: "Turbine Blade Vibration Analysis" },
      { week: "Weeks 07–08", topic: "Thermal Stress & Lightweight Topology Optimization", project: "Optimized Brake Caliper Report" },
    ],
  },
  {
    id: "3d-printing-prototyping",
    title: "3D Printing & Rapid Prototyping",
    category: "Additive Lab",
    level: "Beginner",
    durationWeeks: 6,
    hours: 45,
    offlineFee: 7500,
    onlineFee: 6000,
    seatsLeft: 1,
    rating: "5.0",
    salaryRange: "3.0 – 4.8 LPA",
    jobRoles: ["Additive Manufacturing Engineer", "Prototype Lab Technician", "Product Designer"],
    software: ["UltiMaker Cura", "PrusaSlicer", "Chitubox SLA"],
    mentor: "Er. Neha Kulkarni (9+ Yrs Exp)",
    labZone: "3D Printing & Prototyping Lab",
    laptopSpecs: "Any Windows/Mac Laptop · 8GB RAM",
    icon: Printer,
    highlights: [
      "FDM & SLA Printer Calibration, Bed Leveling & Nozzle Tuning",
      "Material Science: PLA, ABS, PETG, TPU, Carbon Fiber & Resin",
      "Support Structure Optimization & Print Orientation",
      "Post-Processing, Vapor Smoothing & Tolerance Inspection",
    ],
    syllabusModules: [
      { week: "Weeks 01–02", topic: "Additive Technologies (FDM/SLA/SLS) & DFM Rules", project: "Print-In-Place Hinged Mechanism" },
      { week: "Weeks 03–04", topic: "Slicer Parameters: Infill, Walls, Retraction & Supports", project: "Functional PETG Drone Frame" },
      { week: "Weeks 05–06", topic: "SLA High-Detail Resin Printing & Vernier QA", project: "Custom Consumer Product Prototype" },
    ],
  },
];

const batchTimings = [
  { id: "morning", name: "Weekday Morning", days: "Mon – Fri", time: "10:00 AM – 12:30 PM", seats: 4 },
  { id: "evening", name: "Weekday Evening", days: "Mon – Fri", time: "5:00 PM – 7:30 PM", seats: 3 },
  { id: "weekend", name: "Weekend Professional", days: "Sat & Sun", time: "10:00 AM – 2:30 PM", seats: 1 },
];

function CoursesPage() {
  // Feature 1, 2, 3, 4, 5: Search, Category, Level, Mode, Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [learningMode, setLearningMode] = useState<"offline" | "online">("offline");
  const [sortBy, setSortBy] = useState<"popular" | "fee-asc" | "duration-asc" | "seats">("popular");

  // Feature 6 & 7: Shortlist & Comparison Matrix
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(["solidworks-masterclass"]);
  const [compareIds, setCompareIds] = useState<string[]>(["solidworks-masterclass", "catia-v5-automotive"]);

  // Feature 8, 9 & 16: Combo Bundle Builder, EMI Calculator & Promo Code
  const [bundleIds, setBundleIds] = useState<string[]>(["solidworks-masterclass", "3d-printing-prototyping"]);
  const [emiMonths, setEmiMonths] = useState([6]);
  const [downPayment, setDownPayment] = useState([3000]);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // Feature 10 & 18: Syllabus Drawer & Sample Certificate Modal
  const [activeSyllabusCourse, setActiveSyllabusCourse] = useState<CourseItem | null>(null);
  const [certPreviewCourse, setCertPreviewCourse] = useState<CourseItem | null>(null);

  // Feature 12: Career Quiz Recommender
  const [quizGoal, setQuizGoal] = useState("Automotive BIW & OEMs");
  const [quizBackground, setQuizBackground] = useState("Fresher / Student");

  // Feature 15 & 20: Demo Booking Modal & Quick Callback
  const [bookingModalCourse, setBookingModalCourse] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("Weekend Professional");

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    const list = catalogCourses.filter((c) => {
      const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
      const matchesLevel = selectedLevel === "All" || c.level === selectedLevel;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.software.some((s) => s.toLowerCase().includes(q)) ||
        c.jobRoles.some((r) => r.toLowerCase().includes(q));
      return matchesCategory && matchesLevel && matchesSearch;
    });

    return [...list].sort((a, b) => {
      const feeA = learningMode === "offline" ? a.offlineFee : a.onlineFee;
      const feeB = learningMode === "offline" ? b.offlineFee : b.onlineFee;
      if (sortBy === "fee-asc") return feeA - feeB;
      if (sortBy === "duration-asc") return a.durationWeeks - b.durationWeeks;
      if (sortBy === "seats") return b.seatsLeft - a.seatsLeft;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedLevel, learningMode, sortBy]);

  // Combo Bundle Calculations
  const bundleCourses = catalogCourses.filter((c) => bundleIds.includes(c.id));
  const rawBundleFee = bundleCourses.reduce(
    (sum, c) => sum + (learningMode === "offline" ? c.offlineFee : c.onlineFee),
    0
  );
  const comboDiscount = bundleCourses.length >= 2 ? Math.round(rawBundleFee * 0.2) : 0;
  const promoDiscount = Math.round((rawBundleFee - comboDiscount) * (discountPercent / 100));
  const finalBundleFee = Math.max(0, rawBundleFee - comboDiscount - promoDiscount);
  const financedAmount = Math.max(0, finalBundleFee - (downPayment[0] ?? 0));
  const monthlyEmi = Math.round(financedAmount / (emiMonths[0] ?? 6));

  // Quiz Recommendation Logic
  const recommendedCourse = useMemo(() => {
    if (quizGoal === "Automotive BIW & OEMs") return catalogCourses[3]; // CATIA
    if (quizGoal === "CNC Machining & Tooling") return catalogCourses[2]; // Siemens NX
    if (quizGoal === "Stress & FEA Validation") return catalogCourses[4]; // ANSYS
    if (quizGoal === "3D Printing & Hardware Startups") return catalogCourses[5]; // 3D Printing
    return catalogCourses[0]; // SolidWorks
  }, [quizGoal]);

  function toggleShortlist(id: string) {
    setShortlistedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) {
        toast.error("You can compare up to 3 courses at once.");
        return prev;
      }
      return [...prev, id];
    });
  }

  function toggleBundle(id: string) {
    setBundleIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function applyCoupon(e: FormEvent) {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "R2G2026" || code === "STUDENT15") {
      setDiscountPercent(15);
      toast.success(`Coupon ${code} applied! Extra 15% scholarship discount unlocked.`);
    } else {
      setDiscountPercent(0);
      toast.error("Invalid code. Try R2G2026 or STUDENT15.");
    }
  }

  function handleDownloadSyllabus(course: CourseItem) {
    downloadPdf(`${course.id}-official-syllabus`, [
      `${course.title.toUpperCase()} — OFFICIAL SYLLABUS`,
      "R2G LEARN CAD · Institute of Design & Drafting (Sector 35, Faridabad)",
      `Duration: ${course.durationWeeks} Weeks (${course.hours} Hours) · Level: ${course.level}`,
      `Software Covered: ${course.software.join(", ")}`,
      `Mentor: ${course.mentor}`,
      "--- MODULE BREAKDOWN ---",
      ...course.syllabusModules.map((m) => `${m.week}: ${m.topic} (Capstone: ${m.project})`),
      `Target Job Roles: ${course.jobRoles.join(", ")} (${course.salaryRange})`,
    ]);
  }

  function handleDemoSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidMobile(studentPhone)) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }
    toast.success(`Free demo reserved for ${bookingModalCourse} (${selectedBatch})!`);
    setBookingModalCourse(null);
    setStudentName("");
    setStudentPhone("");
  }

  return (
    <main className="r2g-site min-h-screen text-slate-100">
      <Toaster position="top-right" richColors />

      {/* Top Navigation Strip */}
      <div className="border-b border-slate-800/80 bg-[#070d17]">
        <div className="site-container flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-slate-400">
          <Link to="/" className="inline-flex items-center gap-2 font-medium text-amber-400 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <span>SHORTLISTED: <b className="text-amber-400">{shortlistedIds.length}</b></span>
            <span>COMPARING: <b className="text-amber-400">{compareIds.length}/3</b></span>
          </div>
        </div>
      </div>

      {/* Header & Interactive Mode Switcher */}
      <section className="border-b border-slate-800/70 py-14">
        <div className="site-container">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="eyebrow section-eyebrow">CURRICULUM CATALOG · 2026 INTAKE</span>
              <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
                Industry-Aligned <span className="text-amber-400">Training Tracks.</span>
              </h1>
              <p className="mt-3 text-base text-slate-300">
                Compare software tracks, inspect week-by-week syllabi, build custom combo bundles, and calculate easy monthly EMIs.
              </p>
            </div>

            {/* Feature 4: Offline vs Live Online Mode Switcher */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2">
              <span className="mb-1.5 block px-2 text-[11px] font-semibold tracking-wider text-slate-400">
                SELECT DELIVERY MODE
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setLearningMode("offline")}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                    learningMode === "offline"
                      ? "bg-amber-400 text-slate-950"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Offline Faridabad Lab
                </button>
                <button
                  type="button"
                  onClick={() => setLearningMode("online")}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                    learningMode === "online"
                      ? "bg-amber-400 text-slate-950"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Live Online Interactive
                </button>
              </div>
            </div>
          </div>

          {/* Feature 1, 2, 3, 5: Search, Category, Level & Sort Toolbar */}
          <div className="mt-8 grid gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-12">
            <div className="relative md:col-span-4">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SolidWorks, NX, BIW, FEA..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pr-3 pl-9 text-sm text-white placeholder:text-slate-500"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              >
                <option value="All">All Domains</option>
                <option value="Mechanical Design">Mechanical Design</option>
                <option value="Drafting">Drafting &amp; GD&amp;T</option>
                <option value="Manufacturing">CNC CAM &amp; Tooling</option>
                <option value="Simulation">ANSYS Simulation</option>
                <option value="Additive Lab">3D Printing Lab</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                aria-label="Filter by skill level"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Sort courses"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="fee-asc">Sort: Fee (Low to High)</option>
                <option value="duration-asc">Sort: Shortest Duration</option>
                <option value="seats">Sort: Most Seats Available</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Course Catalog Grid */}
      <section className="site-container py-14">
        <div className="mb-6 flex items-center justify-between text-xs text-slate-400">
          <span>SHOWING {filteredCourses.length} OF {catalogCourses.length} PROGRAMS</span>
          {searchQuery || selectedCategory !== "All" || selectedLevel !== "All" ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
              className="text-amber-400 hover:underline"
            >
              Reset Filters
            </button>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const Icon = course.icon;
            const activeFee = learningMode === "offline" ? course.offlineFee : course.onlineFee;
            const isShortlisted = shortlistedIds.includes(course.id);
            const isComparing = compareIds.includes(course.id);
            const isInBundle = bundleIds.includes(course.id);

            return (
              <article
                key={course.id}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-slate-700"
              >
                <div>
                  {/* Top Row: Category + Bookmark */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-amber-400 uppercase">
                      <Icon className="h-4 w-4" /> {course.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                        {course.level}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleShortlist(course.id)}
                        aria-label="Shortlist course"
                        className={`rounded p-1.5 transition ${
                          isShortlisted ? "bg-amber-400/20 text-amber-400" : "text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h2 className="mt-3 text-xl font-bold text-white">{course.title}</h2>

                  {/* Meta: Duration, Hours, Seats */}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5 text-amber-400" /> {course.durationWeeks} Weeks ({course.hours} hrs)
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Flame className="h-3.5 w-3.5" /> {course.seatsLeft} seats left
                    </span>
                  </div>

                  {/* Fee & Salary */}
                  <div className="mt-4 flex items-baseline justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-3.5 py-2.5">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase">
                        {learningMode === "offline" ? "Faridabad Lab Fee" : "Live Online Fee"}
                      </span>
                      <b className="text-lg font-bold text-amber-300">₹{activeFee.toLocaleString("en-IN")}</b>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-400 uppercase">Avg. CTC</span>
                      <b className="text-xs font-semibold text-slate-200">{course.salaryRange}</b>
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    {course.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Software Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {course.software.map((sw) => (
                      <span key={sw} className="rounded border border-slate-800 bg-slate-950 px-2 py-0.5 text-[11px] text-slate-400">
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 space-y-2.5 border-t border-slate-800/80 pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 text-xs"
                      onClick={() => setActiveSyllabusCourse(course)}
                    >
                      View Syllabus
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 text-xs"
                      onClick={() => handleDownloadSyllabus(course)}
                    >
                      <Download className="mr-1 h-3.5 w-3.5" /> PDF
                    </Button>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleCompare(course.id)}
                      className={`flex items-center gap-1 rounded px-2 py-1 ${
                        isComparing ? "bg-sky-500/20 text-sky-300" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Scale className="h-3.5 w-3.5" /> {isComparing ? "Comparing" : "Compare"}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleBundle(course.id)}
                      className={`flex items-center gap-1 rounded px-2 py-1 ${
                        isInBundle ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Tag className="h-3.5 w-3.5" /> {isInBundle ? "In Combo" : "+ Add Combo"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCertPreviewCourse(course)}
                      className="text-slate-400 hover:text-amber-300"
                    >
                      Cert Sample
                    </button>
                  </div>

                  <Button
                    className="gold-button w-full"
                    size="sm"
                    onClick={() => setBookingModalCourse(course.title)}
                  >
                    Book Free Demo <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Feature 7: Side-by-Side Course Comparison Matrix */}
      {compareIds.length > 0 && (
        <section className="border-y border-slate-800/70 bg-[#08101e] py-14">
          <div className="site-container">
            <div className="flex items-center justify-between">
              <div>
                <span className="eyebrow section-eyebrow">DECISION MATRIX</span>
                <h2 className="mt-1 text-2xl font-bold">Compare Selected Courses ({compareIds.length}/3)</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCompareIds([])}>
                Clear Comparison
              </Button>
            </div>

            <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-900/90 text-xs text-slate-400 uppercase">
                  <tr>
                    <th className="p-4">Parameter</th>
                    {compareIds.map((id) => {
                      const c = catalogCourses.find((item) => item.id === id);
                      return c ? <th key={c.id} className="p-4 text-amber-400">{c.title}</th> : null;
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/50 text-slate-300">
                  <tr>
                    <td className="p-4 font-semibold text-slate-400">Duration &amp; Hours</td>
                    {compareIds.map((id) => {
                      const c = catalogCourses.find((item) => item.id === id);
                      return c ? <td key={c.id} className="p-4">{c.durationWeeks} Weeks ({c.hours} hrs)</td> : null;
                    })}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-400">Program Fee ({learningMode})</td>
                    {compareIds.map((id) => {
                      const c = catalogCourses.find((item) => item.id === id);
                      const fee = learningMode === "offline" ? c?.offlineFee : c?.onlineFee;
                      return c ? <td key={c.id} className="p-4 font-bold text-white">₹{fee?.toLocaleString("en-IN")}</td> : null;
                    })}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-400">Target Roles</td>
                    {compareIds.map((id) => {
                      const c = catalogCourses.find((item) => item.id === id);
                      return c ? <td key={c.id} className="p-4">{c.jobRoles.join(", ")}</td> : null;
                    })}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-400">Laptop Requirement</td>
                    {compareIds.map((id) => {
                      const c = catalogCourses.find((item) => item.id === id);
                      return c ? <td key={c.id} className="p-4 text-xs">{c.laptopSpecs}</td> : null;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Feature 8, 9 & 16: Combo Bundle Builder + EMI & Scholarship Calculator */}
      <section className="site-container py-16">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Combo Selector */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 lg:col-span-7">
            <span className="eyebrow section-eyebrow">SAVE 20% WITH MULTI-SKILL TRACKS</span>
            <h2 className="mt-1 text-2xl font-bold">Custom Combo Bundle Builder</h2>
            <p className="mt-1 text-sm text-slate-400">
              Select 2 or more courses to automatically unlock a 20% multi-course engineering scholarship.
            </p>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {catalogCourses.map((c) => {
                const active = bundleIds.includes(c.id);
                const fee = learningMode === "offline" ? c.offlineFee : c.onlineFee;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleBundle(c.id)}
                    className={`flex items-center justify-between rounded-lg border p-3 text-left text-xs transition ${
                      active
                        ? "border-amber-400 bg-amber-400/15 text-white"
                        : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      {active ? <Check className="h-4 w-4 text-amber-400" /> : <span className="h-4 w-4 rounded border border-slate-600" />}
                      {c.title}
                    </span>
                    <span className="text-slate-400">₹{fee.toLocaleString("en-IN")}</span>
                  </button>
                );
              })}
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={applyCoupon} className="mt-6 flex flex-wrap gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Promo code (Try: R2G2026)"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
              <Button type="submit" variant="outline" className="border-amber-400/40 text-amber-300">
                <Percent className="mr-1.5 h-4 w-4" /> Apply Scholarship
              </Button>
            </form>
          </div>

          {/* EMI & Fee Breakdown Panel */}
          <div className="flex flex-col justify-between rounded-xl border border-amber-400/30 bg-slate-900/90 p-6 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-amber-400">0% INTEREST EMI ESTIMATOR</span>
                <Calculator className="h-5 w-5 text-amber-400" />
              </div>

              <div className="mt-4 space-y-2 border-b border-slate-800 pb-4 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Selected Courses ({bundleCourses.length})</span>
                  <span>₹{rawBundleFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Combo Bundle Discount (20%)</span>
                  <span>- ₹{comboDiscount.toLocaleString("en-IN")}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Scholarship ({discountPercent}%)</span>
                    <span>- ₹{promoDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 text-base font-bold text-white">
                  <span>Net Payable Fee</span>
                  <span className="text-amber-400">₹{finalBundleFee.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-400">DOWN PAYMENT</span>
                    <b>₹{(downPayment[0] ?? 0).toLocaleString("en-IN")}</b>
                  </div>
                  <Slider value={downPayment} min={0} max={10000} step={1000} onValueChange={setDownPayment} />
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-400">EMI TENURE</span>
                    <b>{emiMonths[0]} Months</b>
                  </div>
                  <Slider value={emiMonths} min={3} max={9} step={3} onValueChange={setEmiMonths} />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-amber-400/15 p-4 text-center">
              <span className="block text-xs text-amber-200">ESTIMATED MONTHLY INSTALLMENT</span>
              <b className="text-3xl font-bold text-white">₹{monthlyEmi.toLocaleString("en-IN")}</b>
              <span className="text-xs text-slate-300"> / month</span>
              <Button
                className="gold-button mt-3 w-full"
                onClick={() =>
                  setBookingModalCourse(
                    bundleCourses.map((c) => c.title).join(" + ") || "Custom CAD Combo"
                  )
                }
              >
                Lock Scholarship &amp; Book Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 12 & 13: Career Quiz Recommender + Live Batch Schedule */}
      <section className="border-t border-slate-800/70 bg-[#08101e] py-16">
        <div className="site-container grid gap-8 lg:grid-cols-2">
          {/* Career Recommender Quiz */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <span className="eyebrow section-eyebrow">NOT SURE WHERE TO START?</span>
            <h2 className="mt-1 text-2xl font-bold">60-Second Course Recommender</h2>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400">1. TARGET INDUSTRY / ROLE</label>
                <select
                  value={quizGoal}
                  onChange={(e) => setQuizGoal(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                >
                  <option>General Mechanical &amp; Machine Design</option>
                  <option>Automotive BIW &amp; OEMs</option>
                  <option>CNC Machining &amp; Tooling</option>
                  <option>Stress &amp; FEA Validation</option>
                  <option>3D Printing &amp; Hardware Startups</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400">2. CURRENT BACKGROUND</label>
                <select
                  value={quizBackground}
                  onChange={(e) => setQuizBackground(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                >
                  <option>Fresher / Student</option>
                  <option>Working Engineer (Upskilling)</option>
                  <option>Diploma / ITI Graduate</option>
                </select>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-amber-400/40 bg-amber-400/10 p-4">
              <span className="text-xs font-bold text-amber-400">RECOMMENDED FOR {quizBackground.toUpperCase()}</span>
              <h3 className="mt-1 text-lg font-bold text-white">{recommendedCourse.title}</h3>
              <p className="mt-1 text-xs text-slate-300">
                {recommendedCourse.durationWeeks} Weeks · Software: {recommendedCourse.software.join(", ")}
              </p>
              <Button
                size="sm"
                className="gold-button mt-3"
                onClick={() => setBookingModalCourse(recommendedCourse.title)}
              >
                Try Free Demo Class <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Live Batch Timings */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <span className="eyebrow section-eyebrow">SECTOR 35 FARIDABAD SCHEDULE</span>
            <h2 className="mt-1 text-2xl font-bold">Upcoming Batch Timings</h2>
            <p className="mt-1 text-sm text-slate-400">Small batch size (max 8 students) for 1-on-1 workstation mentoring.</p>

            <div className="mt-5 space-y-3">
              {batchTimings.map((b) => (
                <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                  <div>
                    <b className="block text-sm text-white">{b.name}</b>
                    <span className="text-xs text-slate-400">{b.days} · {b.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                      {b.seats} {b.seats === 1 ? "Seat Left" : "Seats Open"}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-700"
                      onClick={() => {
                        setSelectedBatch(b.name);
                        setBookingModalCourse(coursesFallbackTitle(filteredCourses));
                      }}
                    >
                      Reserve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature 10: Detailed Syllabus Sheet Drawer */}
      <Sheet open={Boolean(activeSyllabusCourse)} onOpenChange={(open) => !open && setActiveSyllabusCourse(null)}>
        <SheetContent className="overflow-y-auto border-slate-800 bg-[#09111e] text-slate-100">
          {activeSyllabusCourse && (
            <>
              <SheetHeader>
                <span className="text-xs font-bold text-amber-400">{activeSyllabusCourse.category}</span>
                <SheetTitle className="text-2xl text-white">{activeSyllabusCourse.title}</SheetTitle>
                <SheetDescription className="text-slate-400">
                  {activeSyllabusCourse.durationWeeks} Weeks ({activeSyllabusCourse.hours} Hours) · {activeSyllabusCourse.mentor}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3.5 text-xs">
                  <span className="block text-slate-400">ASSIGNED LAB &amp; LAPTOP SPEC</span>
                  <p className="mt-1 text-slate-200">{activeSyllabusCourse.labZone}</p>
                  <p className="mt-1 text-slate-400">{activeSyllabusCourse.laptopSpecs}</p>
                </div>

                <div>
                  <h4 className="mb-3 text-xs font-bold tracking-wider text-amber-400 uppercase">
                    Module-Wise Curriculum
                  </h4>
                  <div className="space-y-3">
                    {activeSyllabusCourse.syllabusModules.map((mod) => (
                      <div key={mod.week} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3.5">
                        <span className="text-xs font-bold text-amber-400">{mod.week}</span>
                        <p className="mt-1 text-sm font-semibold text-white">{mod.topic}</p>
                        <p className="mt-1 text-xs text-emerald-300">Capstone Project: {mod.project}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="gold-button flex-1" onClick={() => {
                    const title = activeSyllabusCourse.title;
                    setActiveSyllabusCourse(null);
                    setBookingModalCourse(title);
                  }}>
                    Book Demo Class
                  </Button>
                  <Button variant="outline" className="border-slate-700" onClick={() => handleDownloadSyllabus(activeSyllabusCourse)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Feature 18: Sample Certificate Preview Dialog */}
      <Dialog open={Boolean(certPreviewCourse)} onOpenChange={(open) => !open && setCertPreviewCourse(null)}>
        <DialogContent className="r2g-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" /> ISO 9001:2015 Verified Credential Sample
            </DialogTitle>
            <DialogDescription>
              Issued upon successful completion of capstone model &amp; 3D prototype assessment.
            </DialogDescription>
          </DialogHeader>
          {certPreviewCourse && (
            <div className="rounded-xl border-2 border-amber-400/50 bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-center">
              <span className="text-[11px] font-bold tracking-widest text-amber-400">R2G LEARN CAD · FARIDABAD</span>
              <h3 className="mt-2 text-lg font-bold text-white">CERTIFICATE OF INDUSTRIAL PROFICIENCY</h3>
              <p className="mt-3 text-xs text-slate-400">This certifies that</p>
              <b className="mt-1 block text-xl text-amber-300">Ranjeet Kumar</b>
              <p className="mt-2 text-xs text-slate-300">
                has successfully completed the <b>{certPreviewCourse.title}</b> ({certPreviewCourse.hours} Hours)
              </p>
              <div className="mt-4 flex justify-between border-t border-slate-800 pt-3 text-[11px] text-slate-400">
                <span>ID: R2G-2026-CAD-8941</span>
                <span>VERIFIABLE ONLINE</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Feature 15: Demo Class Booking Modal */}
      <Dialog open={Boolean(bookingModalCourse)} onOpenChange={(open) => !open && setBookingModalCourse(null)}>
        <DialogContent className="r2g-dialog">
          <DialogHeader>
            <DialogTitle>Reserve Free Practical Demo</DialogTitle>
            <DialogDescription>
              Course: <b className="text-amber-400">{bookingModalCourse}</b> · {learningMode === "offline" ? "Sector 35 Faridabad Lab" : "Live Online"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDemoSubmit} className="modal-form space-y-4">
            <label className="block text-xs font-semibold text-slate-300">
              FULL NAME
              <input
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Ranjeet Kumar"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-300">
              MOBILE NUMBER
              <input
                required
                type="tel"
                maxLength={10}
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="10-digit mobile number"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-300">
              PREFERRED BATCH
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              >
                {batchTimings.map((b) => (
                  <option key={b.id}>{b.name}</option>
                ))}
              </select>
            </label>
            <Button type="submit" className="gold-button w-full">
              Confirm Free Demo Slot
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function coursesFallbackTitle(list: CourseItem[]) {
  return list[0]?.title ?? "SolidWorks Masterclass";
}