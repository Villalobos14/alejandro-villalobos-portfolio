import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Collage from "@/components/fun/Collage";
import FunClosing from "@/components/fun/FunClosing";
import FunHero from "@/components/fun/FunHero";
import PersonalBlocks from "@/components/fun/PersonalBlocks";

export const metadata: Metadata = pageMetadata({
  title: "About · Fun | Alejandro Villalobos",
  description:
    "Photos, stories and personal explorations by Alejandro Villalobos.",
  path: "/fun",
});

export default function FunPage() {
  return (
    <>
      <FunHero />
      <Collage />
      <PersonalBlocks />
      <FunClosing />
    </>
  );
}
