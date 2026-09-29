"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Lenis from "lenis";
import {
  AnimatePresence,
  motion,
  transform,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { triquetraPath } from "@/lib/triquetra";

export const EASE = [0.16, 1, 0.3, 1] as const;
const MARK = triquetraPath();

/**
 * Scroll-linked range mapping computed on the main thread. Motion can hand plain
 * range transforms of opacity to a native scroll timeline, which mis-tracks inside
 * sticky, Lenis-driven sections; the function form keeps it in step.
 */
export function useRange(mv: MotionValue<number>, input: number[], output: number[]) {
  return useTransform(mv, (v) => transform(v, input, output));
}

/* ---------- intro gate shared with the hero ---------- */

let ready = false;
const subs = new Set<() => void>();
function markReady() {
  ready = true;
  subs.forEach((f) => f());
}
export function useReady() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => ready,
    () => false,
  );
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.3, anchors: true, easing: (t) => 1 - Math.pow(1 - t, 4) });
    if (!ready) lenis.stop();
    const start = () => lenis.start();
    subs.add(start);
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      subs.delete(start);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}

/* ---------- the mark ---------- */

export function Mark({ className, stroke = "currentColor", width = 0.09 }: { className?: string; stroke?: string; width?: number }) {
  return (
    <svg viewBox="-1.25 -1.25 2.5 2.5" className={className} aria-hidden>
      <path d={MARK} fill="none" stroke={stroke} strokeWidth={width} />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-2.5 ${className}`}>
      <Mark className="h-[22px] w-[22px]" width={0.11} />
      <span className="text-[15px] font-medium tracking-[-0.01em]">TripleArc</span>
    </a>
  );
}

/* ---------- intro ---------- */

export function Intro() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(
      () => {
        setDone(true);
        markReady();
      },
      reduce ? 0 : 1900,
    );
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink text-bone"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            <svg viewBox="-1.25 -1.25 2.5 2.5" className="h-14 w-14 text-gold" aria-hidden>
              <motion.path
                d={MARK}
                fill="none"
                stroke="currentColor"
                strokeWidth={0.05}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
              />
            </svg>
            <div className="overflow-hidden">
              <motion.p
                className="text-[13px] tracking-[0.02em] text-bone/70"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: EASE }}
              >
                TripleArc
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- header ---------- */

const LINKS = [
  ["Services", "#services"],
  ["Method", "#method"],
  ["Sectors", "#sectors"],
];

export function Header() {
  const ok = useReady();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => {
    setHidden(v > (scrollY.getPrevious() ?? 0) && v > 200);
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference"
        initial={{ opacity: 0 }}
        animate={{ opacity: ok ? 1 : 0, y: hidden && !open ? -90 : 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-6 md:px-10">
          <Wordmark />
          <nav className="hidden items-center gap-10 text-[13px] md:flex">
            {LINKS.map(([l, h]) => (
              <a key={l} href={h} className="opacity-70 transition-opacity duration-300 hover:opacity-100">
                {l}
              </a>
            ))}
            <a href="#contact" className="u-link pb-0.5">
              Book a consultation
            </a>
          </nav>
          <button onClick={() => setOpen((o) => !o)} className="text-[13px] md:hidden">
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink px-5 pb-12 text-bone md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            {[...LINKS, ["Contact", "#contact"]].map(([l, h]) => (
              <a key={l} href={h} onClick={() => setOpen(false)} className="border-b border-bone/15 py-4 text-4xl font-light tracking-[-0.03em]">
                {l}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- motion primitives ---------- */

/** Masked line reveal. Each entry in `lines` becomes one line. */
export function Lines({
  lines,
  className = "",
  delay = 0,
  play,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  play?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const on = play ?? seen;
  return (
    <div ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            animate={{ y: on ? "0%" : "105%" }}
            transition={{ duration: 1.2, delay: delay + i * 0.08, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

export function Fade({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path d="M4 16 16 4M7 4h9v9" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 });
  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Small section eyebrow: "(01) Label". */
export function Eyebrow({ n, children, className = "" }: { n: string; children: ReactNode; className?: string }) {
  return (
    <p className={`label flex gap-3 ${className}`}>
      <span className="opacity-50">({n})</span>
      <span>{children}</span>
    </p>
  );
}
