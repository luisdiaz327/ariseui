"use client";

import { PromptCard, type Prompt } from "@/components/ui/prompt-card";

const prompt: Prompt = {
  id: 1,
  image:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  imageAlt: "An editorial design board with layered textures and soft lighting",
  kicker: "Brand",
  brand: "Signal",
  category: "Creative system",
  title: "Warm editorial prompts",
  prompt:
    "Design a calm workspace for a product team with tactile materials, quiet contrast, and subtle motion. Keep the interface warm, the hierarchy sharp, and the active controls intentionally bright.",
  footer: "Prompt set · Studio notes",
  palette: ["#171715", "#d7d1c3", "#c8ef57", "#e9d7b3"],
};

export default function Demo() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mx-auto max-w-[360px]">
        <PromptCard prompt={prompt} index={0} />
      </div>
    </div>
  );
}
