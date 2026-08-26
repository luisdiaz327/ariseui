"use client";

import { PromptCard, type Prompt } from "@/components/ui/prompt-card";

const prompt: Prompt = {
  id: 1,
  image:
    "https://img.promptlibrary.space/images/file-3456-1787672522313.jpg",
  imageAlt: "Sunlit Garden Smartphone Portrait",
  kicker: "Made",
  brand: "Arise UI",
  category: "Creative system",
  title: "Sunlit Garden Smartphone Portrait",
  prompt: "prompt",
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
