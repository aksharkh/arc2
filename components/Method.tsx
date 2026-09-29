"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { EXPO, SectionTag } from "./ui";

const STEPS = [
  { t: "Diagnose", w: "Weeks 1–3", d: "A forensic read of your control environment — obligations, owners, evidence and the gaps between them." },
  { t: "Design", w: "Weeks 3–6", d: "A target architecture that removes duplication and maps every control to the risk it actually treats." },
  { t: "Deploy", w: "Weeks 6–14", d: "Policies, workflows and tooling rolled out with your teams — not around them." },
  { t: "Assure", w: "Ongoing", d: "Independent testing and board reporting that proves the system works before a regulator asks." },
  { t: "Evolve", w: "Ongoing", d: "Horizon scanning keeps the structure ahead of regulation, not chasing it." },
];
const AT = [0.1, 0.3, 0.5, 0.7, 0.9];
const D = "M -40 600 C 160 660, 260 470, 420 500 S 660 600, 800 430 S 1010 230, 1150 250 S 1360 110, 1460 40";

export default function Method() {
  const ref = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  const [active, setActive] = useState(0);
  const lenRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });
  const draw = useTransform(p, [0.02, 0.96], [0, 1]);
  const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  useEffect(() => {
    const path = pathRef.current!;
    const L = path.getTotalLength();
    lenRef.current = L;
    setPts(AT.map((a) => path.getPointAtLength(a * L)));
  }, []);

  useMotionValueEvent(draw, "change", (v) => {
    const path = pathRef.current;
    if (!path || !lenRef.current) return;
    const pt = path.getPointAtLength(Math.max(0, Math.min(1, v)) * lenRef.current);
    headRef.current?.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    let i = 0;
    AT.forEach((a, j) => {
      if (v >= a - 0.04) i = j;
    });
    setActive(i);
  });

  return (
    <section id="method" ref={ref} className="relative h-[420vh] bg-ink">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,rgba(28,75,214,0.18),transparent_70%)]" />
        <motion.div
          style={{ x: bgX }}
          className="pointer-events-none absolute -bottom-10 left-0 whitespace-nowrap text-[26vw] font-semibold leading-none tracking-[-0.05em] text-white/[0.025]"
        >
          THE ARC METHOD
        </motion.div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col px-6 pt-28 md:px-12 xl:pl-24">
          <div className="flex items-end justify-between gap-8">
            <div>
              <SectionTag index="05" label="Method" />
              <h2 className="mt-6 text-[clamp(2.6rem,5.4vw,5.6rem)] font-light leading-none tracking-[-0.035em]">
                The Arc <em className="font-serif font-normal italic text-gold-2">Method.</em>
              </h2>
            </div>
            <div className="eyebrow hidden gap-2 text-white/40 md:flex">
              {STEPS.map((s, i) => (
                <span key={s.t} className={`transition-colors duration-500 ${i <= active ? "text-gold" : ""}`}>
                  {String(i + 1).padStart(2, "0")}
                  {i < STEPS.length - 1 && <span className="mx-2 text-white/20">—</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="relative -mx-6 mt-4 flex-1 md:-mx-12">
            <svg viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <linearGradient id="beam" x1="0" x2="1">
                  <stop offset="0" stopColor="#8a6424" />
                  <stop offset="0.5" stopColor="#f3dca0" />
                  <stop offset="1" stopColor="#fff6dc" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-50%" width="140%" height="200%">
                  <feGaussianBlur stdDeviation="10" />
                </filter>
                <radialGradient id="head">
                  <stop offset="0" stopColor="#fff" />
                  <stop offset="0.3" stopColor="#f3dca0" />
                  <stop offset="1" stopColor="#d8b36a" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path ref={pathRef} d={D} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2 6" />
              <motion.path d={D} fill="none" stroke="#d8b36a" strokeWidth="14" filter="url(#glow)" opacity="0.55" style={{ pathLength: draw }} />
              <motion.path d={D} fill="none" stroke="url(#beam)" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: draw }} />
              {pts.map((pt, i) => {
                const on = i <= active;
                return (
                  <g key={i} transform={`translate(${pt.x} ${pt.y})`}>
                    <motion.circle
                      r="22"
                      fill="none"
                      stroke="#d8b36a"
                      animate={{ opacity: on ? 0.6 : 0, scale: on ? 1 : 0.4 }}
                      transition={{ duration: 0.8, ease: EXPO }}
                    />
                    <circle r="7" fill={on ? "#fff6dc" : "#0a1838"} stroke={on ? "#f3dca0" : "rgba(255,255,255,.3)"} strokeWidth="1.5" style={{ transition: "all .6s" }} />
                    <text
                      y={i % 2 ? 56 : -38}
                      textAnchor="middle"
                      fontSize="24"
                      fill={on ? "#fff" : "rgba(255,255,255,.35)"}
                      style={{ fontFamily: "var(--font-display)", fontWeight: 300, transition: "fill .6s" }}
                    >
                      {STEPS[i].t}
                    </text>
                  </g>
                );
              })}
              <g ref={headRef}>
                <circle r="40" fill="url(#head)" opacity="0.8" />
                <circle r="4" fill="#fff" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 grid gap-6 pb-10 md:grid-cols-12 md:pb-14">
            <div className="md:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                  transition={{ duration: 0.6, ease: EXPO }}
                  className="glass gold-border rounded-3xl p-7"
                >
                  <div className="eyebrow flex justify-between text-gold">
                    <span>Phase {String(active + 1).padStart(2, "0")}</span>
                    <span className="text-white/50">{STEPS[active].w}</span>
                  </div>
                  <p className="mt-4 text-3xl font-light">{STEPS[active].t}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/65">{STEPS[active].d}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
