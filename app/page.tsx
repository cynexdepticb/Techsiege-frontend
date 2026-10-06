import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Tracks from "@/components/Tracks";
import Requirements from "@/components/Requirements";
import Schedule from "@/components/Schedule";
import Judging from "@/components/Judging";
import { Awards, Submission } from "@/components/Awards";
import FAQ from "@/components/FAQ";
import ClosingCTA from "@/components/ClosingCTA";

export default function Page() {
  return (
    <>
      <a href="#about" className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-accent focus:p-2 focus:text-black">
        Skip to content
      </a>
      <Navbar />
      <ScrollProgress />
      <main>
        <Hero />
        <About />
        <Tracks />
        <Requirements />
        <Schedule />
        <Judging />
        <Awards />
        <Submission />
        <FAQ />
        <ClosingCTA />
      </main>
    </>
  );
}
