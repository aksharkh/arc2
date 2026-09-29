"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { animate, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Arrow, EASE, Lines, useRange, useReady } from "./core";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

// Indexed by arc: arc 0 opens up-right, arc 1 down, arc 2 up-left.
const PILLARS = [
  { n: "02", name: "Risk", line: "Enterprise, third-party and cyber risk — measured, owned, treated.", align: "left" },
  { n: "03", name: "Compliance", line: "Regulatory obligations mapped to controls that hold up to audit.", align: "center" },
  { n: "01", name: "Governance", line: "Board frameworks, policy and accountability that decide clearly.", align: "right" },
] as const;

const ALIGN = {
  left: "translate-x-6 -translate-y-1/2 text-left",
  right: "-translate-x-[calc(100%+24px)] -translate-y-1/2 text-right",
  center: "-translate-x-1/2 translate-y-4 text-center",
};

export default function Hero() {
  const ready = useReady();
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const intro = useRef(0);
  const labels = useRef<(HTMLDivElement | null)[]>([]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => (progress.current = v));

  useEffect(() => {
    if (!ready) return;
    const c = animate(0, 1, { duration: 2.6, ease: EASE, onUpdate: (v) => (intro.current = v) });
    return () => c.stop();
  }, [ready]);

  const headOpacity = useRange(scrollYProgress, [0.04, 0.2], [1, 0]);
  const headY = useRange(scrollYProgress, [0.04, 0.2], [0, -60]);
  const midOpacity = useRange(scrollYProgress, [0.36, 0.46, 0.78, 0.86], [0, 1, 1, 0]);
  const midY = useRange(scrollYProgress, [0.36, 0.46], [24, 0]);
  const hint = useRange(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-[380vh] bg-bone">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1.6, delay: 0.2 }}
        >
          <HeroScene progress={progress} intro={intro} labels={labels} />
        </motion.div>

        {/* arc labels, positioned every frame by the scene */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {PILLARS.map((p, k) => (
            <div
              key={p.name}
              ref={(el) => {
                labels.current[k] = el;
              }}
              data-align={p.align}
              className="absolute left-0 top-0 opacity-0 will-change-transform"
            >
              <div className={`w-[min(15rem,40vw)] ${ALIGN[p.align]}`}>
                <p className="label text-stone">{p.n}</p>
                <p className="mt-2 text-[clamp(1.5rem,2.4vw,2.25rem)] font-light leading-none tracking-[-0.03em]">{p.name}</p>
                <p className="mt-3 hidden text-[13px] leading-relaxed text-ink/55 md:block">{p.line}</p>
              </div>
            </div>
          ))}
        </div>

        {/* opening frame */}
        <motion.div
          style={{ opacity: headOpacity, y: headY }}
          className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1600px] flex-col gap-10 px-5 pb-10 md:flex-row md:items-end md:justify-between md:px-10 md:pb-12"
        >
          <h1 className="text-[clamp(3.4rem,9.6vw,10.5rem)] font-light leading-[0.9] tracking-[-0.055em]">
            <Lines play={ready} delay={0.35} lines={["Control,", "engineered."]} />
          </h1>
          <motion.div
            className="max-w-[20rem] pb-2"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.2, delay: 0.8, ease: EASE }}
          >
            <p className="text-[15px] leading-relaxed text-ink/65">
              Independent governance, risk and compliance advisory for organisations that operate under scrutiny.
            </p>
            <a href="#contact" className="group mt-6 inline-flex items-center gap-2 text-[14px]">
              <span className="u-link pb-0.5">Book a consultation</span>
              <Arrow className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-45" />
            </a>
          </motion.div>
        </motion.div>

        {/* opened frame */}
        <motion.div
          style={{ opacity: midOpacity, y: midY }}
          className="pointer-events-none absolute bottom-10 left-5 hidden max-w-[17rem] md:bottom-12 md:left-10 md:block"
        >
          <p className="label text-stone">One structure</p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
            Three disciplines, engineered to carry each other&apos;s load.
          </p>
        </motion.div>

        {/* phones: the three names sit as a list under the opened structure */}
        <motion.div
          style={{ opacity: midOpacity }}
          className="pointer-events-none absolute inset-x-5 bottom-10 border-t border-line md:hidden"
        >
          {[PILLARS[2], PILLARS[0], PILLARS[1]].map((p) => (
            <div key={p.name} className="flex items-baseline gap-4 border-b border-line py-3">
              <span className="label text-stone">{p.n}</span>
              <span className="text-2xl font-light tracking-[-0.03em]">{p.name}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          style={{ opacity: hint }}
          className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 md:right-10 md:flex"
        >
          <span className="label text-stone [writing-mode:vertical-rl]">Scroll</span>
          <span className="relative h-16 w-px overflow-hidden bg-ink/10">
            <motion.span
              className="absolute inset-x-0 top-0 h-6 bg-ink"
              animate={{ y: [-24, 64] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
