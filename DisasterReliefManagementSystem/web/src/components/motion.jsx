import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";

/* ---------- CountUp ----------
   Animates a number from 0 to value when scrolled into view.
   Motion value + animate() so React never re-renders per frame
   except on the final integer step. Collapses to static under
   prefers-reduced-motion. */

export function CountUp({ value, format }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(() => (typeof value === "number" ? value : 0));

  useEffect(() => {
    if (typeof value !== "number") return;
    if (!inView || reduce) {
      setDisplay(value);
      return;
    }
    // value can grow while running; animate from the currently shown number
    const controls = animate(display, value, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inView, reduce]);

  const shown = typeof value === "number" ? display.toLocaleString() : value;
  return <span ref={ref}>{format ? format(shown) : shown}</span>;
}

/* ---------- Stagger / StaggerItem ----------
   Children enter with a small vertical offset, cascaded.
   Pure opacity/transform (GPU-safe). Static under reduced motion. */

export function Stagger({ children, className = "", delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.07, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export function StaggerItem({ children, className = "" }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

/* ---------- LiveDot ----------
   The one permitted status dot: a slow pulse on the masthead
   figure strip conveying "this data is live". Sole use on page.
   Under reduced motion it is a static dot. */

export function LiveDot() {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-flex h-2 w-2" role="img" aria-label="Live data">
      <span className="absolute inline-flex h-full w-full rounded-full bg-st-ok opacity-60" aria-hidden="true" />
      {!reduce && (
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-st-ok motion-safe:animate-ping motion-safe:[animation-duration:2.4s]"
          aria-hidden="true"
        />
      )}
      <span className="relative inline-flex h-2 w-2 rounded-full bg-st-ok" aria-hidden="true" />
    </span>
  );
}

/* ---------- Meter ----------
   Shelter occupancy bar. Not a decoration: encodes the ratio
   capacity/occupied numerically AND visually. Thin track, no
   heavy dashboard styling; color switches only at thresholds
   (>= 90% warn, 100% full) and always pairs with a text label. */

export function Meter({ value, max }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const reduce = useReducedMotion();
  const color =
    pct >= 100 ? "bg-accent" : pct >= 90 ? "bg-st-warn" : "bg-st-ok";
  return (
    <div
      className="flex items-center gap-2"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`Occupancy ${value} of ${max}, ${pct} percent`}
    >
      <div className="h-1 w-20 overflow-hidden rounded-full bg-line">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="w-9 text-right font-mono text-[12px] text-muted">{pct}%</span>
    </div>
  );
}

/* ---------- ProgressSteps ----------
   Request lifecycle: Filed -> Verified -> Delivered.
   Text-led; the connecting line only supports the sequence. */

const STEP_LABELS = ["Filed", "Verified", "Delivered"];

export function ProgressSteps({ status, volunteer }) {
  const step =
    status === "Delivered" ? 2 :
    status === "Approved" || status === "Rejected" ? (status === "Approved" ? 1 : -1) :
    0;
  // Rejected is a terminal side-state, not a step; show it in the tag instead.
  if (step === -1) {
    return <span className="font-mono text-[12px] text-muted">not progressing</span>;
  }
  const reached = status === "Delivered" ? 2 : status === "Approved" && volunteer ? 1 : status === "Approved" ? 1 : 0;
  return (
    <ol className="flex items-center gap-1.5" aria-label="Request progress">
      {STEP_LABELS.map((label, i) => {
        const done = i <= reached;
        return (
          <li key={label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className={`h-px w-4 ${i <= reached ? "bg-ink" : "bg-line-strong"}`} />}
            <span
              className={`text-[12px] leading-none ${done ? "font-semibold text-ink" : "text-muted"}`}
              aria-current={i === reached ? "step" : undefined}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
