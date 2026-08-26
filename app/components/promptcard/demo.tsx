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
  prompt:
    "Smartphone photo, 9:16 vertical format, casual shot taken on a regular phone, noise and grain, soft lens sharpness, bright natural sunlight, no professional studio look. Preserve the exact same girl as in the reference photo. Strictly preserve her exact appearance, ethnicity, and identity. Natural skin texture without plastic effect, no airbrushing, no AI smoothing. Skin detailing.

She is standing outdoors, slightly sideways in front of a dense green hedge, looking directly at the camera. She is wearing a black off-the-shoulder dress with white lace ruffles and black ties. Her hand is slightly touching her thigh. Bright natural sunlight, realistic highlights on skin and hair, natural shadows, casual smartphone shot style, high detail of face, skin, hair, and dress fabric, authentic phone photo quality. Black eyeliner, long straight hair, contouring, fluffy eyelashes.",
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
