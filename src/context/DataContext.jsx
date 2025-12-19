import { createContext, useContext, useEffect, useMemo, useState } from "react";

const API = "http://localhost:3000";
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  async function fetchJson(url, options) {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    if (res.status === 204) return null;
    return res.json();
  }

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const [evs, cats] = await Promise.all([
        fetchJson(`${API}/events`),
        fetchJson(`${API}/categories`),
      ]);
      setEvents(evs);
      setCategories(cats);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }

  async function addEvent(payload) {
    const created = await fetchJson(`${API}/events`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setEvents((prev) => [...prev, created]);
    return created;
  }

  async function updateEvent(id, payload) {
    const updated = await fetchJson(`${API}/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  }

  async function removeEvent(id) {
    await fetchJson(`${API}/events/${id}`, { method: "DELETE" });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  useEffect(() => {
    refresh();
  }, []);

  const categoryMap = useMemo(() => {
    const m = new Map();
    categories.forEach((c) => m.set(c.id, c.name || String(c)));
    return m;
  }, [categories]);

  const value = {
    events,
    categories,
    categoryMap,
    loading,
    err,
    refresh,
    addEvent,
    updateEvent,
    removeEvent,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
