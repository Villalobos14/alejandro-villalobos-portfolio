import type { Metadata } from "next";
import ClosingBlock from "@/components/about/ClosingBlock";
import PageIntro from "@/components/about/PageIntro";
import Collage from "@/components/fun/Collage";
import HorizontalGallery from "@/components/fun/HorizontalGallery";
import PersonalBlocks from "@/components/fun/PersonalBlocks";
import { funIntro, galleryPhotos } from "@/lib/personal";

export const metadata: Metadata = {
  title: "About · Fun | Alejandro Villalobos",
  description:
    "Photos, stories and personal explorations by Alejandro Villalobos.",
};

export default function FunPage() {
  return (
    <>
      <PageIntro
        label={funIntro.label}
        lines={[funIntro.title[0], funIntro.title[1]]}
        presentation={funIntro.body}
        active="fun"
      />
      <Collage />
      <HorizontalGallery title="Gallery" photos={galleryPhotos} />
      <PersonalBlocks />
      <ClosingBlock label="Next" title="Professional" href="/about" />
    </>
  );
}
