"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, type MotionValue } from "motion/react";
import { Construction, EASE, Exploded, Stamp } from "./drawings";

/* ---------- shared drafting bits ---------- */

export function Sheet({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section
      id={id}
      className={`relative w-full shrink-0 overflow-hidden px-6 pb-16 pt-24 lg:h-[100svh] lg:w-screen lg:px-[5.5vw] lg:pb-[15vh] lg:pt-[13vh] ${className}`}
    >
      {children}
    </section>
  );
}

function Head({ no, title, note }: { no: string; title: string; note?: string }) {
  return (
    <div className="anno flex items-center gap-4 text-ink/70">
      <span className="text-accent">DWG TA-{no}</span>
      <span className="h-px w-10 bg-ink/40" />
      <span>{title}</span>
      {note && <span className="ml-auto hidden text-ink/50 md:block">{note}</span>}
    </div>
  );
}

function Lines({ lines, className = "", delay = 0 }: { lines: ReactNode[]; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            animate={{ y: on ? "0%" : "105%" }}
            transition={{ duration: 1.1, delay: delay + i * 0.09, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

function In({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Dimension line: |◄──── label ────►| */
function Dim({ children, className = "" }: { children: ReactNode; className?: string }) {
  const head = (flip: boolean) => (
    <svg viewBox="0 0 8 8" className={`h-2 w-2 shrink-0 ${flip ? "rotate-180" : ""}`}>
      <path d="M0 4 8 0v8z" fill="currentColor" />
    </svg>
  );
  return (
    <div className={`anno flex items-center text-ink/80 ${className}`}>
      <span className="h-3 w-px bg-current" />
      {head(false)}
      <motion.span
        className="h-px flex-1 origin-left bg-current"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE }}
      />
      <span className="whitespace-nowrap px-2">{children}</span>
      <motion.span
        className="h-px flex-1 origin-right bg-current"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE }}
      />
      {head(true)}
      <span className="h-3 w-px bg-current" />
    </div>
  );
}

export function Cta({ children, href = "#issue", onClick }: { children: ReactNode; href?: string; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className="anno group inline-flex h-12 items-center gap-4 border border-ink px-5 transition-colors duration-300 hover:bg-ink hover:text-bg"
    >
      <span className="h-1.5 w-1.5 bg-accent" />
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </a>
  );
}

/* ---------- 01 cover ---------- */

export function Cover({ next }: { next: () => void }) {
  return (
    <Sheet id="cover">
      <div className="grid h-full items-end gap-8 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <Head no="001" title="General arrangement" />
          <h1 className="display mt-6 text-[clamp(3.9rem,min(10.2vw,25vh),13.5rem)]">
            <Lines delay={0.2} lines={["Control,", <span key="e">engineered<span className="text-accent">.</span></span>]} />
          </h1>
          <In delay={0.7} className="mt-8 flex flex-col gap-7 md:flex-row md:items-end md:gap-12">
            <p className="max-w-sm text-[13.5px] leading-relaxed text-ink/80">
              TripleArc designs governance, risk and compliance as one load-bearing structure — drawn, specified and
              tested like anything else that must not fail.
            </p>
            <Cta onClick={next}>Read the drawing set</Cta>
          </In>
        </div>
        <div className="order-1 flex justify-center lg:order-2 lg:col-span-5 lg:justify-end">
          <Construction className="h-[min(44vh,88vw)] w-auto lg:h-[min(74vh,38vw)]" />
        </div>
      </div>
    </Sheet>
  );
}

/* ---------- 02 exploded view ---------- */

const PARTS = [
  ["1", "Governance", "Board frameworks, policy, decision rights"],
  ["2", "Risk", "Enterprise, third-party and cyber risk"],
  ["3", "Compliance", "Obligations mapped to tested controls"],
];

export function ExplodedView({ progress }: { progress: MotionValue<number> }) {
  return (
    <Sheet id="exploded">
      <div className="grid h-full gap-8 lg:grid-cols-12">
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <Head no="002" title="Exploded view" />
            <h2 className="display mt-6 text-[clamp(3rem,min(7.4vw,15vh),8.5rem)]">
              <Lines lines={["Three parts.", "One structure."]} />
            </h2>
            <In delay={0.3}>
              <p className="mt-6 max-w-sm text-[13.5px] leading-relaxed text-ink/80">
                Pulled apart, each arc is only a curve. Assembled, each one carries load for the other two. Remove any
                part and the structure fails.
              </p>
            </In>
          </div>
          <In delay={0.4} className="mt-10">
            <p className="anno mb-2 text-ink/60">Parts list</p>
            <table className="w-full border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="anno border-y border-ink/50 text-ink/60">
                  <th className="w-12 py-2 font-normal">Item</th>
                  <th className="w-36 font-normal">Part</th>
                  <th className="font-normal">Description</th>
                  <th className="w-10 text-right font-normal">Qty</th>
                </tr>
              </thead>
              <tbody>
                {PARTS.map(([n, p, d]) => (
                  <tr key={n} className="border-b border-ink/25 transition-colors hover:bg-ink/10">
                    <td className="py-3 text-accent">{n}</td>
                    <td className="font-display text-[22px] font-medium uppercase leading-none">{p}</td>
                    <td className="pr-3 text-ink/75">{d}</td>
                    <td className="text-right">1</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </In>
        </div>
        <div className="flex items-center justify-center lg:col-span-7">
          <Exploded progress={progress} className="h-[min(50vh,92vw)] w-auto lg:h-[min(72vh,52vw)]" />
        </div>
      </div>
    </Sheet>
  );
}

/* ---------- 03 schedule of services ---------- */

const SERVICES = [
  ["GRC Strategy", "Operating models and multi-year roadmaps", "S-01"],
  ["Internal Audit", "Co-sourced and outsourced assurance", "S-02"],
  ["Cyber Risk", "ISO 27001, NIST CSF, board reporting", "S-03"],
  ["Data Privacy", "DPDP and GDPR programmes", "S-04"],
  ["Third-Party Risk", "Tiering, diligence and monitoring", "S-05"],
  ["Regulatory Advisory", "Interpretation, gap analysis, remediation", "S-06"],
  ["ESG Assurance", "Disclosure governance, BRSR readiness", "S-07"],
  ["Risk Culture", "Behaviour that makes controls stick", "S-08"],
];

export function Schedule() {
  return (
    <Sheet id="schedule">
      <div className="flex h-full flex-col">
        <Head no="003" title="Schedule of services" note="8 No. disciplines · read with TA-002" />
        <div className="mt-6 flex-1 lg:mt-[4vh]">
          <div className="anno grid grid-cols-[3rem_1fr_4rem] border-y border-ink/50 py-2 text-ink/60 md:grid-cols-[5rem_1.1fr_1fr_5rem]">
            <span>No.</span>
            <span>Discipline</span>
            <span className="hidden md:block">Scope</span>
            <span className="text-right">Ref</span>
          </div>
          {SERVICES.map(([t, d, r], i) => (
            <motion.a
              key={t}
              href="#issue"
              className="group grid grid-cols-[3rem_1fr_4rem] items-center border-b border-ink/25 transition-colors duration-200 hover:bg-ink hover:text-bg md:grid-cols-[5rem_1.1fr_1fr_5rem] lg:h-[7.4vh]"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
            >
              <span className="anno pl-2 text-accent group-hover:text-bg">{String(i + 1).padStart(2, "0")}</span>
              <span className="display py-2 text-[clamp(1.9rem,min(3.6vw,5.6vh),3.6rem)] font-medium transition-transform duration-300 group-hover:translate-x-3">
                {t}
              </span>
              <span className="hidden text-[12.5px] opacity-75 md:block">{d}</span>
              <span className="anno pr-2 text-right">{r}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

/* ---------- 04 method sequence ---------- */

const STEPS = [
  ["Diagnose", "Wks 1–3", "A forensic read of obligations, owners and evidence."],
  ["Design", "Wks 3–6", "A target architecture with no duplicated controls."],
  ["Deploy", "Wks 6–14", "Policies, workflows and tooling, rolled out with your teams."],
  ["Assure", "Ongoing", "Independent testing and board reporting."],
  ["Evolve", "Ongoing", "Horizon scanning ahead of regulation."],
];

// [phase, start week, end week]; anything past week 20 is ongoing and drawn hatched
const GANTT: [string, number, number][] = [
  ["Diagnose", 0, 3],
  ["Design", 3, 6],
  ["Deploy", 6, 14],
  ["Assure", 14, 99],
  ["Evolve", 14, 99],
];

export function Method() {
  return (
    <Sheet id="method">
      <div className="flex h-full flex-col">
        <Head no="004" title="Method sequence" note="Elevation · not to scale" />
        <h2 className="display mt-6 text-[clamp(3rem,min(7.4vw,14vh),8.5rem)]">
          <Lines lines={["The Arc Method"]} />
        </h2>
        <div className="relative mt-10 flex-1 lg:mt-[4vh]">
          <div className="grid gap-y-10 lg:grid-cols-5">
            {STEPS.map(([t, w, d], i) => (
              <div key={t} className="relative lg:pr-5">
                <Dim>{w}</Dim>
                <div className="relative mt-5 flex items-center">
                  <motion.span
                    className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-accent bg-bg text-[12px] text-accent"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: EASE }}
                  >
                    {i + 1}
                  </motion.span>
                  <motion.span
                    className="absolute left-0 right-0 h-px origin-left bg-ink"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: EASE }}
                  />
                </div>
                <In delay={0.4 + i * 0.12}>
                  <span className="mt-3 block h-[2.5vh] w-px bg-ink/50 lg:ml-[17px]" />
                  <p className="display mt-3 text-[clamp(2.2rem,min(3.6vw,7vh),4rem)] font-medium">{t}</p>
                  <p className="mt-3 max-w-[15rem] text-[12.5px] leading-relaxed text-ink/75">{d}</p>
                </In>
              </div>
            ))}
          </div>

          {/* programme chart */}
          <In delay={0.6} className="mt-[5vh] hidden lg:block">
            <p className="anno mb-2 text-ink/60">Programme · weeks from appointment</p>
            <div className="relative border border-ink/50">
              <div className="absolute inset-0 flex">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className="flex-1 border-r border-ink/20 last:border-0" />
                ))}
              </div>
              {GANTT.map(([t, from, to], i) => (
                <div key={t} className="relative flex h-[3.4vh] items-center border-b border-ink/20 last:border-0">
                  <motion.span
                    className={`absolute inset-y-[22%] origin-left ${to > 20 ? "hatch border border-ink/70" : "bg-ink"}`}
                    style={{ left: `${(from / 20) * 100}%`, width: `${((Math.min(to, 20) - from) / 20) * 100}%` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.7 + i * 0.1, ease: EASE }}
                  />
                  <span className="anno relative pl-2 text-[10px] text-accent mix-blend-difference">{t}</span>
                </div>
              ))}
            </div>
            <div className="anno mt-1.5 flex justify-between text-[10px] text-ink/60">
              {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
          </In>
        </div>
      </div>
    </Sheet>
  );
}

/* ---------- 05 test results ---------- */

function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const c = animate(0, to, { duration: 2, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [seen, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

const RESULTS = [
  [250, "+", "Engagements delivered"],
  [98, "%", "First-submission audit pass rate"],
  [40, "%", "Control redundancy removed"],
  [0, "", "Regulatory penalties for clients"],
] as const;

export function Results() {
  return (
    <Sheet id="results">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <Head no="005" title="Test results" />
            <h2 className="display mt-6 text-[clamp(3rem,min(7.4vw,14vh),8.5rem)]">
              <Lines lines={["Built for scrutiny."]} />
            </h2>
          </div>
          <motion.div
            className="anno mt-10 hidden rotate-[-8deg] border-2 border-accent px-4 py-2 text-[15px] text-accent md:block"
            initial={{ scale: 2.4, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 1.1, ease: [0.2, 1.4, 0.4, 1] }}
          >
            Pass
          </motion.div>
        </div>
        <div className="mt-10 grid flex-1 grid-cols-2 content-center gap-x-6 gap-y-12 lg:grid-cols-4">
          {RESULTS.map(([v, s, l], i) => (
            <In key={l} delay={i * 0.1}>
              <p className="anno text-ink/60">Test {String(i + 1).padStart(2, "0")}</p>
              <p className="display mt-2 text-[clamp(4.4rem,min(9.6vw,22vh),11rem)]">
                <Count to={v} suffix={s} />
              </p>
              <Dim className="mt-4">{i === 3 ? "nil" : "measured"}</Dim>
              <p className="mt-4 max-w-[14rem] text-[12.5px] leading-relaxed text-ink/80">{l}</p>
            </In>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

/* ---------- 06 sector plan ---------- */

const ROOMS = [
  ["Banking", "lg:col-[1/5] lg:row-[1/5]", "Prudential, conduct, resilience"],
  ["Insurance", "lg:col-[5/9] lg:row-[1/4]", "Solvency and distribution"],
  ["Fintech", "lg:col-[9/13] lg:row-[1/4]", "Licensing, payments, lending"],
  ["Healthcare", "lg:col-[5/8] lg:row-[4/7]", "Patient data, accreditation"],
  ["Technology", "lg:col-[8/13] lg:row-[4/7]", "SOC 2, cross-border data"],
  ["Energy", "lg:col-[1/3] lg:row-[5/7]", "Safety, ESG"],
  ["Public sector", "lg:col-[3/5] lg:row-[5/7]", "Accountability"],
];

export function Plan() {
  return (
    <Sheet id="plan">
      <div className="flex h-full flex-col">
        <Head no="006" title="Sector plan" note="Plan view · hover a room" />
        <div className="mt-6 grid flex-1 gap-6 lg:mt-[4vh] lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h2 className="display text-[clamp(3rem,min(6vw,12vh),7rem)]">
              <Lines lines={["Sectors", "under", "watch."]} />
            </h2>
            <In delay={0.3}>
              <p className="mt-6 max-w-[16rem] text-[12.5px] leading-relaxed text-ink/80">
                Seven rooms, one building. Each sector has its own regulators and its own fault lines; the structure
                underneath is shared.
              </p>
            </In>
          </div>
          <div className="grid gap-0 border-2 border-ink lg:col-span-9 lg:grid-cols-12 lg:grid-rows-6">
            {ROOMS.map(([name, pos, note], i) => (
              <motion.div
                key={name}
                className={`group relative border border-ink/70 p-4 transition-colors duration-300 hover:bg-ink/10 ${pos}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.09 }}
              >
                <div className="hatch absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-40" />
                <div className="relative flex h-full flex-col justify-between gap-6">
                  <span className="anno text-ink/60">R-{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="display text-[clamp(1.6rem,min(2.8vw,5.5vh),3.2rem)] font-medium transition-colors group-hover:text-accent">{name}</p>
                    <p className="mt-1 text-[11.5px] text-ink/70">{note}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
}

/* ---------- 07 issue ---------- */

export function Issue() {
  return (
    <Sheet id="issue">
      <div className="grid h-full gap-8 lg:grid-cols-12">
        <div className="flex flex-col justify-between lg:col-span-8">
          <Head no="007" title="Issue" />
          <div>
            <h2 className="display mt-8 text-[clamp(3.8rem,min(11.5vw,22vh),14rem)]">
              <Lines lines={["Uncertainty", "is a choice."]} />
            </h2>
            <In delay={0.4} className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
              <Cta href="mailto:hello@triplearc.com?subject=Diagnostic%20conversation">Book a diagnostic</Cta>
              <a href="mailto:hello@triplearc.com" className="text-[14px] underline decoration-ink/40 underline-offset-4 hover:decoration-accent">
                hello@triplearc.com
              </a>
            </In>
            <In delay={0.5}>
              <p className="mt-6 max-w-sm text-[12.5px] leading-relaxed text-ink/75">
                45 minutes with a senior partner. No decks, no pitch — you leave with a clear view of where you stand.
              </p>
            </In>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-8 lg:col-span-4 lg:items-end">
          <motion.div
            initial={{ scale: 1.8, opacity: 0, rotate: -30 }}
            whileInView={{ scale: 1, opacity: 1, rotate: -12 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.2, 1.3, 0.4, 1] }}
          >
            <Stamp className="h-40 w-40 lg:h-[min(30vh,16vw)] lg:w-[min(30vh,16vw)]" />
          </motion.div>
          <In delay={0.3} className="w-full max-w-xs">
            <p className="anno mb-2 text-ink/60">Revisions</p>
            {[
              ["A", "Issued for diagnosis"],
              ["B", "Issued for design"],
              ["C", "Issued for construction"],
            ].map(([r, t]) => (
              <div key={r} className="grid grid-cols-[2.5rem_1fr] border-t border-ink/30 py-2 text-[12px]">
                <span className="text-accent">{r}</span>
                <span className="text-ink/80">{t}</span>
              </div>
            ))}
            <p className="anno mt-6 text-ink/50">© {new Date().getFullYear()} TripleArc GRC Solutions</p>
          </In>
        </div>
      </div>
    </Sheet>
  );
}
