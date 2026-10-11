import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Hero from "@/components/Hero";
import HomeNarrative from "@/components/home/HomeNarrative";
import { HomeNarrativeProvider } from "@/components/home/NarrativeProvider";
import Projects from "@/components/Projects";
import PageShell from "@/components/system/PageShell";

export const metadata: Metadata = pageMetadata({
  title: "Alejandro Villalobos — Product Designer",
  description: "Selected product design and UX by Alejandro Villalobos.",
  path: "/",
});

export default function Home() {
  return (
    <PageShell>
      <HomeNarrativeProvider>
        <div className="mx-auto w-full max-w-[1440px] overflow-x-clip [--page-gutter:clamp(16px,5vw,72px)]">
          <Hero />
          <Projects />
          <HomeNarrative />
        </div>
      </HomeNarrativeProvider>
    </PageShell>
  );
}
