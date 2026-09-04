import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* IncidentTicker: one marquee per page (design-system cap), and it
   carries real, current records: active disasters and pending
   requests. Pauses on hover; static line under reduced motion. */

export default function IncidentTicker({ items }) {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);
  const half = Math.ceil(items.length / 2);

  if (items.length === 0) return null;

  const line = (slice) => (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={reduce ? undefined : "true"}>
      {slice.map((item, i) => (
        <span key={`${item.text}-${i}`} className="flex items-baseline gap-2 whitespace-nowrap">
          <span className={`h-1.5 w-1.5 rounded-full ${item.hot ? "bg-accent" : "bg-muted"}`} aria-hidden="true" />
          <span className="font-mono text-[11.5px] tracking-wide text-muted uppercase-none">{item.text}</span>
        </span>
      ))}
    </div>
  );

  if (reduce) {
    return (
      <div className="overflow-hidden border-b border-line bg-surface" role="status" aria-label="Current incidents">
        <div className="mx-auto flex max-w-[1160px] items-center gap-8 overflow-x-auto px-6 py-2">
          {items.map((item, i) => (
            <span key={i} className="flex items-baseline gap-2 whitespace-nowrap">
              <span className={`h-1.5 w-1.5 rounded-full ${item.hot ? "bg-accent" : "bg-muted"}`} aria-hidden="true" />
              <span className="font-mono text-[11.5px] tracking-wide text-muted">{item.text}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="ticker group overflow-hidden border-b border-line bg-surface"
      role="status"
      aria-label="Current incidents"
    >
      <div ref={trackRef} className="flex w-max py-2 group-hover:[animation-play-state:paused] motion-safe:animate-ticker">
        {line(items.slice(0, half))}
        {line(items.slice(half).concat(items.slice(0, Math.max(0, half - (items.length - half)))))}
      </div>
    </div>
  );
}
