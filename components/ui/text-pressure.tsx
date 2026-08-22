"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type TextPressureProps = {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  minWeight?: number;
  maxWeight?: number;
  minScale?: number;
  maxScale?: number;
  minItalic?: number;
  maxItalic?: number;
  radius?: number;
  className?: string;
  textClassName?: string;
};

export default function TextPressure({
  text = "Pressure",
  fontFamily,
  fontUrl,
  minWeight = 100,
  maxWeight = 900,
  minScale = 0.85,
  maxScale = 1.2,
  minItalic = 0,
  maxItalic = 14,
  radius = 250,
  className,
  textClassName,
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  const chars = text.split("");

  const setSpan = useCallback((i: number) => (el: HTMLSpanElement | null) => {
    spansRef.current[i] = el;
  }, []);

  useEffect(() => {
    if (!fontUrl) return;
    const style = document.createElement("style");
    style.textContent = `@font-face { font-family: "${fontFamily ?? "TextPressureFont"}"; src: url("${fontUrl}") format("woff2"); font-weight: 100 900; }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, [fontUrl, fontFamily]);

  useEffect(() => {
    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function tick() {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const span of spansRef.current) {
        if (!span) continue;
        const r = span.getBoundingClientRect();
        const sx = r.left + r.width / 2;
        const sy = r.top + r.height / 2;
        const dx = mx - sx;
        const dy = my - sy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - dist / radius);

        span.style.fontWeight = String(Math.round(lerp(minWeight, maxWeight, t)));
        span.style.transform = `scale(${lerp(minScale, maxScale, t).toFixed(3)}) oblique(${lerp(minItalic, maxItalic, t).toFixed(1)}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    tick();

    function onMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    function onLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [radius, minWeight, maxWeight, minScale, maxScale, minItalic, maxItalic]);

  return (
    <div
      ref={containerRef}
      data-slot="text-pressure"
      className={cn("flex h-full w-full items-center justify-center", className)}
      style={fontFamily ? { fontFamily } : undefined}
    >
      <p
        aria-label={text}
        className={cn(
          "select-none whitespace-nowrap text-center text-[10vw] leading-none",
          textClassName,
        )}
      >
        {chars.map((ch, i) => (
          <span
            key={i}
            ref={setSpan(i)}
            aria-hidden
            style={{ display: "inline-block" }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </p>
    </div>
  );
}
