import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Box,
  CheckCircle2,
  Cuboid,
  FileBox,
  Layers,
  Minus,
  Play,
  Printer,
  RotateCcw,
  Scale,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { isValidMobile } from "@/lib/r2g-demo-logic";

export const Route = createFileRoute("/printing")({
  component: PrintingServicePage,
  head: () => ({
    meta: [
      { title: "3D Printing & Live STL Viewer | R2G Learn CAD Faridabad" },
      {
        name: "description",
        content:
          "Upload your .STL CAD model for instant 3D visualization, volume calculation, and rapid prototyping quote in Faridabad.",
      },
    ],
  }),
});

interface MeshMetrics {
  dimensions: [number, number, number];
  volumeCm3: number;
  triangles: number;
}

const materialRates: Record<string, { density: number; ratePerGram: number; label: string }> = {
  PLA: { density: 1.24, ratePerGram: 6, label: "PLA (Standard Concept Prototype)" },
  PETG: { density: 1.27, ratePerGram: 8, label: "PETG (Functional Mechanical Part)" },
  ABS: { density: 1.04, ratePerGram: 8, label: "ABS (High-Temp Automotive Grade)" },
  "Carbon Fiber": { density: 1.35, ratePerGram: 18, label: "Carbon-Fiber Reinforced Nylon" },
  "Tough Resin": { density: 1.15, ratePerGram: 24, label: "SLA Tough Photopolymer Resin" },
};

function computeSignedVolumeOfTriangle(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3) {
  return p1.dot(new THREE.Vector3().crossVectors(p2, p3)) / 6.0;
}

function computeGeometryVolumeCm3(geometry: THREE.BufferGeometry): number {
  const pos = geometry.attributes.position;
  if (!pos) return 15;
  let sum = 0;
  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    p1.fromBufferAttribute(pos, i);
    p2.fromBufferAttribute(pos, i + 1);
    p3.fromBufferAttribute(pos, i + 2);
    sum += computeSignedVolumeOfTriangle(p1, p2, p3);
  }
  // Assuming CAD export in millimeters -> convert mm³ to cm³
  const cm3 = Math.abs(sum) / 1000;
  return cm3 > 0.1 ? Number(cm3.toFixed(2)) : 12.5;
}

function PrintingServicePage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef({ wire: false, rotating: true });

  const [wireframe, setWireframe] = useState(false);
  const [rotating, setRotating] = useState(true);
  const [fileName, setFileName] = useState("Demo_Planetary_Hub.stl");
  const [metrics, setMetrics] = useState<MeshMetrics>({
    dimensions: [84.0, 84.0, 28.5],
    volumeCm3: 24.8,
    triangles: 1420,
  });

  // Slicer & Quote Parameters
  const [material, setMaterial] = useState("PETG");
  const [infill, setInfill] = useState([30]);
  const [quantity, setQuantity] = useState(1);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  useEffect(() => {
    controlsRef.current = { wire: wireframe, rotating };
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.wireframe = wireframe;
    }
  }, [wireframe, rotating]);

  // Initialize Three.js STL Viewport
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 65, 135);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 2.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 3.2);
    dirLight.position.set(60, 100, 80);
    scene.add(dirLight);

    const grid = new THREE.GridHelper(160, 20, 0x334155, 0x1e293b);
    grid.position.y = -28;
    scene.add(grid);

    // Default Demo TorusKnot / Mechanical Hub Mesh
    const defaultGeo = new THREE.TorusKnotGeometry(24, 7, 120, 20);
    const defaultMat = new THREE.MeshStandardMaterial({
      color: 0xf5c542,
      metalness: 0.45,
      roughness: 0.3,
    });
    const initialMesh = new THREE.Mesh(defaultGeo, defaultMat);
    scene.add(initialMesh);
    meshRef.current = initialMesh;

    let animId = 0;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (meshRef.current && controlsRef.current.rotating && !isDragging) {
        meshRef.current.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onDown = (e: PointerEvent<HTMLDivElement>) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMove = (e: PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !meshRef.current) return;
      meshRef.current.rotation.y += (e.clientX - prevX) * 0.01;
      meshRef.current.rotation.x += (e.clientY - prevY) * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onUp = () => {
      isDragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.1, 45, 280);
    };

    container.addEventListener("pointerdown", onDown as unknown as EventListener);
    container.addEventListener("pointermove", onMove as unknown as EventListener);
    container.addEventListener("pointerup", onUp);
    container.addEventListener("pointerleave", onUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    // Expose loader helper on window-scoped ref via custom event
    const handleNewGeometry = (evt: Event) => {
      const custom = evt as CustomEvent<THREE.BufferGeometry>;
      const geo = custom.detail;
      if (!geo) return;

      geo.computeBoundingBox();
      geo.center();

      const bbox = geo.boundingBox!;
      const size = new THREE.Vector3();
      bbox.getSize(size);

      // Normalize scale so any STL fits nicely inside viewport
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scaleFactor = 68 / maxDim;

      if (meshRef.current) {
        scene.remove(meshRef.current);
        meshRef.current.geometry.dispose();
      }

      const newMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.4,
        roughness: 0.32,
        wireframe: controlsRef.current.wire,
      });
      const newMesh = new THREE.Mesh(geo, newMat);
      newMesh.scale.setScalar(scaleFactor);
      scene.add(newMesh);
      meshRef.current = newMesh;

      const volCm3 = computeGeometryVolumeCm3(geo);
      const triCount = Math.round((geo.attributes.position?.count ?? 0) / 3);

      setMetrics({
        dimensions: [
          Number(size.x.toFixed(1)),
          Number(size.y.toFixed(1)),
          Number(size.z.toFixed(1)),
        ],
        volumeCm3: volCm3,
        triangles: triCount,
      });
    };

    window.addEventListener("r2g-stl-loaded", handleNewGeometry);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("r2g-stl-loaded", handleNewGeometry);
      container.removeEventListener("pointerdown", onDown as unknown as EventListener);
      container.removeEventListener("pointermove", onMove as unknown as EventListener);
      container.removeEventListener("pointerup", onUp);
      container.removeEventListener("pointerleave", onUp);
      container.removeEventListener("wheel", onWheel);
      renderer.dispose();
      container.replaceChildren();
    };
  }, []);

  function handleFileUpload(file?: File) {
    if (!file) return;
    setFileName(file.name);

    if (!file.name.toLowerCase().endsWith(".stl")) {
      toast.info(`${file.name} attached! Live 3D mesh preview supports binary/ASCII .STL files.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const loader = new STLLoader();
        const geometry = loader.parse(buffer);
        window.dispatchEvent(new CustomEvent("r2g-stl-loaded", { detail: geometry }));
        toast.success(`Loaded 3D mesh: ${file.name}`);
      } catch {
        toast.error("Could not parse STL mesh. Ensure it is a valid binary or ASCII STL.");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // Real-time Mass & Cost Calculation from 3D Mesh Volume
  const matSpec = materialRates[material] ?? materialRates.PETG;
  const effectiveFillFactor = 0.25 + ((infill[0] ?? 30) / 100) * 0.75; // Shell + Infill
  const estimatedWeightGrams = Math.max(
    4,
    Math.round(metrics.volumeCm3 * matSpec.density * effectiveFillFactor)
  );
  const unitPrice = Math.max(120, estimatedWeightGrams * matSpec.ratePerGram);
  const totalOrderPrice = unitPrice * quantity;

  function handleOrderSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidMobile(clientPhone)) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }
    toast.success(
      `3D Print Order Placed! ${fileName} (${quantity}x ${material}) — Est. ₹${totalOrderPrice.toLocaleString("en-IN")}`
    );
    setClientName("");
    setClientPhone("");
  }

  return (
    <main className="r2g-site min-h-screen text-slate-100">
      <Toaster position="top-right" richColors />
      <Navbar />

      <div className="site-container py-14">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-amber-400 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow section-eyebrow">RAPID PROTOTYPING BAY · LIVE 3D SLICER</span>
            <h1 className="mt-2 text-4xl font-bold">
              Interactive <span className="text-amber-400">.STL 3D Viewer</span> &amp; Print Quote
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Upload any binary or ASCII <strong>.STL</strong> file to inspect its 3D geometry in your browser, measure bounding box dimensions, and calculate exact filament mass &amp; cost.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {/* Left 7 Cols: Live Three.js STL Viewport + Mesh Telemetry */}
          <div className="space-y-4 lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#08101e]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-[#0b1526] px-4 py-3 text-xs">
                <span className="flex items-center gap-2 font-mono text-amber-300">
                  <Cuboid className="h-4 w-4" /> {fileName}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 border-slate-700 px-2.5 text-xs"
                    onClick={() => setWireframe((v) => !v)}
                  >
                    <Box className="mr-1 h-3.5 w-3.5" /> {wireframe ? "Solid" : "Wireframe"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 border-slate-700 px-2.5 text-xs"
                    onClick={() => setRotating((v) => !v)}
                  >
                    {rotating ? <Minus className="mr-1 h-3.5 w-3.5" /> : <Play className="mr-1 h-3.5 w-3.5" />}
                    {rotating ? "Pause" : "Spin"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-slate-400"
                    onClick={() => {
                      if (meshRef.current) meshRef.current.rotation.set(0, 0, 0);
                    }}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* 3D Canvas */}
              <div
                ref={mountRef}
                className="h-[360px] w-full cursor-grab active:cursor-grabbing"
                aria-label="Interactive 3D STL Mesh Viewer"
              />

              {/* Mesh Telemetry Bar */}
              <div className="grid grid-cols-3 divide-x divide-slate-800 border-t border-slate-800 bg-slate-950/80 p-3.5 text-center text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Bounding Box (mm)</span>
                  <b className="font-mono text-white">
                    {metrics.dimensions[0]} × {metrics.dimensions[1]} × {metrics.dimensions[2]}
                  </b>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Solid Mesh Volume</span>
                  <b className="font-mono text-amber-400">{metrics.volumeCm3} cm³</b>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Mesh Triangles</span>
                  <b className="font-mono text-emerald-400">{metrics.triangles.toLocaleString()}</b>
                </div>
              </div>
            </div>

            {/* Drag & Drop File Upload Box */}
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-6 text-center transition hover:border-amber-400/60 hover:bg-slate-900/80">
              <UploadCloud className="h-8 w-8 text-amber-400" />
              <span className="mt-2 text-sm font-semibold text-white">
                Click to upload your <span className="text-amber-400">.STL</span> or .STEP CAD file
              </span>
              <span className="mt-1 text-xs text-slate-400">
                Instant client-side 3D inspection · Your IP stays 100% private in your browser
              </span>
              <input
                type="file"
                accept=".stl,.step,.stp,.obj"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
            </label>
          </div>

          {/* Right 5 Cols: Live Cost Configurator & Order Form */}
          <form
            onSubmit={handleOrderSubmit}
            className="flex flex-col justify-between space-y-5 rounded-2xl border border-slate-800 bg-slate-900/75 p-6 lg:col-span-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Configure Print &amp; Quote</h2>
                <span className="rounded bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                  Faridabad Lab
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400">ENGINEERING MATERIAL</label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                >
                  {Object.entries(materialRates).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.label} (₹{info.ratePerGram}/g)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="font-semibold text-slate-400">INFILL DENSITY</span>
                  <b className="text-amber-400">{infill[0]}%</b>
                </div>
                <Slider value={infill} min={10} max={100} step={5} onValueChange={setInfill} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400">QUANTITY (PARTS)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                  />
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-2.5 text-center">
                  <span className="block text-[10px] text-slate-400">EST. PART MASS</span>
                  <b className="text-base text-white">{estimatedWeightGrams * quantity} g</b>
                </div>
              </div>

              <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-center">
                <span className="text-xs font-semibold text-amber-200">INSTANT PROTOTYPE ESTIMATE</span>
                <b className="mt-1 block text-3xl font-bold text-white">
                  ₹{totalOrderPrice.toLocaleString("en-IN")}
                </b>
                <span className="text-[11px] text-slate-300">
                  24–48 Hr Pickup at Sector 35 Faridabad or Courier
                </span>
              </div>

              <div className="space-y-3 border-t border-slate-800 pt-4">
                <input
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Your Full Name / Company"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                />
                <input
                  required
                  type="tel"
                  maxLength={10}
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-Digit Mobile / WhatsApp"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <Button type="submit" className="gold-button w-full">
              <Printer className="mr-1.5 h-4 w-4" /> Confirm 3D Print Order
            </Button>
          </form>
        </div>
      </div>

      <SiteFooter onOpenOtp={() => toast.info("Use the Home Page footer to retrieve certificates via OTP.")} />
    </main>
  );
}