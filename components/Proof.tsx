"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import { renderMarbleStill } from "@/lib/marble";
import { EXPO, FadeUp, RevealLines, SectionTag } from "./ui";

const STATS = [
  { v: 250, s: "+", l: "Engagements delivered", n: "Across banking, insurance, fintech and the public sector." },
  { v: 98, s: "%", l: "First-submission audit pass rate", n: "Evidence built to be accepted the first time." },
  { v: 40, s: "%", l: "Control redundancy removed", n: "Average reduction in duplicated controls after redesign." },
  { v: 0, s: "", l: "Regulatory penalties", n: "For clients operating inside a TripleArc structure." },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix && <span className="text-[0.6em] align-top">{suffix}</span>}
    </span>
  );
}

export function Proof() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], ["-20%", "30%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink py-28 md:py-44">
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute left-1/2 top-0 h-[70%] w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(216,179,106,0.16),transparent_65%)] blur-3xl"
      />
      <div className="relative mx-auto max-w-[1500px] px-6 md:px-12 xl:pl-24">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionTag index="06" label="Proof" />
            <RevealLines
              className="mt-8 text-[clamp(2.6rem,6vw,6.2rem)] font-light leading-none tracking-[-0.035em]"
              lines={[
                <span key="a">
                  Built for <em className="font-serif font-normal italic text-gold-2">scrutiny.</em>
                </span>,
              ]}
            />
          </div>
          <FadeUp delay={0.15}>
            <p className="max-w-sm text-[15px] leading-relaxed text-white/60">
              Measurable outcomes for organisations operating under the closest regulatory attention.
            </p>
          </FadeUp>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-y-16 lg:mt-28 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.4, delay: i * 0.1, ease: EXPO }}
              className={`group relative px-2 md:px-8 ${i ? "lg:border-l lg:border-white/10" : ""}`}
            >
              <div className="text-metal reflect inline-block pr-2 text-[clamp(4rem,7.4vw,8rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
                <Counter to={s.v} suffix={s.s} />
              </div>
              <div className="mt-16 h-px w-full bg-white/10">
                <motion.div
                  className="h-px bg-gold"
                  initial={{ width: 0 }}
                  whileInView={{ width: "40%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, delay: 0.4 + i * 0.1, ease: EXPO }}
                />
              </div>
              <p className="mt-5 text-[15px] text-white">{s.l}</p>
              <p className="mt-2 max-w-[16rem] text-[13px] leading-relaxed text-white/45">{s.n}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SECTORS = ["Banking", "Insurance", "Fintech", "Healthcare", "Technology", "Energy", "Public Sector"];
const SECTOR_NOTES = [
  "Prudential, conduct and operational resilience regimes.",
  "Solvency, claims governance and distribution oversight.",
  "Licensing readiness, payments and digital lending rules.",
  "Patient data, clinical governance and accreditation.",
  "SaaS assurance, SOC 2 and cross-border data flows.",
  "Safety, ESG disclosures and critical infrastructure.",
  "Public accountability, procurement and audit trails.",
];

export function Sectors() {
  const [tex, setTex] = useState<string[]>([]);
  const [active, setActive] = useState(3);

  useEffect(() => {
    // Bake three marble stills once, off the first paint.
    const id = requestAnimationFrame(() => {
      setTex([0, 1, 2].map((i) => renderMarbleStill(420, 900, 2.1 + i * 3.7, 9)).filter(Boolean) as string[]);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section id="sectors" className="relative bg-pearl py-28 text-navy md:py-40">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12 xl:pl-24">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionTag index="07" label="Sectors" dark={false} />
            <RevealLines
              className="mt-8 text-[clamp(2.6rem,6vw,6.2rem)] font-light leading-[0.98] tracking-[-0.035em]"
              lines={[
                "Sectors under",
                <em key="w" className="font-serif font-normal italic text-royal">
                  our watch.
                </em>,
              ]}
            />
          </div>
          <FadeUp className="self-end md:col-span-4 md:col-start-9" delay={0.2}>
            <p className="text-[15px] leading-relaxed text-navy/65">
              Each industry is its own mineral — formed under different pressures, with different fault lines. We read
              the grain before we cut.
            </p>
          </FadeUp>
        </div>

        <div className="mt-16 flex h-[680px] flex-col gap-2 md:mt-24 md:h-[600px] md:flex-row md:gap-3">
          {SECTORS.map((s, i) => {
            const on = i === active;
            return (
              <motion.div
                key={s}
                onPointerEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                data-cursor-label="Explore"
                className="relative overflow-hidden rounded-[22px] bg-navy shadow-[0_30px_60px_-30px_rgba(6,15,38,0.7)]"
                style={{
                  flexBasis: 0,
                  clipPath: `polygon(${i % 2 ? "0 2%, 100% 0, 100% 97%, 0 100%" : "0 0, 100% 3%, 100% 100%, 0 98%"})`,
                }}
                animate={{ flexGrow: on ? 4.5 : 1 }}
                transition={{ duration: 1, ease: EXPO }}
              >
                {tex.length > 0 && (
                  <motion.div
                    className="absolute inset-0 bg-cover"
                    style={{ backgroundImage: `url(${tex[i % tex.length]})`, backgroundPosition: `${(i * 37) % 100}% center` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: on ? 1.05 : 1.25 }}
                    transition={{ duration: 1.4, ease: EXPO }}
                  />
                )}
                <div className="absolute inset-0 rounded-[22px] ring-1 ring-inset ring-gold/60" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-ink/90 via-ink/30 to-transparent" />
                <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.18)_45%,transparent_60%)] opacity-60 mix-blend-overlay" />
                <span
                  className={`absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-xl font-light text-white transition-opacity duration-500 md:bottom-6 md:left-1/2 md:top-auto md:-translate-x-1/2 md:translate-y-0 md:rotate-180 md:text-3xl md:[writing-mode:vertical-rl] ${
                    on ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {s}
                </span>
                <motion.div
                  className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8"
                  animate={{ opacity: on ? 1 : 0, y: on ? 0 : 20 }}
                  transition={{ duration: 0.7, delay: on ? 0.35 : 0, ease: EXPO }}
                >
                  <p className="eyebrow text-gold-2">{String(i + 1).padStart(2, "0")} / 07</p>
                  <p className="mt-3 whitespace-nowrap text-3xl font-light md:text-5xl">{s}</p>
                  <p className="mt-3 hidden max-w-xs text-[14px] text-white/70 md:block">{SECTOR_NOTES[i]}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
