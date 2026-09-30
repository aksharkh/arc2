"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, type MotionValue } from "motion/react";
import { ArrowIcon, Badge, Button, Count, EASE, Logo, Mark, Rise, SectionHead, Spot, useRange, Words, WRAP } from "./kit";
import { Arcs, Bars, Checklist, Heatmap, ScoreRing, Tree } from "./widgets";

/* ---------- frameworks strip ---------- */

const FRAMEWORKS = ["ISO 27001", "SOC 2", "NIST CSF", "COSO", "DPDP Act", "GDPR", "DORA", "NIS2", "PCI DSS", "SOX", "ISO 31000", "BRSR"];

export function Frameworks() {
  return (
    <section className="py-14 md:py-20">
      <p className="text-center text-[13px] font-semibold text-slate">Programmes aligned to the frameworks your regulators use</p>
      <div className="marquee-wrap relative mt-7 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee" style={{ ["--dur" as string]: "48s" }}>
          {[...FRAMEWORKS, ...FRAMEWORKS].map((f, i) => (
            <span key={i} className="mx-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-ink shadow-(--shadow-card)">
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- bento: three pillars ---------- */

const CARD = "rounded-[28px] p-7 md:p-9 transition-transform duration-500 ease-(--ease-out-expo) hover:-translate-y-1";

export function Pillars() {
  return (
    <section id="pillars" className="py-16 md:py-24">
      <div className={WRAP}>
        <SectionHead tag="The structure" title="Three pillars. One structure." highlight={["One"]}>
          Each discipline carries load for the other two. We design them together, so nothing is duplicated and nothing
          falls between teams.
        </SectionHead>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-12">
          <Rise className="md:col-span-7">
            <Spot className={`${CARD} h-full bg-white shadow-(--shadow-card)`}>
              <div className="flex items-start justify-between">
                <div className="max-w-sm">
                  <p className="text-[13px] font-bold text-cobalt">01</p>
                  <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.035em]">Governance</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate">
                    Board frameworks, policy and decision rights — clear lines from the boardroom to every control owner.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Tree />
              </div>
            </Spot>
          </Rise>

          <Rise delay={0.08} className="md:col-span-5">
            <Spot tint="rgba(255,255,255,0.16)" className={`${CARD} flex h-full flex-col justify-between bg-cobalt text-white`}>
              <div>
                <p className="text-[13px] font-bold text-white/70">02</p>
                <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.035em]">Risk</h3>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/75">
                  Enterprise, third-party and cyber risk — quantified, owned and tracked to treatment.
                </p>
              </div>
              <div className="mt-8 flex items-end gap-6">
                <div className="w-[52%] max-w-[220px]">
                  <Heatmap />
                </div>
                <div className="pb-1 text-[12px] font-semibold text-white/70">
                  <p>Impact ↑</p>
                  <p className="mt-1">Likelihood →</p>
                </div>
              </div>
            </Spot>
          </Rise>

          <Rise className="md:col-span-5">
            <Spot tint="rgba(80,120,255,0.25)" className={`${CARD} h-full bg-navy text-white`}>
              <p className="text-[13px] font-bold text-white/60">03</p>
              <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.035em]">Compliance</h3>
              <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/65">
                Obligations mapped to controls, with evidence that passes the first time.
              </p>
              <div className="mt-7">
                <Checklist dark items={["Obligation register mapped", "Evidence linked to controls", "First-submission approval"]} />
              </div>
            </Spot>
          </Rise>

          <Rise delay={0.08} className="md:col-span-3">
            <Spot className={`${CARD} flex h-full flex-col justify-between bg-white shadow-(--shadow-card)`}>
              <p className="text-[13px] font-semibold text-slate">Engagements delivered</p>
              <div>
                <p className="mt-6 text-[64px] font-semibold leading-none tracking-[-0.06em]">
                  <Count to={250} suffix="+" />
                </p>
                <div className="mt-5">
                  <Bars values={[30, 42, 38, 55, 63, 78, 100]} />
                </div>
              </div>
            </Spot>
          </Rise>

          <Rise delay={0.16} className="md:col-span-4">
            <Spot className={`${CARD} flex h-full items-center justify-between gap-6 bg-sky`}>
              <div>
                <p className="text-[13px] font-semibold text-cobalt">Audit pass rate</p>
                <p className="mt-3 text-[22px] font-semibold leading-tight tracking-[-0.03em]">
                  First submission,
                  <br />
                  first approval.
                </p>
              </div>
              <ScoreRing value={98} size={124} />
            </Spot>
          </Rise>
        </div>
      </div>
    </section>
  );
}

/* ---------- services: tabs with a crossfading detail card ---------- */

const SERVICES = [
  { t: "GRC Strategy", d: "Target operating models and multi-year roadmaps tied to business outcomes.", k: ["Maturity assessment", "Operating model", "3-year roadmap"] },
  { t: "Internal Audit", d: "Co-sourced and outsourced audit, risk-based plans and quality assessments.", k: ["Audit universe", "Risk-based plan", "QAIP review"] },
  { t: "Cyber Risk", d: "Cyber maturity, ISO 27001 and NIST CSF programmes, board-level cyber reporting.", k: ["ISO 27001", "NIST CSF", "Board reporting"] },
  { t: "Data Privacy", d: "DPDP and GDPR readiness, DPIAs, records of processing and privacy operations.", k: ["DPDP readiness", "DPIA", "RoPA"] },
  { t: "Third-Party Risk", d: "Vendor tiering, due diligence and continuous monitoring across the supply chain.", k: ["Vendor tiering", "Due diligence", "Monitoring"] },
  { t: "Regulatory Advisory", d: "Interpretation, gap analysis and remediation for sectoral regulators.", k: ["Gap analysis", "Remediation", "Regulator liaison"] },
  { t: "ESG Assurance", d: "ESG data governance, BRSR readiness and assurance-grade disclosures.", k: ["Data governance", "BRSR", "Assurance"] },
  { t: "Risk Culture", d: "Behavioural diagnostics, training and incentives that make controls stick.", k: ["Diagnostics", "Training", "Incentives"] },
];

export function Services() {
  const [a, setA] = useState(0);
  const s = SERVICES[a];
  return (
    <section id="services" className="py-16 md:py-24">
      <div className={WRAP}>
        <SectionHead tag="Services" title="Eight disciplines, one team." highlight={["one"]}>
          Pick a starting point. Every service plugs into the same structure, so work done once is never done twice.
        </SectionHead>

        <div className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-12">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0">
            {SERVICES.map((x, i) => (
              <button
                key={x.t}
                onClick={() => setA(i)}
                onPointerEnter={() => setA(i)}
                className={`relative flex shrink-0 items-center justify-between gap-6 rounded-2xl px-5 py-4 text-left text-[16px] font-semibold tracking-[-0.02em] transition-colors duration-300 ${
                  a === i ? "text-white" : "text-ink hover:bg-white"
                }`}
              >
                {a === i && (
                  <motion.span layoutId="svc" className="absolute inset-0 rounded-2xl bg-cobalt" transition={{ type: "spring", stiffness: 380, damping: 34 }} />
                )}
                <span className="relative flex items-center gap-4">
                  <span className={`tabular text-[12px] ${a === i ? "text-white/70" : "text-slate"}`}>{String(i + 1).padStart(2, "0")}</span>
                  {x.t}
                </span>
                <ArrowIcon className={`relative hidden h-4 w-4 transition-opacity lg:block ${a === i ? "opacity-100" : "opacity-0"}`} />
              </button>
            ))}
          </div>

          <div className="relative min-h-[460px] overflow-hidden rounded-[28px] bg-white shadow-(--shadow-card) lg:col-span-8">
            <div className="pointer-events-none absolute -right-[18%] -top-[30%] h-[120%] text-cobalt" style={{ aspectRatio: "1" }}>
              <motion.div className="h-full w-full" animate={{ rotate: a * 45 }} transition={{ duration: 1.2, ease: EASE }}>
                <Arcs className="h-full w-full" stroke="rgba(29,77,255,0.22)" />
              </motion.div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={a}
                className="relative flex h-full min-h-[460px] flex-col justify-between p-7 md:p-10"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <p className="tabular text-[84px] font-semibold leading-none tracking-[-0.06em] text-sky md:text-[120px]">
                  {String(a + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold tracking-[-0.04em]">{s.t}</h3>
                  <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-slate">{s.d}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {s.k.map((k) => (
                      <span key={k} className="rounded-full bg-mist px-4 py-2 text-[13px] font-semibold">
                        {k}
                      </span>
                    ))}
                  </div>
                  <a href="#contact" className="group mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-cobalt">
                    Discuss this service
                    <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- method: cards that stack as you scroll ---------- */

const STEPS = [
  { t: "Diagnose", w: "Weeks 1–3", d: "A forensic read of obligations, owners, evidence and the gaps between them." },
  { t: "Design", w: "Weeks 3–6", d: "A target architecture that removes duplication and maps every control to a real risk." },
  { t: "Deploy", w: "Weeks 6–14", d: "Policies, workflows and tooling rolled out with your teams, not around them." },
  { t: "Assure", w: "Ongoing", d: "Independent testing and board reporting that proves the system works." },
  { t: "Evolve", w: "Ongoing", d: "Horizon scanning keeps the structure ahead of regulation." },
];
const TONES = ["bg-white text-ink", "bg-sky text-ink", "bg-cobalt text-white", "bg-navy text-white", "bg-white text-ink"];

function StepCard({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const n = STEPS.length;
  const scale = useRange(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.035]);
  const s = STEPS[i];
  const dark = i === 2 || i === 3;
  return (
    <div className="sticky" style={{ top: `calc(6.5rem + ${i * 18}px)` }}>
      <motion.div
        style={{ scale }}
        className={`grid min-h-[360px] origin-top gap-8 rounded-[28px] p-7 shadow-(--shadow-card) ring-1 ring-ink/5 md:grid-cols-12 md:p-11 ${TONES[i]}`}
      >
        <div className="flex flex-col justify-between md:col-span-5">
          <span
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-[14px] font-bold ${
              dark ? "bg-white/15" : "bg-cobalt text-white"
            }`}
          >
            {i + 1}
          </span>
          <p className={`mt-10 text-[13px] font-semibold ${dark ? "text-white/60" : "text-slate"}`}>{s.w}</p>
        </div>
        <div className="md:col-span-7">
          <h3 className="text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-none tracking-[-0.05em]">{s.t}</h3>
          <p className={`mt-5 max-w-md text-[17px] leading-relaxed ${dark ? "text-white/75" : "text-slate"}`}>{s.d}</p>
        </div>
      </motion.div>
    </div>
  );
}

export function Method() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.2", "end 0.9"] });
  return (
    <section id="method" className="py-16 md:py-24">
      <div className={WRAP}>
        <SectionHead tag="Method" title="The Arc Method, in five moves." highlight={["five"]} center />
        <div ref={ref} className="mx-auto mt-12 flex max-w-[1040px] flex-col gap-6 md:mt-16">
          {STEPS.map((_, i) => (
            <StepCard key={i} i={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- stats ---------- */

export function Stats() {
  const stats = [
    { v: 250, s: "+", l: "Engagements delivered" },
    { v: 98, s: "%", l: "First-submission audit pass rate" },
    { v: 40, s: "%", l: "Control redundancy removed" },
    { v: 0, s: "", l: "Regulatory penalties for clients" },
  ];
  return (
    <section className="px-3 py-16 md:px-5 md:py-24">
      <div className="relative mx-auto max-w-[1560px] overflow-hidden rounded-[32px] bg-cobalt px-6 py-16 text-white md:rounded-[44px] md:px-14 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_100%_0%,#4a73ff,transparent_60%),radial-gradient(60%_80%_at_0%_100%,#0b2bb8,transparent_60%)]" />
        <div className="relative">
          <h2 className="max-w-3xl text-[clamp(2.1rem,4.6vw,3.9rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
            <Words text="Built for scrutiny. Measured by outcome." />
          </h2>
          <div className="mt-14 grid grid-cols-2 gap-y-10 md:mt-20 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Rise key={s.l} delay={i * 0.08} className="border-l border-white/20 pl-5 md:pl-7">
                <p className="text-[clamp(3rem,6vw,5.6rem)] font-semibold leading-none tracking-[-0.06em]">
                  <Count to={s.v} suffix={s.s} />
                </p>
                <p className="mt-4 max-w-[12rem] text-[14px] font-medium leading-snug text-white/75">{s.l}</p>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- sectors ---------- */

const SECTORS = ["Banking", "Insurance", "Fintech", "Healthcare", "Technology", "Energy", "Public sector"];

export function Sectors() {
  const row = (rev: boolean) => (
    <div className={`marquee ${rev ? "rev" : ""}`} style={{ ["--dur" as string]: rev ? "52s" : "44s" }}>
      {[...SECTORS, ...SECTORS, ...SECTORS, ...SECTORS].map((s, i) => (
        <span
          key={i}
          className="mx-2 cursor-default rounded-full bg-white px-8 py-4 text-[clamp(1.4rem,2.6vw,2.2rem)] font-semibold tracking-[-0.035em] shadow-(--shadow-card) transition-colors duration-300 hover:bg-cobalt hover:text-white"
        >
          {s}
        </span>
      ))}
    </div>
  );
  return (
    <section id="sectors" className="py-16 md:py-24">
      <div className={WRAP}>
        <SectionHead tag="Sectors" title="Where the scrutiny is closest." highlight={["closest."]} center />
      </div>
      <div className="marquee-wrap mt-12 space-y-4 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] md:mt-16">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

const FAQ = [
  ["What makes TripleArc independent?", "We sell no software, take no referral fees and do not audit the programmes we design. Our only product is advice you can defend."],
  ["Who actually does the work?", "Partners and principals lead every engagement from the first conversation to the final board pack. The people you meet are the people who deliver."],
  ["How long does an engagement take?", "A diagnostic takes around three weeks. A full design-and-deploy programme typically runs three to four months, followed by ongoing assurance if you want it."],
  ["Do you work alongside our existing teams and tools?", "Yes. We design around the tooling and people you already have, and only recommend change where it removes duplication or closes a real gap."],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className={`${WRAP} grid gap-10 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <Rise>
            <Badge>Questions</Badge>
          </Rise>
          <h2 className="mt-5 text-[clamp(2.1rem,4.6vw,3.9rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
            <Words text="Asked before every first meeting." />
          </h2>
        </div>
        <div className="space-y-3 lg:col-span-7">
          {FAQ.map(([q, a], i) => {
            const on = open === i;
            return (
              <Rise key={q} delay={i * 0.05}>
                <div className={`rounded-[22px] bg-white shadow-(--shadow-card) transition-shadow ${on ? "ring-1 ring-cobalt/25" : ""}`}>
                  <button onClick={() => setOpen(on ? null : i)} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left md:px-7">
                    <span className="text-[17px] font-semibold tracking-[-0.02em]">{q}</span>
                    <span
                      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                        on ? "bg-cobalt text-white" : "bg-mist text-ink"
                      }`}
                    >
                      <span className="absolute h-[1.5px] w-3.5 bg-current" />
                      <span className={`absolute h-[1.5px] w-3.5 bg-current transition-transform duration-500 ease-(--ease-out-expo) ${on ? "rotate-0" : "rotate-90"}`} />
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-xl px-6 pb-6 text-[15px] leading-relaxed text-slate md:px-7">{a}</p>
                  </motion.div>
                </div>
              </Rise>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- contact ---------- */

export function Contact() {
  return (
    <section id="contact" className="px-3 pb-3 pt-16 md:px-5 md:pb-5 md:pt-24">
      <div className="relative mx-auto max-w-[1560px] overflow-hidden rounded-[32px] bg-navy px-6 py-24 text-center text-white md:rounded-[44px] md:py-36">
        <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[130vmax] -translate-x-1/2 -translate-y-1/2 text-[#4a73ff]/50">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="ring-out" style={{ animationDelay: `${i * 2}s` }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(29,77,255,0.55),transparent_70%)]" />
        <div className="relative flex flex-col items-center">
          <Badge dark>45 minutes · no pitch</Badge>
          <h2 className="mt-7 max-w-4xl text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
            <Words text="Uncertainty is a choice." />
          </h2>
          <Rise delay={0.2}>
            <p className="mx-auto mt-6 max-w-md text-[17px] leading-relaxed text-white/70">
              Start with a diagnostic conversation with a senior partner. You leave with a clear view of where you stand.
            </p>
          </Rise>
          <Rise delay={0.3} className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="mailto:hello@triplearc.com?subject=Diagnostic%20conversation" variant="white">
              Book a diagnostic
            </Button>
            <a
              href="mailto:hello@triplearc.com"
              className="inline-flex h-12 items-center rounded-full px-6 text-[14px] font-semibold ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10"
            >
              hello@triplearc.com
            </a>
          </Rise>
        </div>
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
    <footer className="pt-16 md:pt-20">
      <div className={`${WRAP} grid gap-12 md:grid-cols-12`}>
        <div className="md:col-span-6">
          <Logo />
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-slate">
            Governance, risk and compliance, engineered as one structure for organisations under scrutiny.
          </p>
        </div>
        {cols.map(([h, ls]) => (
          <div key={h} className="md:col-span-2">
            <p className="text-[13px] font-bold">{h}</p>
            <ul className="mt-4 space-y-2.5 text-[14px] font-medium text-slate">
              {ls.map((l) => (
                <li key={l}>
                  <a href="#top" className="transition-colors hover:text-cobalt">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-16 flex items-end justify-center gap-[2vw] overflow-hidden text-cobalt">
        <Mark className="mb-[1.5vw] h-[11.5vw] w-[11.5vw] shrink-0" width={0.09} />
        <p className="select-none whitespace-nowrap text-[17vw] font-bold leading-[0.8] tracking-[-0.075em]">TripleArc</p>
      </div>
      <div className={`${WRAP} flex flex-col justify-between gap-3 border-t border-line py-6 text-[13px] font-medium text-slate md:flex-row`}>
        <span>© {new Date().getFullYear()} TripleArc GRC Solutions</span>
        <span className="flex gap-6">
          <a href="#top" className="hover:text-ink">Privacy</a>
          <a href="#top" className="hover:text-ink">Terms</a>
          <a href="#top" className="hover:text-ink">Back to top ↑</a>
        </span>
      </div>
    </footer>
  );
}
