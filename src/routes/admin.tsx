import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  Award,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Copy,
  Cuboid,
  Download,
  FileSpreadsheet,
  GraduationCap,
  History,
  IndianRupee,
  LockKeyhole,
  LogOut,
  Megaphone,
  MessageSquarePlus,
  PhoneCall,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { downloadStyledCertificatePdf } from "@/lib/certificate-pdf";
import {
  defaultCerts,
  defaultLeads,
  getStoredCerts,
  getStoredLeads,
  saveStoredCerts,
  saveStoredLeads,
  type CertRecord,
  type LeadItem,
} from "@/lib/r2g-storage";

export const Route = createFileRoute("/admin")({
  component: AdminDashboardPage,
  head: () => ({
    meta: [{ title: "Admin Control Center | R2G Learn CAD Faridabad" }],
  }),
});

interface PrintQuoteItem {
  quoteId: string;
  client: string;
  phone: string;
  file: string;
  material: string;
  estimate: number;
  status: "Under Review" | "Approved" | "Printed";
}

interface CourseAdminItem {
  id: string;
  title: string;
  duration: string;
  fee: number;
  seats: number;
}

interface CouponItem {
  code: string;
  discount: number;
  active: boolean;
}

interface AuditEntry {
  id: string;
  action: string;
  time: string;
}

const initialQuotes: PrintQuoteItem[] = [
  { quoteId: "QT-401", client: "Karan Singh", phone: "9810011223", file: "planetary_carrier.step", material: "Carbon Fiber", estimate: 1280, status: "Under Review" },
  { quoteId: "QT-402", client: "Neha Sharma", phone: "9899112233", file: "turbine_impeller.stl", material: "Tough Resin", estimate: 1850, status: "Approved" },
  { quoteId: "QT-403", client: "Vikram Yadav", phone: "9871234560", file: "ev_motor_mount.stl", material: "PETG", estimate: 740, status: "Printed" },
];

const initialCoursesAdmin: CourseAdminItem[] = [
  { id: "c1", title: "SolidWorks Masterclass", duration: "12 Weeks", fee: 14500, seats: 3 },
  { id: "c2", title: "AutoCAD 2D & 3D", duration: "8 Weeks", fee: 8500, seats: 4 },
  { id: "c3", title: "Siemens NX & CAM", duration: "12 Weeks", fee: 18500, seats: 2 },
  { id: "c4", title: "3D Printing & Prototyping", duration: "6 Weeks", fee: 7500, seats: 1 },
];

const initialCoupons: CouponItem[] = [
  { code: "R2G2026", discount: 15, active: true },
  { code: "STUDENT15", discount: 15, active: true },
  { code: "EARLYBIRD20", discount: 20, active: false },
];

function AdminDashboardPage() {
  // Feature 1: Persistent Login
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Core Data States
  const [leads, setLeads] = useState<LeadItem[]>(() => getStoredLeads());
  const [certs, setCerts] = useState<CertRecord[]>(() => getStoredCerts());
  const [quotes, setQuotes] = useState<PrintQuoteItem[]>(initialQuotes);
  const [adminCourses, setAdminCourses] = useState<CourseAdminItem[]>(initialCoursesAdmin);
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);

  // Feature 2 & 3: Search & Status Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | LeadItem["status"]>("All");

  // Feature 8: Add Walk-In Lead Modal
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInCourse, setWalkInCourse] = useState("SolidWorks Masterclass");
  const [walkInBatch, setWalkInBatch] = useState("Weekend Professional");

  // Feature 10: Counselor Notes Modal
  const [notesMap, setNotesMap] = useState<Record<string, string>>({
    "LD-101": "Interested in weekend SolidWorks batch; requested fee brochure.",
    "LD-102": "Completed AutoCAD 2D/3D practical evaluation.",
  });
  const [activeNoteLead, setActiveNoteLead] = useState<LeadItem | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  // Manual Certificate State
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentMobile, setNewStudentMobile] = useState("");
  const [newStudentCourse, setNewStudentCourse] = useState("AutoCAD 2D & 3D");

  // Feature 13: New 3D Print Order Form
  const [printClient, setPrintClient] = useState("");
  const [printFile, setPrintFile] = useState("");
  const [printMat, setPrintMat] = useState("PETG");
  const [printCost, setPrintCost] = useState("950");

  // Feature 14, 15, 16: Batch Seats, Announcement Banner & Promo Codes
  const [weekdaySeats, setWeekdaySeats] = useState(3);
  const [eveningSeats, setEveningSeats] = useState(4);
  const [weekendSeats, setWeekendSeats] = useState(1);
  const [bannerText, setBannerText] = useState("ISO 9001:2015 CERTIFIED · ADMISSIONS OPEN FOR NOVEMBER 2026 BATCH");
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponPct, setNewCouponPct] = useState("10");

  // Feature 18: Audit Activity Log
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([
    { id: "a1", action: "System initialized with synced student registry", time: "Just now" },
  ]);

  useEffect(() => {
    setLeads(getStoredLeads());
    setCerts(getStoredCerts());
    if (localStorage.getItem("r2g_admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  function logAction(action: string) {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setAuditLogs((prev) => [{ id: `log-${Date.now()}`, action, time }, ...prev.slice(0, 14)]);
  }

  function updateLeads(next: LeadItem[]) {
    setLeads(next);
    saveStoredLeads(next);
  }

  function updateCerts(next: CertRecord[]) {
    setCerts(next);
    saveStoredCerts(next);
  }

  function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (email.trim().toLowerCase() === "admin@r2glearncad.com" && password === "admin123") {
      localStorage.setItem("r2g_admin_auth", "true");
      setAuthenticated(true);
      toast.success("Welcome back, R2G Admin!");
      logAction("Admin signed in to Control Center");
    } else {
      toast.error("Invalid credentials. Use admin@r2glearncad.com / admin123");
    }
  }

  function handleLogout() {
    localStorage.removeItem("r2g_admin_auth");
    setAuthenticated(false);
    setEmail("");
    setPassword("");
    toast("Signed out from Admin Portal.");
  }

  // Feature 4: Status Toggle
  function cycleLeadStatus(id: string) {
    const next = leads.map((lead) => {
      if (lead.id !== id) return lead;
      const nextStatus: LeadItem["status"] =
        lead.status === "Pending"
          ? "Confirmed"
          : lead.status === "Confirmed"
            ? "Completed"
            : "Pending";
      toast.success(`${lead.name} marked as ${nextStatus}`);
      logAction(`Updated ${lead.name} status to ${nextStatus}`);
      return { ...lead, status: nextStatus };
    });
    updateLeads(next);
  }

  // Feature 5: Direct Lead-to-Certificate Generator
  function generateCertForLead(lead: LeadItem) {
    if (lead.certId) {
      navigator.clipboard?.writeText(lead.certId);
      toast.info(`Certificate already exists: ${lead.certId} (Copied!)`);
      return;
    }
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const certId = `R2G-2026-CAD-${randomNum}`;
    const newCert: CertRecord = {
      certId,
      name: lead.name,
      mobile: lead.mobile,
      course: lead.course,
      year: "November 2026",
    };
    updateCerts([newCert, ...certs]);
    updateLeads(
      leads.map((item) => (item.id === lead.id ? { ...item, status: "Completed" as const, certId } : item))
    );
    navigator.clipboard?.writeText(certId);
    toast.success(`Certificate generated for ${lead.name}: ${certId} (Copied!)`);
    logAction(`Issued certificate ${certId} to ${lead.name}`);
  }

  function deleteLead(id: string) {
    const target = leads.find((l) => l.id === id);
    updateLeads(leads.filter((item) => item.id !== id));
    toast("Lead removed.");
    if (target) logAction(`Deleted lead ${target.name} (${id})`);
  }

  // Feature 7: Revoke Certificate
  function revokeCertificate(certId: string) {
    updateCerts(certs.filter((c) => c.certId !== certId));
    updateLeads(leads.map((l) => (l.certId === certId ? { ...l, certId: undefined } : l)));
    toast.error(`Revoked certificate ${certId}`);
    logAction(`Revoked certificate ${certId}`);
  }

  // Feature 8: Add Walk-In Lead
  function handleAddWalkIn(e: FormEvent) {
    e.preventDefault();
    const cleanPhone = walkInPhone.replace(/\D/g, "").slice(0, 10);
    if (cleanPhone.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }
    const newLead: LeadItem = {
      id: `LD-${Math.floor(200 + Math.random() * 799)}`,
      name: walkInName.trim(),
      mobile: cleanPhone,
      course: walkInCourse,
      batch: walkInBatch,
      status: "Confirmed",
      date: "13 Nov 2026",
    };
    updateLeads([newLead, ...leads]);
    setWalkInName("");
    setWalkInPhone("");
    setAddLeadOpen(false);
    toast.success(`Added student ${newLead.name}`);
    logAction(`Added walk-in enrollment: ${newLead.name} (${newLead.course})`);
  }

  // Feature 9: Export CSV
  function exportLeadsCsv() {
    const headers = ["ID,Name,Mobile,Course,Batch,Status,Date,CertificateID"];
    const rows = leads.map(
      (l) => `"${l.id}","${l.name}","${l.mobile}","${l.course}","${l.batch}","${l.status}","${l.date}","${l.certId ?? ""}"`
    );
    const blob = new Blob([[...headers, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "R2G-Student-Leads-2026.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Exported student leads to CSV!");
    logAction("Exported student leads CSV report");
  }

  function issueManualCertificate(e: FormEvent) {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const certId = `R2G-2026-CAD-${randomNum}`;
    const created: CertRecord = {
      certId,
      name: newStudentName.trim(),
      mobile: newStudentMobile.replace(/\D/g, "").slice(0, 10) || "9811223344",
      course: newStudentCourse,
      year: "November 2026",
    };
    updateCerts([created, ...certs]);
    setNewStudentName("");
    setNewStudentMobile("");
    navigator.clipboard?.writeText(certId);
    toast.success(`Certificate issued: ${certId} (Copied!)`);
    logAction(`Manually issued ${certId} to ${created.name}`);
  }

  // Feature 12 & 13: 3D Print Quote Workflow
  function cycleQuoteStatus(quoteId: string) {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.quoteId !== quoteId) return q;
        const nextStatus: PrintQuoteItem["status"] =
          q.status === "Under Review" ? "Approved" : q.status === "Approved" ? "Printed" : "Under Review";
        toast.success(`${quoteId} marked as ${nextStatus}`);
        logAction(`3D Print order ${quoteId} moved to ${nextStatus}`);
        return { ...q, status: nextStatus };
      })
    );
  }

  function handleAddPrintJob(e: FormEvent) {
    e.preventDefault();
    const newJob: PrintQuoteItem = {
      quoteId: `QT-${Math.floor(404 + Math.random() * 500)}`,
      client: printClient.trim(),
      phone: "9876543210",
      file: printFile.trim(),
      material: printMat,
      estimate: Number(printCost) || 800,
      status: "Under Review",
    };
    setQuotes([newJob, ...quotes]);
    setPrintClient("");
    setPrintFile("");
    toast.success(`Logged print order ${newJob.quoteId}`);
    logAction(`Created 3D print job ${newJob.quoteId} (${newJob.file})`);
  }

  // Feature 19: Factory Reset Demo Data
  function resetDemoData() {
    updateLeads(defaultLeads);
    updateCerts(defaultCerts);
    setQuotes(initialQuotes);
    toast.success("All demo data restored to defaults.");
    logAction("Restored factory default demo dataset");
  }

  // Feature 17: Live Revenue Analytics
  const analytics = useMemo(() => {
    const completedCount = leads.filter((l) => l.status === "Completed").length;
    const confirmedCount = leads.filter((l) => l.status === "Confirmed").length;
    const estCourseRevenue = (completedCount + confirmedCount) * 13500;
    const estPrintRevenue = quotes.reduce((sum, q) => sum + q.estimate, 0);
    const conversionRate = leads.length ? Math.round(((completedCount + confirmedCount) / leads.length) * 100) : 0;
    return { estCourseRevenue, estPrintRevenue, conversionRate };
  }, [leads, quotes]);

  if (!authenticated) {
    return (
      <main className="r2g-site flex min-h-screen items-center justify-center px-4 text-slate-100">
        <Toaster position="top-right" richColors />
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#09111e] p-8 shadow-2xl">
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-amber-400 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Website
          </Link>
          <div className="mt-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400">
              <Cuboid className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-white">R2G Admin Backend</h1>
              <p className="text-xs text-slate-400">Faridabad Campus Operations Portal</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-400">ADMIN EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@r2glearncad.com"
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-400">PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <Button type="submit" className="gold-button w-full">
              <LockKeyhole className="mr-1.5 h-4 w-4" /> Sign In to Dashboard
            </Button>
          </form>

          <div className="mt-5 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center text-xs text-slate-400">
            Demo Credentials: <b className="text-amber-300">admin@r2glearncad.com</b> / <b className="text-amber-300">admin123</b>
          </div>
        </div>
      </main>
    );
  }

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.mobile.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="r2g-site min-h-screen text-slate-100">
      <Toaster position="top-right" richColors />

      {/* Top Admin Control Bar */}
      <header className="border-b border-slate-800 bg-[#070d17]">
        <div className="site-container flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <span className="brand-mark"><Cuboid /></span>
            <div>
              <strong className="block text-sm font-bold text-white">R2G ADMIN CONTROL CENTER</strong>
              <span className="text-xs text-emerald-400">● Live Frontend Sync Active · Faridabad Campus</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="border-slate-700 text-xs" onClick={exportLeadsCsv}>
              <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5 text-emerald-400" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" className="border-slate-700 text-xs" onClick={resetDemoData}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5 text-amber-400" /> Reset Demo
            </Button>
            <Button variant="outline" size="sm" className="border-slate-700 text-xs" asChild>
              <Link to="/">View Live Site</Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="site-container py-8">
        {/* KPI Analytics Strip */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">TOTAL LEADS</span>
              <GraduationCap className="h-4 w-4 text-amber-400" />
            </div>
            <b className="mt-1.5 block text-2xl font-bold text-white">{leads.length}</b>
            <span className="text-[11px] text-emerald-400">{analytics.conversionRate}% conversion rate</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">CERTIFICATES</span>
              <BadgeCheck className="h-4 w-4 text-amber-400" />
            </div>
            <b className="mt-1.5 block text-2xl font-bold text-white">{certs.length}</b>
            <span className="text-[11px] text-slate-400">ISO 9001:2015 Registry</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">EST. COURSE REV</span>
              <IndianRupee className="h-4 w-4 text-emerald-400" />
            </div>
            <b className="mt-1.5 block text-2xl font-bold text-white">₹{analytics.estCourseRevenue.toLocaleString("en-IN")}</b>
            <span className="text-[11px] text-slate-400">Confirmed + Completed</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">3D LAB ORDERS</span>
              <Printer className="h-4 w-4 text-amber-400" />
            </div>
            <b className="mt-1.5 block text-2xl font-bold text-white">{quotes.length}</b>
            <span className="text-[11px] text-amber-300">₹{analytics.estPrintRevenue.toLocaleString("en-IN")} pipeline</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">OPEN SEATS</span>
              <Users className="h-4 w-4 text-amber-400" />
            </div>
            <b className="mt-1.5 block text-2xl font-bold text-white">{weekdaySeats + eveningSeats + weekendSeats}</b>
            <span className="text-[11px] text-slate-400">Across 3 Active Batches</span>
          </div>
        </div>

        {/* Main Operations Tabs */}
        <Tabs defaultValue="leads" className="mt-8">
          <TabsList className="flex h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
            <TabsTrigger value="leads" className="rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs data-[state=active]:border-amber-400 data-[state=active]:text-amber-300">
              <ClipboardList className="mr-1.5 h-4 w-4" /> Student Bookings ({leads.length})
            </TabsTrigger>
            <TabsTrigger value="certificates" className="rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs data-[state=active]:border-amber-400 data-[state=active]:text-amber-300">
              <Award className="mr-1.5 h-4 w-4" /> Certificates ({certs.length})
            </TabsTrigger>
            <TabsTrigger value="printing" className="rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs data-[state=active]:border-amber-400 data-[state=active]:text-amber-300">
              <Printer className="mr-1.5 h-4 w-4" /> 3D Print Lab ({quotes.length})
            </TabsTrigger>
            <TabsTrigger value="courses-manager" className="rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs data-[state=active]:border-amber-400 data-[state=active]:text-amber-300">
              <Settings className="mr-1.5 h-4 w-4" /> Courses &amp; Fees
            </TabsTrigger>
            <TabsTrigger value="batches" className="rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs data-[state=active]:border-amber-400 data-[state=active]:text-amber-300">
              <ShieldCheck className="mr-1.5 h-4 w-4" /> Batches, Promos &amp; Logs
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: STUDENT BOOKINGS + CERTIFICATE GENERATOR + NOTES + WHATSAPP */}
          <TabsContent value="leads" className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {(["All", "Pending", "Confirmed", "Completed"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      statusFilter === st
                        ? "bg-amber-400 text-slate-950"
                        : "border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-56">
                  <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search student or mobile..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 py-1.5 pr-3 pl-8 text-xs"
                  />
                </div>
                <Button size="sm" className="gold-button h-8 text-xs" onClick={() => setAddLeadOpen(true)}>
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Student
                </Button>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-800 text-xs text-slate-400 uppercase">
                  <tr>
                    <th className="py-3">Student</th>
                    <th className="py-3">Course &amp; Batch</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Certificate Action</th>
                    <th className="py-3 text-right">Follow-Up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="py-3">
                        <b className="block text-white">{lead.name}</b>
                        <span className="text-xs text-slate-400">+91 {lead.mobile} · {lead.date}</span>
                        {notesMap[lead.id] && (
                          <span className="mt-1 block max-w-xs truncate text-[11px] text-amber-300/80">
                            Note: {notesMap[lead.id]}
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="block text-slate-200">{lead.course}</span>
                        <span className="text-xs text-slate-400">{lead.batch}</span>
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => cycleLeadStatus(lead.id)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            lead.status === "Confirmed"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : lead.status === "Completed"
                                ? "bg-sky-500/20 text-sky-300"
                                : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {lead.status}
                        </button>
                      </td>
                      <td className="py-3">
                        {lead.certId ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => generateCertForLead(lead)}
                              className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-1 font-mono text-xs font-bold text-emerald-300"
                            >
                              <BadgeCheck className="h-3.5 w-3.5" /> {lead.certId}
                            </button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 border-slate-700 px-2 text-xs"
                              onClick={() =>
                                downloadStyledCertificatePdf({
                                  name: lead.name,
                                  course: lead.course,
                                  year: "November 2026",
                                  certId: lead.certId!,
                                })
                              }
                            >
                              <Download className="h-3.5 w-3.5 text-amber-400" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className="gold-button h-8 text-xs"
                            onClick={() => generateCertForLead(lead)}
                          >
                            <Sparkles className="mr-1 h-3.5 w-3.5" /> Generate Certificate
                          </Button>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Add Counselor Note"
                            onClick={() => {
                              setActiveNoteLead(lead);
                              setNoteDraft(notesMap[lead.id] ?? "");
                            }}
                          >
                            <MessageSquarePlus className="h-4 w-4 text-sky-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="WhatsApp Follow-Up"
                            asChild
                          >
                            <a
                              href={`https://wa.me/91${lead.mobile}?text=${encodeURIComponent(`Hi ${lead.name}, greetings from R2G Learn CAD Faridabad regarding your ${lead.course} session!`)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <PhoneCall className="h-4 w-4 text-emerald-400" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete Lead" onClick={() => deleteLead(lead.id)}>
                            <Trash2 className="h-4 w-4 text-rose-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 2: CERTIFICATE REGISTRY & DESIGNER PDF DOWNLOAD */}
          <TabsContent value="certificates" className="mt-6 grid gap-6 lg:grid-cols-12">
            <form
              onSubmit={issueManualCertificate}
              className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-5"
            >
              <h3 className="text-lg font-bold">Issue Custom Credential</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-400">STUDENT FULL NAME</label>
                <input
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Sneha Gupta"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400">REGISTERED MOBILE</label>
                <input
                  required
                  type="tel"
                  maxLength={10}
                  value={newStudentMobile}
                  onChange={(e) => setNewStudentMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 9811223344"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400">COMPLETED TRACK</label>
                <select
                  value={newStudentCourse}
                  onChange={(e) => setNewStudentCourse(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                >
                  <option>AutoCAD 2D &amp; 3D</option>
                  <option>SolidWorks Masterclass</option>
                  <option>Siemens NX &amp; CNC CAM</option>
                  <option>Industrial CAD/CAM &amp; 3D Prototyping</option>
                </select>
              </div>
              <Button type="submit" className="gold-button w-full">
                <Plus className="mr-1.5 h-4 w-4" /> Issue Verified Certificate ID
              </Button>
            </form>

            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-7">
              <h3 className="text-lg font-bold">Active Verification Registry</h3>
              {certs.map((c) => (
                <div key={c.certId} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/70 p-3.5">
                  <div>
                    <b className="text-sm text-white">{c.name}</b>
                    <p className="text-xs text-slate-400">{c.course} · +91 {c.mobile} · {c.year}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(c.certId);
                        toast.success(`Copied ${c.certId}`);
                      }}
                      className="inline-flex items-center gap-1 rounded bg-amber-400/15 px-2.5 py-1 font-mono text-xs font-bold text-amber-300"
                    >
                      {c.certId} <Copy className="h-3 w-3" />
                    </button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 border-slate-700 px-2 text-xs"
                      title="Download Designer PDF"
                      onClick={() =>
                        downloadStyledCertificatePdf({
                          name: c.name,
                          course: c.course,
                          year: c.year,
                          certId: c.certId,
                        })
                      }
                    >
                      <Download className="h-3.5 w-3.5 text-emerald-400" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-rose-400"
                      title="Revoke Certificate"
                      onClick={() => revokeCertificate(c.certId)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 3: 3D PRINT LAB QUEUE & NEW ORDER LOGGER */}
          <TabsContent value="printing" className="mt-6 grid gap-6 lg:grid-cols-12">
            <form onSubmit={handleAddPrintJob} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-4">
              <h3 className="text-lg font-bold">Log New 3D Print Job</h3>
              <input
                required
                value={printClient}
                onChange={(e) => setPrintClient(e.target.value)}
                placeholder="Client / Student Name"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
              <input
                required
                value={printFile}
                onChange={(e) => setPrintFile(e.target.value)}
                placeholder="CAD Filename (e.g. gear.step)"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={printMat}
                  onChange={(e) => setPrintMat(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                >
                  <option>PLA</option>
                  <option>PETG</option>
                  <option>ABS</option>
                  <option>Carbon Fiber</option>
                  <option>Tough Resin</option>
                </select>
                <input
                  type="number"
                  value={printCost}
                  onChange={(e) => setPrintCost(e.target.value)}
                  placeholder="Est. ₹"
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                />
              </div>
              <Button type="submit" className="gold-button w-full">Add to Print Queue</Button>
            </form>

            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-8">
              <h3 className="text-lg font-bold">Active Slicing &amp; Print Queue</h3>
              {quotes.map((q) => (
                <div key={q.quoteId} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                  <div>
                    <span className="text-xs font-bold text-amber-400">{q.quoteId} · {q.material}</span>
                    <b className="block text-white">{q.file}</b>
                    <span className="text-xs text-slate-400">Client: {q.client} · Quote: ₹{q.estimate}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => cycleQuoteStatus(q.quoteId)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                      q.status === "Printed"
                        ? "bg-sky-500/20 text-sky-300"
                        : q.status === "Approved"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {q.status} (Click to Advance)
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 4: COURSE & FEE EDITOR */}
          <TabsContent value="courses-manager" className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-bold">Course Fee &amp; Seat Allocation Editor</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {adminCourses.map((course) => (
                <div key={course.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between">
                    <b className="text-white">{course.title}</b>
                    <span className="text-xs text-slate-400">{course.duration}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Fee (₹):</span>
                      <input
                        type="number"
                        value={course.fee}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setAdminCourses((prev) =>
                            prev.map((c) => (c.id === course.id ? { ...c, fee: val } : c))
                          );
                        }}
                        className="w-24 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Seats:</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2"
                        onClick={() =>
                          setAdminCourses((prev) =>
                            prev.map((c) => (c.id === course.id ? { ...c, seats: Math.max(0, c.seats - 1) } : c))
                          )
                        }
                      >
                        -
                      </Button>
                      <b className="text-amber-400">{course.seats}</b>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2"
                        onClick={() =>
                          setAdminCourses((prev) =>
                            prev.map((c) => (c.id === course.id ? { ...c, seats: c.seats + 1 } : c))
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 5: BATCH SEATS, PROMO CODES, ANNOUNCEMENT BANNER & AUDIT LOG */}
          <TabsContent value="batches" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h4 className="font-bold text-white">Weekday Morning</h4>
                <p className="text-xs text-slate-400">10:00 AM – 1:00 PM</p>
                <div className="mt-3 flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => setWeekdaySeats((s) => Math.max(0, s - 1))}>-</Button>
                  <b className="text-xl text-amber-400">{weekdaySeats}</b>
                  <Button variant="outline" size="sm" onClick={() => setWeekdaySeats((s) => s + 1)}>+</Button>
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h4 className="font-bold text-white">Weekday Evening</h4>
                <p className="text-xs text-slate-400">5:00 PM – 7:30 PM</p>
                <div className="mt-3 flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => setEveningSeats((s) => Math.max(0, s - 1))}>-</Button>
                  <b className="text-xl text-amber-400">{eveningSeats}</b>
                  <Button variant="outline" size="sm" onClick={() => setEveningSeats((s) => s + 1)}>+</Button>
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h4 className="font-bold text-white">Weekend Professional</h4>
                <p className="text-xs text-slate-400">Sat &amp; Sun · 10:00 AM</p>
                <div className="mt-3 flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => setWeekendSeats((s) => Math.max(0, s - 1))}>-</Button>
                  <b className="text-xl text-amber-400">{weekendSeats}</b>
                  <Button variant="outline" size="sm" onClick={() => setWeekendSeats((s) => s + 1)}>+</Button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Promo Codes & Announcement Banner */}
              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <h4 className="flex items-center gap-2 font-bold text-white">
                  <Tag className="h-4 w-4 text-amber-400" /> Scholarship Promo Codes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {coupons.map((cp) => (
                    <button
                      key={cp.code}
                      type="button"
                      onClick={() =>
                        setCoupons((prev) =>
                          prev.map((c) => (c.code === cp.code ? { ...c, active: !c.active } : c))
                        )
                      }
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                        cp.active
                          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                          : "border-slate-800 bg-slate-950 text-slate-500 line-through"
                      }`}
                    >
                      {cp.code} ({cp.discount}% OFF)
                    </button>
                  ))}
                </div>
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCouponCode.trim()) return;
                    setCoupons([
                      ...coupons,
                      { code: newCouponCode.trim().toUpperCase(), discount: Number(newCouponPct) || 10, active: true },
                    ]);
                    setNewCouponCode("");
                    toast.success("Promo code added!");
                  }}
                >
                  <input
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="New Code (e.g. DIWALI25)"
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs"
                  />
                  <input
                    type="number"
                    value={newCouponPct}
                    onChange={(e) => setNewCouponPct(e.target.value)}
                    className="w-16 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs"
                  />
                  <Button type="submit" size="sm" className="gold-button">Add</Button>
                </form>

                <div className="border-t border-slate-800 pt-4">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                    <Megaphone className="h-4 w-4 text-amber-400" /> Top Announcement Banner
                  </h4>
                  <input
                    value={bannerText}
                    onChange={(e) => setBannerText(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              {/* Live Activity Audit Log */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <h4 className="flex items-center gap-2 font-bold text-white">
                  <History className="h-4 w-4 text-amber-400" /> Admin Activity Audit Log
                </h4>
                <div className="mt-4 max-h-56 space-y-2.5 overflow-y-auto text-xs">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between rounded border border-slate-800/80 bg-slate-950/60 px-3 py-2">
                      <span className="text-slate-300">{log.action}</span>
                      <span className="text-slate-500">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal 1: Add Walk-In Student Lead */}
      <Dialog open={addLeadOpen} onOpenChange={setAddLeadOpen}>
        <DialogContent className="r2g-dialog">
          <DialogHeader>
            <DialogTitle>Add New Student Enrollment</DialogTitle>
            <DialogDescription>Register a walk-in or phone inquiry directly into the live system.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddWalkIn} className="modal-form space-y-4">
            <label className="block text-xs font-semibold text-slate-300">
              STUDENT FULL NAME
              <input
                required
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                placeholder="e.g. Ranjeet Kumar"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-300">
              10-DIGIT MOBILE NUMBER
              <input
                required
                type="tel"
                maxLength={10}
                value={walkInPhone}
                onChange={(e) => setWalkInPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="9876543210"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-300">
              COURSE TRACK
              <select
                value={walkInCourse}
                onChange={(e) => setWalkInCourse(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              >
                <option>SolidWorks Masterclass</option>
                <option>AutoCAD 2D &amp; 3D</option>
                <option>Siemens NX &amp; CAM</option>
                <option>3D Printing &amp; Prototyping</option>
              </select>
            </label>
            <label className="block text-xs font-semibold text-slate-300">
              BATCH SLOT
              <select
                value={walkInBatch}
                onChange={(e) => setWalkInBatch(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              >
                <option>Weekend Professional</option>
                <option>Weekday Morning</option>
                <option>Weekday Evening</option>
              </select>
            </label>
            <Button type="submit" className="gold-button w-full">Save Student Record</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Counselor Notes */}
      <Dialog open={Boolean(activeNoteLead)} onOpenChange={(open) => !open && setActiveNoteLead(null)}>
        <DialogContent className="r2g-dialog">
          <DialogHeader>
            <DialogTitle>Counseling Notes — {activeNoteLead?.name}</DialogTitle>
            <DialogDescription>Add follow-up remarks, fee commitments, or lab evaluation feedback.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!activeNoteLead) return;
              setNotesMap((prev) => ({ ...prev, [activeNoteLead.id]: noteDraft }));
              toast.success("Counselor note saved.");
              logAction(`Updated counselor note for ${activeNoteLead.name}`);
              setActiveNoteLead(null);
            }}
            className="space-y-4"
          >
            <textarea
              rows={4}
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Write counseling notes here..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white"
            />
            <Button type="submit" className="gold-button w-full">Save Note</Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}