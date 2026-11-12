import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Code2,
  Cuboid,
  Download,
  GraduationCap,
  LockKeyhole,
  MapPin,
  Menu,
  Phone,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [mobileNav, setMobileNav] = useState(false);
  const [hotkeysOpen, setHotkeysOpen] = useState(false);
  const [hotkeySoftware, setHotkeySoftware] = useState("SolidWorks");
  const [hotkeySearch, setHotkeySearch] = useState("");

  const filteredShortcuts = (shortcuts[hotkeySoftware] ?? []).filter((row) =>
    row.join(" ").toLowerCase().includes(hotkeySearch.toLowerCase())
  );

  return (
    <>
      <div className="announcement-bar">
        <div className="site-container announcement-content">
          <div className="announcement-contact">
            <span><MapPin /> Sector 35, Faridabad, Haryana</span>
            <a href="tel:+919876543210"><Phone /> Helpline: +91 98765 43210</a>
          </div>
          <div className="announcement-note">
            <span>ISO 9001:2015 CERTIFIED</span>
            <em>“Transforming Concepts into Reality.”</em>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="site-container nav-content">
          <Link
            className="brand-lockup"
            to="/"
            aria-label="R2G Learn CAD home"
            onClick={() => setMobileNav(false)}
          >
            <span className="brand-mark"><Cuboid /></span>
            <span className="brand-text">
              <strong>R2G LEARN CAD</strong>
              <small>INSTITUTE OF DESIGN &amp; DRAFTING</small>
            </span>
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

          <nav className={`main-nav${mobileNav ? " is-open" : ""}`} aria-label="Main navigation">
            <Link to="/" onClick={() => setMobileNav(false)}>Home</Link>
            <Link to="/about" onClick={() => setMobileNav(false)}>About</Link>
            <Link to="/courses" onClick={() => setMobileNav(false)}>Courses</Link>
            <Link to="/printing" onClick={() => setMobileNav(false)}>3D STL Lab</Link>
            <Link to="/quiz" onClick={() => setMobileNav(false)}>Skill Quiz</Link>
            <Link to="/placements" onClick={() => setMobileNav(false)}>Placements</Link>
            <Link to="/blog" onClick={() => setMobileNav(false)}>Blog</Link>
            <Link to="/contact" onClick={() => setMobileNav(false)}>Contact</Link>
          </nav>

          <div className="nav-actions">
            <Button
              className="nav-utility"
              variant="ghost"
              onClick={() => setHotkeysOpen(true)}
              title="Open CAD shortcut guide"
            >
              <Code2 /> Hotkeys
            </Button>
            <Button variant="outline" size="sm" className="border-slate-700 text-xs" asChild>
              <Link to="/student-portal">
                <GraduationCap className="mr-1 h-3.5 w-3.5 text-amber-400" /> Student Login
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