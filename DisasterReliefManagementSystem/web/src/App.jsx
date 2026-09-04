import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import TopBar from "./components/TopBar.jsx";
import Toast from "./components/Toast.jsx";
import SearchPalette from "./components/SearchPalette.jsx";
import IncidentTicker from "./components/IncidentTicker.jsx";
import { useSearchPalette } from "./hooks/useSearchPalette.js";
import Overview from "./views/Overview.jsx";
import Disasters from "./views/Disasters.jsx";
import Shelters from "./views/Shelters.jsx";
import Requests from "./views/Requests.jsx";
import Volunteers from "./views/Volunteers.jsx";
import Resources from "./views/Resources.jsx";
import Missing from "./views/Missing.jsx";
import Donations from "./views/Donations.jsx";
import Login from "./views/Login.jsx";

const VIEWS = {
  home: Overview,
  disasters: Disasters,
  shelters: Shelters,
  requests: Requests,
  volunteers: Volunteers,
  resources: Resources,
  missing: Missing,
  donations: Donations,
  login: Login,
};

// Ticker items come from live data: unresolved disasters are "hot".
function buildTicker(db) {
  const items = [];
  for (const d of db.disasters) {
    if (d.status !== "Resolved") {
      items.push({ text: `${d.type} · ${d.location} · ${d.status}`, hot: true });
    }
  }
  for (const s of db.shelters) {
    const free = s.capacity - s.occupied;
    if (free === 0) {
      items.push({ text: `Shelter at capacity · ${s.name}`, hot: true });
    } else {
      items.push({ text: `${free} places free · ${s.name}`, hot: false });
    }
  }
  const pending = db.requests.filter((r) => r.status === "Pending").length;
  if (pending > 0) items.push({ text: `${pending} relief request${pending === 1 ? "" : "s"} awaiting approval`, hot: true });
  const missing = db.missing.filter((m) => m.status === "Missing").length;
  if (missing > 0) items.push({ text: `${missing} missing person report${missing === 1 ? "" : "s"} open`, hot: false });
  return items.slice(0, 10);
}

function Shell() {
  const { section, db } = useApp();
  const reduce = useReducedMotion();
  const search = useSearchPalette();
  const View = VIEWS[section] || Overview;

  const content = <View />;

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-[#fbfbf9]">
        Skip to content
      </a>
      <TopBar onOpenSearch={() => search.setOpen(true)} />
      <IncidentTicker items={buildTicker(db)} />
      <main id="main" className="mx-auto w-full max-w-[1160px] grow px-6 pb-16 max-[640px]:px-4">
        {reduce ? (
          content
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-center gap-2.5 px-6 py-6 text-[13px] text-muted">
          <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M2 1h11l-3.2 4L13 9H2z" fill="var(--color-accent)" />
            <path d="M5 10h11l-3.2 4L16 18H5z" fill="var(--color-ink)" opacity="0.85" />
          </svg>
          DRMS, Nepal disaster relief. The console build stores data in text files; this site stores data in the browser.
        </div>
      </footer>
      <Toast />
      <SearchPalette open={search.open} onClose={() => search.setOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
