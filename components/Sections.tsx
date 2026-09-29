"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  transform,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useMaterials, type Materials } from "@/lib/materials";
import { Arrow, EASE, Eyebrow, Fade, Lines, Magnetic, Mark, useRange } from "./core";

const WRAP = "mx-auto max-w-[1600px] px-5 md:px-10";

/* ---------- statement: words darken as they pass ---------- */

export function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const text =
    "We do not sell reassurance. We build the conditions that justify it — one structure where governance, risk and compliance hold each other up.";
  const list = text.split(" ");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.45"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    words.current.forEach((el, i) => {
      if (!el) return;
      const t = Math.min(1, Math.max(0, v * list.length - i + 0.5));
      el.style.opacity = String(0.16 + 0.84 * t);
    });
  });

  return (
    <section className="bg-bone pb-32 pt-24 md:pb-48 md:pt-32">
      <div className={`${WRAP} grid gap-10 md:grid-cols-12`}>
        <Eyebrow n="01" className="md:col-span-3 md:pt-4">
          Position
        </Eyebrow>
        <div ref={ref} className="md:col-span-9">
          <p className="text-[clamp(1.9rem,4.1vw,4.25rem)] font-light leading-[1.08] tracking-[-0.035em]">
            {list.map((w, i) => (
              <span
                key={i}
                ref={(el) => {
                  words.current[i] = el;
                }}
                style={{ opacity: 0.16 }}
              >
                {w}{" "}
              </span>
            ))}
          </p>
          <div className="mt-16 grid gap-10 border-t border-line pt-8 sm:grid-cols-3 md:mt-24">
            {[
              ["Independent", "No software to sell, no audit conflicts, no referral fees."],
              ["Senior-led", "Partners run every engagement, start to finish."],
              ["Evidence-based", "Each recommendation traces to an obligation and a control."],
            ].map(([t, d], i) => (
              <Fade key={t} delay={i * 0.08}>
                <p className="text-[15px] font-medium">{t}</p>
                <p className="mt-2 max-w-[16rem] text-[14px] leading-relaxed text-ink/55">{d}</p>
              </Fade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- services index with a material preview that follows the cursor ---------- */

const SERVICES: { t: string; d: string; m: keyof Materials }[] = [
  { t: "GRC Strategy", d: "Operating models and multi-year roadmaps", m: "lapis" },
  { t: "Internal Audit", d: "Co-sourced and outsourced assurance", m: "marble" },
  { t: "Cyber Risk", d: "ISO 27001, NIST CSF and board reporting", m: "brass" },
  { t: "Data Privacy", d: "DPDP and GDPR programmes", m: "lapis" },
  { t: "Third-Party Risk", d: "Tiering, diligence and monitoring", m: "marble" },
  { t: "Regulatory Advisory", d: "Interpretation, gap analysis, remediation", m: "brass" },
  { t: "ESG Assurance", d: "Disclosure governance and BRSR readiness", m: "lapis" },
  { t: "Risk Culture", d: "Behaviour that makes controls stick", m: "marble" },
];

export function Services() {
  const mats = useMaterials();
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 160, damping: 22, mass: 0.6 });
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className="relative bg-bone pb-32 md:pb-48">
      <div className={WRAP}>
        <div className="flex items-end justify-between border-b border-line pb-8">
          <Lines className="text-[clamp(2.6rem,6vw,6rem)] font-light leading-[0.95] tracking-[-0.045em]" lines={["Services"]} />
          <Eyebrow n="02" className="pb-3">
            08 disciplines
          </Eyebrow>
        </div>

        <div
          ref={listRef}
          className="relative"
          onPointerMove={(e) => {
            const r = listRef.current!.getBoundingClientRect();
            x.set(e.clientX - r.left);
            y.set(e.clientY - r.top);
          }}
          onPointerLeave={() => setActive(null)}
        >
          {SERVICES.map((s, i) => (
            <Fade key={s.t} delay={i * 0.03}>
              <a
                href="#contact"
                onPointerEnter={() => setActive(i)}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line py-6 md:grid-cols-[5rem_1fr_1fr_auto] md:py-8"
              >
                <span className="label tabular text-stone">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[clamp(1.5rem,3vw,2.9rem)] font-light leading-none tracking-[-0.035em] transition-transform duration-700 ease-(--ease-out-expo) md:group-hover:translate-x-4">
                  {s.t}
                </span>
                <span className="hidden text-[14px] text-ink/50 transition-colors duration-500 group-hover:text-ink md:block">{s.d}</span>
                <Arrow className="h-4 w-4 text-ink/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-ink" />
              </a>
            </Fade>
          ))}

          {/* cursor-following swatch */}
          <motion.div
            className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
            style={{ x: sx, y: sy }}
          >
            <motion.div
              className="-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[3px] shadow-[0_30px_60px_-20px_rgba(12,14,18,0.45)]"
              animate={{
                width: active === null ? 0 : 240,
                height: active === null ? 0 : 300,
                opacity: active === null ? 0 : 1,
              }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {mats &&
                SERVICES.map((s, i) => (
                  <motion.div
                    key={s.t}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${mats[s.m]})`, backgroundPosition: `${(i * 23) % 100}% ${(i * 41) % 100}%` }}
                    animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.15 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  />
                ))}
              <Mark
                className={`absolute bottom-4 left-4 h-6 w-6 ${active !== null && SERVICES[active].m === "marble" ? "text-ink/60" : "text-white/80"}`}
                width={0.1}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- lapis panel that opens outward to full bleed ---------- */

export function MaterialBand() {
  const mats = useMaterials();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clip = useTransform(scrollYProgress, (v) => {
    const t = transform(v, [0, 0.55], [1, 0]);
    return `inset(${30 * t}% ${36 * t}% ${30 * t}% ${36 * t}% round ${5 * t}px)`;
  });
  const scale = useRange(scrollYProgress, [0, 1], [1.35, 1]);
  const textOpacity = useRange(scrollYProgress, [0.5, 0.7], [0, 1]);
  const textY = useRange(scrollYProgress, [0.5, 0.7], [40, 0]);
  const tag = useRange(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section ref={ref} className="relative h-[260vh] bg-bone">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ opacity: tag }} className={`${WRAP} absolute inset-x-0 top-24 flex justify-between`}>
          <span className="label text-stone">Material</span>
          <span className="label text-stone">Lapis lazuli · Pyrite</span>
        </motion.div>
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 bg-lapis">
          {mats && (
            <motion.div
              style={{ scale, backgroundImage: `url(${mats.lapisWide})` }}
              className="absolute inset-0 bg-cover bg-center"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,30,0.1),rgba(6,10,30,0.55))]" />
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className={`${WRAP} absolute inset-x-0 bottom-0 grid gap-8 pb-12 text-white md:grid-cols-12 md:pb-16`}
          >
            <h2 className="text-[clamp(2.6rem,7vw,7.5rem)] font-light leading-[0.92] tracking-[-0.05em] md:col-span-8">
              Formed under
              <br />
              pressure.
            </h2>
            <p className="self-end text-[15px] leading-relaxed text-white/75 md:col-span-3 md:col-start-10">
              Lapis takes millions of years of heat and pressure to form. Resilience is built the same way — deliberately,
              under load, with nothing left to chance.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- numbers ---------- */

function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const c = animate(0, to, { duration: 2.4, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [seen, to]);
  return (
    <span ref={ref} className="tabular">
      {n}
      {suffix}
    </span>
  );
}

export function Numbers() {
  const stats = [
    { v: 250, s: "+", l: "Engagements delivered" },
    { v: 98, s: "%", l: "First-submission audit pass rate" },
    { v: 40, s: "%", l: "Control redundancy removed" },
    { v: 0, s: "", l: "Regulatory penalties for clients" },
  ];
  return (
    <section className="bg-ink py-28 text-bone md:py-44">
      <div className={WRAP}>
        <div className="grid gap-10 md:grid-cols-12">
          <Eyebrow n="03" className="text-bone/60 md:col-span-3">
            Record
          </Eyebrow>
          <Lines
            className="text-[clamp(2.2rem,4.6vw,4.6rem)] font-light leading-[1] tracking-[-0.04em] md:col-span-9"
            lines={["Built for scrutiny.", <span key="b" className="text-bone/40">Measured by outcome.</span>]}
          />
        </div>
        <div className="mt-20 grid grid-cols-2 md:mt-32 md:grid-cols-4">
          {stats.map((s, i) => (
            <Fade key={s.l} delay={i * 0.08} className={`border-t border-bone/15 pb-10 pt-6 md:pr-8 ${i % 2 ? "pl-5 md:pl-0" : ""}`}>
              <p className="label text-bone/40">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-10 text-[clamp(3.6rem,7vw,7rem)] font-extralight leading-none tracking-[-0.06em]">
                <Count to={s.v} suffix={s.s} />
              </p>
              <p className="mt-4 max-w-[12rem] text-[14px] leading-snug text-bone/60">{s.l}</p>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- method: pinned horizontal track ---------- */

const STEPS = [
  { t: "Diagnose", w: "Weeks 1–3", d: "A forensic read of obligations, owners, evidence and the gaps between them." },
  { t: "Design", w: "Weeks 3–6", d: "A target architecture that removes duplication and maps every control to a real risk." },
  { t: "Deploy", w: "Weeks 6–14", d: "Policies, workflows and tooling rolled out with your teams, not around them." },
  { t: "Assure", w: "Ongoing", d: "Independent testing and board reporting that proves the system works." },
  { t: "Evolve", w: "Ongoing", d: "Horizon scanning keeps the structure ahead of regulation." },
];

export function Method() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const dist = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => transform(v, [0.05, 0.95], [0, -dist.current]));
  const bar = useRange(scrollYProgress, [0.05, 0.95], [0, 1]);

  useEffect(() => {
    const measure = () => {
      if (track.current) dist.current = Math.max(0, track.current.scrollWidth - window.innerWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section id="method" ref={ref} className="relative h-[380vh] bg-ink text-bone">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className={`${WRAP} w-full pt-28 md:pt-32`}>
          <div className="flex items-end justify-between">
            <Lines className="text-[clamp(2.6rem,6vw,6rem)] font-light leading-[0.95] tracking-[-0.045em]" lines={["The Arc Method"]} />
            <div className="hidden md:block">
              <Eyebrow n="04" className="pb-3 text-bone/60">
                Five phases
              </Eyebrow>
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 items-center">
          <motion.div ref={track} style={{ x }} className="flex gap-0 pl-5 md:pl-10">
            {STEPS.map((s, i) => (
              <div key={s.t} className="w-[82vw] shrink-0 border-l border-bone/15 px-6 md:w-[36vw] md:px-10 lg:w-[30vw]">
                <p className="label tabular text-gold">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-16 text-[clamp(2.4rem,4.4vw,4.4rem)] font-light leading-none tracking-[-0.045em]">{s.t}</p>
                <p className="mt-6 max-w-[22rem] text-[15px] leading-relaxed text-bone/60">{s.d}</p>
                <p className="label mt-10 text-bone/40">{s.w}</p>
              </div>
            ))}
            <div className="w-[20vw] shrink-0" />
          </motion.div>
        </div>

        <div className={`${WRAP} w-full pb-10`}>
          <div className="h-px w-full bg-bone/15">
            <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- sectors ---------- */

const SECTORS = ["Banking", "Insurance", "Fintech", "Healthcare", "Technology", "Energy", "Public sector"];

export function Sectors() {
  return (
    <section id="sectors" className="bg-bone py-28 md:py-44">
      <div className={`${WRAP} grid gap-12 md:grid-cols-12`}>
        <div className="md:col-span-3">
          <Eyebrow n="05">Sectors</Eyebrow>
          <Fade delay={0.1}>
            <p className="mt-6 max-w-[16rem] text-[14px] leading-relaxed text-ink/55">
              Each industry forms under different pressures. We read the grain before we cut.
            </p>
          </Fade>
        </div>
        <div className="md:col-span-9">
          <div className="text-[clamp(2.4rem,6.2vw,6.6rem)] font-light leading-[1.02] tracking-[-0.05em]">
            {SECTORS.map((s, i) => (
              <Fade key={s} delay={i * 0.05} className="inline">
                <span className="inline-block cursor-default transition-colors duration-500 hover:text-gold">{s}</span>
                {i < SECTORS.length - 1 && <span className="text-ink/20">, </span>}
              </Fade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- contact: rings ripple outward from the call to action ---------- */

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-bone pb-32 pt-12 md:pb-44">
      <div className="pointer-events-none absolute left-1/2 top-[58%] aspect-square w-[150vmax] -translate-x-1/2 -translate-y-1/2 text-ink/25">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="ripple" style={{ animationDelay: `${i * 1.8}s` }} />
        ))}
      </div>
      <div className={`${WRAP} relative flex flex-col items-center text-center`}>
        <Eyebrow n="06">Begin</Eyebrow>
        <Lines
          className="mt-10 text-[clamp(3rem,9vw,9.5rem)] font-light leading-[0.92] tracking-[-0.055em]"
          lines={["Uncertainty", "is a choice."]}
        />
        <Fade delay={0.2}>
          <p className="mx-auto mt-10 max-w-sm text-[15px] leading-relaxed text-ink/60">
            A 45-minute diagnostic conversation with a senior partner. No decks, no pitch.
          </p>
        </Fade>
        <Fade delay={0.3} className="mt-14">
          <Magnetic>
            <a
              href="mailto:hello@triplearc.com?subject=Diagnostic%20conversation"
              className="group relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-ink text-[14px] text-bone"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-gold transition-transform duration-700 ease-(--ease-out-expo) group-hover:translate-y-0" />
              <span className="relative flex items-center gap-2">
                Book a diagnostic
                <Arrow className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </a>
          </Magnetic>
        </Fade>
      </div>
    </section>
  );
}

/* ---------- footer ---------- */

export function Footer() {
  const cols = [
    ["Services", ["GRC Strategy", "Internal Audit", "Cyber Risk", "Data Privacy"]],
    ["Company", ["About", "Leadership", "Careers"]],
    ["Follow", ["LinkedIn", "Insights"]],
  ] as const;
  return (
    <footer className="bg-ink pt-24 text-bone">
      <div className={WRAP}>
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="label text-bone/40">Write to us</p>
            <a href="mailto:hello@triplearc.com" className="u-link mt-5 inline-block text-[clamp(1.8rem,3.6vw,3.4rem)] font-light tracking-[-0.035em]">
              hello@triplearc.com
            </a>
          </div>
          {cols.map(([h, ls]) => (
            <div key={h} className="md:col-span-2">
              <p className="label text-bone/40">{h}</p>
              <ul className="mt-5 space-y-2.5 text-[14px] text-bone/75">
                {ls.map((l) => (
                  <li key={l}>
                    <a href="#top" className="transition-colors hover:text-bone">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-24 overflow-hidden">
        <p className="select-none whitespace-nowrap text-center text-[23vw] font-light leading-[0.75] tracking-[-0.07em] text-bone/[0.07]">
          TripleArc
        </p>
      </div>
      <div className={`${WRAP} flex flex-col justify-between gap-3 border-t border-bone/10 py-7 text-[12px] text-bone/45 md:flex-row`}>
        <span>© {new Date().getFullYear()} TripleArc GRC Solutions</span>
        <span className="flex gap-6">
          <a href="#top">Privacy</a>
          <a href="#top">Terms</a>
          <a href="#top">Back to top</a>
        </span>
      </div>
    </footer>
  );
}
