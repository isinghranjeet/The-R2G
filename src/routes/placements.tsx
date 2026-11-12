import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BriefcaseBusiness, Building, GraduationCap, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/placements")({
  component: PlacementsPage,
  head: () => ({
    meta: [{ title: "Student Placements & Alumni | R2G Learn CAD" }],
  }),
});

const placedStudents = [
  { name: "Anjali Rawat", role: "Mechanical CAD Designer", company: "Tata Motors", ctc: "5.2 LPA", tool: "SolidWorks · GD&T" },
  { name: "Vikram Yadav", role: "Junior BIW Design Engineer", company: "Maruti Suzuki", ctc: "4.8 LPA", tool: "CATIA V5" },
  { name: "Rohit Kumar", role: "Product Design Associate", company: "L&T", ctc: "4.5 LPA", tool: "Siemens NX" },
  { name: "Pooja Saini", role: "Design Engineer", company: "Havells", ctc: "4.2 LPA", tool: "SolidWorks · Sheet Metal" },
  { name: "Deepak Chauhan", role: "Tool Design Trainee", company: "Uno Minda", ctc: "3.8 LPA", tool: "AutoCAD · NX CAM" },
  { name: "Siddharth Verma", role: "CAE Simulation Analyst", company: "Escorts Kubota", ctc: "4.6 LPA", tool: "ANSYS Workbench" },
];

function PlacementsPage() {
  return (
    <main className="r2g-site min-h-screen text-slate-100">
      <div className="site-container py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-amber-400 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mt-6">
          <span className="eyebrow section-eyebrow">CAREER OUTCOMES</span>
          <h1 className="mt-2 text-4xl font-bold">From CAD Lab to <span className="text-amber-400">Design Desk.</span></h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Every learner graduates with a verified project portfolio, CAD technical test prep, and direct interview referrals across Delhi-NCR manufacturing hubs.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <TrendingUp className="h-6 w-6 text-amber-400" />
            <b className="mt-2 block text-2xl">5.2 LPA</b>
            <span className="text-xs text-slate-400">HIGHEST FRESHER PACKAGE</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <Building className="h-6 w-6 text-amber-400" />
            <b className="mt-2 block text-2xl">120+</b>
            <span className="text-xs text-slate-400">HIRING PARTNERS IN NCR</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <GraduationCap className="h-6 w-6 text-amber-400" />
            <b className="mt-2 block text-2xl">100%</b>
            <span className="text-xs text-slate-400">INTERVIEW &amp; PORTFOLIO SUPPORT</span>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {placedStudents.map((s) => (
            <div key={s.name} className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between">
                <span className="rounded bg-amber-400/15 px-2.5 py-1 text-xs font-bold text-amber-300">{s.ctc}</span>
                <span className="text-xs text-slate-400">{s.tool}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold">{s.name}</h3>
              <p className="text-sm text-slate-300">{s.role}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <BriefcaseBusiness className="h-4 w-4" /> {s.company}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}