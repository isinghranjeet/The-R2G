import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  Code2,
  Command,
  Cpu,
  Download,
  GraduationCap,
  LockKeyhole,
  MapPin,
  Menu,
  Phone,
  Printer,
  Search,
  Trophy,
  X,
} from "lucide-react";
import { toast } from "sonner";
import logoImg from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { buildPlainTextPdf } from "@/lib/r2g-demo-logic";

const shortcuts: Record<string, [string, string, string][]> = {
  AutoCAD: [
    ["Line", "L", "Draw a precise straight segment."],
    ["Trim", "TR", "Trim geometry at a cutting edge."],
    ["Offset", "O", "Create parallel, concentric geometry."],
    ["Fillet", "F", "Round the junction between edges."],
    ["Move", "M", "Relocate selected geometry."],
  ],
  SolidWorks: [
    ["Extrude", "E", "Add depth to a 2D sketch."],
    ["Revolve", "R", "Rotate a profile around an axis."],
    ["Fillet", "F", "Round selected model edges."],
    ["Mate", "M", "Constrain components in an assembly."],
    ["Loft", "L", "Blend profiles into a smooth shape."],
  ],
  CATIA: [
    ["Pad", "P", "Extrude a sketch into a solid."],
    ["Pocket", "K", "Remove material from a solid."],
    ["Shaft", "SH", "Revolve a sketch around an axis."],
    ["Fillet", "F", "Apply a radius to model edges."],
  ],
  "Siemens NX": [
    ["Extrude", "X", "Create a solid from a section."],
    ["Revolve", "RV", "Revolve a section around a centerline."],
    ["Edge Blend", "EB", "Add a radius to selected edges."],
    ["Trim", "TR", "Trim curves to a boundary."],
  ],
};

const quickJumpItems = [
  { title: "3D Parametric CAD & CNC Studio", tag: "Interactive Tool", to: "/cad-sandbox" },
  { title: "3D .STL File Viewer & Print Quote", tag: "Additive Lab", to: "/printing" },
  { title: "CAD & GD&T Scholarship Quiz (20% Off)", tag: "Assessment", to: "/quiz" },
  { title: "Student Portal & Certificate Download", tag: "OTP Login", to: "/student-portal" },
  { title: "All CAD/CAM & FEA Courses", tag: "Programs", to: "/courses" },
  { title: "Student Placements & Packages", tag: "Career", to: "/placements" },
  { title: "About R2G Faridabad Lab", tag: "Institute", to: "/about" },
  { title: "Contact & Sector 35 Campus Map", tag: "Location", to: "/contact" },
  { title: "Admin Control Center", tag: "Staff Portal", to: "/admin" },
];

function downloadCheatSheet(software: string) {
  const lines = [
    `${software} — QUICK REFERENCE`,
    ...(shortcuts[software] ?? []).map(([name, key, tip]) => `${name} · ${key} — ${tip}`),
  ];
  const blob = new Blob([buildPlainTextPdf(lines)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${software.toLowerCase().replaceAll(" ", "-")}-cheat-sheet.pdf`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success("PDF cheat sheet downloaded.");
}

export function Navbar() {
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);
  const [labsMenuOpen, setLabsMenuOpen] = useState(false);
  const [hotkeysOpen, setHotkeysOpen] = useState(false);
  const [hotkeySoftware, setHotkeySoftware] = useState("SolidWorks");
  const [hotkeySearch, setHotkeySearch] = useState("");

  // Ctrl+K Quick Command Palette
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredShortcuts = (shortcuts[hotkeySoftware] ?? []).filter((row) =>
    row.join(" ").toLowerCase().includes(hotkeySearch.toLowerCase())
  );

  const filteredJumpItems = quickJumpItems.filter(
    (item) =>
      item.title.toLowerCase().includes(cmdQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(cmdQuery.toLowerCase())
  );

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="site-container announcement-content">
          <div className="announcement-contact">
            <span><MapPin /> Sector 35, Faridabad, Haryana</span>
            <a href="tel:+919315058665"><Phone /> Helpline: +91 93150 58665</a>
          </div>
          <div className="announcement-note">
            <span>ISO 9001:2015 CERTIFIED</span>
            <em>“Transforming Concepts into Reality.”</em>
          </div>
        </div>
      </div>

      {/* Main Sticky Glass Header */}
      <header className="site-header sticky top-0 z-40 border-b border-slate-800/80 bg-[#070d17]/92 backdrop-blur-xl">
        <div className="site-container nav-content">
          {/* Clean Horizontal Logo Lockup */}
          <Link
            className="flex shrink-0 items-center gap-3"
            to="/"
            aria-label="R2G Learn CAD home"
            onClick={() => setMobileNav(false)}
          >
            <div className="flex h-11 items-center rounded-lg border border-slate-700/70 bg-white px-2.5 py-1 shadow-sm">
              <img
                src={logoImg}
                alt="R2G Learn CAD Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="hidden flex-col sm:flex">
              <strong className="text-[13px] font-bold tracking-wider text-white">
                R2G LEARN CAD
              </strong>
              <small className="font-mono text-[9px] tracking-widest text-slate-400">
                DESIGN &amp; DRAFTING
              </small>
            </div>
          </Link>

          <Button
            className="mobile-menu-button"
            variant="outline"
            size="icon"
            aria-label={mobileNav ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileNav}
            onClick={() => setMobileNav((v) => !v)}
          >
            {mobileNav ? <X /> : <Menu />}
          </Button>

          {/* Perfectly Aligned Primary Navigation */}
          <nav className={`main-nav${mobileNav ? " is-open" : ""}`} aria-label="Main navigation">
            <Link to="/" onClick={() => setMobileNav(false)}>Home</Link>
            <Link to="/courses" onClick={() => setMobileNav(false)}>Courses</Link>

            <Link
              to="/cad-sandbox"
              onClick={() => setMobileNav(false)}
              className="inline-flex items-center gap-1.5 font-semibold text-amber-300"
            >
              CAD Studio
              <span className="rounded bg-amber-400/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-300">
                3D
              </span>
            </Link>

            {/* Labs & Tools Dropdown (Exact same typography as links) */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setLabsMenuOpen(true)}
              onMouseLeave={() => setLabsMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setLabsMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13.5px] font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Labs &amp; Tools <ChevronDown className="h-3.5 w-3.5 opacity-75" />
              </button>

              {labsMenuOpen && (
                <div className="absolute top-full left-0 z-50 pt-1.5">
                  <div className="w-64 rounded-xl border border-slate-800 bg-[#091222]/98 p-2 shadow-2xl backdrop-blur-xl">
                    <Link
                      to="/cad-sandbox"
                      onClick={() => {
                        setLabsMenuOpen(false);
                        setMobileNav(false);
                      }}
                      className="flex items-start gap-2.5 rounded-lg p-2.5 transition hover:bg-slate-800/80"
                    >
                      <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      <div>
                        <b className="block text-xs text-white">Parametric CAD &amp; CNC Studio</b>
                        <span className="text-[11px] text-slate-400">20-part 3D builder, FEA &amp; G-Code</span>
                      </div>
                    </Link>

                    <Link
                      to="/printing"
                      onClick={() => {
                        setLabsMenuOpen(false);
                        setMobileNav(false);
                      }}
                      className="flex items-start gap-2.5 rounded-lg p-2.5 transition hover:bg-slate-800/80"
                    >
                      <Printer className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                      <div>
                        <b className="block text-xs text-white">3D .STL Viewer &amp; Print Quote</b>
                        <span className="text-[11px] text-slate-400">Inspect mesh &amp; calculate cost</span>
                      </div>
                    </Link>

                    <Link
                      to="/quiz"
                      onClick={() => {
                        setLabsMenuOpen(false);
                        setMobileNav(false);
                      }}
                      className="flex items-start gap-2.5 rounded-lg p-2.5 transition hover:bg-slate-800/80"
                    >
                      <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <div>
                        <b className="block text-xs text-white">CAD &amp; GD&amp;T Scholarship Quiz</b>
                        <span className="text-[11px] text-slate-400">Win up to 20% fee waiver</span>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setLabsMenuOpen(false);
                        setMobileNav(false);
                        setHotkeysOpen(true);
                      }}
                      className="flex w-full items-start gap-2.5 rounded-lg p-2.5 text-left transition hover:bg-slate-800/80"
                    >
                      <Code2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                      <div>
                        <b className="block text-xs text-white">CAD Command Hotkeys</b>
                        <span className="text-[11px] text-slate-400">SolidWorks, NX &amp; AutoCAD PDF</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link to="/placements" onClick={() => setMobileNav(false)}>Placements</Link>
            <Link to="/about" onClick={() => setMobileNav(false)}>About</Link>
            <Link to="/contact" onClick={() => setMobileNav(false)}>Contact</Link>
          </nav>

          {/* Right Utility Actions */}
          <div className="nav-actions">
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-400 transition hover:border-slate-700 hover:text-white xl:inline-flex"
              title="Quick Search (Ctrl + K)"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search…</span>
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                Ctrl K
              </kbd>
            </button>

            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 bg-slate-900/70 text-xs"
              asChild
            >
              <Link to="/student-portal">
                <GraduationCap className="mr-1 h-3.5 w-3.5 text-amber-400" /> Student Portal
              </Link>
            </Button>

            <Button className="admin-button" asChild>
              <Link to="/admin">
                <LockKeyhole /> Admin
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Ctrl+K Quick Navigation Command Palette */}
      <Dialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <DialogContent className="r2g-dialog max-w-lg overflow-hidden p-0">
          <div className="flex items-center border-b border-slate-800 px-4 py-3">
            <Command className="mr-2.5 h-4 w-4 text-amber-400" />
            <input
              autoFocus
              value={cmdQuery}
              onChange={(e) => setCmdQuery(e.target.value)}
              placeholder="Jump to CAD Studio, 3D Print Lab, Courses, Student Portal..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
          <div className="max-h-72 overflow-y-auto p-2">
            {filteredJumpItems.map((item) => (
              <button
                key={item.to}
                type="button"
                onClick={() => {
                  setCmdOpen(false);
                  setCmdQuery("");
                  navigate({ to: item.to });
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition hover:bg-slate-800/80"
              >
                <span className="font-semibold text-slate-100">{item.title}</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-amber-300">
                  {item.tag} <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            ))}
            {filteredJumpItems.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-500">
                No matching studio page found.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* CAD Hotkeys Reference Drawer */}
      <Sheet open={hotkeysOpen} onOpenChange={setHotkeysOpen}>
        <SheetContent className="hotkey-drawer">
          <SheetHeader>
            <span className="eyebrow section-eyebrow">QUICK REFERENCE / ENGINEERING TOOLS</span>
            <SheetTitle>CAD command library</SheetTitle>
            <SheetDescription>Search essential modeling and drafting shortcuts.</SheetDescription>
          </SheetHeader>
          <div className="hotkey-search">
            <Search />
            <input
              placeholder="Search commands…"
              aria-label="Search CAD commands"
              value={hotkeySearch}
              onChange={(e) => setHotkeySearch(e.target.value)}
            />
          </div>
          <Tabs value={hotkeySoftware} onValueChange={setHotkeySoftware}>
            <TabsList className="hotkey-tabs">
              {Object.keys(shortcuts).map((s) => (
                <TabsTrigger key={s} value={s}>{s}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={hotkeySoftware} className="hotkey-results">
              {filteredShortcuts.length ? (
                filteredShortcuts.map(([name, code, tip]) => (
                  <div className="hotkey-row" key={name}>
                    <span><b>{name}</b><small>{tip}</small></span>
                    <kbd>{code}</kbd>
                  </div>
                ))
              ) : (
                <div className="hotkey-empty">No matching commands.</div>
              )}
            </TabsContent>
          </Tabs>
          <Button
            className="gold-button hotkey-download"
            onClick={() => downloadCheatSheet(hotkeySoftware)}
          >
            <Download /> Download PDF cheat sheet
          </Button>
        </SheetContent>
      </Sheet>
    </>
  );
}