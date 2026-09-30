"use client";

import { motion } from "motion/react";
import { Count, EASE } from "./kit";

/* Small product-style visuals used inside cards. All animate once when scrolled into view. */

export function ScoreRing({ value = 98, size = 96, dark = false }: { value?: number; size?: number; dark?: boolean }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke={dark ? "rgba(255,255,255,.18)" : "#e2eaff"} strokeWidth="9" />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={dark ? "#fff" : "#1d4dff"}
          strokeWidth="9"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: value / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.3, ease: EASE }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-bold tracking-[-0.04em]" style={{ fontSize: size * 0.24 }}>
        <Count to={value} suffix="%" />
      </span>
    </div>
  );
}

export function Heatmap({ dark = true, size = 5 }: { dark?: boolean; size?: number }) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
      {Array.from({ length: size * size }).map((_, k) => {
        const i = k % size;
        const j = Math.floor(k / size);
        const level = (i + (size - 1 - j)) / (2 * (size - 1)); // low bottom-left → high top-right
        return (
          <motion.span
            key={k}
            className="cell aspect-square rounded-[6px]"
            style={{
              background: dark ? `rgba(255,255,255,${0.1 + level * 0.8})` : `rgba(29,77,255,${0.08 + level * 0.85})`,
              animationDelay: `${(i + j) * 0.18}s`,
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 + (i + j) * 0.05, ease: EASE }}
          />
        );
      })}
    </div>
  );
}

export function Checklist({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="space-y-2.5">
      {items.map((t, i) => (
        <motion.li
          key={t}
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium ${dark ? "bg-white/8 text-white" : "bg-mist text-ink"}`}
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 + i * 0.18, ease: EASE }}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint">
            <svg viewBox="0 0 12 12" className="h-3 w-3">
              <motion.path
                d="M2.5 6.2 5 8.6 9.5 3.6"
                fill="none"
                stroke="#06281c"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.18 }}
              />
            </svg>
          </span>
          {t}
        </motion.li>
      ))}
    </ul>
  );
}

export function Bars({ values, dark = false }: { values: number[]; dark?: boolean }) {
  return (
    <div className="flex h-16 items-end gap-1.5">
      {values.map((v, i) => (
        <motion.span
          key={i}
          className={`w-full rounded-t-[5px] ${i === values.length - 1 ? (dark ? "bg-white" : "bg-cobalt") : dark ? "bg-white/25" : "bg-sky"}`}
          initial={{ height: 0 }}
          whileInView={{ height: `${v}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 + i * 0.06, ease: EASE }}
        />
      ))}
    </div>
  );
}

/** Three concentric arcs — the TripleArc motif — turning slowly at different speeds. */
export function Arcs({ className = "", stroke = "rgba(255,255,255,0.28)" }: { className?: string; stroke?: string }) {
  const rings = [
    { r: 150, dash: "520 422", cls: "spin-slow", dot: 0 },
    { r: 250, dash: "900 670", cls: "spin-rev", dot: 140 },
    { r: 350, dash: "1300 900", cls: "spin-slow", dot: 250 },
  ];
  return (
    <svg viewBox="-400 -400 800 800" className={className} aria-hidden>
      {rings.map((g) => (
        <g key={g.r} className={g.cls}>
          <circle r={g.r} fill="none" stroke={stroke} strokeWidth="1.2" strokeDasharray={g.dash} strokeLinecap="round" />
          <circle
            r="5"
            cx={g.r * Math.cos((g.dot * Math.PI) / 180)}
            cy={g.r * Math.sin((g.dot * Math.PI) / 180)}
            fill="#fff"
          />
        </g>
      ))}
    </svg>
  );
}

/** Board → committees → functions, drawn as a small reporting tree. */
export function Tree() {
  const mid = [
    ["Audit", 90],
    ["Risk", 260],
    ["Ethics", 430],
  ] as const;
  const low = [40, 140, 210, 310, 380, 480];
  return (
    <svg viewBox="0 0 520 250" className="w-full" aria-hidden>
      {mid.map(([, x], i) => (
        <motion.path
          key={x}
          d={`M260 46 C260 80, ${x} 66, ${x} 104`}
          fill="none"
          stroke="#c9d5ff"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease: EASE }}
        />
      ))}
      {low.map((x, i) => {
        const px = mid[Math.floor(i / 2)][1];
        return (
          <motion.path
            key={x}
            d={`M${px} 140 C${px} 170, ${x} 160, ${x} 196`}
            fill="none"
            stroke="#c9d5ff"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 + i * 0.06, ease: EASE }}
          />
        );
      })}
      <Node x={260} y={28} w={92} label="Board" solid delay={0.1} />
      {mid.map(([l, x], i) => (
        <Node key={l} x={x} y={122} w={84} label={l} delay={0.6 + i * 0.1} />
      ))}
      {low.map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={208}
          r="9"
          fill={i === 3 ? "#1d4dff" : "#e2eaff"}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.2 + i * 0.06, ease: EASE }}
          style={{ transformOrigin: `${x}px 208px` }}
        />
      ))}
    </svg>
  );
}

function Node({ x, y, w, label, solid = false, delay }: { x: number; y: number; w: number; label: string; solid?: boolean; delay: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      <rect x={x - w / 2} y={y - 18} width={w} height={36} rx={18} fill={solid ? "#1d4dff" : "#fff"} stroke={solid ? "none" : "#d5ddf5"} />
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize="13" fontWeight="600" fill={solid ? "#fff" : "#0a1230"} style={{ fontFamily: "var(--font-manrope)" }}>
        {label}
      </text>
    </motion.g>
  );
}
