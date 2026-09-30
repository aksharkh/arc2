"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { Badge, Button, Count, EASE, Logo, Mark, useRange, Words, WRAP } from "./kit";
import { Arcs, Bars, Checklist, Heatmap, ScoreRing } from "./widgets";

const LINKS = [
  ["Pillars", "#pillars"],
  ["Services", "#services"],
  ["Method", "#method"],
  ["Sectors", "#sectors"],
  ["FAQ", "#faq"],
];

export function Nav() {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  useMotionValueEvent(scrollY, "change", (v) => setCompact(v > 80));

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div
        className={`w-full rounded-[22px] bg-white/85 shadow-(--shadow-card) ring-1 ring-ink/5 backdrop-blur-xl transition-[max-width] duration-700 ease-(--ease-out-expo) ${
          compact ? "max-w-[860px]" : "max-w-[1256px]"
        }`}
      >
        <div className="flex h-[60px] items-center justify-between pl-4 pr-2">
          <Logo />
          <nav className="hidden items-center md:flex" onPointerLeave={() => setHover(null)}>
            {LINKS.map(([l, h]) => (
              <a
                key={l}
                href={h}
                onPointerEnter={() => setHover(l)}
                className="relative px-4 py-2 text-[14px] font-medium text-slate transition-colors hover:text-ink"
              >
                {hover === l && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-mist"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{l}</span>
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden h-11 items-center rounded-full bg-ink px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-cobalt sm:flex"
            >
              Book a consultation
            </a>
            <button
              aria-label="Menu"
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full bg-mist md:hidden"
            >
              <span className={`h-[1.5px] w-4 bg-ink transition-transform duration-300 ${open ? "translate-y-[3.25px] rotate-45" : ""}`} />
              <span className={`h-[1.5px] w-4 bg-ink transition-transform duration-300 ${open ? "-translate-y-[3.25px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              className="overflow-hidden md:hidden"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="flex flex-col gap-1 px-3 pb-3">
                {[...LINKS, ["Contact", "#contact"]].map(([l, h]) => (
                  <a key={l} href={h} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-[17px] font-semibold hover:bg-mist">
                    {l}
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

/** A white card floating over the hero panel; drifts with the pointer by `depth`. */
function Float({
  children,
  className,
  depth,
  mx,
  my,
  delay,
}: {
  children: ReactNode;
  className: string;
  depth: number;
  mx: ReturnType<typeof useSpring>;
  my: ReturnType<typeof useSpring>;
  delay: number;
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6 + Math.abs(depth) / 20, repeat: Infinity, ease: "easeInOut", delay }}
          className="rounded-[22px] bg-white p-5 text-ink shadow-(--shadow-float)"
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: panel, offset: ["start end", "start 0.12"] });
  const scale = useRange(scrollYProgress, [0.35, 1], [0.93, 1]);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 60, damping: 18 });
  const my = useSpring(py, { stiffness: 60, damping: 18 });

  return (
    <section ref={ref} id="top" className="relative pt-32 md:pt-40">
      <div className={`${WRAP} flex flex-col items-center text-center`}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: EASE }}>
          <Badge>Independent GRC advisory</Badge>
        </motion.div>
        <h1 className="mt-7 max-w-5xl text-[clamp(2.7rem,7.2vw,6.2rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
          <Words text="Governance, risk and compliance, engineered as one." highlight={["one."]} delay={0.2} />
        </h1>
        <motion.p
          className="mt-7 max-w-xl text-[17px] leading-relaxed text-slate"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
        >
          One clear structure for regulated organisations — so every control has an owner, every risk has a number, and
          every audit has an answer.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.72, ease: EASE }}
        >
          <Button>Book a consultation</Button>
          <Button href="#pillars" variant="light">
            See how it works
          </Button>
        </motion.div>
      </div>

      <div className="mt-14 px-3 md:mt-20 md:px-5">
        <motion.div
          ref={panel}
          style={{ scale }}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            px.set((e.clientX - r.left) / r.width - 0.5);
            py.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onPointerLeave={() => {
            px.set(0);
            py.set(0);
          }}
          className="relative mx-auto h-[560px] max-w-[1560px] origin-top overflow-hidden rounded-[32px] bg-cobalt text-white md:h-[680px] md:rounded-[44px]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_0%,#4a73ff,transparent_60%),radial-gradient(70%_70%_at_100%_100%,#0a1f9c,transparent_60%),radial-gradient(60%_60%_at_0%_100%,#0b2bb8,transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[150%] -translate-x-1/2 -translate-y-1/2"
            style={{ aspectRatio: "1" }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: EASE }}
          >
            <Arcs className="h-full w-full" />
          </motion.div>

          {/* core */}
          <motion.div
            className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[32px] bg-white text-cobalt shadow-(--shadow-float) md:h-36 md:w-36 md:rounded-[40px]"
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
          >
            <Mark className="h-16 w-16 md:h-20 md:w-20" width={0.1} />
          </motion.div>

          <Float mx={mx} my={my} depth={-38} delay={0.8} className="left-[4%] top-[9%] w-[210px] md:left-[9%] md:top-[14%] md:w-[250px]">
            <p className="text-[12px] font-semibold text-slate">Compliance score</p>
            <div className="mt-3 flex items-center gap-4">
              <ScoreRing value={98} size={84} />
              <div>
                <p className="text-[13px] font-semibold text-mint">▲ 12 pts</p>
                <p className="text-[12px] text-slate">since Q1</p>
              </div>
            </div>
          </Float>

          <Float mx={mx} my={my} depth={46} delay={0.95} className="right-[4%] top-[7%] hidden w-[230px] sm:block md:right-[8%] md:top-[11%]">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold text-slate">Risk heatmap</p>
              <span className="rounded-full bg-sky px-2 py-0.5 text-[10.5px] font-bold text-cobalt">Live</span>
            </div>
            <div className="mt-3">
              <Heatmap dark={false} />
            </div>
          </Float>

          <Float mx={mx} my={my} depth={60} delay={1.1} className="bottom-[7%] left-[4%] hidden w-[270px] md:bottom-[11%] md:left-[13%] md:block">
            <p className="mb-3 text-[12px] font-semibold text-slate">Audit readiness</p>
            <Checklist items={["Evidence library complete", "Controls tested — 412", "Board pack signed off"]} />
          </Float>

          <Float mx={mx} my={my} depth={-52} delay={1.25} className="bottom-[8%] right-[4%] w-[200px] md:bottom-[13%] md:right-[11%] md:w-[230px]">
            <p className="text-[12px] font-semibold text-slate">Redundant controls</p>
            <p className="mt-1 text-[30px] font-bold leading-none tracking-[-0.04em]">
              −<Count to={40} suffix="%" />
            </p>
            <div className="mt-3">
              <Bars values={[95, 88, 80, 74, 66, 60, 55]} />
            </div>
          </Float>
        </motion.div>
      </div>
    </section>
  );
}
