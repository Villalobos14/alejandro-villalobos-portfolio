import About from "@/components/About";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

import SmoothSection from "@/components/SmoothSection";

export default function Home() {
  return (
    <>
      <Header />
      <Hero/>
      
      <SmoothSection/>
     
      <About/>
      <Footer/>
    </>
  );
}
