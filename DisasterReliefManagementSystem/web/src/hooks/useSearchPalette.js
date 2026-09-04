import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";

/* Global shortcut: Ctrl+K / Cmd+K opens the search palette. */
export function useSearchPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return { open, setOpen };
}
