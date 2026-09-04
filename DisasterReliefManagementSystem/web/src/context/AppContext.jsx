import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loadDB, loadSession, saveDB, storeSession, nextId, today } from "../lib/db.js";

const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

function initialTheme() {
  try {
    const stored = localStorage.getItem("drms_theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function AppProvider({ children }) {
  const [db, setDbState] = useState(() => loadDB());
  const [user, setUser] = useState(() => loadSession(db.users));
  const [section, setSection] = useState("home");
  const [toast, setToast] = useState({ id: 0, text: "" });
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("drms_theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const setDb = useCallback((updater) => {
    setDbState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveDB(next);
      return next;
    });
  }, []);

  const showSection = useCallback((id) => {
    setSection(id);
    window.scrollTo(0, 0);
  }, []);

  const showToast = useCallback((text) => {
    setToast((t) => ({ id: t.id + 1, text }));
  }, []);

  const login = useCallback(
    (username, password) => {
      const found = db.users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password,
      );
      if (!found) return false;
      setUser(found);
      storeSession(found);
      showToast(`Logged in as ${found.fullName}`);
      showSection("home");
      return true;
    },
    [db.users, showToast, showSection],
  );

  const logout = useCallback(() => {
    setUser(null);
    storeSession(null);
    showToast("Logged out");
    showSection("home");
  }, [showToast, showSection]);

  const register = useCallback(
    (draft) => {
      if (db.users.some((u) => u.username.toLowerCase() === draft.username.toLowerCase())) {
        return "That username is already taken.";
      }
      const newUser = { id: nextId(db.users), ...draft };
      setDb((prev) => ({ ...prev, users: [...prev.users, newUser] }));
      setUser(newUser);
      storeSession(newUser);
      showToast(`Account created. Welcome, ${newUser.fullName}`);
      showSection("home");
      return null;
    },
    [db.users, setDb, showToast, showSection],
  );

  // ---- domain actions (each returns a toast message) ----

  const actions = {
    reportDisaster(draft) {
      const rec = { id: nextId(db.disasters), ...draft, date: today(), status: "Reported", reportedBy: user.fullName };
      setDb((prev) => ({ ...prev, disasters: [...prev.disasters, rec] }));
      showToast("Disaster report filed");
    },
    setDisasterStatus(id, status) {
      setDb((prev) => ({
        ...prev,
        disasters: prev.disasters.map((d) => (d.id === id ? { ...d, status } : d)),
      }));
      showToast(`Disaster ${id} set to ${status}`);
    },
    addShelter(draft) {
      const rec = { id: nextId(db.shelters), ...draft };
      if (rec.occupied > rec.capacity) rec.occupied = rec.capacity;
      if (rec.occupied < 0) rec.occupied = 0;
      setDb((prev) => ({ ...prev, shelters: [...prev.shelters, rec] }));
      showToast("Shelter added");
    },
    addResource(draft) {
      const rec = { id: nextId(db.resources), ...draft };
      setDb((prev) => ({ ...prev, resources: [...prev.resources, rec] }));
      showToast("Resource added to inventory");
    },
    requestRelief(draft) {
      const rec = {
        id: nextId(db.requests),
        ...draft,
        citizenName: user.fullName,
        date: today(),
        status: "Pending",
        volunteer: "",
      };
      setDb((prev) => ({ ...prev, requests: [...prev.requests, rec] }));
      showToast("Relief request submitted, status Pending");
    },
    decideRequest(id, status) {
      setDb((prev) => ({
        ...prev,
        requests: prev.requests.map((r) => (r.id === id ? { ...r, status } : r)),
      }));
      showToast(status === "Delivered" ? `Request ${id} delivered` : `Request ${id} ${status.toLowerCase()}`);
    },
    claimRequest(id) {
      setDb((prev) => ({
        ...prev,
        requests: prev.requests.map((r) => (r.id === id ? { ...r, volunteer: user.fullName } : r)),
      }));
      showToast(`You claimed request ${id}`);
    },
    setAvailability(availability) {
      setDb((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u.id === user.id ? { ...u, availability } : u)),
      }));
      setUser({ ...user, availability });
      showToast(`You are marked ${availability.toLowerCase()}`);
    },
    reportMissing(draft) {
      const rec = {
        id: nextId(db.missing),
        ...draft,
        reportedBy: user.fullName,
        date: today(),
        status: "Missing",
      };
      setDb((prev) => ({ ...prev, missing: [...prev.missing, rec] }));
      showToast("Missing person report filed");
    },
    markFound(id) {
      setDb((prev) => ({
        ...prev,
        missing: prev.missing.map((m) => (m.id === id ? { ...m, status: "Found" } : m)),
      }));
      showToast(`Person ${id} marked as found`);
    },
    donate(draft) {
      const rec = { id: nextId(db.donations), ...draft, donorName: user.fullName, date: today() };
      setDb((prev) => ({ ...prev, donations: [...prev.donations, rec] }));
      showToast("Donation recorded, thank you");
    },
  };

  const value = {
    db,
    user,
    section,
    toast,
    theme,
    toggleTheme,
    showSection,
    showToast,
    login,
    logout,
    register,
    actions,
    isStaff: !!user && (user.role === "ADMIN" || user.role === "MUNICIPALITY"),
    isCitizen: !!user && user.role === "CITIZEN",
    isVolunteer: !!user && user.role === "VOLUNTEER",
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
