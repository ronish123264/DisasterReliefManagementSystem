import { motion, useReducedMotion } from "motion/react";

/* Shared motion/feature primitives live in motion.jsx and are
   re-exported here so views import everything from one module. */
export { CountUp, Stagger, StaggerItem, LiveDot, Meter, ProgressSteps } from "./motion.jsx";

/* ---------- status tag ----------
   Text always carries the state; the tint only supports it.
   One mapping used everywhere (color consistency lock). */

const TAG_STYLES = {
  pending: "text-st-warn bg-st-warn-bg border-st-warn-bg",
  medium: "text-st-warn bg-st-warn-bg border-st-warn-bg",
  reported: "text-st-neutral bg-st-neutral-bg border-line-strong",
  rejected: "text-st-neutral bg-st-neutral-bg border-line-strong",
  approved: "text-st-info bg-st-info-bg border-st-info-bg",
  money: "text-st-info bg-st-info-bg border-st-info-bg",
  resolved: "text-st-ok bg-st-ok-bg border-st-ok-bg",
  found: "text-st-ok bg-st-ok-bg border-st-ok-bg",
  delivered: "text-st-ok bg-st-ok-bg border-st-ok-bg",
  low: "text-st-ok bg-st-ok-bg border-st-ok-bg",
  available: "text-st-ok bg-st-ok-bg border-st-ok-bg",
  supplies: "text-st-ok bg-st-ok-bg border-st-ok-bg",
  ongoing: "text-st-bad bg-st-bad-bg border-st-bad-bg",
  missing: "text-st-bad bg-st-bad-bg border-st-bad-bg",
  high: "text-st-bad bg-st-bad-bg border-st-bad-bg",
  critical: "text-st-bad bg-st-bad-bg border-st-bad-bg",
  busy: "text-st-bad bg-st-bad-bg border-st-bad-bg",
};

export function Tag({ status }) {
  const key = status.toLowerCase().replace(" ", "-");
  const cls = TAG_STYLES[key] || "text-st-neutral bg-st-neutral-bg border-line-strong";
  return (
    <span className={`inline-block rounded border px-2 py-0.5 text-xs leading-5 font-semibold whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}

/* ---------- buttons ----------
   Three variants only: solid (primary/crimson), ink (confirm),
   line (secondary). All meet WCAG AA contrast. */

const BTN_BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-md font-semibold " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "transition-[background-color,border-color,transform,box-shadow] duration-150 " +
  "active:translate-y-px active:scale-[0.99] whitespace-nowrap cursor-pointer";

const BTN_VARIANTS = {
  solid:
    "bg-accent text-[#fdfdfb] border border-accent-deep shadow-[0_1px_2px_rgba(138,28,38,0.35)] " +
    "hover:bg-accent-deep hover:shadow-[0_3px_10px_rgba(138,28,38,0.35)] hover:-translate-y-px",
  ink:
    "bg-ink text-[#fbfbf9] border border-ink shadow-[0_1px_2px_rgba(27,29,31,0.3)] " +
    "hover:bg-[#0b0c0d] hover:shadow-[0_3px_10px_rgba(27,29,31,0.3)] hover:-translate-y-px",
  line:
    "bg-transparent text-ink border border-line-strong hover:border-muted hover:bg-surface-2 hover:-translate-y-px",
  ghost:
    "bg-transparent text-ink-soft border border-transparent hover:bg-surface-2 hover:text-ink",
};

const BTN_SIZES = {
  md: "px-4 py-2.5 text-sm",
  sm: "px-2.5 py-1.5 text-[13px]",
};

export function btn(variant = "solid", size = "md", extra = "") {
  return `${BTN_BASE} ${BTN_VARIANTS[variant]} ${BTN_SIZES[size]} ${extra}`;
}

export function Button({ variant = "solid", size = "md", className = "", ...rest }) {
  return <button className={btn(variant, size, className)} {...rest} />;
}

/* ---------- panel ---------- */

export function Panel({ title, meta, children, actions }) {
  return (
    <section className="mb-5 rounded-md border border-line bg-surface">
      {(title || meta || actions) && (
        <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-5 py-3.5">
          <div className="flex items-baseline gap-3">
            {title && <h2 className="text-[15px] font-semibold">{title}</h2>}
          </div>
          <div className="flex items-center gap-4">
            {meta && <p className="font-mono text-[13px] text-muted">{meta}</p>}
            {actions}
          </div>
        </header>
      )}
      {children}
    </section>
  );
}

/* ---------- form field ----------
   Label above, control below (skill: never placeholder-as-label). */

export function Field({ label, htmlFor, wide = false, children, hint }) {
  return (
    <div className={`flex flex-col gap-1 ${wide ? "sm:col-span-2" : ""}`}>
      <label htmlFor={htmlFor} className="text-[13px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export const inputCls =
  "w-full rounded-md border border-line-strong bg-white px-3 py-2 text-sm text-ink " +
  "placeholder:text-muted focus:outline-2 focus:outline-offset-[-1px] focus:outline-accent";

/* ---------- empty state (skill: never a blank table) ---------- */

export function EmptyState({ icon: Icon, title, body, children }) {
  return (
    <div role="status" className="px-5 py-12 text-center">
      {Icon && <Icon size={28} weight="thin" className="mx-auto text-muted" aria-hidden="true" />}
      <h3 className="mt-3 text-sm font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-1 max-w-[42ch] text-sm text-muted">{body}</p>
      {children && <div className="mt-4 flex justify-center gap-3">{children}</div>}
    </div>
  );
}

/* ---------- reveal ----------
   Scroll-triggered entrance, gated by prefers-reduced-motion. */

export function Reveal({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
