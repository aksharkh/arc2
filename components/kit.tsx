"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { animate, motion, transform, useInView, useTransform, type MotionValue } from "motion/react";
import { triquetraPath } from "@/lib/triquetra";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const WRAP = "mx-auto w-full max-w-[1320px] px-4 md:px-8";
const MARK = triquetraPath();

/** Scroll-linked range mapping kept on the main thread so it stays in step with Lenis. */
export function useRange(mv: MotionValue<number>, input: number[], output: number[]) {
  return useTransform(mv, (v) => transform(v, input, output));
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, anchors: { offset: -90 }, easing: (t) => 1 - Math.pow(1 - t, 4) });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}

export function Mark({ className, width = 0.12 }: { className?: string; width?: number }) {
  return (
    <svg viewBox="-1.25 -1.25 2.5 2.5" className={className} aria-hidden>
      <path d={MARK} fill="none" stroke="currentColor" strokeWidth={width} strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-cobalt text-white">
        <Mark className="h-5 w-5" />
      </span>
      <span className="text-[16px] font-bold tracking-[-0.03em]">TripleArc</span>
    </a>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Pill button: the arrow disc slides out and a second arrow slides in on hover. */
export function Button({
  children,
  href = "#contact",
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "light" | "ghost" | "white";
  className?: string;
}) {
  const look = {
    primary: "bg-cobalt text-white hover:bg-cobalt-deep",
    light: "bg-white text-ink shadow-(--shadow-card) hover:bg-sky",
    ghost: "text-ink ring-1 ring-inset ring-ink/15 hover:ring-ink/40",
    white: "bg-white text-cobalt hover:bg-sky",
  }[variant];
  const disc = {
    primary: "bg-white text-cobalt",
    light: "bg-cobalt text-white",
    ghost: "bg-ink text-white",
    white: "bg-cobalt text-white",
  }[variant];
  return (
    <a
      href={href}
      className={`group inline-flex h-12 items-center gap-3 rounded-full pl-6 pr-1.5 text-[14px] font-semibold tracking-[-0.01em] transition-colors duration-300 ${look} ${className}`}
    >
      {children}
      <span className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ${disc}`}>
        <ArrowIcon className="h-4 w-4 transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-7" />
        <ArrowIcon className="absolute h-4 w-4 -translate-x-7 transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-0" />
      </span>
    </a>
  );
}

export function Badge({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
        dark ? "bg-white/10 text-white" : "bg-white text-ink shadow-(--shadow-card)"
      }`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-cobalt opacity-60" />
        <span className={`relative h-1.5 w-1.5 rounded-full ${dark ? "bg-white" : "bg-cobalt"}`} />
      </span>
      {children}
    </span>
  );
}

/** Words rise in one after another. */
export function Words({
  text,
  className = "",
  delay = 0,
  highlight = [],
}: {
  text: string;
  className?: string;
  delay?: number;
  highlight?: string[];
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const on = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  return (
    <span ref={ref} className={`[word-spacing:0.09em] ${className}`}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden whitespace-pre pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${highlight.includes(w) ? "text-cobalt" : ""}`}
            initial={{ y: "110%" }}
            animate={{ y: on ? "0%" : "110%" }}
            transition={{ duration: 0.9, delay: delay + i * 0.045, ease: EASE }}
          >
            {w}
          </motion.span>
          {" "}
        </span>
      ))}
    </span>
  );
}

export function Rise({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Count({ to, suffix = "", duration = 2.2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-10% 0px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const c = animate(0, to, { duration, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [seen, to, duration]);
  return (
    <span ref={ref} className="tabular">
      {n}
      {suffix}
    </span>
  );
}

/** Wrapper that feeds pointer position to the `.spot` highlight. */
export function Spot({ children, className = "", tint }: { children: ReactNode; className?: string; tint?: string }) {
  return (
    <div
      className={`spot ${className}`}
      style={tint ? ({ "--spot": tint } as React.CSSProperties) : undefined}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  tag,
  title,
  highlight,
  children,
  center = false,
}: {
  tag: string;
  title: string;
  highlight?: string[];
  children?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "grid items-end gap-6 md:grid-cols-12"}>
      <div className={center ? "" : "md:col-span-7"}>
        <Rise>
          <Badge>{tag}</Badge>
        </Rise>
        <h2 className="mt-5 text-[clamp(2.1rem,4.6vw,3.9rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
          <Words text={title} highlight={highlight} />
        </h2>
      </div>
      {children && (
        <Rise delay={0.15} className={center ? "mt-5" : "md:col-span-4 md:col-start-9"}>
          <p className="text-[16px] leading-relaxed text-slate">{children}</p>
        </Rise>
      )}
    </div>
  );
}
