import type { Metadata } from "next";
import Works from "@/components/Works";

export const metadata: Metadata = {
  title: "Projects | Alejandro Villalobos",
  description: "Selected product design and UX work by Alejandro Villalobos.",
};

export default function ProjectsPage() {
  return <Works />;
}
