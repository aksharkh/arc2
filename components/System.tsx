"use client";

import { useRef, useState } from "react";
import { motion, useAnimationFrame, useInView } from "motion/react";
import { EXPO, FadeUp, RevealLines, SectionTag, Triquetra } from "./ui";

const SERVICES = [
  { name: "GRC Strategy", d: "Target operating models and multi-year GRC roadmaps tied to business outcomes.", orbit: 0, phase: 0 },
  { name: "Internal Audit", d: "Co-sourced and outsourced audit, risk-based plans and quality assessments.", orbit: 1, phase: 0.6 },
  { name: "Cyber Risk", d: "Cyber maturity, ISO 27001 and NIST CSF programmes, board-level cyber reporting.", orbit: 2, phase: 1.1 },
  { name: "Data Privacy", d: "DPDP and GDPR readiness, DPIAs, records of processing and privacy operations.", orbit: 0, phase: 2.1 },
  { name: "Third-Party Risk", d: "Vendor tiering, due diligence and continuous monitoring across the supply chain.", orbit: 1, phase: 2.9 },
  { name: "Regulatory Advisory", d: "Interpretation, gap analysis and remediation for sectoral regulators.", orbit: 2, phase: 3.6 },
  { name: "ESG Assurance", d: "ESG data governance, BRSR readiness and assurance-grade disclosures.", orbit: 0, phase: 4.2 },
  { name: "Risk Culture", d: "Behavioural diagnostics, training and incentives that make controls stick.", orbit: 1, phase: 5.2 },
];

const ORBITS = [
  { rx: 236, ry: 84, rot: -16, speed: 0.1 },
  { rx: 200, ry: 140, rot: 28, speed: -0.075 },
  { rx: 170, ry: 60, rot: 62, speed: 0.13 },
];

const C = 320;

function pos(o: (typeof ORBITS)[number], a: number) {
  const r = (o.rot * Math.PI) / 180;
  const x = o.rx * Math.cos(a);
  const y = o.ry * Math.sin(a);
  return { x: C + x * Math.cos(r) - y * Math.sin(r), y: C + x * Math.sin(r) + y * Math.cos(r), front: Math.sin(a) > 0 };
}

function Hud({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  const nodes = useRef<(SVGGElement | null)[]>([]);
  const line = useRef<SVGLineElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { margin: "200px" });

  useAnimationFrame((t) => {
    if (!inView) return;
    const s = t / 1000;
    SERVICES.forEach((sv, i) => {
      const o = ORBITS[sv.orbit];
      const p = pos(o, sv.phase + s * o.speed);
      const g = nodes.current[i];
      if (!g) return;
      g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
      g.style.opacity = p.front || i === active ? "1" : "0.45";
      if (i === active && line.current) {
        line.current.setAttribute("x2", p.x.toFixed(1));
        line.current.setAttribute("y2", p.y.toFixed(1));
      }
    });
  });

  return (
    <div ref={wrap} className="relative aspect-square w-full">
      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(61,109,255,0.35),transparent_65%)] blur-2xl" />
      <svg viewBox="0 0 640 640" className="relative h-full w-full overflow-visible">
        <defs>
          <radialGradient id="orb" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#9fbaff" stopOpacity="0.9" />
            <stop offset="0.35" stopColor="#2a5cff" stopOpacity="0.85" />
            <stop offset="0.8" stopColor="#0a1b52" />
            <stop offset="1" stopColor="#030a22" />
          </radialGradient>
          <linearGradient id="gl" x1="0" x2="1">
            <stop offset="0" stopColor="#d8b36a" stopOpacity="0" />
            <stop offset="1" stopColor="#f3dca0" />
          </linearGradient>
        </defs>
        {/* tick ring */}
        <g opacity="0.5">
          {Array.from({ length: 120 }).map((_, i) => {
            const a = (i / 120) * Math.PI * 2;
            const r1 = 300;
            const r2 = i % 10 === 0 ? 288 : 295;
            return (
              <line
                key={i}
                x1={(C + r1 * Math.cos(a)).toFixed(2)}
                y1={(C + r1 * Math.sin(a)).toFixed(2)}
                x2={(C + r2 * Math.cos(a)).toFixed(2)}
                y2={(C + r2 * Math.sin(a)).toFixed(2)}
                stroke={i % 10 === 0 ? "#d8b36a" : "rgba(255,255,255,.3)"}
                strokeWidth="1"
              />
            );
          })}
        </g>
        {ORBITS.map((o, i) => (
          <motion.ellipse
            key={i}
            cx={C}
            cy={C}
            rx={o.rx}
            ry={o.ry}
            transform={`rotate(${o.rot} ${C} ${C})`}
            fill="none"
            stroke={i === SERVICES[active].orbit ? "rgba(243,220,160,.7)" : "rgba(216,179,106,.28)"}
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, delay: i * 0.2, ease: EXPO }}
          />
        ))}
        <line ref={line} x1={C} y1={C} x2={C} y2={C} stroke="url(#gl)" strokeWidth="1" strokeDasharray="3 4" />
        <circle cx={C} cy={C} r="78" fill="url(#orb)" />
        <circle cx={C} cy={C} r="78" fill="none" stroke="rgba(255,255,255,.25)" />
        <ellipse cx={C - 22} cy={C - 34} rx="30" ry="14" fill="rgba(255,255,255,.18)" transform={`rotate(-30 ${C - 22} ${C - 34})`} />
        <foreignObject x={C - 40} y={C - 40} width="80" height="80">
          <Triquetra className="h-full w-full drop-shadow-[0_0_12px_rgba(243,220,160,0.7)]" width={0.12} />
        </foreignObject>

        {SERVICES.map((s, i) => {
          const on = i === active;
          return (
            <g
              key={s.name}
              ref={(el) => {
                nodes.current[i] = el;
              }}
              onPointerEnter={() => setActive(i)}
              style={{ cursor: "pointer", transition: "opacity .6s" }}
              transform={`translate(${C} ${C})`}
            >
              <circle r={on ? 16 : 9} fill={on ? "rgba(216,179,106,.18)" : "transparent"} style={{ transition: "r .5s" }} />
              <circle r={on ? 6 : 4.5} fill={on ? "#f3dca0" : "#c9d6ff"} style={{ transition: "r .5s" }} />
              <g transform="translate(14 -14)">
                <rect
                  x="0"
                  y="-13"
                  rx="11"
                  width={s.name.length * 6.6 + 22}
                  height="24"
                  fill={on ? "rgba(216,179,106,.95)" : "rgba(10,24,56,.75)"}
                  stroke={on ? "none" : "rgba(255,255,255,.18)"}
                />
                <text
                  x="11"
                  y="3.5"
                  fontSize="11"
                  fill={on ? "#03081a" : "rgba(255,255,255,.9)"}
                  style={{ fontFamily: "var(--font-display)", letterSpacing: ".04em" }}
                >
                  {s.name}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function System() {
  const [active, setActive] = useState(0);

  return (
    <section id="system" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_50%,rgba(28,75,214,0.22),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-16 px-6 md:px-12 lg:grid-cols-12 xl:pl-24">
        <div className="lg:col-span-5">
          <SectionTag index="04" label="The TripleArc System" />
          <RevealLines
            className="mt-8 text-[clamp(2.6rem,5.4vw,5.6rem)] font-light leading-[0.98] tracking-[-0.035em]"
            lines={[
              "One architecture.",
              <span key="x" className="text-white/40">
                Every control.
              </span>,
              <em key="y" className="font-serif font-normal italic text-gold-2">
                Continuous visibility.
              </em>,
            ]}
          />
          <FadeUp delay={0.2} className="mt-12">
            <ul className="border-t border-white/10">
              {SERVICES.map((s, i) => {
                const on = i === active;
                return (
                  <li key={s.name} className="border-b border-white/10" onPointerEnter={() => setActive(i)}>
                    <button onClick={() => setActive(i)} className="group flex w-full items-center gap-6 py-4 text-left" data-cursor="hover">
                      <span className={`eyebrow w-6 transition-colors ${on ? "text-gold" : "text-white/35"}`}>0{i + 1}</span>
                      <span
                        className={`flex-1 text-xl font-light transition-all duration-500 md:text-2xl ${
                          on ? "translate-x-2 text-white" : "text-white/55 group-hover:text-white/80"
                        }`}
                      >
                        {s.name}
                      </span>
                      <motion.span
                        animate={{ rotate: on ? 45 : 0, color: on ? "#d8b36a" : "rgba(255,255,255,.35)" }}
                        className="text-xl font-extralight"
                      >
                        +
                      </motion.span>
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                      transition={{ duration: 0.7, ease: EXPO }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-md pb-5 pl-12 text-[14px] leading-relaxed text-white/60">{s.d}</p>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
          </FadeUp>
        </div>
        <FadeUp className="lg:col-span-7" delay={0.1}>
          <Hud active={active} setActive={setActive} />
        </FadeUp>
      </div>
    </section>
  );
}
