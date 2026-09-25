import { Compare } from "@/components/sections/Compare";
import { Details } from "@/components/sections/Details";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Nav } from "@/components/sections/Nav";
import { Problem } from "@/components/sections/Problem";
import { Token } from "@/components/sections/Token";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Compare />
        <HowItWorks />
        <Details />
        <Token />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
