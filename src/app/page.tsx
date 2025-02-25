import Experience from "@/components/Experience";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import SmoothSection from "@/components/SmoothSection";

export default function Home() {
  return (
    <>
      <Header />
      <Hero/>
      <Projects/>
      <SmoothSection/>
      <Experience/>
    </>
  );
}
