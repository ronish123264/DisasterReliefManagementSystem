import { useState } from "react";
import { List, MagnifyingGlass, Moon, Sun } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext.jsx";
import { btn } from "./ui.jsx";

const NAV_ITEMS = [
  { id: "home", label: "Overview" },
  { id: "disasters", label: "Disasters" },
  { id: "shelters", label: "Shelters" },
  { id: "requests", label: "Requests" },
  { id: "volunteers", label: "Volunteers" },
  { id: "resources", label: "Resources" },
  { id: "missing", label: "Missing" },
  { id: "donations", label: "Donations" },
];

export default function TopBar({ onOpenSearch }) {
  const { user, section, showSection, logout, theme, toggleTheme } = useApp();
  const [open, setOpen] = useState(false);

  function go(id) {
    setOpen(false);
    showSection(id);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="mx-auto flex h-15 max-w-[1160px] items-center gap-7 px-6 max-[640px]:flex-wrap max-[640px]:h-auto max-[640px]:px-4 max-[640px]:pt-2.5">
        <button
          onClick={() => go("home")}
          className="flex shrink-0 cursor-pointer items-center gap-2.5 py-1 text-base font-bold tracking-tight"
        >
          {/* brand mark: two stacked pennants, the flag of the response */}
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
            <path d="M2 1h11l-3.2 4L13 9H2z" fill="var(--color-accent)" />
            <path d="M5 10h11l-3.2 4L16 18H5z" fill="var(--color-ink)" opacity="0.85" />
          </svg>
          DRMS
        </button>

        {/* desktop / tablet nav with shared active pill */}
        <nav aria-label="Main" className="relative flex flex-1 gap-0.5 overflow-x-auto max-[900px]:hidden">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              aria-current={section === item.id ? "page" : undefined}
              className={`relative cursor-pointer px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                section === item.id ? "text-accent" : "text-ink-soft hover:text-ink"
              }`}
            >
              {section === item.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-md bg-accent-tint"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  aria-hidden="true"
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* mobile menu toggle */}
        <button
          className="ml-auto cursor-pointer p-1.5 text-ink max-[900px]:inline-flex lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <List size={22} />
        </button>

        <div className={`ml-auto flex items-center gap-2 max-[900px]:ml-0 max-[640px]:w-full ${open ? "max-[900px]:hidden" : ""}`}>
          <button
            onClick={onOpenSearch}
            aria-label="Search records (Ctrl+K)"
            title="Search (Ctrl+K)"
            className="hidden cursor-pointer items-center gap-2 rounded-md border border-line-strong px-2.5 py-1.5 text-[13px] text-muted transition-colors hover:border-muted hover:text-ink md:flex"
          >
            <MagnifyingGlass size={14} aria-hidden="true" />
            Search
            <kbd className="rounded-xs border border-line bg-surface-2 px-1 font-mono text-[11px]">Ctrl K</kbd>
          </button>
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="cursor-pointer rounded-md border border-line-strong p-2 text-ink-soft transition-colors hover:border-muted hover:text-ink"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          {user ? (
            <>
              <span className="text-[13px] text-ink-soft whitespace-nowrap max-[1100px]:hidden">
                <b className="font-semibold text-ink">{user.fullName}</b> ({user.role})
              </span>
              <button onClick={logout} className={btn("line", "sm")}>
                Log out
              </button>
            </>
          ) : (
            <button onClick={() => go("login")} className={btn("solid", "sm")}>
              Log in
            </button>
          )}
        </div>
      </div>

      {/* mobile nav panel */}
      {open && (
        <nav aria-label="Main navigation, collapsed" className="border-t border-line px-4 py-3 max-[900px]:block hidden">
          <div className="mx-auto grid max-w-[1160px] grid-cols-2 gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium ${
                  section === item.id ? "bg-accent-tint text-accent" : "text-ink-soft hover:bg-surface-2"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
