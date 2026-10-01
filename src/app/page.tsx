import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Hero from "@/components/Hero";
import HomeNarrative from "@/components/home/HomeNarrative";
import { HomeNarrativeProvider } from "@/components/home/NarrativeProvider";
import Projects from "@/components/Projects";
import SmoothSection from "@/components/SmoothSection";

export const metadata: Metadata = pageMetadata({
  title: "Work | Alejandro Villalobos",
  description:
    "Selected product design and UX work by Alejandro Villalobos.",
  path: "/",
});

export default function Home() {
  return (
    <HomeNarrativeProvider>
      <Hero />
      <Projects />
      <SmoothSection />
      <HomeNarrative />
    </HomeNarrativeProvider>
  );
}
