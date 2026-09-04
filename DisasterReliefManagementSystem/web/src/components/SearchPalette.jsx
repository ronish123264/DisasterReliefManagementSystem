import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useApp } from "../context/AppContext.jsx";

/* Global search palette (Ctrl+K / Cmd+K).
   Searches every record type plus navigation targets, keyboard
   driven: arrows to move, Enter to open, Escape to close. */

const SECTIONS = [
  { id: "home", label: "Overview" },
  { id: "disasters", label: "Disasters" },
  { id: "shelters", label: "Shelters" },
  { id: "requests", label: "Relief requests" },
  { id: "volunteers", label: "Volunteers" },
  { id: "resources", label: "Resources" },
  { id: "missing", label: "Missing persons" },
  { id: "donations", label: "Donations" },
  { id: "login", label: "Login / register" },
];

export default function SearchPalette({ open, onClose }) {
  const { db, showSection } = useApp();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = [];
    for (const s of SECTIONS) {
      if (!q || s.label.toLowerCase().includes(q)) {
        out.push({ kind: "Section", label: s.label, sub: "Go to page", go: () => showSection(s.id) });
      }
    }
    if (q) {
      for (const d of db.disasters) {
        if ([d.type, d.location, d.description].some((v) => v.toLowerCase().includes(q))) {
          out.push({ kind: "Disaster", label: `#${d.id} ${d.type} in ${d.location}`, sub: d.status, go: () => showSection("disasters") });
        }
      }
      for (const s of db.shelters) {
        if ([s.name, s.location].some((v) => v.toLowerCase().includes(q))) {
          out.push({ kind: "Shelter", label: s.name, sub: `${s.location} · ${s.capacity - s.occupied} free`, go: () => showSection("shelters") });
        }
      }
      for (const r of db.requests) {
        if ([r.citizenName, r.location, r.needType].some((v) => v.toLowerCase().includes(q))) {
          out.push({ kind: "Request", label: `#${r.id} ${r.needType} for ${r.citizenName}`, sub: `${r.location} · ${r.status}`, go: () => showSection("requests") });
        }
      }
      for (const m of db.missing) {
        if ([m.name, m.lastSeen].some((v) => v.toLowerCase().includes(q))) {
          out.push({ kind: "Missing", label: m.name, sub: `${m.lastSeen} · ${m.status}`, go: () => showSection("missing") });
        }
      }
      for (const v of db.users) {
        if (v.role === "VOLUNTEER" && [v.fullName, v.skills].some((t) => (t || "").toLowerCase().includes(q))) {
          out.push({ kind: "Volunteer", label: v.fullName, sub: v.skills, go: () => showSection("volunteers") });
        }
      }
      for (const r of db.resources) {
        if ([r.name, r.location].some((v) => v.toLowerCase().includes(q))) {
          out.push({ kind: "Resource", label: `${r.name} (${r.quantity} ${r.unit})`, sub: r.location, go: () => showSection("resources") });
        }
      }
      for (const d of db.donations) {
        if (d.donorName.toLowerCase().includes(q)) {
          out.push({ kind: "Donation", label: d.donorName, sub: d.type, go: () => showSection("donations") });
        }
      }
    }
    return out.slice(0, 12);
  }, [query, db, showSection]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // wait a frame so the input exists before focusing
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter" && results[active]) {
        results[active].go();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, onClose]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-start justify-center bg-[rgba(11,12,13,0.45)] px-4 pt-[14vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="w-full max-w-[560px] overflow-hidden rounded-md border border-line-strong bg-surface shadow-[0_24px_70px_rgba(11,12,13,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search disasters, shelters, requests, people"
          className="w-full border-0 border-b border-line bg-surface px-4 py-3.5 text-[15px] text-ink outline-none placeholder:text-muted"
        />        <ul ref={listRef} role="listbox" aria-label="Search results" className="max-h-[46vh] overflow-y-auto py-1.5">
          {results.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted">Nothing matches that search.</li>
          )}
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.label}-${i}`}>
              <button
                aria-selected={i === active}
                role="option"
                onMouseEnter={() => setActive(i)}
                onClick={() => { r.go(); onClose(); }}
                className={`flex w-full cursor-pointer items-baseline justify-between gap-3 px-4 py-2 text-left ${
                  i === active ? "bg-accent-tint" : ""
                }`}
              >
                <span className="text-sm text-ink">
                  <span className="mr-2 font-mono text-[11px] text-muted">{r.kind.toUpperCase()}</span>
                  {r.label}
                </span>
                <span className="shrink-0 text-[12px] text-muted">{r.sub}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3 border-t border-line px-4 py-2 font-mono text-[11px] text-muted">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
