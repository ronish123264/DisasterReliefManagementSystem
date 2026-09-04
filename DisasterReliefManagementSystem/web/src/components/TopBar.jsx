import { useState } from "react";
import { List } from "@phosphor-icons/react";
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

export default function TopBar() {
  const { user, section, showSection, logout } = useApp();
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
          <span aria-hidden="true" className="h-3 w-3 rounded-xs bg-accent" />
          DRMS
        </button>

        {/* desktop / tablet nav */}
        <nav aria-label="Main" className="flex flex-1 gap-0.5 overflow-x-auto max-[900px]:hidden">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              aria-current={section === item.id ? "page" : undefined}
              className={`-mb-px cursor-pointer border-b-2 px-3 pt-5 pb-4 text-sm font-medium whitespace-nowrap transition-colors ${
                section === item.id
                  ? "border-accent text-accent"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {item.label}
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

        <div className={`ml-auto flex items-center gap-2.5 max-[900px]:ml-0 max-[640px]:w-full ${open ? "max-[900px]:hidden" : ""}`}>
          {user ? (
            <>
              <span className="text-[13px] text-ink-soft whitespace-nowrap">
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
