"use client";

import { ChevronDown, Search } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/lib/utils";

export type DynamicIslandProps = ComponentPropsWithoutRef<"div"> & {
  categories?: string[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  category?: string;
  defaultCategory?: string;
  onCategoryChange?: (category: string) => void;
  allLabel?: string;
  placeholder?: string;
};

export function DynamicIsland({
  categories = [],
  value,
  defaultValue = "",
  onValueChange,
  category,
  defaultCategory,
  onCategoryChange,
  allLabel = "All",
  placeholder = "Search",
  className,
  ...props
}: DynamicIslandProps) {
  const drawerId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalCategory, setInternalCategory] = useState(
    defaultCategory ?? allLabel,
  );
  const activeValue = value ?? internalValue;
  const activeCategory = category ?? internalCategory;
  const filterOptions = [
    allLabel,
    ...categories.filter((item) => item !== allLabel),
  ];

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const setSearchValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  const selectCategory = (nextCategory: string) => {
    if (category === undefined) setInternalCategory(nextCategory);
    onCategoryChange?.(nextCategory);
    setIsOpen(false);
  };

  return (
    <div
      ref={rootRef}
      data-slot="dynamic-island"
      className={cn(
        "w-full max-w-[640px] rounded-[26px] border border-white/10 bg-[#0e0e10]/90 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(0,0,0,0.4),0_14px_30px_rgba(0,0,0,0.55)] backdrop-blur-[18px] backdrop-saturate-[1.4] transition-[border-radius] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        isOpen && "rounded-[22px]",
        className,
      )}
      {...props}
    >
      <div className="flex h-[50px] items-center gap-2.5 px-2 pr-2 pl-[18px] sm:h-[50px]">
        <Search aria-hidden="true" className="size-4 shrink-0 text-white/50" />
        <input
          type="search"
          value={activeValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm tracking-[-0.01em] text-white outline-none placeholder:text-white/30"
        />
        <span aria-hidden="true" className="h-5 w-px shrink-0 bg-white/10" />
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={drawerId}
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.05] px-3.5 text-xs font-medium tracking-[-0.01em] text-white outline-none transition-[background-color,transform] duration-200 hover:bg-white/[0.09] active:scale-95 focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none max-[520px]:px-2.5"
        >
          <span className="max-[520px]:sr-only">{activeCategory}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-3 shrink-0 transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              isOpen && "rotate-180",
            )}
          />
        </button>
      </div>

      <div
        id={drawerId}
        className={cn(
          "grid transition-[grid-template-rows] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-2 px-4 pt-0.5 pb-4">
            {filterOptions.map((option) => {
              const isActive = option === activeCategory;

              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => selectCategory(option)}
                  className={cn(
                    "rounded-full border border-white/[0.06] bg-white/[0.04] px-[13px] py-[7px] text-xs font-medium tracking-[-0.01em] text-white/55 outline-none transition-[background-color,color,transform] duration-200 hover:bg-white/[0.08] hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none",
                    isActive &&
                      "border-white bg-white text-[#0a0a0c] hover:bg-white",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
