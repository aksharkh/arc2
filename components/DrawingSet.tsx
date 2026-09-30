"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { EASE, Mark } from "./drawings";
import { Cover, ExplodedView, Issue, Method, Plan, Results, Schedule } from "./sheets";

const SHEETS = [
  ["cover", "General arrangement"],
  ["exploded", "Exploded view"],
  ["schedule", "Schedule of services"],
  ["method", "Method sequence"],
  ["results", "Test results"],
  ["plan", "Sector plan"],
  ["issue", "Issue"],
] as const;
const N = SHEETS.length;
const WIDE = "(min-width: 1024px)";

/** True on screens wide enough for the sideways drawing set; phones get a vertical stack. */
function useWide() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(WIDE);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}

export default function DrawingSet() {
  const wide = useWide();
  const wideRef = useRef(wide);
  const lenis = useRef<Lenis | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const coords = useRef<HTMLSpanElement>(null);
  const [theme, setTheme] = useState<"blueprint" | "paper">("blueprint");
  const [active, setActive] = useState(0);

  useEffect(() => {
    wideRef.current = wide;
  }, [wide]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ duration: 1.3, easing: (t) => 1 - Math.pow(1 - t, 4) });
    lenis.current = l;
    let raf = 0;
    const loop = (t: number) => {
      l.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: scroller, offset: ["start start", "end end"] });
  // vertical scroll drives the sheets sideways
  const x = useTransform(scrollYProgress, (v) => (wideRef.current ? `${-v * (N - 1) * 100}vw` : "0vw"));
  // sheet 02 opens as it slides into place
  const explode = useTransform(scrollYProgress, (v) => (wideRef.current ? (v * (N - 1) - 0.45) / 0.55 : 1));
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (wideRef.current) setActive(Math.round(v * (N - 1)));
  });

  const goTo = (i: number) => {
    let top: number;
    if (wideRef.current && scroller.current) {
      const el = scroller.current;
      top = el.offsetTop + (i * (el.offsetHeight - window.innerHeight)) / (N - 1);
    } else {
      top = (document.getElementById(SHEETS[i][0])?.getBoundingClientRect().top ?? 0) + window.scrollY;
    }
    if (lenis.current) lenis.current.scrollTo(top, { duration: 1.6 });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  // crosshair
  const cx = useMotionValue(-10);
  const cy = useMotionValue(-10);
  const onMove = (e: React.PointerEvent) => {
    cx.set(e.clientX);
    cy.set(e.clientY);
    if (coords.current) coords.current.textContent = `X ${String(Math.round(e.clientX)).padStart(4, "0")}  Y ${String(Math.round(e.clientY)).padStart(4, "0")}`;
  };

  const toggle = () => {
    const next = theme === "blueprint" ? "paper" : "blueprint";
    setTheme(next);
    document.documentElement.style.background = next === "paper" ? "#f2efe7" : "#0b2ea6";
  };

  return (
    <div data-theme={theme} onPointerMove={onMove} className={`sheet-root relative ${wide ? "has-cross" : ""}`}>
      <div className="grid-paper pointer-events-none fixed inset-0" />

      {/* the drawing set */}
      <div ref={scroller} className="relative" style={wide ? { height: `${N * 100}svh` } : undefined}>
        <div className={wide ? "sticky top-0 h-[100svh] overflow-hidden" : ""}>
          <motion.main style={{ x }} className="flex flex-col lg:h-full lg:w-max lg:flex-row">
            <Cover next={() => goTo(1)} />
            <ExplodedView progress={explode} />
            <Schedule />
            <Method />
            <Results />
            <Plan />
            <Issue />
          </motion.main>
        </div>
      </div>

      {/* ---------- fixed drawing frame ---------- */}
      <div className="pointer-events-none fixed inset-2 z-40 border border-ink/70 lg:inset-4">
        <div className="ruler-x absolute inset-x-0 top-0 hidden h-2.5 lg:block" />
        <div className="ruler-y absolute inset-y-0 left-0 hidden w-2.5 lg:block" />

        {/* header */}
        <div className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between border-b border-ink/40 bg-bg/80 px-3 py-2.5 backdrop-blur-sm transition-colors duration-700 lg:border-0 lg:bg-transparent lg:px-8 lg:pt-6 lg:backdrop-blur-none">
          <button onClick={() => goTo(0)} className="flex items-center gap-2.5">
            <Mark className="h-6 w-6 text-accent" />
            <span className="font-display text-[20px] font-semibold uppercase tracking-[0.08em]">TripleArc</span>
          </button>
          <nav className="anno hidden items-center gap-1 lg:flex">
            {SHEETS.map(([id], i) => (
              <button
                key={id}
                onClick={() => goTo(i)}
                className={`relative px-2.5 py-1 transition-colors ${active === i ? "text-bg" : "text-ink/60 hover:text-ink"}`}
              >
                {active === i && <motion.span layoutId="tab" className="absolute inset-0 bg-ink" transition={{ duration: 0.5, ease: EASE }} />}
                <span className="relative">{String(i + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </nav>
          <button onClick={toggle} className="anno flex items-center gap-2.5 border border-ink/60 px-3 py-1.5 transition-colors hover:bg-ink hover:text-bg">
            <span className="relative h-2.5 w-5 rounded-full border border-current">
              <span
                className={`absolute top-[1px] h-1.5 w-1.5 rounded-full bg-current transition-all duration-500 ${theme === "paper" ? "left-[11px]" : "left-[1px]"}`}
              />
            </span>
            {theme === "blueprint" ? "Blueprint" : "Paper"}
          </button>
        </div>

        {/* bottom-left readout */}
        <div className="anno absolute bottom-5 left-8 hidden items-center gap-6 text-ink/70 lg:flex">
          <span ref={coords} className="whitespace-pre tabular-nums">
            X 0000  Y 0000
          </span>
          <span className="relative h-px w-40 bg-ink/30">
            <motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-accent" />
          </span>
          <span>Scroll to turn sheets</span>
        </div>

        {/* title block */}
        <div className="anno absolute bottom-0 right-0 hidden w-[430px] border-l border-t border-ink/70 bg-bg transition-colors duration-700 lg:block">
          <div className="grid grid-cols-[1fr_7rem] border-b border-ink/40">
            <div className="border-r border-ink/40 px-3 py-2">
              <p className="text-[9px] text-ink/55">Project</p>
              <p className="mt-0.5">TripleArc GRC Solutions</p>
            </div>
            <div className="px-3 py-2">
              <p className="text-[9px] text-ink/55">Sheet</p>
              <p className="mt-0.5 tabular-nums">
                <span className="text-accent">{String(active + 1).padStart(2, "0")}</span> / {String(N).padStart(2, "0")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_3.5rem_3.5rem]">
            <div className="h-[46px] overflow-hidden border-r border-ink/40 px-3 py-2">
              <p className="text-[9px] text-ink/55">Title</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  className="mt-0.5"
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {SHEETS[active][1]}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="border-r border-ink/40 px-3 py-2">
              <p className="text-[9px] text-ink/55">Scale</p>
              <p className="mt-0.5">1:1</p>
            </div>
            <div className="px-3 py-2">
              <p className="text-[9px] text-ink/55">Rev</p>
              <p className="mt-0.5">C</p>
            </div>
          </div>
        </div>
      </div>

      {/* crosshair */}
      {wide && (
        <>
          <motion.div style={{ x: cx }} className="pointer-events-none fixed inset-y-0 left-0 z-30 w-px bg-ink/25" />
          <motion.div style={{ y: cy }} className="pointer-events-none fixed inset-x-0 top-0 z-30 h-px bg-ink/25" />
        </>
      )}
    </div>
  );
}
