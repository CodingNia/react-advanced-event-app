import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
function fromDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString();
}
function AddEventModal({ open, onClose, categories, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [startLocal, setStartLocal] = useState("");
  const [endLocal, setEndLocal] = useState("");
  const [selectedCats, setSelectedCats] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage("");
    setLocation("");
    setStartLocal("");
    setEndLocal("");
    setSelectedCats([]);
  };

  if (!open) return null;

  const toggleCategory = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title,
      description,
      image,
      location,
      startTime: fromDateTimeLocal(startLocal),
      endTime: fromDateTimeLocal(endLocal),
      categoryIds: selectedCats.map(Number),
    };

    try {
      const res = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Create HTTP ${res.status}`);
      }
      const created = await res.json();
      alert("Event is toegevoegd.");
      onCreated(created);
      resetForm();
      onClose();
    } catch (e) {
      alert("Event aanmaken mislukt: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (submitting) return;
    resetForm();
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          maxWidth: 520,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Nieuw event aanmaken</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <label>
              Titel*{" "}
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>
              Beschrijving*{" "}
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  minHeight: 80,
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>
              Afbeelding-URL*{" "}
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://voorbeeld.nl/afbeelding.jpg"
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>
              Locatie*{" "}
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bijvoorbeeld: Amsterdam, Damrak 1"
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>
              Startdatum en tijd*{" "}
              <input
                type="datetime-local"
                required
                value={startLocal}
                onChange={(e) => setStartLocal(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>
              Einddatum en tijd*{" "}
              <input
                type="datetime-local"
                required
                value={endLocal}
                onChange={(e) => setEndLocal(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Categorieën*</strong>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {categories.map((cat) => {
                const id = String(cat.id);
                const checked = selectedCats.includes(id);
                return (
                  <label
                    key={id}
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(id)}
                    />
                    {cat.name}
                  </label>
                );
              })}
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #cbd5e1",
                background: "white",
                cursor: "pointer",
              }}
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: "#0f766e",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: 6,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {submitting ? "Opslaan…" : "Event aanmaken"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState([]);

  const [showAdd, setShowAdd] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const [eventsRes, catsRes] = await Promise.all([
          fetch(`${API_URL}/events`),
          fetch(`${API_URL}/categories`),
        ]);

        if (!eventsRes.ok) throw new Error(`Events HTTP ${eventsRes.status}`);
        if (!catsRes.ok) throw new Error(`Categories HTTP ${catsRes.status}`);

        const [eventsData, catsData] = await Promise.all([
          eventsRes.json(),
          catsRes.json(),
        ]);

        setEvents(eventsData);
        setCategories(catsData);
      } catch (e) {
        setErr(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleCategory = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredEvents = useMemo(() => {
    let list = events;

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((ev) => ev.title.toLowerCase().includes(s));
    }

    if (selectedCats.length > 0) {
      const active = new Set(selectedCats);

      list = list.filter((ev) => {
        const evCatIds = (ev.categoryIds || []).map(String);
        return evCatIds.some((cid) => active.has(cid));
      });
    }

    return list;
  }, [events, search, selectedCats]);

  if (loading) {
    return <div style={{ padding: 16 }}>Events laden…</div>;
  }

  if (err) {
    return (
      <div style={{ padding: 16, color: "red" }}>
        Fout bij laden van events: {err.message}
      </div>
    );
  }

  return (
    <div style={{ padding: 4 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Events</h1>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: "#0f766e",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: 999,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Nieuw event
        </button>
      </div>

      {/* Zoeken */}
      <div style={{ margin: "8px 0 12px" }}>
        <input
          type="text"
          placeholder="Zoek events op titel…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 8,
            width: "100%",
            maxWidth: 360,
            borderRadius: 8,
            border: "1px solid #cbd5e1",
          }}
        />
      </div>

      {/* categorie filters */}
      <div style={{ marginBottom: 16 }}>
        <strong>Categorieën filteren:</strong>
        <div
          style={{
            marginTop: 8,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {categories.map((cat) => {
            const id = String(cat.id);
            const checked = selectedCats.includes(id);

            return (
              <label
                key={id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCategory(id)}
                />
                {cat.name}
              </label>
            );
          })}
        </div>
      </div>

      {/* event cards */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredEvents.map((ev) => (
          <li
            key={ev.id}
            onClick={() => navigate(`/events/${ev.id}`)}
            style={{
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
              cursor: "pointer",
              background: "white",
              boxShadow:
                "0 1px 2px rgba(15,23,42,0.05), 0 2px 6px rgba(15,23,42,0.06)",
            }}
          >
            {ev.image && (
              <img
                src={ev.image}
                alt={ev.title}
                style={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "cover",
                  borderRadius: 10,
                  marginBottom: 8,
                }}
              />
            )}
            <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>{ev.title}</h2>

            <p
              style={{
                margin: "0 0 4px",
                fontSize: 13,
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              📍 {ev.location || "Locatie nog niet ingesteld"}
            </p>

            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#0f172a",
              }}
            >
              {ev.description}
            </p>

            <p
              style={{
                marginTop: 6,
                marginBottom: 0,
                fontSize: 12,
                color: "#475569",
              }}
            >
              {formatDateTime(ev.startTime)} → {formatDateTime(ev.endTime)}
            </p>

            <div
              style={{
                marginTop: 6,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                fontSize: 12,
              }}
            >
              {(ev.categoryIds || [])
                .map((cid) =>
                  categories.find((c) => String(c.id) === String(cid))
                )
                .filter(Boolean)
                .map((cat) => (
                  <span
                    key={cat.id}
                    style={{
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "#e0f2fe",
                      color: "#0369a1",
                      fontWeight: 500,
                    }}
                  >
                    {cat.name}
                  </span>
                ))}
            </div>
          </li>
        ))}
      </ul>

      {filteredEvents.length === 0 && (
        <p>Geen events gevonden{search && <> voor “{search}”</>}.</p>
      )}

      {/* nieuw event */}
      <AddEventModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        categories={categories}
        onCreated={(newEvent) => setEvents((prev) => [...prev, newEvent])}
      />
    </div>
  );
}
