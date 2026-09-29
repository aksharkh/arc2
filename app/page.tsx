import { Header, Intro, SmoothScroll } from "@/components/core";
import Hero from "@/components/Hero";
import { Contact, Footer, MaterialBand, Method, Numbers, Sectors, Services, Statement } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Intro />
      <Header />
      <main>
        <Hero />
        <Statement />
        <Services />
        <MaterialBand />
        <Numbers />
        <Method />
        <Sectors />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
