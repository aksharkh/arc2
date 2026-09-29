"use client";

import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { Button, FadeUp, Logo, RevealLines, SectionTag, Triquetra } from "./ui";
import { ShaderCanvas } from "./Manifesto";

/* ---------- marquee ---------- */

export function Marquee({
  items,
  dur = 40,
  reverse = false,
  className = "",
}: {
  items: string[];
  dur?: number;
  reverse?: boolean;
  className?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`marquee ${reverse ? "marquee-rev" : ""}`} style={{ ["--dur" as string]: `${dur}s` }}>
        {row.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 md:px-12">{t}</span>
            <Triquetra className="h-[0.5em] w-[0.5em] opacity-80" width={0.16} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- independence / trust ---------- */

function Seal() {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 14 });
  const sry = useSpring(ry, { stiffness: 120, damping: 14 });
  const text = "INDEPENDENT BY DESIGN · SENIOR-LED · CONFLICT-FREE · ";

  return (
    <div
      ref={ref}
      className="relative aspect-square w-full max-w-[560px] [perspective:1200px]"
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 22);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 22);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <motion.div
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="relative h-full w-full overflow-hidden rounded-[40px] shadow-[0_60px_120px_-40px_rgba(3,8,26,0.9)]"
      >
        <div className="absolute inset-0">
          <ShaderCanvas seed={7.7} bands={8} scale={0.5} />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(3,8,26,0.55))]" />
        <div className="glass absolute inset-[14%] rounded-full" style={{ transform: "translateZ(60px)" }}>
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <path id="circ" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
            </defs>
            <text fontSize="8.6" letterSpacing="3.2" fill="#f3dca0" style={{ fontFamily: "var(--font-mono)" }}>
              <textPath href="#circ">{text}</textPath>
            </text>
          </motion.svg>
          <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#4b78ff,#12307e_55%,#050d2a)] shadow-[inset_0_0_40px_rgba(0,0,0,0.6),0_0_60px_rgba(61,109,255,0.4)]">
            <div className="absolute inset-0 rounded-full ring-1 ring-gold/70" />
            <Triquetra className="absolute inset-[20%] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" width={0.13} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Trust() {
  const principles = [
    ["Independent by design", "No software to sell, no audit conflicts, no referral fees. Our only product is your resilience."],
    ["Senior-led, always", "Every engagement is run by partners and principals — the people you meet are the people who deliver."],
    ["Evidence over opinion", "Every recommendation is traceable to an obligation, a risk and a measurable control outcome."],
  ];
  return (
    <section className="relative overflow-hidden bg-navy py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_50%,rgba(28,75,214,0.25),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-16 px-6 md:px-12 lg:grid-cols-2 xl:pl-24">
        <div>
          <SectionTag index="08" label="Independence" />
          <RevealLines
            className="mt-8 text-[clamp(3rem,7vw,7.5rem)] font-light leading-[0.92] tracking-[-0.04em]"
            lines={[
              "Trust,",
              <em key="p" className="font-serif font-normal italic text-gold-2">
                proven.
              </em>,
            ]}
          />
          <div className="mt-14 space-y-0 border-t border-white/10">
            {principles.map(([t, d], i) => (
              <FadeUp key={t} delay={0.1 * i}>
                <div className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/10 py-6">
                  <span className="eyebrow pt-1.5 text-gold">0{i + 1}</span>
                  <div>
                    <p className="text-xl font-light">{t}</p>
                    <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/55">{d}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
        <FadeUp className="flex justify-center lg:justify-end" delay={0.15}>
          <Seal />
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------- insights ---------- */

const POSTS = [
  { c: "Regulation", t: "DPDP Rules: what boards must own before enforcement begins", r: "8 min", hue: "from-royal to-ink" },
  { c: "Operational Resilience", t: "Mapping important business services without drowning in process maps", r: "6 min", hue: "from-[#2a3f7a] to-ink" },
  { c: "Audit", t: "Why first-submission pass rates are a design problem, not an audit one", r: "5 min", hue: "from-gold-3 to-ink" },
];

export function Insights() {
  return (
    <section id="insights" className="relative bg-pearl py-28 text-navy md:py-40">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12 xl:pl-24">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionTag index="09" label="Insights" dark={false} />
            <RevealLines
              className="mt-8 text-[clamp(2.6rem,6vw,6.2rem)] font-light leading-none tracking-[-0.035em]"
              lines={[
                <span key="a">
                  Field <em className="font-serif font-normal italic text-royal">notes.</em>
                </span>,
              ]}
            />
          </div>
          <Button href="#insights" variant="ghost-dark">
            All insights
          </Button>
        </div>

        <div className="mt-16 grid gap-6 md:mt-20 md:grid-cols-3">
          {POSTS.map((p, i) => (
            <FadeUp key={p.t} delay={i * 0.1}>
              <a href="#insights" data-cursor-label="Read" className="group block">
                <div className={`relative aspect-[4/5] overflow-hidden rounded-[26px] bg-linear-to-br ${p.hue}`}>
                  <div className="absolute inset-0 transition-transform duration-[1.4s] ease-(--ease-expo) group-hover:scale-110">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
                    <Triquetra
                      className="absolute -bottom-[18%] -right-[18%] h-[90%] w-[90%] opacity-70 transition-transform duration-[1.6s] ease-(--ease-expo) group-hover:rotate-[30deg]"
                      width={0.018}
                    />
                    <svg viewBox="0 0 100 125" className="absolute inset-0 h-full w-full opacity-30">
                      {Array.from({ length: 14 }).map((_, k) => (
                        <path
                          key={k}
                          d={`M -10 ${20 + k * 7} Q 50 ${5 + k * 7 + i * 6} 110 ${30 + k * 6}`}
                          fill="none"
                          stroke="#f3dca0"
                          strokeWidth="0.15"
                        />
                      ))}
                    </svg>
                  </div>
                  <span className="eyebrow glass absolute left-5 top-5 rounded-full px-3 py-1.5 text-[10px] text-white">{p.c}</span>
                  <span className="eyebrow absolute bottom-5 left-5 text-white/70">{p.r} read</span>
                </div>
                <p className="mt-6 text-xl font-light leading-snug transition-colors group-hover:text-royal md:text-2xl">
                  <span className="link-u">{p.t}</span>
                </p>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */

export function Cta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const rot = useTransform(scrollYProgress, [0, 1], [-40, 0]);
  const sc = useTransform(scrollYProgress, [0, 1], [0.7, 1]);

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden bg-ink py-32 md:py-48">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_40%,rgba(216,179,106,0.14),transparent_70%)]" />
      <motion.div style={{ rotate: rot, scale: sc }} className="pointer-events-none absolute left-1/2 top-[8%] w-[min(90vw,760px)] -translate-x-1/2">
        <div className="absolute inset-0 blur-2xl">
          <Triquetra className="h-full w-full" width={0.05} />
        </div>
        <Triquetra className="relative h-full w-full" width={0.012} draw duration={3} />
        <svg viewBox="-1.25 -1.25 2.5 2.5" className="absolute inset-0 h-full w-full">
          <circle r="1.18" fill="none" stroke="rgba(216,179,106,.18)" strokeWidth="0.004" strokeDasharray="0.01 0.03" />
        </svg>
      </motion.div>

      <div className="relative mx-auto flex max-w-[1500px] flex-col items-center px-6 pt-[18vw] text-center md:pt-[14vw] lg:pt-56">
        <p className="eyebrow text-gold">10 — Begin</p>
        <RevealLines
          className="mt-8 text-[clamp(3.2rem,9vw,10rem)] font-light leading-[0.92] tracking-[-0.045em]"
          lines={[
            "Uncertainty is",
            <span key="c" className="text-gold-grad font-normal">
              a choice.
            </span>,
          ]}
        />
        <FadeUp delay={0.2}>
          <p className="mx-auto mt-10 max-w-md text-[16px] leading-relaxed text-white/65">
            A 45-minute diagnostic conversation with a senior partner.{" "}
            <em className="font-serif text-[1.15em] text-white">No decks, no pitch.</em>
          </p>
        </FadeUp>
        <FadeUp delay={0.3} className="mt-12 flex flex-wrap justify-center gap-3">
          <Button href="mailto:hello@triplearc.com?subject=Diagnostic%20conversation">Schedule a diagnostic</Button>
          <Button href="mailto:hello@triplearc.com" variant="ghost">
            hello@triplearc.com
          </Button>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------- footer ---------- */

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);
  const cols = [
    ["Solutions", ["GRC Strategy", "Internal Audit", "Cyber Risk", "Data Privacy", "Third-Party Risk"]],
    ["Company", ["About", "Leadership", "Careers", "Press"]],
    ["Insights", ["Field notes", "Regulatory briefs", "Events"]],
    ["Contact", ["hello@triplearc.com", "LinkedIn", "Mumbai · London · Dubai"]],
  ] as const;

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-white/10 bg-ink pt-24">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12 xl:pl-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-xs text-[14px] leading-relaxed text-white/50">
              Governance · Risk · Compliance. Engineered as one precise system for organisations that operate under scrutiny.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            {cols.map(([h, ls]) => (
              <div key={h}>
                <p className="eyebrow text-gold">{h}</p>
                <ul className="mt-5 space-y-3">
                  {ls.map((l) => (
                    <li key={l}>
                      <a href="#top" className="link-u text-[14px] text-white/65 transition-colors hover:text-white">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-20 overflow-hidden">
        <motion.p
          style={{ y }}
          className="select-none whitespace-nowrap bg-[linear-gradient(180deg,rgba(243,220,160,0.5),rgba(216,179,106,0.08)_75%)] bg-clip-text text-center text-[16.5vw] font-semibold leading-[0.8] tracking-[-0.06em] text-transparent"
        >
          TRIPLEARC
        </motion.p>
      </div>

      <div className="relative mx-auto flex max-w-[1500px] flex-col justify-between gap-4 border-t border-white/10 px-6 py-8 text-[12px] text-white/40 md:flex-row md:px-12 xl:pl-24">
        <span>© {new Date().getFullYear()} TripleArc GRC Solutions. All rights reserved.</span>
        <span className="flex gap-6">
          <a href="#top" className="link-u">Privacy</a>
          <a href="#top" className="link-u">Terms</a>
          <a href="#top" className="link-u">Back to top ↑</a>
        </span>
      </div>
    </footer>
  );
}

