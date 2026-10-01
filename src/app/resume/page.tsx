import type { Metadata } from "next";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";

export const metadata: Metadata = {
  title: "Resume | Alejandro Villalobos",
  description: "Professional experience and skills of Alejandro Villalobos.",
};

export default function ResumePage() {
  return (
    <>
      <Experience />
      <Skills />
    </>
  );
}
