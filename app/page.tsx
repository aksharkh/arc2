import { SmoothScroll } from "@/components/kit";
import { Hero, Nav } from "@/components/Top";
import { Contact, Faq, Footer, Frameworks, Method, Pillars, Sectors, Services, Stats } from "@/components/Blocks";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <Frameworks />
        <Pillars />
        <Services />
        <Method />
        <Stats />
        <Sectors />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
