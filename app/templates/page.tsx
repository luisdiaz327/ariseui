import type { Metadata } from "next";
import GooeyNavbar from "@/components/GooeyNavbar";
import TemplatesSection from "@/components/TemplatesSection";
import Footer from "@/components/Footer";
import { fetchStarCount } from "@/lib/github";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Ready-to-use, full-page templates built with AriseUI. Download and start building from a solid foundation.",
  alternates: {
    canonical: "/templates",
  },
};

export default async function TemplatesPage() {
  const stars = await fetchStarCount();

  return (
    <>
      <GooeyNavbar stars={stars} />
      <main className="min-h-screen bg-background">
        <TemplatesSection className="pt-28 sm:pt-32 md:pt-36" />
      </main>
      <Footer />
    </>
  );
}
