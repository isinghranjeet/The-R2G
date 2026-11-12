import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  Cpu,
  Gauge,
  Layers,
  Minus,
  Play,
  RotateCcw,
} from "lucide-react";
import * as THREE from "three";

type ModelPreset = "planetary" | "turbine" | "rotor";
type DisplayStyle = "steel" | "gold" | "xray" | "wireframe";

function createSpurGearMesh(
  teeth: number,
  rootRadius: number,
  toothRadius: number,
  thickness: number,
  boreRadius: number,
  color: number,
  metalness = 0.85,
  roughness = 0.25
) {
  const shape = new THREE.Shape();
  for (let i = 0; i < teeth * 4; i++) {
    const idx = Math.floor(i / 4);
    const t = i % 4;
    const r = t === 0 || t === 3 ? rootRadius : toothRadius;
    const angle = ((idx + t * 0.25) / teeth) * Math.PI * 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  if (boreRadius > 0) {
    const hole = new THREE.Path();
    hole.absarc(0, 0, boreRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  });
  geo.center();

  const mat = new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness,
  });

  return new THREE.Mesh(geo, mat);
}

export default function CadViewer() {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Default opens in Planetary Gear + Mesh (Wireframe) + 18% Exploded View
  const [preset, setPreset] = useState<ModelPreset>("planetary");
  const [styleMode, setStyleMode] = useState<DisplayStyle>("wireframe");
  const [rotating, setRotating] = useState(true);
  const [explode, setExplode] = useState(18);
  const [rpmSpeed, setRpmSpeed] = useState(1);
  const [zoom, setZoom] = useState(9.2);
  const [rotation, setRotation] = useState<[number, number]>([-0.38, 0.45]);

  const stateRef = useRef({
    preset,
    styleMode,
    rotating,
    explode,
    rpmSpeed,
    zoom,
  });

  useEffect(() => {
    stateRef.current = { preset, styleMode, rotating, explode, rpmSpeed, zoom };
  }, [preset, styleMode, rotating, explode, rpmSpeed, zoom]);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, stateRef.current.zoom);
    camera.lookAt(0, 0, 0);

    // Studio CAD Three-Point Lighting
    scene.add(new THREE.HemisphereLight(0xdbeafe, 0x0b1324, 1.8));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.6);
    keyLight.position.set(6, 8, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf5c542, 2.2);
    rimLight.position.set(-7, -5, 6);
    scene.add(rimLight);

    const coolFill = new THREE.PointLight(0x38bdf8, 18, 25);
    coolFill.position.set(0, 6, -6);
    scene.add(coolFill);

    // Subtle CAD Reference Grid Behind Assembly
    const grid = new THREE.GridHelper(14, 24, 0x263c5a, 0x162438);
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -2.2;
    scene.add(grid);

    // Root Assembly Group (Centered at 0,0,0)
    const rootGroup = new THREE.Group();
    rootGroup.rotation.set(-0.38, 0.45, 0);
    scene.add(rootGroup);

    // --- 1. PLANETARY GEARBOX ASSEMBLY ---
    const planetaryGroup = new THREE.Group();
    const sunGear = createSpurGearMesh(12, 0.72, 0.92, 0.55, 0.3, 0xf5c542, 0.88, 0.22);
    planetaryGroup.add(sunGear);

    const carrierGroup = new THREE.Group();
    const planetGears: THREE.Mesh[] = [];
    const planetPins: THREE.Mesh[] = [];
    const orbitRadius = 1.62;

    for (let i = 0; i < 3; i++) {
      const ang = (i * Math.PI * 2) / 3;
      const pGear = createSpurGearMesh(10, 0.58, 0.75, 0.5, 0.18, 0xcbd5e1, 0.85, 0.25);
      pGear.position.set(Math.cos(ang) * orbitRadius, Math.sin(ang) * orbitRadius, 0);
      carrierGroup.add(pGear);
      planetGears.push(pGear);

      const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.95, 24),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 })
      );
      pin.rotation.x = Math.PI / 2;
      pin.position.set(Math.cos(ang) * orbitRadius, Math.sin(ang) * orbitRadius, 0);
      carrierGroup.add(pin);
      planetPins.push(pin);
    }

    // Back Carrier Ring Plate
    const carrierRing = new THREE.Mesh(
      new THREE.RingGeometry(0.75, 1.95, 48),
      new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.8,
        roughness: 0.35,
        side: THREE.DoubleSide,
      })
    );
    carrierRing.position.z = -0.45;
    carrierGroup.add(carrierRing);
    planetaryGroup.add(carrierGroup);

    // Outer Annulus Ring Housing
    const outerRingShape = new THREE.Shape();
    outerRingShape.absarc(0, 0, 2.75, 0, Math.PI * 2, false);
    const outerHole = new THREE.Path();
    outerHole.absarc(0, 0, 2.38, 0, Math.PI * 2, true);
    outerRingShape.holes.push(outerHole);

    const outerRingMesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(outerRingShape, {
        depth: 0.62,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.05,
        bevelThickness: 0.05,
      }),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.28 })
    );
    outerRingMesh.geometry.center();
    planetaryGroup.add(outerRingMesh);
    rootGroup.add(planetaryGroup);

    // --- 2. TURBINE IMPELLER ASSEMBLY ---
    const turbineGroup = new THREE.Group();
    const hubCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.85, 1.6, 36),
      new THREE.MeshStandardMaterial({ color: 0xf5c542, metalness: 0.88, roughness: 0.2 })
    );
    hubCone.rotation.x = Math.PI / 2;
    turbineGroup.add(hubCone);

    const backDisk = new THREE.Mesh(
      new THREE.CylinderGeometry(2.35, 2.35, 0.22, 48),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.3 })
    );
    backDisk.rotation.x = Math.PI / 2;
    backDisk.position.z = -0.45;
    turbineGroup.add(backDisk);

    const blades: THREE.Mesh[] = [];
    for (let i = 0; i < 12; i++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 1.55, 0.65),
        new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.85, roughness: 0.22 })
      );
      const ang = (i * Math.PI * 2) / 12;
      blade.position.set(Math.cos(ang) * 1.35, Math.sin(ang) * 1.35, 0);
      blade.rotation.z = ang + Math.PI / 2;
      blade.rotation.y = 0.45;
      turbineGroup.add(blade);
      blades.push(blade);
    }
    turbineGroup.visible = false;
    rootGroup.add(turbineGroup);

    // --- 3. VENTILATED BRAKE ROTOR ASSEMBLY ---
    const rotorGroup = new THREE.Group();
    const discShape = new THREE.Shape();
    discShape.absarc(0, 0, 2.55, 0, Math.PI * 2, false);
    const discCenterHole = new THREE.Path();
    discCenterHole.absarc(0, 0, 0.85, 0, Math.PI * 2, true);
    discShape.holes.push(discCenterHole);

    for (let r = 1.25; r <= 2.15; r += 0.42) {
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI * 2) / 16 + r;
        const drill = new THREE.Path();
        drill.absarc(Math.cos(a) * r, Math.sin(a) * r, 0.065, 0, Math.PI * 2, true);
        discShape.holes.push(drill);
      }
    }

    const rotorDisc = new THREE.Mesh(
      new THREE.ExtrudeGeometry(discShape, {
        depth: 0.28,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.03,
        bevelThickness: 0.03,
      }),
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.22 })
    );
    rotorDisc.geometry.center();
    rotorGroup.add(rotorDisc);

    const rotorHat = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.15, 0.65, 36),
      new THREE.MeshStandardMaterial({ color: 0xf5c542, metalness: 0.85, roughness: 0.25 })
    );
    rotorHat.rotation.x = Math.PI / 2;
    rotorHat.position.z = 0.35;
    rotorGroup.add(rotorHat);
    rotorGroup.visible = false;
    rootGroup.add(rotorGroup);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(1, entry.contentRect.width);
        const h = Math.max(1, entry.contentRect.height);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }
    });
    resizeObserver.observe(container);

    let frame = 0;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const applyMaterialStyle = (group: THREE.Object3D, style: DisplayStyle) => {
      group.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.wireframe = style === "wireframe";
          if (style === "xray") {
            child.material.transparent = true;
            child.material.opacity = 0.38;
            child.material.color.setHex(0x38bdf8);
          } else if (style === "gold") {
            child.material.transparent = false;
            child.material.opacity = 1;
            child.material.color.setHex(0xf5c542);
          } else {
            child.material.transparent = false;
            child.material.opacity = 1;
          }
        }
      });
    };

    const renderLoop = () => {
      frame = requestAnimationFrame(renderLoop);
      const st = stateRef.current;

      planetaryGroup.visible = st.preset === "planetary";
      turbineGroup.visible = st.preset === "turbine";
      rotorGroup.visible = st.preset === "rotor";

      camera.position.z = THREE.MathUtils.lerp(camera.position.z, st.zoom, 0.12);

      const exp = st.explode / 100;
      sunGear.position.z = exp * 1.15;
      outerRingMesh.position.z = -exp * 0.95;
      carrierRing.position.z = -0.45 - exp * 1.35;
      planetPins.forEach((pin) => {
        pin.position.z = exp * 0.55;
      });
      hubCone.position.z = exp * 1.1;
      backDisk.position.z = -0.45 - exp * 0.9;
      rotorHat.position.z = 0.35 + exp * 1.1;

      if (st.styleMode === "xray" || st.styleMode === "wireframe" || st.styleMode === "gold") {
        applyMaterialStyle(rootGroup, st.styleMode);
      } else {
        rootGroup.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.wireframe = false;
            child.material.transparent = false;
            child.material.opacity = 1;
          }
        });
        sunGear.material.color.setHex(0xf5c542);
        outerRingMesh.material.color.setHex(0x94a3b8);
        planetGears.forEach((g) => g.material.color.setHex(0xcbd5e1));
        hubCone.material.color.setHex(0xf5c542);
        rotorHat.material.color.setHex(0xf5c542);
        rotorDisc.material.color.setHex(0xcbd5e1);
      }

      if (st.rotating) {
        const delta = 0.014 * st.rpmSpeed;
        sunGear.rotation.z -= delta * 1.8;
        carrierGroup.rotation.z += delta * 0.55;
        planetGears.forEach((g) => {
          g.rotation.z += delta * 1.4;
        });
        turbineGroup.rotation.z += delta * 1.2;
        rotorGroup.rotation.z -= delta * 0.9;
      }

      renderer.render(scene, camera);
    };
    renderLoop();

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      container.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      rootGroup.rotation.y += (e.clientX - prevX) * 0.01;
      rootGroup.rotation.x += (e.clientY - prevY) * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
      setRotation([rootGroup.rotation.x, rootGroup.rotation.y]);
    };
    const onPointerUp = () => {
      isDragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const nextZoom = THREE.MathUtils.clamp(stateRef.current.zoom + e.deltaY * 0.01, 5.5, 16);
      setZoom(nextZoom);
    };

    const onResetEvent = () => {
      rootGroup.rotation.set(-0.38, 0.45, 0);
      setRotation([-0.38, 0.45]);
      setZoom(9.2);
      setExplode(18);
      setStyleMode("wireframe");
    };

    container.addEventListener("pointerdown", onPointerDown as unknown as EventListener);
    container.addEventListener("pointermove", onPointerMove as unknown as EventListener);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("r2g-reset-cad-view", onResetEvent);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("r2g-reset-cad-view", onResetEvent);
      container.removeEventListener("pointerdown", onPointerDown as unknown as EventListener);
      container.removeEventListener("pointermove", onPointerMove as unknown as EventListener);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerUp);
      container.removeEventListener("wheel", onWheel);
      renderer.dispose();
      container.replaceChildren();
    };
  }, []);

  return (
    <div className="relative flex flex-col bg-[#060d18]">
      {/* Top Assembly & Material Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-[#091324] px-3 py-2 text-[11px]">
        <div className="flex items-center gap-1">
          {(
            [
              ["planetary", "Planetary Gear"],
              ["turbine", "Turbine Rotor"],
              ["rotor", "Brake Disc"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPreset(id)}
              className={`rounded px-2.5 py-1 font-semibold transition ${
                preset === id
                  ? "bg-amber-400 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {(
            [
              ["steel", "Steel"],
              ["gold", "Brass"],
              ["xray", "X-Ray"],
              ["wireframe", "Mesh"],
            ] as const
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setStyleMode(mode)}
              className={`rounded border px-2 py-0.5 font-mono text-[10px] transition ${
                styleMode === mode
                  ? "border-sky-400 bg-sky-400/20 text-sky-300"
                  : "border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Centered 3D Canvas Stage */}
      <div className="relative h-[370px] w-full overflow-hidden">
        <div
          ref={canvasRef}
          className="h-full w-full cursor-grab active:cursor-grabbing"
          aria-label="Interactive 3D CAD Digital Twin Viewport"
        />

        {/* Corner HUD Overlays */}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1 font-mono text-[10px] text-slate-400">
          <span className="inline-flex items-center gap-1.5 text-emerald-400">
            <Cpu className="h-3 w-3" /> KINEMATICS ACTIVE · {rpmSpeed}x
          </span>
          <span>TOLERANCE: ISO 286 H7/g6</span>
        </div>

        <div className="pointer-events-none absolute top-3 right-3 rounded border border-slate-800 bg-slate-950/70 px-2 py-1 font-mono text-[10px] text-amber-300">
          DRAG TO ORBIT · SCROLL TO ZOOM
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] text-slate-500">
          ROT [{rotation[0].toFixed(2)}, {rotation[1].toFixed(2)}] · ZOOM {zoom.toFixed(1)}
        </div>
      </div>

      {/* Bottom Interactive CAD Controls: Exploded View + RPM + Play/Reset */}
      <div className="grid gap-3 border-t border-slate-800/80 bg-[#091324] px-4 py-3 text-xs sm:grid-cols-12 sm:items-center">
        {/* Exploded View Slider */}
        <div className="flex items-center gap-2.5 sm:col-span-5">
          <Layers className="h-3.5 w-3.5 shrink-0 text-amber-400" />
          <span className="shrink-0 font-mono text-[10px] text-slate-300">EXPLODE</span>
          <input
            type="range"
            min={0}
            max={100}
            value={explode}
            onChange={(e) => setExplode(Number(e.target.value))}
            aria-label="Exploded view percentage"
            className="h-1.5 w-full accent-amber-400"
          />
          <span className="w-8 text-right font-mono text-[10px] text-amber-300">{explode}%</span>
        </div>

        {/* Speed / RPM Control */}
        <div className="flex items-center gap-2 sm:col-span-4">
          <Gauge className="h-3.5 w-3.5 shrink-0 text-sky-400" />
          <span className="font-mono text-[10px] text-slate-300">RPM</span>
          {[0.5, 1, 2.5].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => setRpmSpeed(spd)}
              className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                rpmSpeed === spd
                  ? "bg-sky-400/20 text-sky-300 ring-1 ring-sky-400/50"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Play/Pause & Reset */}
        <div className="flex items-center justify-end gap-1.5 sm:col-span-3">
          <button
            type="button"
            onClick={() => setRotating((v) => !v)}
            className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-200 hover:border-amber-400"
          >
            {rotating ? <Minus className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {rotating ? "Pause" : "Spin"}
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("r2g-reset-cad-view"))}
            className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-200 hover:border-amber-400"
            title="Reset Camera & Explode"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}