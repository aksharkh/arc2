import { Cursor, Preloader, SmoothScroll, SystemRail } from "@/components/chrome";
import Hero, { Nav } from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Pillars from "@/components/Pillars";
import System from "@/components/System";
import Method from "@/components/Method";
import { Proof, Sectors } from "@/components/Proof";
import { Cta, Footer, Insights, Marquee, Trust } from "@/components/Closing";

const DISCIPLINES = [
  "Governance",
  "Risk",
  "Compliance",
  "Internal Audit",
  "Cyber Risk",
  "Data Privacy",
  "Third-Party Risk",
  "ESG Assurance",
  "Regulatory Advisory",
];

const FRAMEWORKS = ["ISO 27001", "SOC 2", "NIST CSF", "COSO", "DPDP Act", "GDPR", "DORA", "NIS2", "PCI DSS", "SOX", "ISO 31000", "BRSR"];

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <SystemRail />
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <div className="bg-ink py-10 md:py-14">
          <Marquee
            items={DISCIPLINES}
            dur={45}
            className="text-[clamp(2rem,4.6vw,4.4rem)] font-extralight tracking-[-0.02em] text-white/85"
          />
        </div>
        <Manifesto />
        <Pillars />
        <System />
        <Method />
        <Proof />
        <div className="border-y border-white/10 bg-navy py-6">
          <Marquee items={FRAMEWORKS} dur={35} reverse className="eyebrow text-[12px] text-white/55" />
        </div>
        <Sectors />
        <Trust />
        <Insights />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
