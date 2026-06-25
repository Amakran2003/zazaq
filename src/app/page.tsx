import { AmbientBackground } from "@/components/landing/AmbientBackground";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Proof } from "@/components/landing/Proof";
import { Calculator } from "@/components/landing/Calculator";
import { Methodology } from "@/components/landing/Methodology";
import { Offer } from "@/components/landing/Offer";
import { Footer } from "@/components/landing/Footer";
import { GsapReveal } from "@/components/landing/GsapReveal";

export default function Home() {
  return (
    <>
      <AmbientBackground />
      <Navbar />
      <main id="main">
        <Hero />
        <Proof />
        <Calculator />
        <Methodology />
        <Offer />
      </main>
      <Footer />
      <GsapReveal />
    </>
  );
}
