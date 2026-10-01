import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Works from "@/components/Works";

export const metadata: Metadata = pageMetadata({
  title: "Projects | Alejandro Villalobos",
  description:
    "Selected product design and UX work by Alejandro Villalobos.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <Works />;
}
