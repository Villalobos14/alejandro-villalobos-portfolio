import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Hero from "@/components/Hero";
import HomeNarrative from "@/components/home/HomeNarrative";
import { HomeNarrativeProvider } from "@/components/home/NarrativeProvider";
import Projects from "@/components/Projects";
import PageShell from "@/components/system/PageShell";

export const metadata: Metadata = pageMetadata({
  title: "Work | Alejandro Villalobos",
  description:
    "Selected product design and UX work by Alejandro Villalobos.",
  path: "/",
});

export default function Home() {
  return (
    <PageShell>
      <HomeNarrativeProvider>
        <Hero />
        <Projects />
        <HomeNarrative />
      </HomeNarrativeProvider>
    </PageShell>
  );
}
