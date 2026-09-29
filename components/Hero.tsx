"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useLoaded } from "./chrome";
import { Button, EXPO, Logo, Magnetic } from "./ui";

const KnotScene = dynamic(() => import("./KnotScene"), { ssr: false });

const NAV = [
  ["Pillars", "#pillars"],
  ["System", "#system"],
  ["Method", "#method"],
  ["Sectors", "#sectors"],
  ["Insights", "#insights"],
];

export function Nav() {
  const loaded = useLoaded();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 400 && !open);
    setSolid(v > 60);
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-6"
        initial={{ y: -120 }}
        animate={{ y: loaded && !hidden ? 0 : -120 }}
        transition={{ duration: 1, ease: EXPO, delay: loaded && !solid ? 0.9 : 0 }}
      >
        <div
          className={`mx-auto flex max-w-[1500px] items-center justify-between rounded-full py-2.5 pl-5 pr-2.5 transition-all duration-700 ${
            solid ? "glass shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]" : "border border-transparent"
          }`}
        >
          <Logo />
          <nav className="glass hidden items-center gap-1 rounded-full p-1 lg:flex">
            {NAV.map(([l, h]) => (
              <a
                key={l}
                href={h}
                className="rounded-full px-4 py-2 text-[12.5px] tracking-wide text-white/75 transition-colors duration-300 hover:bg-white/10 hover:text-white"
              >
                {l}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <Magnetic>
                <a
                  href="#contact"
                  className="btn-gold inline-flex h-11 items-center rounded-full px-6 text-[12.5px] font-medium tracking-wide"
                >
                  Book a Consultation
                </a>
              </Magnetic>
            </div>
            <button
              aria-label="Menu"
              onClick={() => setOpen((o) => !o)}
              className="glass flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full lg:hidden"
            >
              <span className={`h-px w-4 bg-white transition-transform duration-500 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-4 bg-white transition-transform duration-500 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </motion.header>
      <motion.div
        className="fixed inset-0 z-40 flex flex-col justify-end bg-ink/95 px-6 pb-14 backdrop-blur-xl lg:hidden"
        initial={false}
        animate={{ clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      >
        {NAV.map(([l, h], i) => (
          <a
            key={l}
            href={h}
            onClick={() => setOpen(false)}
            className="flex items-baseline gap-4 border-b border-white/10 py-4 text-4xl font-light text-white"
          >
            <span className="eyebrow text-gold">0{i + 1}</span>
            {l}
          </a>
        ))}
        <a href="#contact" onClick={() => setOpen(false)} className="btn-gold mt-8 rounded-full py-4 text-center text-sm font-medium">
          Book a Consultation
        </a>
      </motion.div>
    </>
  );
}

function HeadLine({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) {
  const loaded = useLoaded();
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "115%", rotate: 3 }}
        animate={loaded ? { y: "0%", rotate: 0 } : undefined}
        transition={{ duration: 1.5, delay, ease: EXPO }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const loaded = useLoaded();
  const ref = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => (scrollRef.current = v));
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const yKnot = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const radius = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[720px]">
      <motion.div
        style={{ borderBottomLeftRadius: radius, borderBottomRightRadius: radius, scale }}
        className="absolute inset-0 origin-top overflow-hidden bg-navy"
      >
        {/* atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_72%_45%,rgba(28,75,214,0.35),transparent_70%),radial-gradient(ellipse_50%_40%_at_10%_100%,rgba(216,179,106,0.12),transparent_70%),linear-gradient(180deg,#03081a,#060f26_60%,#081634)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
            backgroundSize: "96px 96px",
            maskImage: "radial-gradient(ellipse at 70% 50%, black, transparent 70%)",
          }}
        />
        {/* orbit rings behind knot */}
        <motion.svg
          viewBox="0 0 800 800"
          className="absolute right-[-12%] top-1/2 hidden h-[125%] -translate-y-1/2 opacity-60 md:block"
          initial={{ opacity: 0, rotate: -30 }}
          animate={loaded ? { opacity: 0.6, rotate: 0 } : undefined}
          transition={{ duration: 3, ease: EXPO, delay: 0.4 }}
        >
          <circle cx="400" cy="400" r="300" fill="none" stroke="rgba(216,179,106,.25)" strokeDasharray="2 8" />
          <circle cx="400" cy="400" r="370" fill="none" stroke="rgba(143,176,255,.12)" />
          <ellipse cx="400" cy="400" rx="390" ry="120" fill="none" stroke="rgba(216,179,106,.2)" transform="rotate(-18 400 400)" />
        </motion.svg>

        <motion.div
          style={{ y: yKnot }}
          className="absolute inset-x-[-10%] top-[6%] h-[52%] md:inset-x-auto md:inset-y-0 md:right-[-6%] md:top-0 md:h-auto md:w-[68%]"
        >
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={loaded ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 2.4, ease: EXPO, delay: 0.2 }}
          >
            <KnotScene scrollRef={scrollRef} />
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: yText, opacity: fade }}
          className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-end px-6 pb-12 md:px-12 md:pb-16 xl:pl-24"
        >
          <motion.div
            className="eyebrow mb-8 flex items-center gap-4 text-mist"
            initial={{ opacity: 0, x: -20 }}
            animate={loaded ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 1.2, delay: 0.3, ease: EXPO }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
              <span className="relative h-2 w-2 rounded-full bg-gold" />
            </span>
            Independent GRC Advisory
          </motion.div>

          <h1 className="text-[clamp(3.4rem,10.5vw,11.5rem)] font-extralight leading-[0.9] tracking-[-0.045em] text-white">
            <HeadLine delay={0.15}>Control,</HeadLine>
            <HeadLine delay={0.28} className="flex items-baseline gap-[0.12em]">
              <span className="text-gold-grad font-light">engineered</span>
              <span className="font-serif text-[0.9em] italic text-gold">.</span>
            </HeadLine>
          </h1>

          <div className="mt-10 flex flex-col gap-10 md:mt-14 md:flex-row md:items-end md:justify-between">
            <motion.p
              className="max-w-md text-[15px] font-light leading-relaxed text-white/70 md:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1.2, delay: 0.7, ease: EXPO }}
            >
              Unified governance, risk and compliance advisory for regulated organisations that{" "}
              <em className="font-serif text-[1.15em] text-white">cannot afford uncertainty.</em>
            </motion.p>
            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1.2, delay: 0.85, ease: EXPO }}
            >
              <Button href="#pillars">Explore Solutions</Button>
              <Button href="#method" variant="ghost">
                Our Approach
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 hidden items-center justify-between border-t border-white/10 pt-6 md:flex"
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : undefined}
            transition={{ duration: 1.5, delay: 1.1 }}
          >
            <div className="eyebrow flex gap-10 text-white/45">
              <span>ISO 27001</span>
              <span>SOC 2</span>
              <span>NIST CSF</span>
              <span>DPDP · GDPR</span>
              <span>DORA</span>
            </div>
            <div className="eyebrow flex items-center gap-3 text-white/60">
              Scroll to explore
              <span className="relative h-8 w-[18px] rounded-full border border-white/30">
                <motion.span
                  className="absolute left-1/2 top-1.5 h-1.5 w-px -translate-x-1/2 bg-gold"
                  animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
