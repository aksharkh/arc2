"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { createProgram } from "@/lib/marble";
import { Triquetra } from "./ui";

export function ShaderCanvas({ className = "", seed = 1.3, bands = 6, scale = 0.6 }: { className?: string; seed?: number; bands?: number; scale?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", { antialias: false });
    if (!gl) return;
    const u = createProgram(gl);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const start = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * scale));
      canvas.height = Math.max(1, Math.round(r.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform1f(u.time, reduce ? 12 : (performance.now() - start) / 1000 + seed * 20);
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.seed, seed);
      gl.uniform1f(u.bands, bands);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    const move = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", move);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, [seed, bands, scale]);

  return <canvas ref={ref} className={`block h-full w-full ${className}`} />;
}

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clip = useTransform(scrollYProgress, [0, 0.25], ["inset(14% 10% 14% 10% round 40px)", "inset(0% 0% 0% 0% round 0px)"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const line2 = useTransform(scrollYProgress, [0.62, 0.8], [0, 1]);
  const line2y = useTransform(scrollYProgress, [0.62, 0.8], [40, 0]);

  const words = "We do not sell reassurance.".split(" ");
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const a = 0.2;
  const b = 0.6;

  // Drive the word reveal by hand: each word fades and sharpens over its own slice of the scroll.
  const paint = (v: number) => {
    wordRefs.current.forEach((el, i) => {
      if (!el) return;
      const s0 = a + ((b - a) * i) / words.length;
      const s1 = a + ((b - a) * (i + 1)) / words.length;
      const t = Math.min(1, Math.max(0, (v - s0) / (s1 - s0)));
      el.style.opacity = String(0.12 + 0.88 * t);
      el.style.filter = `blur(${(6 * (1 - t)).toFixed(2)}px)`;
    });
  };
  useMotionValueEvent(scrollYProgress, "change", paint);

  return (
    <section ref={ref} className="relative h-[300vh] bg-ink">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <motion.div style={{ scale: bgScale }} className="absolute inset-0">
            <ShaderCanvas />
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(3,8,26,0.25),rgba(3,8,26,0.85))]" />
        </motion.div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center px-6 text-center">
          <Triquetra className="mb-10 h-12 w-12 opacity-90" width={0.08} draw />
          <h2 className="max-w-6xl text-[clamp(2.8rem,8.5vw,9rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
            {words.map((w, i) => (
              <span
                key={i}
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                style={{ opacity: 0.12, filter: "blur(6px)" }}
                className="mr-[0.22em] inline-block"
              >
                {w}
              </span>
            ))}
          </h2>
          <motion.p
            style={{ opacity: line2, y: line2y }}
            className="mt-8 font-serif text-[clamp(1.6rem,3.4vw,3.2rem)] italic text-gold-2"
          >
            We build the conditions that justify it.
          </motion.p>
        </div>

        <div className="eyebrow absolute bottom-8 left-6 right-6 z-10 flex justify-between text-white/50 md:left-12 md:right-12 xl:left-24">
          <span>02 — Manifesto</span>
          <span className="hidden md:block">Lapis &amp; gold · Formed under pressure</span>
        </div>
      </div>
    </section>
  );
}
