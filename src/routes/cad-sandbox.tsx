import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Box,
  Cpu,
  Download,
  Flame,
  Layers,
  Play,
  RotateCcw,
  Scissors,
  Sliders,
  Sparkles,
  Square,
  Terminal,
} from "lucide-react";
import * as THREE from "three";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/cad-sandbox")({
  component: CadSandboxPage,
  head: () => ({
    meta: [
      { title: "20-Part Interactive 3D CAD & CNC Studio | R2G Learn CAD" },
      {
        name: "description",
        content:
          "Design and customize 20 industrial 3D mechanical models, inspect FEA stress heatmaps, run CNC G-Code simulations, and export .STL files.",
      },
    ],
  }),
});

type ViewMode = "steel" | "gold" | "titanium" | "fea" | "wireframe";

interface CadPartPreset {
  id: string;
  code: string;
  name: string;
  category: "Automotive" | "Aerospace" | "Robotics" | "Tooling";
  generator:
    | "flange"
    | "spurGear"
    | "sprocket"
    | "brakeRotor"
    | "turbine"
    | "geneva"
    | "hexNut"
    | "heatsink"
    | "nemaMount"
    | "conRod"
    | "gripperJaw"
    | "wingRib"
    | "manifold"
    | "splineHub"
    | "bearingCage"
    | "coilSpring"
    | "camLobe"
    | "impellerOpen"
    | "starWheel"
    | "couplingDisc";
  defaults: { od: number; id: number; th: number; count: number; hole: number; bevel: number };
  countLabel: string;
}

// 20 Distinct Industrial CAD Models
const CAD_PRESETS: CadPartPreset[] = [
  {
    id: "spur-gear",
    code: "CAD-01",
    name: "Involute Spur Gear",
    category: "Automotive",
    generator: "spurGear",
    defaults: { od: 130, id: 34, th: 20, count: 18, hole: 10, bevel: 1.2 },
    countLabel: "GEAR TEETH COUNT",
  },
  {
    id: "turbine-impeller",
    code: "CAD-02",
    name: "Jet Turbine Impeller",
    category: "Aerospace",
    generator: "turbine",
    defaults: { od: 140, id: 30, th: 24, count: 12, hole: 8, bevel: 1.0 },
    countLabel: "TURBINE BLADES",
  },
  {
    id: "brake-rotor",
    code: "CAD-03",
    name: "Drilled V8 Brake Rotor",
    category: "Automotive",
    generator: "brakeRotor",
    defaults: { od: 164, id: 52, th: 14, count: 16, hole: 8, bevel: 1.0 },
    countLabel: "COOLING VENT RINGS",
  },
  {
    id: "geneva-drive",
    code: "CAD-04",
    name: "Maltese Geneva Wheel",
    category: "Robotics",
    generator: "geneva",
    defaults: { od: 136, id: 28, th: 16, count: 6, hole: 10, bevel: 1.2 },
    countLabel: "INDEXING SLOTS",
  },
  {
    id: "chain-sprocket",
    code: "CAD-05",
    name: "CNC Roller Sprocket",
    category: "Automotive",
    generator: "sprocket",
    defaults: { od: 144, id: 40, th: 12, count: 22, hole: 12, bevel: 1.5 },
    countLabel: "SPROCKET TEETH",
  },
  {
    id: "cpu-heatsink",
    code: "CAD-06",
    name: "Radial Pin-Fin Heatsink",
    category: "Robotics",
    generator: "heatsink",
    defaults: { od: 124, id: 26, th: 28, count: 24, hole: 6, bevel: 0.8 },
    countLabel: "COOLING FINS",
  },
  {
    id: "con-rod",
    code: "CAD-07",
    name: "Forged Connecting Rod",
    category: "Automotive",
    generator: "conRod",
    defaults: { od: 156, id: 44, th: 18, count: 4, hole: 14, bevel: 1.5 },
    countLabel: "LIGHTENING POCKETS",
  },
  {
    id: "nema-mount",
    code: "CAD-08",
    name: "NEMA-23 Stepper Bracket",
    category: "Robotics",
    generator: "nemaMount",
    defaults: { od: 116, id: 38, th: 12, count: 4, hole: 8, bevel: 1.2 },
    countLabel: "MOUNTING SLOTS",
  },
  {
    id: "wing-rib",
    code: "CAD-09",
    name: "NACA Aero Wing Rib",
    category: "Aerospace",
    generator: "wingRib",
    defaults: { od: 168, id: 28, th: 10, count: 5, hole: 14, bevel: 1.0 },
    countLabel: "TRUSS CUTOUTS",
  },
  {
    id: "hex-nut",
    code: "CAD-10",
    name: "Heavy Hex Flange Nut",
    category: "Tooling",
    generator: "hexNut",
    defaults: { od: 112, id: 46, th: 26, count: 6, hole: 8, bevel: 2.2 },
    countLabel: "HEX FACETS",
  },
  {
    id: "spline-hub",
    code: "CAD-11",
    name: "Internal Spline Drive Hub",
    category: "Automotive",
    generator: "splineHub",
    defaults: { od: 128, id: 44, th: 24, count: 14, hole: 10, bevel: 1.2 },
    countLabel: "INTERNAL SPLINES",
  },
  {
    id: "gripper-jaw",
    code: "CAD-12",
    name: "6-Axis Robot Gripper Base",
    category: "Robotics",
    generator: "gripperJaw",
    defaults: { od: 132, id: 36, th: 16, count: 6, hole: 9, bevel: 1.5 },
    countLabel: "ACTUATOR PORTS",
  },
  {
    id: "hydraulic-manifold",
    code: "CAD-13",
    name: "CNC Hydraulic Manifold",
    category: "Tooling",
    generator: "manifold",
    defaults: { od: 126, id: 32, th: 30, count: 8, hole: 11, bevel: 1.5 },
    countLabel: "VALVE BORES",
  },
  {
    id: "bearing-cage",
    code: "CAD-14",
    name: "Ball Bearing Retainer",
    category: "Tooling",
    generator: "bearingCage",
    defaults: { od: 134, id: 68, th: 18, count: 12, hole: 14, bevel: 1.0 },
    countLabel: "BALL POCKETS",
  },
  {
    id: "coil-spring",
    code: "CAD-15",
    name: "Helical Suspension Coil",
    category: "Automotive",
    generator: "coilSpring",
    defaults: { od: 110, id: 64, th: 36, count: 6, hole: 12, bevel: 1.0 },
    countLabel: "ACTIVE COIL TURNS",
  },
  {
    id: "cam-lobe",
    code: "CAD-16",
    name: "DOHC Engine Cam Lobe",
    category: "Automotive",
    generator: "camLobe",
    defaults: { od: 124, id: 36, th: 22, count: 3, hole: 10, bevel: 1.4 },
    countLabel: "LOBE PROFILE",
  },
  {
    id: "impeller-open",
    code: "CAD-17",
    name: "Centrifugal Pump Rotor",
    category: "Aerospace",
    generator: "impellerOpen",
    defaults: { od: 142, id: 34, th: 20, count: 8, hole: 9, bevel: 1.0 },
    countLabel: "CURVED VANES",
  },
  {
    id: "star-wheel",
    code: "CAD-18",
    name: "Bottle Indexing Starwheel",
    category: "Robotics",
    generator: "starWheel",
    defaults: { od: 152, id: 42, th: 15, count: 10, hole: 16, bevel: 1.2 },
    countLabel: "POCKET CRADLES",
  },
  {
    id: "coupling-disc",
    code: "CAD-19",
    name: "Flexible Jaw Coupling",
    category: "Tooling",
    generator: "couplingDisc",
    defaults: { od: 118, id: 32, th: 26, count: 6, hole: 10, bevel: 1.5 },
    countLabel: "ELASTOMER JAWS",
  },
  {
    id: "iso-flange",
    code: "CAD-20",
    name: "ASME B16.5 Pipe Flange",
    category: "Tooling",
    generator: "flange",
    defaults: { od: 136, id: 48, th: 18, count: 8, hole: 11, bevel: 1.5 },
    countLabel: "PCD BOLT HOLES",
  },
];

function buildPartGeometry(
  preset: CadPartPreset,
  params: { od: number; id: number; th: number; count: number; hole: number; bevel: number }
): THREE.BufferGeometry {
  const outerR = params.od / 2;
  const innerR = Math.min(params.id / 2, outerR - 10);
  const pcdR = (outerR + innerR) / 2;
  const holeR = Math.min(params.hole / 2, (outerR - innerR) * 0.34);

  // Special 3D Helical Coil Spring Generator
  if (preset.generator === "coilSpring") {
    const pts: THREE.Vector3[] = [];
    const turns = Math.max(3, params.count);
    const totalPts = turns * 32;
    const coilR = (outerR + innerR) / 2;
    const height = params.th * 2.4;
    for (let i = 0; i <= totalPts; i++) {
      const t = i / totalPts;
      const a = t * turns * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * coilR, Math.sin(a) * coilR, (t - 0.5) * height));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const wireR = Math.max(3, params.hole * 0.45);
    const geo = new THREE.TubeGeometry(curve, totalPts, wireR, 16, false);
    geo.center();
    return geo;
  }

  const shape = new THREE.Shape();

  if (preset.generator === "spurGear" || preset.generator === "sprocket") {
    const teeth = Math.max(8, params.count);
    const toothDepth = preset.generator === "sprocket" ? 6.5 : 5.2;
    const rootR = outerR - toothDepth;
    for (let i = 0; i < teeth * 4; i++) {
      const idx = Math.floor(i / 4);
      const step = i % 4;
      const r = step === 0 || step === 3 ? rootR : outerR;
      const a = ((idx + step * 0.25) / teeth) * Math.PI * 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
  } else if (preset.generator === "turbine" || preset.generator === "impellerOpen") {
    const blades = Math.max(5, params.count);
    const hubR = innerR + 10;
    for (let i = 0; i < blades * 4; i++) {
      const idx = Math.floor(i / 4);
      const step = i % 4;
      const r = step === 0 || step === 3 ? hubR : outerR;
      const twist = step === 1 || step === 2 ? 0.24 : 0;
      const a = ((idx + step * 0.22) / blades) * Math.PI * 2 + twist;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
  } else if (preset.generator === "geneva" || preset.generator === "starWheel") {
    const slots = Math.max(4, params.count);
    const segs = slots * 12;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const wave = Math.cos(a * slots);
      const r = wave > 0.65 ? outerR - (wave - 0.65) * 48 : outerR;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
  } else if (preset.generator === "hexNut" || preset.generator === "manifold" || preset.generator === "nemaMount") {
    const sides = preset.generator === "hexNut" ? 6 : 4;
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 + Math.PI / sides;
      const x = Math.cos(a) * outerR;
      const y = Math.sin(a) * outerR;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
  } else if (preset.generator === "heatsink") {
    const fins = Math.max(12, params.count);
    for (let i = 0; i < fins * 2; i++) {
      const a = (i / (fins * 2)) * Math.PI * 2;
      const r = i % 2 === 0 ? outerR : innerR + 14;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
  } else if (preset.generator === "conRod" || preset.generator === "wingRib") {
    const len = outerR * 1.15;
    const bigR = outerR * 0.42;
    const smallR = preset.generator === "wingRib" ? outerR * 0.16 : outerR * 0.28;
    shape.absarc(-len * 0.45, 0, bigR, Math.PI * 0.5, Math.PI * 1.5, false);
    shape.lineTo(len * 0.55, -smallR);
    shape.absarc(len * 0.55, 0, smallR, -Math.PI * 0.5, Math.PI * 0.5, false);
    shape.lineTo(-len * 0.45, bigR);
    shape.closePath();
  } else if (preset.generator === "camLobe") {
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const nose = Math.max(0, Math.cos(a)) ** 3 * (outerR * 0.42);
      const r = outerR * 0.68 + nose;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
  } else if (preset.generator === "couplingDisc" || preset.generator === "gripperJaw") {
    const jaws = Math.max(4, params.count);
    for (let i = 0; i < jaws * 4; i++) {
      const idx = Math.floor(i / 4);
      const step = i % 4;
      const r = step === 0 || step === 3 ? outerR * 0.78 : outerR;
      const a = ((idx + step * 0.25) / jaws) * Math.PI * 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
  } else {
    shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
  }

  // Center Bore (with optional internal splines)
  if (preset.generator === "conRod" || preset.generator === "wingRib") {
    const bigHole = new THREE.Path();
    bigHole.absarc(-outerR * 0.52, 0, innerR * 0.65, 0, Math.PI * 2, true);
    shape.holes.push(bigHole);

    const smallHole = new THREE.Path();
    smallHole.absarc(outerR * 0.63, 0, innerR * 0.35, 0, Math.PI * 2, true);
    shape.holes.push(smallHole);

    const pockets = Math.max(2, params.count);
    for (let i = 0; i < pockets; i++) {
      const px = -outerR * 0.12 + (i / pockets) * (outerR * 0.55);
      const pHole = new THREE.Path();
      pHole.absarc(px, 0, holeR * 0.65, 0, Math.PI * 2, true);
      shape.holes.push(pHole);
    }
  } else {
    const borePath = new THREE.Path();
    if (preset.generator === "splineHub") {
      const splines = Math.max(8, params.count);
      for (let i = 0; i < splines * 4; i++) {
        const idx = Math.floor(i / 4);
        const step = i % 4;
        const r = step === 0 || step === 3 ? innerR : innerR - 3.2;
        const a = ((idx + step * 0.25) / splines) * Math.PI * 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) borePath.moveTo(x, y);
        else borePath.lineTo(x, y);
      }
      borePath.closePath();
    } else {
      borePath.absarc(0, 0, innerR, 0, Math.PI * 2, true);
    }
    shape.holes.push(borePath);

    // Bolt Holes / Vent Drills
    if (
      preset.generator === "flange" ||
      preset.generator === "brakeRotor" ||
      preset.generator === "bearingCage" ||
      preset.generator === "manifold" ||
      preset.generator === "nemaMount" ||
      preset.generator === "spurGear"
    ) {
      const count = preset.generator === "spurGear" ? Math.min(6, Math.floor(params.count / 3)) : params.count;
      for (let i = 0; i < count; i++) {
        const ang = (i * Math.PI * 2) / count;
        const hx = Math.cos(ang) * pcdR;
        const hy = Math.sin(ang) * pcdR;
        const hPath = new THREE.Path();
        hPath.absarc(hx, hy, holeR, 0, Math.PI * 2, true);
        shape.holes.push(hPath);
      }
    }
  }

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: params.th,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: params.bevel,
    bevelThickness: params.bevel,
    curveSegments: 56,
  });
  geo.center();
  return geo;
}

function exportGeometryToAsciiStl(geometry: THREE.BufferGeometry, partName: string) {
  const nonIndexed = geometry.index ? geometry.toNonIndexed() : geometry;
  const pos = nonIndexed.attributes.position;
  if (!pos) return "";

  const lines: string[] = [`solid ${partName}`];
  const pA = new THREE.Vector3();
  const pB = new THREE.Vector3();
  const pC = new THREE.Vector3();
  const cb = new THREE.Vector3();
  const ab = new THREE.Vector3();

  for (let i = 0; i < pos.count; i += 3) {
    pA.fromBufferAttribute(pos, i);
    pB.fromBufferAttribute(pos, i + 1);
    pC.fromBufferAttribute(pos, i + 2);
    cb.subVectors(pC, pB);
    ab.subVectors(pA, pB);
    cb.cross(ab).normalize();

    lines.push(`  facet normal ${cb.x.toFixed(5)} ${cb.y.toFixed(5)} ${cb.z.toFixed(5)}`);
    lines.push("    outer loop");
    lines.push(`      vertex ${pA.x.toFixed(4)} ${pA.y.toFixed(4)} ${pA.z.toFixed(4)}`);
    lines.push(`      vertex ${pB.x.toFixed(4)} ${pB.y.toFixed(4)} ${pB.z.toFixed(4)}`);
    lines.push(`      vertex ${pC.x.toFixed(4)} ${pC.y.toFixed(4)} ${pC.z.toFixed(4)}`);
    lines.push("    endloop");
    lines.push("  endfacet");
  }
  lines.push(`endsolid ${partName}`);
  return lines.join("\n");
}

function CadSandboxPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const currentGeoRef = useRef<THREE.BufferGeometry | null>(null);

  const [selectedPreset, setSelectedPreset] = useState<CadPartPreset>(CAD_PRESETS[0]!);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Parametric CAD Sliders
  const [outerDia, setOuterDia] = useState([CAD_PRESETS[0]!.defaults.od]);
  const [boreDia, setBoreDia] = useState([CAD_PRESETS[0]!.defaults.id]);
  const [thickness, setThickness] = useState([CAD_PRESETS[0]!.defaults.th]);
  const [featureCount, setFeatureCount] = useState([CAD_PRESETS[0]!.defaults.count]);
  const [holeDia, setHoleDia] = useState([CAD_PRESETS[0]!.defaults.hole]);
  const [bevelSize, setBevelSize] = useState([CAD_PRESETS[0]!.defaults.bevel]);

  // Interactive Modes
  const [viewMode, setViewMode] = useState<ViewMode>("steel");
  const [sectionCut, setSectionCut] = useState(false);
  const [cncRunning, setCncRunning] = useState(false);
  const [autoSpin, setAutoSpin] = useState(true);
  const [activeGcodeLine, setActiveGcodeLine] = useState(0);

  const simRef = useRef({ viewMode, sectionCut, cncRunning, autoSpin });
  useEffect(() => {
    simRef.current = { viewMode, sectionCut, cncRunning, autoSpin };
  }, [viewMode, sectionCut, cncRunning, autoSpin]);

  function handleSelectPreset(preset: CadPartPreset) {
    setSelectedPreset(preset);
    setOuterDia([preset.defaults.od]);
    setBoreDia([preset.defaults.id]);
    setThickness([preset.defaults.th]);
    setFeatureCount([preset.defaults.count]);
    setHoleDia([preset.defaults.hole]);
    setBevelSize([preset.defaults.bevel]);
    toast.success(`Loaded ${preset.code}: ${preset.name}`);
  }

  const telemetry = useMemo(() => {
    const od = outerDia[0] ?? 130;
    const id = Math.min(boreDia[0] ?? 34, od - 20);
    const th = thickness[0] ?? 20;
    const cnt = featureCount[0] ?? 18;
    const hd = holeDia[0] ?? 10;

    const areaMm2 = Math.PI * ((od / 2) ** 2 - (id / 2) ** 2) * 0.82;
    const volumeCm3 = Math.max(3, (areaMm2 * th) / 1000);
    const steelMassGrams = Math.round(volumeCm3 * 7.85);
    const maxStressMpa = Math.round(13800 / Math.max(14, th * (od - id) * 0.038));
    const safetyFactor = Number((350 / Math.max(25, maxStressMpa)).toFixed(2));
    const estPrintCost = Math.round(140 + volumeCm3 * 8.5);

    return {
      od,
      id,
      th,
      cnt,
      hd,
      volumeCm3: volumeCm3.toFixed(1),
      steelMassGrams,
      maxStressMpa,
      safetyFactor,
      estPrintCost,
    };
  }, [outerDia, boreDia, thickness, featureCount, holeDia]);

  const gcodeLines = useMemo(() => {
    return [
      `O2026 (${selectedPreset.code}-${selectedPreset.id.toUpperCase()})`,
      `G21 G17 G90 G40 G49 G80`,
      `T01 M06 (8MM CARBIDE BALL-NOSE ENDMILL)`,
      `S5400 M03 (SPINDLE CW 5400 RPM)`,
      `G00 X0.0 Y0.0 Z25.0 M08`,
      `G01 Z-${telemetry.th}.0 F480.0 (ROUGH POCKET PASS)`,
      `G02 I${(telemetry.id / 2).toFixed(1)} J0.0 F720.0 (BORE Ø${telemetry.id}MM)`,
      `G03 I${(telemetry.od / 2).toFixed(1)} J0.0 F880.0 (CONTOUR N=${telemetry.cnt})`,
      `G00 Z50.0 M09`,
      `M30 (PROGRAM END)`,
    ];
  }, [selectedPreset, telemetry]);

  useEffect(() => {
    if (!cncRunning) return;
    const interval = window.setInterval(() => {
      setActiveGcodeLine((prev) => (prev + 1) % gcodeLines.length);
    }, 600);
    return () => window.clearInterval(interval);
  }, [cncRunning, gcodeLines.length]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.localClippingEnabled = true;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      600
    );
    camera.position.set(0, -155, 175);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xe0f2fe, 0x09111e, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 3.6);
    key.position.set(85, -95, 145);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xf5c542, 2.3);
    rim.position.set(-95, 85, 95);
    scene.add(rim);

    const grid = new THREE.GridHelper(260, 26, 0x263c5a, 0x162438);
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -24;
    scene.add(grid);

    const clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
    const assemblyGroup = new THREE.Group();
    scene.add(assemblyGroup);

    // CNC End-Mill Tool
    const toolGroup = new THREE.Group();
    const cutter = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 3.2, 28, 20),
      new THREE.MeshStandardMaterial({ color: 0xf5c542, metalness: 0.9, roughness: 0.15 })
    );
    cutter.rotation.x = Math.PI / 2;
    cutter.position.z = 14;
    const holder = new THREE.Mesh(
      new THREE.CylinderGeometry(8.5, 5.2, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.3 })
    );
    holder.rotation.x = Math.PI / 2;
    holder.position.z = 38;
    toolGroup.add(cutter, holder);
    toolGroup.visible = false;
    assemblyGroup.add(toolGroup);

    const pathRing = new THREE.Mesh(
      new THREE.RingGeometry(42, 43.5, 72),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
    );
    pathRing.visible = false;
    assemblyGroup.add(pathRing);

    let partMesh: THREE.Mesh | null = null;

    const rebuildMesh = (detail: {
      preset: CadPartPreset;
      od: number;
      id: number;
      th: number;
      cnt: number;
      hd: number;
      bevel: number;
    }) => {
      if (partMesh) {
        assemblyGroup.remove(partMesh);
        partMesh.geometry.dispose();
        (partMesh.material as THREE.Material).dispose();
      }

      const geo = buildPartGeometry(detail.preset, {
        od: detail.od,
        id: detail.id,
        th: detail.th,
        count: detail.cnt,
        hole: detail.hd,
        bevel: detail.bevel,
      });

      // FEA Stress Vertex Colors
      const posAttr = geo.attributes.position;
      const colors = new Float32Array(posAttr.count * 3);
      const col = new THREE.Color();
      const outerR = detail.od / 2;
      const innerR = detail.id / 2;
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vy = posAttr.getY(i);
        const r = Math.hypot(vx, vy);
        const norm = THREE.MathUtils.clamp(1 - (r - innerR) / Math.max(1, outerR - innerR), 0, 1);
        col.setHSL((1 - norm) * 0.65, 0.9, 0.52);
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      currentGeoRef.current = geo;

      const mat = new THREE.MeshStandardMaterial({
        color: 0xdbeafe,
        metalness: 0.86,
        roughness: 0.24,
        side: THREE.DoubleSide,
      });

      partMesh = new THREE.Mesh(geo, mat);
      assemblyGroup.add(partMesh);

      const pcdR = (detail.od + detail.id) / 4;
      pathRing.geometry.dispose();
      pathRing.geometry = new THREE.RingGeometry(pcdR - 0.7, pcdR + 0.7, 72);
      pathRing.position.z = detail.th / 2 + 1.2;
    };

    const onRebuildEvt = (e: Event) => rebuildMesh((e as CustomEvent).detail);
    const onCamEvt = (e: Event) => {
      const view = (e as CustomEvent).detail as string;
      assemblyGroup.rotation.set(0, 0, 0);
      if (view === "iso") camera.position.set(0, -155, 175);
      if (view === "top") camera.position.set(0, -0.1, 225);
      if (view === "front") camera.position.set(0, -225, 15);
      camera.lookAt(0, 0, 0);
    };

    window.addEventListener("r2g-rebuild-part", onRebuildEvt);
    window.addEventListener("r2g-cam-preset", onCamEvt);

    rebuildMesh({
      preset: selectedPreset,
      od: telemetry.od,
      id: telemetry.id,
      th: telemetry.th,
      cnt: telemetry.cnt,
      hd: telemetry.hd,
      bevel: bevelSize[0] ?? 1.2,
    });

    let animId = 0;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let toolAngle = 0;

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const { viewMode: vm, sectionCut: cut, cncRunning: cnc, autoSpin: spin } = simRef.current;

      if (partMesh) {
        const mat = partMesh.material as THREE.MeshStandardMaterial;
        mat.wireframe = vm === "wireframe";
        mat.vertexColors = vm === "fea";
        if (vm === "gold") mat.color.setHex(0xf5c542);
        else if (vm === "titanium") mat.color.setHex(0x7dd3fc);
        else mat.color.setHex(0xdbeafe);

        mat.metalness = vm === "fea" ? 0.15 : 0.88;
        mat.roughness = vm === "fea" ? 0.58 : 0.22;
        mat.clippingPlanes = cut ? [clipPlane] : [];
        mat.needsUpdate = true;
      }

      toolGroup.visible = cnc;
      pathRing.visible = cnc;

      if (cnc) {
        toolAngle += 0.05;
        const pcdR = ((outerDia[0] ?? 130) + (boreDia[0] ?? 34)) / 4;
        toolGroup.position.set(
          Math.cos(toolAngle) * pcdR,
          Math.sin(toolAngle) * pcdR,
          (thickness[0] ?? 20) / 2 + Math.sin(toolAngle * 6) * 2
        );
        cutter.rotation.y += 0.35;
      } else if (spin && !isDragging) {
        assemblyGroup.rotation.z += 0.0045;
      }

      renderer.render(scene, camera);
    };
    renderLoop();

    const onDown = (e: PointerEvent<HTMLDivElement>) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMove = (e: PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      assemblyGroup.rotation.z += (e.clientX - prevX) * 0.01;
      assemblyGroup.rotation.x += (e.clientY - prevY) * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onUp = () => {
      isDragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.12, 75, 310);
    };

    const resizeObs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(1, entry.contentRect.width);
        const h = Math.max(1, entry.contentRect.height);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }
    });
    resizeObs.observe(container);

    container.addEventListener("pointerdown", onDown as unknown as EventListener);
    container.addEventListener("pointermove", onMove as unknown as EventListener);
    container.addEventListener("pointerup", onUp);
    container.addEventListener("pointerleave", onUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animId);
      resizeObs.disconnect();
      window.removeEventListener("r2g-rebuild-part", onRebuildEvt);
      window.removeEventListener("r2g-cam-preset", onCamEvt);
      container.removeEventListener("pointerdown", onDown as unknown as EventListener);
      container.removeEventListener("pointermove", onMove as unknown as EventListener);
      container.removeEventListener("pointerup", onUp);
      container.removeEventListener("pointerleave", onUp);
      container.removeEventListener("wheel", onWheel);
      renderer.dispose();
      container.replaceChildren();
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("r2g-rebuild-part", {
        detail: {
          preset: selectedPreset,
          od: telemetry.od,
          id: telemetry.id,
          th: telemetry.th,
          cnt: telemetry.cnt,
          hd: telemetry.hd,
          bevel: bevelSize[0] ?? 1.2,
        },
      })
    );
  }, [selectedPreset, telemetry, bevelSize]);

  function handleDownloadStl() {
    if (!currentGeoRef.current) return;
    const stlText = exportGeometryToAsciiStl(
      currentGeoRef.current,
      `${selectedPreset.code}_${selectedPreset.id}`
    );
    const blob = new Blob([stlText], { type: "application/sla" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedPreset.code}-${selectedPreset.id}-OD${telemetry.od}mm.stl`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${selectedPreset.name} (.STL) for 3D Printing!`);
  }

  const filteredPresets =
    categoryFilter === "All"
      ? CAD_PRESETS
      : CAD_PRESETS.filter((p) => p.category === categoryFilter);

  return (
    <main className="r2g-site relative z-10 min-h-screen text-slate-100">
      <Toaster position="top-right" richColors />
      <Navbar />

      <div className="site-container py-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-amber-400 hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home Studio
            </Link>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              20-Part Interactive <span className="text-amber-400">3D CAD &amp; CNC Studio</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Pick any of the <strong>20 industrial CAD models</strong>, modify geometry live, run FEA stress &amp; CNC G-Code simulations, or export a printable <strong>.STL</strong>.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button className="gold-button" onClick={handleDownloadStl}>
              <Download className="mr-1.5 h-4 w-4" /> Download .STL File
            </Button>
            <Button variant="outline" className="border-slate-700" asChild>
              <Link to="/printing">Print in Lab (₹{telemetry.estPrintCost}) →</Link>
            </Button>
          </div>
        </div>

        {/* 20-MODEL INTERACTIVE GALLERY STRIP */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-[#08101e]/95 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400">
              <Sparkles className="h-4 w-4" /> SELECT FROM 20 PARAMETRIC CAD DESIGNS ({CAD_PRESETS.length} MODELS)
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {["All", "Automotive", "Aerospace", "Robotics", "Tooling"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    categoryFilter === cat
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {filteredPresets.map((item) => {
              const active = selectedPreset.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectPreset(item)}
                  className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition ${
                    active
                      ? "border-amber-400 bg-amber-400/15 shadow-md shadow-amber-500/10"
                      : "border-slate-800/90 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex w-full items-center justify-between font-mono text-[10px]">
                    <span className={active ? "font-bold text-amber-300" : "text-slate-500"}>
                      {item.code}
                    </span>
                    <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[9px] text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <span
                    className={`mt-1 line-clamp-1 text-xs font-semibold ${
                      active ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN CAD WORKBENCH: LEFT PARAMETERS + RIGHT 3D VIEWPORT */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* LEFT 4 COLS: Parametric Feature Tree */}
          <div className="space-y-5 rounded-2xl border border-slate-800 bg-[#08101e]/95 p-6 lg:col-span-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-[10px] text-amber-400">{selectedPreset.code} · ACTIVE PART</span>
                <h2 className="text-sm font-bold text-white">{selectedPreset.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPreset(selectedPreset)}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-slate-400">OUTER ENVELOPE DIAMETER</span>
                  <b className="font-mono text-amber-300">{telemetry.od} mm</b>
                </div>
                <Slider value={outerDia} min={80} max={190} step={2} onValueChange={setOuterDia} />
              </div>

              <div>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-slate-400">CENTER SHAFT BORE (H7)</span>
                  <b className="font-mono text-amber-300">{telemetry.id} mm</b>
                </div>
                <Slider value={boreDia} min={16} max={110} step={2} onValueChange={setBoreDia} />
              </div>

              <div>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-slate-400">EXTRUSION DEPTH / HEIGHT</span>
                  <b className="font-mono text-amber-300">{telemetry.th} mm</b>
                </div>
                <Slider value={thickness} min={8} max={44} step={1} onValueChange={setThickness} />
              </div>

              <div>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-slate-400">{selectedPreset.countLabel}</span>
                  <b className="font-mono text-sky-300">{telemetry.cnt}</b>
                </div>
                <Slider value={featureCount} min={3} max={28} step={1} onValueChange={setFeatureCount} />
              </div>

              <div>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-slate-400">SECONDARY HOLE / WIRE SIZE</span>
                  <b className="font-mono text-sky-300">Ø{telemetry.hd} mm</b>
                </div>
                <Slider value={holeDia} min={4} max={20} step={1} onValueChange={setHoleDia} />
              </div>

              <div>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-slate-400">EDGE CHAMFER / BEVEL</span>
                  <b className="font-mono text-slate-200">{bevelSize[0]} mm</b>
                </div>
                <Slider value={bevelSize} min={0} max={3.5} step={0.5} onValueChange={setBevelSize} />
              </div>
            </div>

            {/* Live Engineering Telemetry */}
            <div className="grid grid-cols-2 gap-2.5 border-t border-slate-800 pt-4 text-xs">
              <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
                <span className="block text-[10px] text-slate-400">AISI 1045 MASS</span>
                <b className="font-mono text-base text-white">{telemetry.steelMassGrams} g</b>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
                <span className="block text-[10px] text-slate-400">SOLID VOLUME</span>
                <b className="font-mono text-base text-amber-300">{telemetry.volumeCm3} cm³</b>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
                <span className="block text-[10px] text-slate-400">MAX VON MISES</span>
                <b className="font-mono text-base text-sky-300">{telemetry.maxStressMpa} MPa</b>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
                <span className="block text-[10px] text-slate-400">3D PRINT ESTIMATE</span>
                <b className="font-mono text-base text-emerald-400">₹{telemetry.estPrintCost}</b>
              </div>
            </div>
          </div>

          {/* RIGHT 8 COLS: 3D Viewport + Live Fanuc CNC Console */}
          <div className="space-y-4 lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#060d18]">
              {/* Top Viewport Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-[#0a1426] px-4 py-2.5 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      ["steel", "CNC Steel"],
                      ["gold", "Brass"],
                      ["titanium", "Titanium"],
                      ["fea", "FEA Stress"],
                      ["wireframe", "Mesh"],
                    ] as const
                  ).map(([mode, label]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                        viewMode === mode
                          ? "bg-amber-400 text-slate-950"
                          : "bg-slate-900 text-slate-300 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(["iso", "top", "front"] as const).map((cam) => (
                    <button
                      key={cam}
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent("r2g-cam-preset", { detail: cam }))}
                      className="rounded border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-[10px] uppercase text-slate-300 hover:border-amber-400"
                    >
                      {cam}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setSectionCut((v) => !v)}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 font-semibold transition ${
                      sectionCut
                        ? "border-sky-400 bg-sky-400/20 text-sky-300"
                        : "border-slate-700 bg-slate-900 text-slate-300"
                    }`}
                  >
                    <Scissors className="h-3.5 w-3.5" /> Cutaway
                  </button>

                  <button
                    type="button"
                    onClick={() => setCncRunning((v) => !v)}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 font-bold transition ${
                      cncRunning
                        ? "bg-rose-500 text-white"
                        : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    }`}
                  >
                    {cncRunning ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    {cncRunning ? "Stop CNC" : "Run CNC"}
                  </button>
                </div>
              </div>

              {/* 3D Interactive Canvas */}
              <div className="relative h-[410px] w-full">
                <div
                  ref={mountRef}
                  className="h-full w-full cursor-grab active:cursor-grabbing"
                />

                <div className="pointer-events-none absolute top-3 left-3 font-mono text-[10px] text-slate-400">
                  <span className="block font-bold text-amber-300">
                    {selectedPreset.code} // {selectedPreset.name.toUpperCase()}
                  </span>
                  <span>DRAG TO ORBIT · SCROLL TO ZOOM</span>
                </div>

                <button
                  type="button"
                  onClick={() => setAutoSpin((v) => !v)}
                  className="absolute top-3 right-3 rounded border border-slate-800 bg-slate-950/80 px-2.5 py-1 font-mono text-[10px] text-slate-300 hover:border-amber-400"
                >
                  {autoSpin ? "AUTO-SPIN: ON" : "AUTO-SPIN: OFF"}
                </button>

                {viewMode === "fea" && (
                  <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-2 text-[10px]">
                    <span className="block font-mono font-bold text-white">VON MISES STRESS (MPa)</span>
                    <div className="mt-1 h-2 w-36 rounded bg-gradient-to-r from-blue-500 via-emerald-400 via-yellow-400 to-rose-500" />
                    <div className="mt-0.5 flex justify-between font-mono text-slate-400">
                      <span>12 MPa</span>
                      <span>{telemetry.maxStressMpa} MPa</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Fanuc CNC G-Code Execution Console */}
            <div className="rounded-2xl border border-slate-800 bg-[#070e1b] p-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                <span className="flex items-center gap-2 font-mono font-bold text-emerald-400">
                  <Terminal className="h-4 w-4" /> LIVE FANUC 3-AXIS G-CODE POST-PROCESSOR
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  {cncRunning ? "● EXECUTING TOOLPATH..." : "READY · CLICK 'RUN CNC'"}
                </span>
              </div>
              <div className="mt-2.5 grid gap-1 font-mono text-[11px] sm:grid-cols-2">
                {gcodeLines.map((line, idx) => (
                  <div
                    key={line}
                    className={`rounded px-2.5 py-1 transition ${
                      cncRunning && activeGcodeLine === idx
                        ? "bg-emerald-500/20 font-bold text-emerald-300 ring-1 ring-emerald-500/40"
                        : "text-slate-400"
                    }`}
                  >
                    <span className="mr-2 text-slate-600">N{(idx + 1) * 10}</span>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}