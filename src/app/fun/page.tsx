import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import PageShell from "@/components/system/PageShell";
import CameraRoll from "@/components/fun/CameraRoll";
import EverydayNotes from "@/components/fun/EverydayNotes";
import FunCta from "@/components/fun/FunCta";
import FunHero from "@/components/fun/FunHero";
import { funHeader } from "@/lib/fun";

export const metadata: Metadata = pageMetadata({
  title: "About · Fun | Alejandro Villalobos",
  description: funHeader.deck,
  path: "/fun",
});

export default function FunPage() {
  return (
    <PageShell>
      <div className="page-container">
        <FunHero />
      </div>
      <CameraRoll />
      <div className="page-container">
        <EverydayNotes />
        <FunCta />
      </div>
    </PageShell>
  );
}
