"use client";

import { Check, Copy } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type MouseEvent,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export type Prompt = {
  id: number;
  image: string;
  imageAlt: string;
  kicker: string;
  brand: string;
  category: string;
  title: string;
  prompt: string;
  footer: string;
  palette: string[];
};

export type PromptCardProps = ComponentPropsWithoutRef<"article"> & {
  prompt: Prompt;
  index?: number;
};

export function PromptCard({
  prompt,
  index = 0,
  className,
  style,
  ...props
}: PromptCardProps) {
  const [isImageView, setIsImageView] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleView = () => setIsImageView((current) => !current);

  const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(prompt.prompt);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = prompt.prompt;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article
      data-slot="prompt-card"
      role="button"
      tabIndex={0}
      aria-pressed={isImageView}
      aria-label={`${prompt.title} prompt card. Activate to ${isImageView ? "reveal the prompt" : "view the full image"}.`}
      onClick={toggleView}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleView();
        }
      }}
      className={cn(
        "group relative isolate aspect-[2/3] w-full cursor-pointer select-none overflow-hidden rounded-[24px] bg-[#151514] shadow-[0_24px_50px_-27px_rgba(29,27,21,0.52),0_6px_14px_-9px_rgba(29,27,21,0.3)] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1.5 hover:shadow-[0_32px_66px_-28px_rgba(29,27,21,0.58),0_10px_18px_-11px_rgba(29,27,21,0.35)] active:translate-y-0 active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9abf35] focus-visible:ring-offset-2",
        className,
      )}
      style={{
        ...style,
        animationDelay: `${index * 55}ms`,
      } as CSSProperties}
      {...props}
    >
      <img
        src={prompt.image}
        alt={prompt.imageAlt}
        loading="lazy"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.035]",
          isImageView && "scale-[1.01] saturate-[1.04]",
        )}
      />

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[28%] bg-gradient-to-b from-black/30 to-transparent transition-opacity duration-300",
          isImageView && "opacity-0",
        )}
      />

      <div
        className={cn(
          "absolute right-[4.6%] top-[4.6%] z-10 flex items-center gap-1.5 transition-all duration-200 ease-out",
          isImageView && "pointer-events-none -translate-y-2 opacity-0",
        )}
        aria-hidden={isImageView}
      >
        <span className="inline-flex h-6 items-center rounded-full border border-white/70 bg-black/25 px-2 text-[8px] font-extrabold tracking-[0.07em] text-[#fbfaf6] backdrop-blur-[7px]">
          {prompt.kicker}
        </span>
        <span className="inline-flex h-6 items-center rounded-full bg-[#c8ef57] px-2 text-[8px] font-extrabold tracking-[0.07em] text-[#2a340e]">
          {prompt.brand}
        </span>
      </div>

      <div className={cn("pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-200", isImageView ? "opacity-100" : "opacity-0")} aria-hidden="true">
        <span className="rounded-full bg-black/35 px-3 py-2 text-[10px] font-bold text-white/80 backdrop-blur-md animate-[pulse_2s_ease-in-out_infinite]">
          Tap to show prompt
        </span>
      </div>

      <div
        className={cn(
          "absolute inset-x-[3.5%] bottom-[3.5%] z-10 flex max-h-[69%] flex-col rounded-[18px] border border-white/15 bg-[#1a1a18]/55 p-[14px_14px_12px] backdrop-blur-[18px] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
          isImageView && "pointer-events-none translate-y-[calc(100%+32px)] opacity-0",
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-2">
          <div>
            <p className="mb-1.5 text-[7px] font-medium uppercase tracking-[0.1em] text-white/60">
              {prompt.category}
            </p>
            <h3 className="m-0 font-[Playfair_Display,Georgia,serif] text-[clamp(17px,2.2vw,25px)] font-medium italic leading-[0.98] tracking-[-0.045em] text-[#fbfaf6]">
              {prompt.title}
            </h3>
          </div>

          <button
            type="button"
            className={cn(
              "inline-flex flex-none items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2 py-1 text-[9px] font-extrabold text-[#f5f4ef] transition-colors duration-180 hover:bg-white/15 active:scale-[0.95]",
              copied && "border-[#c8ef57] bg-[#c8ef57] text-[#27310e]",
            )}
            onClick={handleCopy}
            aria-label={copied ? "Prompt copied" : "Copy prompt"}
          >
            {copied ? <Check size={12} strokeWidth={2.4} /> : <Copy size={12} strokeWidth={2} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <div className="mt-2 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <p className="m-0 text-[clamp(9px,1.1vw,11px)] leading-[1.48] tracking-[0.002em] text-white/80">
            {prompt.prompt}
          </p>
        </div>

        <div className="mt-3 flex shrink-0 items-center justify-between gap-2 text-[10px] font-extrabold text-[#fbfaf6]">
          <span>{prompt.footer}</span>
          <span className="font-[IBM_Plex_Mono,ui-monospace,monospace] text-[9px] text-[#c8ef57]">
            {String(prompt.id).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-2 flex gap-1.5" aria-label="Prompt palette">
          {prompt.palette.map((color) => (
            <span
              key={color}
              className="h-3.5 w-3.5 rounded-[5px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)] transition-transform duration-180 group-hover:-translate-y-0.5"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
