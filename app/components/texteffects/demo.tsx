"use client";

import { useSearchParams } from "next/navigation";
import ParticleText from "@/components/ui/particle-text";
import TextPressure from "@/components/ui/text-pressure";

export default function TextEffectsDemo() {
  const searchParams = useSearchParams();
  const active = searchParams.get("variant") === "text-pressure" ? "text-pressure" : "particle-text";

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-background">
      {active === "particle-text" && (
        <ParticleText
          text="Particle"
          fontSize={120}
          particleGap={5}
          particleSize={3}
          repelRadius={120}
          className="h-full w-full"
        />
      )}

      {active === "text-pressure" && (
        <TextPressure
          text="Pressure"
          minWeight={100}
          maxWeight={900}
          className="h-full w-full"
        />
      )}
    </div>
  );
}
