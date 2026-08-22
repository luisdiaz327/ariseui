"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Particle = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
};

export type ParticleTextProps = {
  text?: string;
  fontSize?: number;
  particleSize?: number;
  particleGap?: number;
  repelRadius?: number;
  repelStrength?: number;
  returnSpeed?: number;
  damping?: number;
  color?: string;
  className?: string;
};

export default function ParticleText({
  text = "Hello",
  fontSize = 120,
  particleSize = 3,
  particleGap = 5,
  repelRadius = 120,
  repelStrength = 7,
  returnSpeed = 0.1,
  damping = 0.84,
  color,
  className,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    particles: Particle[];
    color: string;
    mouse: { x: number; y: number };
    raf: number;
  }>({
    particles: [],
    color: "#ffffff",
    mouse: { x: -9999, y: -9999 },
    raf: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const state = stateRef.current;

    function resolveColor(): string {
      if (color) return color;
      // read the CSS foreground token and convert to a usable color
      const raw = getComputedStyle(container!).color;
      return raw || "#ffffff";
    }

    function buildParticles() {
      if (!canvas || !ctx) return;
      const w = container!.offsetWidth;
      const h = container!.offsetHeight;
      canvas.width = w;
      canvas.height = h;

      const particleColor = resolveColor();
      state.color = particleColor;

      // draw text off-screen first to sample pixels
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = particleColor;
      // scale font to fit width
      let fs = fontSize;
      ctx.font = `bold ${fs}px sans-serif`;
      let measured = ctx.measureText(text).width;
      if (measured > w * 0.9) {
        fs = Math.floor(fs * (w * 0.9) / measured);
        ctx.font = `bold ${fs}px sans-serif`;
        measured = ctx.measureText(text).width;
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, w / 2, h / 2);

      const { data } = ctx.getImageData(0, 0, w, h);
      const particles: Particle[] = [];

      for (let y = 0; y < h; y += particleGap) {
        for (let x = 0; x < w; x += particleGap) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            particles.push({
              x: Math.random() * w,
              y: Math.random() * h,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
            });
          }
        }
      }
      state.particles = particles;
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { mouse, particles, color: col } = state;
      ctx.fillStyle = col;

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          p.vx -= (dx / dist) * force * repelStrength;
          p.vy -= (dy / dist) * force * repelStrength;
        }

        p.vx += (p.originX - p.x) * returnSpeed;
        p.vy += (p.originY - p.y) * returnSpeed;
        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillRect(p.x, p.y, particleSize, particleSize);
      }

      state.raf = requestAnimationFrame(animate);
    }

    buildParticles();
    animate();

    const ro = new ResizeObserver(buildParticles);
    ro.observe(container);

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      state.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onLeave() {
      state.mouse = { x: -9999, y: -9999 };
    }

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(state.raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [text, fontSize, particleSize, particleGap, repelRadius, repelStrength, returnSpeed, damping, color]);

  return (
    <div
      ref={containerRef}
      data-slot="particle-text"
      className={cn("relative h-full w-full", className)}
    >
      <canvas ref={canvasRef} className="block h-full w-full cursor-none" />
    </div>
  );
}
