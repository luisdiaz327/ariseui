"use client";

import { useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { activeComponent, isDocPage } from "@/lib/components";
import { cn } from "@/lib/utils";
import MobileSidebar from "./MobileSidebar";
import DescriptionContent from "../Description/DescriptionContent";
import SourceSection from "../Description/SourceSection";

const CARD = "rounded-[32px] bg-card";

export default function MobileShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const item = activeComponent(pathname);
  const docPage = isDocPage(pathname);

  const activeVariantId = searchParams.get("variant") ?? item?.variants?.[0]?.id;
  const activeVariant = item?.variants?.find((v) => v.id === activeVariantId);
  const registryForSource = activeVariant?.registry ?? item?.registry;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  function selectVariant(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", id);
    router.replace(`${pathname}?${params.toString()}`);
    setDropdownOpen(false);
  }

  return (
    <div className="no-scrollbar h-full overflow-y-auto">
      <div className="flex flex-col gap-2 pb-2">
        <div className={cn(CARD, "relative h-[88svh] shrink-0 p-4")}>
          <MobileSidebar />

          {item?.variants && item.variants.length > 0 && (
            <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-2xl bg-popover px-4 py-2.5 text-sm shadow-lg"
                >
                  <span className="text-foreground">
                    {activeVariant?.label ?? item.variants[0].label}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-150",
                      dropdownOpen && "rotate-180",
                    )}
                  />
                </button>

                {dropdownOpen && (
                  <ul className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 min-w-[160px] overflow-hidden rounded-2xl bg-popover shadow-lg">
                    {item.variants.map((v, i) => (
                      <li key={v.id}>
                        <button
                          type="button"
                          onClick={() => selectVariant(v.id)}
                          className={cn(
                            "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-muted",
                            activeVariantId === v.id ? "text-[#00aaff]" : "text-foreground",
                          )}
                        >
                          <span className="w-4 text-xs text-muted-foreground tabular-nums">
                            {i + 1}
                          </span>
                          {v.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {children}
        </div>

        {!docPage && (
          <>
            <div className={cn(CARD, "p-6")}>
              <DescriptionContent
                item={item}
                activeVariant={activeVariant}
                showSourceHint={false}
              />
            </div>

            {registryForSource && (
              <div className={cn(CARD, "p-6")}>
                <SourceSection key={registryForSource} registry={registryForSource} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
