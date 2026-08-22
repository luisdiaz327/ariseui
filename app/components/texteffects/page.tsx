import { Suspense } from "react";
import { componentPageMetadata } from "@/lib/seo";
import Demo from "./demo";

export const metadata = componentPageMetadata("/components/texteffects");

export default function Page() {
  return (
    <Suspense>
      <Demo />
    </Suspense>
  );
}
