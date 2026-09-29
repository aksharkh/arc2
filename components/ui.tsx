"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { triquetraPath } from "@/lib/triquetra";

const MARK = triquetraPath();
export const EXPO = [0.19, 1, 0.22, 1] as const;

export function Triquetra({
  className,
  stroke = "url(#tq-gold)",
  width = 0.11,
  draw = false,
  delay = 0,
  duration = 2.4,
  style,
}: {
  className?: string;
  stroke?: string;
  width?: number;
  draw?: boolean;
  delay?: number;
  duration?: number;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="-1.25 -1.25 2.5 2.5" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id="tq-gold" x1="0" y1="-1" x2="1" y2="1" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fbeec4" />
          <stop offset="0.35" stopColor="#d8b36a" />
          <stop offset="0.6" stopColor="#8f6726" />
          <stop offset="1" stopColor="#f3dca0" />
        </linearGradient>
      </defs>
      {draw ? (
        <motion.path
          d={MARK}
          fill="none"
          stroke={stroke}
          strokeWidth={width}
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}
        />
      ) : (
        <path d={MARK} fill="none" stroke={stroke} strokeWidth={width} strokeLinejoin="miter" />
      )}
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-3 ${className}`} data-cursor="hover">
      <Triquetra className="h-8 w-8" width={0.13} />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-medium tracking-[0.34em] text-white">
          TRIPLE<span className="text-gold">ARC</span>
        </span>
        <span className="mt-1.5 flex items-center gap-1.5 text-[7.5px] tracking-[0.32em] text-gold/80">
          <span className="h-px w-3 bg-gold/60" />
          GRC SOLUTIONS
          <span className="h-px w-3 bg-gold/60" />
        </span>
      </span>
    </a>
  );
}

/** Line-by-line mask reveal. Pass lines as separate children strings. */
export function RevealLines({
  lines,
  className = "",
  lineClass = "",
  delay = 0,
  stagger = 0.09,
  once = true,
}: {
  lines: ReactNode[];
  className?: string;
  lineClass?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "0px 0px -12% 0px" });
  return (
    <div ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block will-change-transform ${lineClass}`}
            initial={{ y: "110%", rotate: 2.5 }}
            animate={inView ? { y: "0%", rotate: 0 } : { y: "110%", rotate: 2.5 }}
            transition={{ duration: 1.3, delay: delay + i * stagger, ease: EXPO }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

export function FadeUp({
  children,
  delay = 0,
  className = "",
  y = 36,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.2, delay, ease: EXPO }}
    >
      {children}
    </motion.div>
  );
}

export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
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

export function Button({
  children,
  href = "#contact",
  variant = "gold",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  variant?: "gold" | "ghost" | "ghost-dark";
  className?: string;
}) {
  const styles = {
    gold: "btn-gold",
    ghost: "border border-white/20 text-white hover:border-gold/70 hover:bg-white/5",
    "ghost-dark": "border border-navy/20 text-navy hover:border-navy hover:bg-navy hover:text-pearl",
  }[variant];
  return (
    <Magnetic>
      <a
        href={href}
        data-cursor="hover"
        className={`group relative inline-flex h-13 items-center gap-3 overflow-hidden rounded-full px-7 text-[13px] font-medium tracking-[0.06em] transition-colors duration-500 ${styles} ${className}`}
      >
        <span className="relative block overflow-hidden">
          <span className="block transition-transform duration-700 ease-(--ease-expo) group-hover:-translate-y-full">
            {children}
          </span>
          <span className="absolute inset-0 block translate-y-full transition-transform duration-700 ease-(--ease-expo) group-hover:translate-y-0">
            {children}
          </span>
        </span>
        <svg
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 transition-transform duration-700 ease-(--ease-expo) group-hover:translate-x-1 group-hover:-rotate-45"
        >
          <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </a>
    </Magnetic>
  );
}

export function SectionTag({
  index,
  label,
  dark = true,
}: {
  index: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div className={`eyebrow flex items-center gap-4 ${dark ? "text-mist" : "text-navy/60"}`}>
      <span className="text-gold">{index}</span>
      <span className={`h-px w-10 ${dark ? "bg-white/20" : "bg-navy/20"}`} />
      <span>{label}</span>
    </div>
  );
}
