"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { Triquetra, EXPO } from "./ui";

/* ---------- loaded state shared by the preloader and the hero ---------- */

let loaded = false;
const subs = new Set<() => void>();
function setLoaded() {
  loaded = true;
  subs.forEach((f) => f());
}
export function useLoaded() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => loaded,
    () => false,
  );
}

let lenis: Lenis | null = null;

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLoaded();
      return;
    }
    lenis = new Lenis({ duration: 1.25, anchors: { offset: 0 }, easing: (t) => 1 - Math.pow(1 - t, 4) });
    if (!loaded) lenis.stop();
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const unsub = (() => {
      const f = () => lenis?.start();
      subs.add(f);
      return () => subs.delete(f);
    })();
    return () => {
      cancelAnimationFrame(raf);
      unsub();
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}

/* ---------- preloader ---------- */

export function Preloader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const start = performance.now();
    const total = 2300;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setDone(true);
          setLoaded();
        }, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(28,75,214,0.18),transparent_60%)]" />
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: EXPO }}
            >
              <Triquetra className="h-28 w-28 drop-shadow-[0_0_30px_rgba(216,179,106,0.45)]" draw duration={2} width={0.06} />
            </motion.div>
            <div className="mt-10 overflow-hidden">
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: EXPO }}
                className="text-[13px] tracking-[0.6em] text-white/80"
              >
                TRIPLE<span className="text-gold">ARC</span>
              </motion.p>
            </div>
          </div>
          <div className="eyebrow absolute bottom-10 left-6 right-6 flex items-end justify-between text-mist md:left-12 md:right-12">
            <span>Governance · Risk · Compliance</span>
            <span className="font-display text-6xl font-extralight tracking-normal text-white tabular-nums md:text-8xl">
              {String(n).padStart(3, "0")}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 h-px bg-gold" style={{ width: `${n}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- custom cursor ---------- */

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });
  const [mode, setMode] = useState<"idle" | "hover" | "label">("idle");
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      setOn(true);
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor], a, button") as HTMLElement | null;
      const lab = el?.dataset.cursorLabel;
      if (lab) {
        setMode("label");
        setLabel(lab);
      } else setMode(el ? "hover" : "idle");
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!on) return null;
  const size = mode === "label" ? 96 : mode === "hover" ? 58 : 34;
  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[120] mix-blend-difference"
        style={{ x, y }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white" />
      </motion.div>
      <motion.div className="pointer-events-none fixed left-0 top-0 z-[119]" style={{ x: sx, y: sy }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60"
          animate={{
            width: size,
            height: size,
            backgroundColor: mode === "label" ? "rgba(216,179,106,0.95)" : "rgba(216,179,106,0)",
          }}
          transition={{ duration: 0.45, ease: EXPO }}
        >
          <AnimatePresence>
            {mode === "label" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="eyebrow text-[9px] text-ink"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ---------- left "system rail" with scroll progress + local clock ---------- */

export function SystemRail() {
  const { scrollYProgress } = useScroll();
  const h = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const pct = useTransform(scrollYProgress, (v) => v.toFixed(2));
  const [time, setTime] = useState("");
  const [p, setP] = useState("0.00");

  useEffect(() => {
    const f = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }).format(new Date()) + " IST",
      );
    f();
    const id = setInterval(f, 20000);
    const u = pct.on("change", setP);
    return () => {
      clearInterval(id);
      u();
    };
  }, [pct]);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-40 hidden h-screen w-14 flex-col items-center justify-between py-8 mix-blend-difference xl:flex">
      <span className="eyebrow rotate-180 text-[10px] text-white/70 [writing-mode:vertical-rl]">
        Scroll <span className="text-gold">●</span> {p}
      </span>
      <div className="relative h-40 w-px bg-white/20">
        <motion.div className="absolute left-0 top-0 w-px origin-top bg-gold" style={{ height: "100%", scaleY: h }} />
      </div>
      <span className="eyebrow rotate-180 text-[10px] text-white/70 [writing-mode:vertical-rl]">{time}</span>
    </div>
  );
}
