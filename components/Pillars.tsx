"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EXPO, FadeUp, RevealLines, SectionTag, Triquetra } from "./ui";

const PILLARS = [
  {
    key: "Governance",
    n: "01",
    scope: "Board · Policy · Accountability · Oversight",
    items: [
      ["Board & committee frameworks", "Charters, delegations of authority and decision rights that hold up under scrutiny."],
      ["Policy architecture", "A single, versioned policy estate mapped to every obligation you carry."],
      ["Three lines model", "Clear ownership between business, risk and assurance — no gaps, no overlap."],
      ["Governance reporting", "Board-grade dashboards that turn control data into decisions."],
    ],
    stat: ["250+", "engagements delivered"],
  },
  {
    key: "Risk",
    n: "02",
    scope: "Enterprise · Third-party · Cyber · Scenario",
    items: [
      ["Risk identification framework", "Systematic inventory of business and operational risks."],
      ["Continuous risk assessment", "Modelling likelihood and impact — quantitative and qualitative."],
      ["Mitigation actions tracking", "Plan execution, owner assignments and due dates, all in view."],
      ["Control effectiveness analytics", "Real-time view of control performance and gaps."],
    ],
    stat: ["40%", "control redundancy removed"],
  },
  {
    key: "Compliance",
    n: "03",
    scope: "Regulatory · Privacy · Audit · Assurance",
    items: [
      ["Regulatory change management", "Horizon scanning translated into owned, dated actions."],
      ["Privacy by design", "DPDP, GDPR and sectoral privacy regimes built into operations."],
      ["Audit readiness", "Evidence libraries that make first-submission approval routine."],
      ["Continuous assurance", "Testing cadences that surface issues before regulators do."],
    ],
    stat: ["98%", "first-submission audit pass rate"],
  },
];

function Arcs({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 400 600" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
      <motion.path
        d="M -40 80 A 420 420 0 0 1 380 520"
        fill="none"
        stroke="rgba(216,179,106,0.55)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0.35 }}
        transition={{ duration: 1.6, ease: EXPO }}
      />
      <motion.path
        d="M 440 60 A 480 480 0 0 0 60 600"
        fill="none"
        stroke="rgba(216,179,106,0.3)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0.25 }}
        transition={{ duration: 1.8, ease: EXPO, delay: 0.1 }}
      />
    </svg>
  );
}

export default function Pillars() {
  const [active, setActive] = useState(1);

  return (
    <section id="pillars" className="relative bg-pearl py-28 text-navy md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(28,75,214,0.08),transparent)]" />
      <div className="relative mx-auto max-w-[1500px] px-6 md:px-12 xl:pl-24">
        <div className="mb-16 grid gap-10 md:mb-24 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionTag index="03" label="The Triptych" dark={false} />
            <RevealLines
              className="mt-8 text-[clamp(2.6rem,6vw,6.2rem)] font-light leading-[0.98] tracking-[-0.035em]"
              lines={[
                "Three pillars.",
                <span key="b">
                  One <em className="font-serif font-normal italic text-royal">structure.</em>
                </span>,
              ]}
            />
          </div>
          <FadeUp className="self-end md:col-span-4 md:col-start-9" delay={0.2}>
            <p className="text-[15px] leading-relaxed text-navy/70">
              Governance, risk and compliance — designed as a single continuous system. Each arc carries load for the
              other two. Remove one and the structure fails; engineer all three and it becomes unbreakable.
            </p>
          </FadeUp>
        </div>

        {/* desktop triptych */}
        <div className="hidden h-[640px] gap-3 lg:flex">
          {PILLARS.map((p, i) => {
            const on = i === active;
            return (
              <motion.div
                key={p.key}
                onPointerEnter={() => setActive(i)}
                data-cursor="hover"
                className="relative overflow-hidden rounded-[28px] bg-navy text-white shadow-[0_40px_80px_-40px_rgba(6,15,38,0.6)]"
                animate={{ flexGrow: on ? 3.2 : 1 }}
                style={{ flexBasis: 0 }}
                transition={{ duration: 1.1, ease: EXPO }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(28,75,214,0.35),transparent_60%)]" />
                <Arcs active={on} />
                <AnimatePresence mode="wait">
                  {on ? (
                    <motion.div
                      key="open"
                      className="relative flex h-full flex-col p-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.35, duration: 0.6 } }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="text-[clamp(4rem,7vw,7.5rem)] font-extralight leading-none tracking-[-0.04em]">
                          {p.key.toUpperCase()}
                        </h3>
                        <Triquetra className="h-16 w-16" width={0.1} />
                      </div>
                      <p className="eyebrow mt-6 text-gold">
                        {p.n} / Scope — {p.scope}
                      </p>
                      <div className="mt-6 flex-1">
                        {p.items.map(([t, d], j) => (
                          <motion.div
                            key={t}
                            className="group flex items-start justify-between gap-6 border-t border-white/12 py-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9, delay: 0.45 + j * 0.07, ease: EXPO }}
                          >
                            <div>
                              <p className="font-mono text-[14px] uppercase tracking-[0.08em]">{t}</p>
                              <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.04em] text-white/45">{d}</p>
                            </div>
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold/40 transition-colors group-hover:bg-gold" />
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex items-baseline gap-5 border-t border-white/12 pt-6">
                        <span className="text-gold-grad text-5xl font-light">{p.stat[0]}</span>
                        <span className="font-mono text-[13px] uppercase tracking-[0.12em] text-white/80">{p.stat[1]}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="closed"
                      className="relative flex h-full flex-col items-center justify-between py-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.3 } }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    >
                      <span className="eyebrow text-gold">{p.n}</span>
                      <span className="rotate-180 text-5xl font-extralight tracking-[0.02em] [writing-mode:vertical-rl]">
                        {p.key.toUpperCase()}.
                      </span>
                      <span className="eyebrow text-white/40">+</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* mobile */}
        <div className="flex flex-col gap-3 lg:hidden">
          {PILLARS.map((p, i) => {
            const on = i === active;
            return (
              <div key={p.key} className="relative overflow-hidden rounded-3xl bg-navy text-white">
                <button onClick={() => setActive(i)} className="flex w-full items-center justify-between p-6 text-left">
                  <span className="text-3xl font-extralight">{p.key}</span>
                  <span className="eyebrow text-gold">{p.n}</span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: on ? "auto" : 0 }}
                  transition={{ duration: 0.8, ease: EXPO }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <p className="eyebrow text-gold">{p.scope}</p>
                    {p.items.map(([t, d]) => (
                      <div key={t} className="border-t border-white/10 py-3">
                        <p className="font-mono text-[12px] uppercase">{t}</p>
                        <p className="mt-1 text-[12px] text-white/50">{d}</p>
                      </div>
                    ))}
                    <p className="mt-3 text-gold-grad text-4xl font-light">
                      {p.stat[0]} <span className="font-mono text-[11px] uppercase text-white/70">{p.stat[1]}</span>
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
