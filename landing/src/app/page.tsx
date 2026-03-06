import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CursorBackground from "@/components/CursorBackground";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Pipeline from "@/components/Pipeline";
import Security from "@/components/Security";
import Download from "@/components/Download";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <CursorBackground />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Features />
        <Pipeline />
        <Security />
        <Download />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
