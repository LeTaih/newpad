import { Compare } from "@/components/sections/Compare";
import { Hero } from "@/components/sections/Hero";
import { Nav } from "@/components/sections/Nav";
import { Problem } from "@/components/sections/Problem";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Compare />
      </main>
    </>
  );
}
