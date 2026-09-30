"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValueEvent, type MotionValue } from "motion/react";
import { triquetraArcPaths, triquetraCircles, triquetraPath, triquetraTips } from "@/lib/triquetra";

export const EASE = [0.16, 1, 0.3, 1] as const;
const INK = "currentColor";
const FONT = { fontFamily: "var(--font-plex)", letterSpacing: "0.04em" } as const;

const ARCS = triquetraArcPaths();
const CIRCLES = triquetraCircles();
const TIPS = triquetraTips();
const MARK = triquetraPath();

const PX = 0.0075; // one screen pixel in drawing units, near enough

/** Solid lines draw themselves on; dashed construction lines fade in. */
function Stroke({
  d,
  delay = 0,
  dur = 1.4,
  w = 1,
  dash,
  color = INK,
  opacity = 1,
}: {
  d: string;
  delay?: number;
  dur?: number;
  w?: number;
  dash?: number[];
  color?: string;
  opacity?: number;
}) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={w * PX}
      strokeDasharray={dash?.map((v) => v * PX).join(" ")}
      strokeOpacity={opacity}
      strokeLinecap={dash ? "butt" : "round"}
      initial={dash ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
      whileInView={dash ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: dur, delay, ease: [0.65, 0, 0.35, 1] }}
    />
  );
}

function Note({ x, y, children, delay = 0, anchor = "start", accent = false }: { x: number; y: number; children: ReactNode; delay?: number; anchor?: "start" | "middle" | "end"; accent?: boolean }) {
  return (
    <motion.text
      x={x}
      y={y}
      fontSize="0.075"
      textAnchor={anchor}
      fill={accent ? "var(--accent)" : INK}
      style={FONT}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.text>
  );
}

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="-1.25 -1.25 2.5 2.5" className={className} aria-hidden>
      <path d={MARK} fill="none" stroke="currentColor" strokeWidth="0.11" />
    </svg>
  );
}

/** Sheet 01 — the mark set out with compass and straightedge. */
export function Construction({ className }: { className?: string }) {
  const c0 = CIRCLES[0];
  const ang = (-38 * Math.PI) / 180;
  const rEnd = [c0.cx + c0.r * Math.cos(ang), c0.cy + c0.r * Math.sin(ang)];
  return (
    <svg viewBox="-1.95 -1.95 3.9 3.9" className={className} aria-hidden>
      {/* centre lines */}
      <Stroke d="M-1.9 0H1.9" dash={[14, 4, 2, 4]} opacity={0.5} delay={0.1} dur={1} />
      <Stroke d="M0 -1.9V1.9" dash={[14, 4, 2, 4]} opacity={0.5} delay={0.2} dur={1} />
      {/* circumscribed circle through the three tips */}
      <Stroke d="M1 0A1 1 0 1 1 -1 0A1 1 0 1 1 1 0" dash={[3, 5]} opacity={0.6} delay={0.5} dur={1.6} />
      {/* compass circles */}
      {CIRCLES.map((c, i) => (
        <Stroke
          key={i}
          d={`M${c.cx + c.r} ${c.cy}A${c.r} ${c.r} 0 1 1 ${c.cx - c.r} ${c.cy}A${c.r} ${c.r} 0 1 1 ${c.cx + c.r} ${c.cy}`}
          opacity={0.45}
          delay={0.9 + i * 0.35}
          dur={1.8}
        />
      ))}
      {CIRCLES.map((c, i) => (
        <g key={i}>
          <Stroke d={`M${c.cx - 0.06} ${c.cy}H${c.cx + 0.06}M${c.cx} ${c.cy - 0.06}V${c.cy + 0.06}`} delay={0.9 + i * 0.35} dur={0.4} />
        </g>
      ))}
      {/* radii to the tips */}
      {TIPS.map((t, i) => (
        <Stroke key={i} d={`M0 0L${t[0]} ${t[1]}`} dash={[2, 4]} opacity={0.6} delay={1.9 + i * 0.1} dur={0.8} />
      ))}
      {/* the mark itself, heavy line */}
      {ARCS.map((a, i) => (
        <Stroke key={i} d={a.d} w={3.2} delay={2.3 + i * 0.35} dur={1.5} />
      ))}
      {TIPS.map((t, i) => (
        <motion.circle
          key={i}
          cx={t[0]}
          cy={t[1]}
          r="0.035"
          fill="var(--accent)"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 3.2 + i * 0.1, ease: EASE }}
          style={{ transformOrigin: `${t[0]}px ${t[1]}px` }}
        />
      ))}
      {/* radius dimension */}
      <Stroke d={`M${c0.cx} ${c0.cy}L${rEnd[0]} ${rEnd[1]}`} color="var(--accent)" delay={3.3} dur={0.8} />
      <Note x={(c0.cx + rEnd[0]) / 2 + 0.06} y={(c0.cy + rEnd[1]) / 2 - 0.05} delay={3.8} accent>
        R {c0.r.toFixed(2)}
      </Note>
      {/* included angle */}
      <Stroke d={`M0 -0.3A0.3 0.3 0 0 1 ${0.3 * Math.cos(Math.PI / 6)} ${0.3 * Math.sin(Math.PI / 6)}`} color="var(--accent)" delay={3.5} dur={0.7} />
      <Note x={0.2} y={-0.34} delay={3.9} accent>
        120°
      </Note>
      <Note x={TIPS[0][0] + 0.09} y={TIPS[0][1] - 0.06} delay={3.4}>
        T1
      </Note>
      <Note x={TIPS[1][0] + 0.09} y={TIPS[1][1] + 0.12} delay={3.5}>
        T2
      </Note>
      <Note x={TIPS[2][0] - 0.09} y={TIPS[2][1] + 0.12} delay={3.6} anchor="end">
        T3
      </Note>
      <Note x={-1.9} y={1.9} delay={4}>
        3 × ARC · EQUAL RADII · 120° APART
      </Note>
    </svg>
  );
}

/** Sheet 02 — the three arcs pulled apart along their axes; `progress` runs 0 → 1. */
export function Exploded({ className, progress }: { className?: string; progress: MotionValue<number> }) {
  const groups = useRef<(SVGGElement | null)[]>([]);
  const items = [2, 3, 1]; // balloon numbers for arcs 0, 1, 2

  const place = (v: number) => {
    const e = Math.min(1, Math.max(0, v)) * 0.62;
    ARCS.forEach((a, i) => groups.current[i]?.setAttribute("transform", `translate(${(a.out[0] * e).toFixed(4)} ${(a.out[1] * e).toFixed(4)})`));
  };
  useMotionValueEvent(progress, "change", place);
  useEffect(() => place(progress.get()));

  return (
    <svg viewBox="-2.7 -2.35 5.4 4.9" className={className} aria-hidden>
      <path d={MARK} fill="none" stroke={INK} strokeOpacity="0.3" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
      {ARCS.map((a, i) => (
        <path
          key={i}
          d={`M0 0L${a.out[0] * 2.2} ${a.out[1] * 2.2}`}
          stroke={INK}
          strokeOpacity="0.45"
          strokeDasharray="14 4 2 4"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {ARCS.map((a, i) => {
        const b = [a.pin[0] + a.out[0] * 0.55, a.pin[1] + a.out[1] * 0.55];
        return (
          <g
            key={i}
            ref={(el) => {
              groups.current[i] = el;
            }}
          >
            <path d={a.d} fill="none" stroke={INK} strokeWidth="3.2" vectorEffect="non-scaling-stroke" />
            <path d={`M${a.pin[0]} ${a.pin[1]}L${b[0]} ${b[1]}`} stroke="var(--accent)" vectorEffect="non-scaling-stroke" />
            <circle cx={a.pin[0]} cy={a.pin[1]} r="0.03" fill="var(--accent)" />
            <circle cx={b[0]} cy={b[1]} r="0.15" fill="var(--bg)" stroke="var(--accent)" vectorEffect="non-scaling-stroke" />
            <text x={b[0]} y={b[1] + 0.045} textAnchor="middle" fontSize="0.13" fill="var(--accent)" style={FONT}>
              {items[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Circular approval stamp. */
export function Stamp({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="spin h-full w-full">
        <defs>
          <path id="stamp-c" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="var(--accent)" strokeWidth="1" />
        <text fontSize="12" fill="var(--accent)" style={{ fontFamily: "var(--font-plex)", letterSpacing: "0.32em" }}>
          <textPath href="#stamp-c">APPROVED FOR ISSUE · TRIPLEARC GRC · </textPath>
        </text>
      </svg>
      <Mark className="absolute inset-[34%] text-accent" />
    </div>
  );
}
