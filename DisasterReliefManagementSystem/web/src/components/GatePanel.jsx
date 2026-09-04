import { UserPlus } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext.jsx";
import { Panel, btn } from "./ui.jsx";

// Shown instead of a restricted form: explains who can use it,
// and offers a route to the login screen for guests.
export default function GatePanel({ title, roleText }) {
  const { user, showSection } = useApp();
  return (
    <Panel title={title}>
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5">
        <p className="flex items-center gap-2.5 text-sm text-muted">
          <UserPlus size={18} weight="thin" className="text-line-strong" aria-hidden="true" />
          {user ? roleText : "Log in with an account that has access to use this form."}
        </p>
        {!user && (
          <button className={btn("line", "sm")} onClick={() => showSection("login")}>
            Go to log in
          </button>
        )}
      </div>
    </Panel>
  );
}
