import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import TopBar from "./components/TopBar.jsx";
import Toast from "./components/Toast.jsx";
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

function Shell() {
  const { section } = useApp();
  const reduce = useReducedMotion();
  const View = VIEWS[section] || Overview;

  const content = <View />;

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-[#fbfbf9]">
        Skip to content
      </a>
      <TopBar />
      <main id="main" className="mx-auto w-full max-w-[1160px] grow px-6 pb-16 max-[640px]:px-4">
        {reduce ? (
          content
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-center gap-2.5 px-6 py-6 text-[13px] text-muted">
          <span aria-hidden="true" className="h-3 w-3 rounded-xs bg-accent" />
          DRMS, Nepal disaster relief. The console build stores data in text files; this site stores data in the browser.
        </div>
      </footer>
      <Toast />
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
