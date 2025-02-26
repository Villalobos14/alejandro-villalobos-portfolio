import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import SmoothSection from "@/components/SmoothSection";

export default function Home() {
  return (
    <>
      <Header />
      <Hero/>
      <Projects/>
      <SmoothSection/>
      <Experience/>
      <Skills/>
      <About/>
      <Contact/>
    </>
  );
}
