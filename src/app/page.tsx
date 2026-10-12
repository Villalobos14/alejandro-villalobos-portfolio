import type { Metadata } from "next";
import { pageMetadata, siteDescription, siteTitle } from "@/lib/site";
import Hero from "@/components/Hero";
import HomeNarrative from "@/components/home/HomeNarrative";
import { HomeNarrativeProvider } from "@/components/home/NarrativeProvider";
import Projects from "@/components/Projects";
import PageShell from "@/components/system/PageShell";

export const metadata: Metadata = pageMetadata({
  title: siteTitle,
  description: siteDescription,
  path: "/",
});

export default function Home() {
  return (
    <PageShell>
      <HomeNarrativeProvider>
        <div className="page-container overflow-x-clip">
          <Hero />
          <Projects />
          <HomeNarrative />
        </div>
      </HomeNarrativeProvider>
    </PageShell>
  );
}
