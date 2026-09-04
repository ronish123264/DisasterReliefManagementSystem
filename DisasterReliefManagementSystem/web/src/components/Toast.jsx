import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext.jsx";

// Toast: transient feedback only. Announced politely to screen readers.
export default function Toast() {
  const { toast } = useApp();
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!toast.text) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(timer);
  }, [toast.id, toast.text]);

  const inner = (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-5 z-100 flex max-w-[380px] items-center gap-2.5 rounded-md bg-ink px-4 py-3 text-[13.5px] font-medium text-[#fbfbf9] shadow-[0_8px_28px_rgba(27,29,31,0.28)]"
    >
      <CheckCircle size={16} weight="fill" className="shrink-0 text-st-ok-bg" aria-hidden="true" />
      {toast.text}
    </div>
  );

  if (reduce) {
    return visible ? inner : null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {inner}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
