import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Cuboid,
  Download,
  FileText,
  GraduationCap,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { downloadStyledCertificatePdf } from "@/lib/certificate-pdf";
import { buildPlainTextPdf, isValidDemoOtp, isValidMobile } from "@/lib/r2g-demo-logic";
import { getStoredCerts, getStoredLeads } from "@/lib/r2g-storage";

export const Route = createFileRoute("/student-portal")({
  component: StudentPortalPage,
  head: () => ({
    meta: [{ title: "Student Portal | R2G Learn CAD Faridabad" }],
  }),
});

const practiceSheets = [
  {
    code: "DRG-101",
    title: "Orthographic & GD&T Flange Housing Blueprint",
    software: "AutoCAD / SolidWorks",
    difficulty: "Beginner",
  },
  {
    code: "DRG-102",
    title: "Sheet-Metal K-Factor Enclosure Unfold Exercise",
    software: "SolidWorks Sheet Metal",
    difficulty: "Intermediate",
  },
  {
    code: "DRG-103",
    title: "Planetary Carrier & Spur Gear Mating Tolerance",
    software: "SolidWorks / CATIA V5",
    difficulty: "Advanced",
  },
];

function StudentPortalPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loggedInPhone, setLoggedInPhone] = useState<string | null>(null);

  function handleStudentLogin(e: FormEvent) {
    e.preventDefault();
    if (!isValidMobile(phone)) {
      toast.error("Enter a valid 10-digit registered mobile number.");
      return;
    }
    if (!isValidDemoOtp(otp)) {
      toast.error("Enter demo OTP: 1234");
      return;
    }
    setLoggedInPhone(phone);
    toast.success("Welcome to R2G Student Workspace!");
  }

  function downloadPracticeDrawing(sheet: (typeof practiceSheets)[number]) {
    const blob = new Blob(
      [
        buildPlainTextPdf([
          `R2G LEARN CAD — PRACTICE BLUEPRINT ${sheet.code}`,
          sheet.title,
          `Recommended Tool: ${sheet.software} · Level: ${sheet.difficulty}`,
          "Tolerance Standard: ISO 2768-mK · All dimensions in millimeters (mm)",
          "Submit completed .SLDPRT / .STEP file at Sector 35 Faridabad Lab.",
        ]),
      ],
      { type: "application/pdf" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sheet.code}-Practice-Sheet.pdf`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Downloaded ${sheet.code} practice drawing!`);
  }

  const studentCerts = loggedInPhone
    ? getStoredCerts().filter((c) => c.mobile === loggedInPhone)
    : [];
  const studentLeads = loggedInPhone
    ? getStoredLeads().filter((l) => l.mobile === loggedInPhone)
    : [];
  const studentName =
    studentCerts[0]?.name || studentLeads[0]?.name || "R2G Engineering Trainee";

  return (
    <main className="r2g-site min-h-screen text-slate-100">
      <Toaster position="top-right" richColors />
      <Navbar />

      {!loggedInPhone ? (
        <div className="site-container flex min-h-[75vh] items-center justify-center py-14">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#09111e] p-8 shadow-2xl">
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-amber-400 hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400">
                <GraduationCap className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-white">Student Learning Portal</h1>
                <p className="text-xs text-slate-400">Access blueprints, batch schedule &amp; certificates</p>
              </div>
            </div>

            <form onSubmit={handleStudentLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400">REGISTERED MOBILE NUMBER</label>
                <input
                  required
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="Try: 9876543210 or 9811223344"
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400">4-DIGIT OTP</label>
                <input
                  required
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="1234"
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white"
                />
              </div>
              <Button type="submit" className="gold-button w-full">
                <ShieldCheck className="mr-1.5 h-4 w-4" /> Enter Student Portal
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-slate-400">
              Demo Test Numbers: <b className="text-amber-300">9876543210</b> (Rahul) · <b className="text-amber-300">9811223344</b> (Sneha) · OTP: <b className="text-amber-300">1234</b>
            </p>
          </div>
        </div>
      ) : (
        <div className="site-container py-12">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/75 p-6">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/20 text-lg font-bold text-amber-300">
                {studentName[0]}
              </span>
              <div>
                <span className="text-xs font-semibold text-emerald-400">● VERIFIED STUDENT ACCOUNT</span>
                <h1 className="text-2xl font-bold text-white">{studentName}</h1>
                <p className="text-xs text-slate-400">Mobile: +91 {loggedInPhone} · Sector 35 Faridabad Campus</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-slate-700" onClick={() => setLoggedInPhone(null)}>
              <LogOut className="mr-1.5 h-4 w-4" /> Sign Out
            </Button>
          </div>

          <Tabs defaultValue="certificates" className="mt-8">
            <TabsList className="flex h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
              <TabsTrigger value="certificates" className="rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs data-[state=active]:border-amber-400 data-[state=active]:text-amber-300">
                <Award className="mr-1.5 h-4 w-4" /> My Certificates ({studentCerts.length})
              </TabsTrigger>
              <TabsTrigger value="enrollments" className="rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs data-[state=active]:border-amber-400 data-[state=active]:text-amber-300">
                <Calendar className="mr-1.5 h-4 w-4" /> My Batches &amp; Demos ({studentLeads.length})
              </TabsTrigger>
              <TabsTrigger value="blueprints" className="rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs data-[state=active]:border-amber-400 data-[state=active]:text-amber-300">
                <BookOpen className="mr-1.5 h-4 w-4" /> CAD Practice Blueprints
              </TabsTrigger>
            </TabsList>

            <TabsContent value="certificates" className="mt-6">
              {studentCerts.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
                  <p className="text-sm text-slate-300">No certificates issued for +91 {loggedInPhone} yet.</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Once your capstone project is approved in the Admin Portal, your ISO certificate will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {studentCerts.map((cert) => (
                    <div key={cert.certId} className="rounded-xl border border-amber-400/40 bg-slate-900/80 p-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <BadgeCheck className="h-4 w-4" /> ISO 9001:2015 VERIFIED
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-white">{cert.course}</h3>
                      <p className="mt-1 font-mono text-xs text-amber-300">Credential ID: {cert.certId}</p>
                      <p className="text-xs text-slate-400">Issued: {cert.year}</p>
                      <Button
                        className="gold-button mt-4 w-full"
                        size="sm"
                        onClick={() =>
                          downloadStyledCertificatePdf({
                            name: cert.name,
                            course: cert.course,
                            year: cert.year,
                            certId: cert.certId,
                          })
                        }
                      >
                        <Download className="mr-1.5 h-4 w-4" /> Download Official Designer PDF
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="enrollments" className="mt-6 space-y-3">
              {studentLeads.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
                  No active batch bookings linked to this number. <Link to="/courses" className="text-amber-400 underline">Explore courses →</Link>
                </div>
              ) : (
                studentLeads.map((lead) => (
                  <div key={lead.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                    <div>
                      <b className="text-base text-white">{lead.course}</b>
                      <p className="text-xs text-slate-400">Batch: {lead.batch} · Registered: {lead.date}</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                      Status: {lead.status}
                    </span>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="blueprints" className="mt-6 grid gap-4 md:grid-cols-3">
              {practiceSheets.map((sheet) => (
                <div key={sheet.code} className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                  <div>
                    <span className="text-xs font-bold text-amber-400">{sheet.code} · {sheet.difficulty}</span>
                    <h4 className="mt-1.5 text-base font-bold text-white">{sheet.title}</h4>
                    <p className="mt-1 text-xs text-slate-400">{sheet.software}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-5 w-full border-slate-700 text-xs"
                    onClick={() => downloadPracticeDrawing(sheet)}
                  >
                    <FileText className="mr-1.5 h-3.5 w-3.5 text-amber-400" /> Download Drawing PDF
                  </Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      )}

      <SiteFooter onOpenOtp={() => {}} />
    </main>
  );
}