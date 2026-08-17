"use client";

import { useMemo, useState } from "react";
import { DynamicIsland } from "@/components/ui/dynamic-island";

const prompts = [
  { title: "Beach / Hard Sunlight", category: "Beach" },
  { title: "Gym / Soft Ambient Light", category: "Gym" },
  { title: "Studio / Rim Light Portrait", category: "Studio" },
  { title: "Street / Golden Hour", category: "Street" },
  { title: "Cafe / Window Reflection", category: "Cafe" },
  { title: "Poolside / Harsh Midday", category: "Beach" },
];

const categories = [...new Set(prompts.map((prompt) => prompt.category))];

export default function Demo() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const filteredPrompts = useMemo(
    () =>
      prompts.filter((prompt) => {
        const matchesCategory =
          category === "All" || prompt.category === category;
        const matchesQuery = prompt.title
          .toLowerCase()
          .includes(query.toLowerCase());

        return matchesCategory && matchesQuery;
      }),
    [category, query],
  );

  return (
    <div className="relative flex h-full min-h-[580px] flex-col items-center overflow-auto rounded-[28px] bg-[#0a0a0c] px-4 py-14 text-white sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_360px_at_50%_-5%,rgba(255,255,255,0.08),transparent_62%),radial-gradient(500px_320px_at_100%_100%,rgba(255,255,255,0.035),transparent_65%)]" />
      <DynamicIsland
        categories={categories}
        value={query}
        category={category}
        placeholder="Search prompts"
        onValueChange={setQuery}
        onCategoryChange={setCategory}
        className="relative z-10"
      />
      <div className="relative z-10 mt-14 w-full max-w-[640px]">
        <p
          aria-live="polite"
          className="text-xs tracking-[0.02em] text-white/40"
        >
          {filteredPrompts.length}{" "}
          {filteredPrompts.length === 1 ? "prompt" : "prompts"}
          {category !== "All" && ` in ${category}`}
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.title}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4"
            >
              <p className="text-[11px] font-medium tracking-[0.08em] text-white/40 uppercase">
                {prompt.category}
              </p>
              <p className="mt-1.5 text-sm font-medium tracking-[-0.01em]">
                {prompt.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
