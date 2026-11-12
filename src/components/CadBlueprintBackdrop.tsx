import { useEffect, useRef } from "react";

export function CadBlueprintBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: -9999, y: -9999, active: false };

    const nodeCount = Math.min(42, Math.floor((width * height) / 32000));
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      isGold: i % 4 === 0,
    }));

    let angle = 0;

    const drawGearOutline = (
      cx: number,
      cy: number,
      radius: number,
      teeth: number,
      rot: number,
      stroke: string
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;

      ctx.beginPath();
      for (let i = 0; i < teeth * 4; i++) {
        const idx = Math.floor(i / 4);
        const step = i % 4;
        const r = step === 0 || step === 3 ? radius * 0.88 : radius;
        const a = ((idx + step * 0.25) / teeth) * Math.PI * 2;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.36, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      angle += 0.0015;

      drawGearOutline(width * 0.12, height * 0.22, 85, 16, angle, "rgba(245, 197, 66, 0.055)");
      drawGearOutline(
        width * 0.12 + 136,
        height * 0.22 + 44,
        55,
        12,
        -angle * 1.33,
        "rgba(56, 189, 248, 0.05)"
      );
      drawGearOutline(width * 0.88, height * 0.82, 105, 18, -angle * 0.8, "rgba(245, 197, 66, 0.05)");

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]!;
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j]!;
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          if (dist < 145) {
            ctx.strokeStyle = `rgba(148, 163, 184, ${(1 - dist / 145) * 0.09})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        if (mouse.active) {
          const mDist = Math.hypot(mouse.x - n.x, mouse.y - n.y);
          if (mDist < 170) {
            ctx.strokeStyle = `rgba(245, 197, 66, ${(1 - mDist / 170) * 0.32})`;
            ctx.lineWidth = 0.95;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = n.isGold ? "rgba(245, 197, 66, 0.42)" : "rgba(56, 189, 248, 0.35)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.isGold ? 2.1 : 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      if (mouse.active) {
        ctx.strokeStyle = "rgba(245, 197, 66, 0.22)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(mouse.x - 14, mouse.y);
        ctx.lineTo(mouse.x + 14, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 14);
        ctx.lineTo(mouse.x, mouse.y + 14);
        ctx.stroke();

        ctx.fillStyle = "rgba(245, 197, 66, 0.45)";
        ctx.font = "10px monospace";
        ctx.fillText(`X:${Math.round(mouse.x)} Y:${Math.round(mouse.y)}`, mouse.x + 10, mouse.y - 8);
      }
    };

    render();

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] h-screen w-screen"
    />
  );
}

export default CadBlueprintBackdrop;