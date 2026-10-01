import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";

export const metadata: Metadata = pageMetadata({
  title: "Resume | Alejandro Villalobos",
  description:
    "Professional experience and skills of Alejandro Villalobos.",
  path: "/resume",
});

export default function ResumePage() {
  return (
    <>
      <Experience />
      <Skills />
    </>
  );
}
