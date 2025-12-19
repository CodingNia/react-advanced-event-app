import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function fromDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString();
}

function DeleteConfirmModal({ open, onCancel, onConfirm, deleting }) {
  if (!open) return null;

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
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Event verwijderen?</h2>
        <p style={{ margin: "0 0 12px", fontSize: 14, color: "#475569" }}>
          Weet je zeker dat je dit event wilt verwijderen? Deze actie kan niet
          ongedaan gemaakt worden.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 8,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
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
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              background: "#dc2626",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {deleting ? "Verwijderen…" : "Ja, verwijderen"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditEventModal({ open, event, categories, onClose, onUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [startLocal, setStartLocal] = useState("");
  const [endLocal, setEndLocal] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!open || !event) return;

    setTitle(event.title || "");
    setDescription(event.description || "");
    setImage(event.image || "");
    setLocation(event.location || "");
    setStartLocal(toDateTimeLocal(event.startTime));
    setEndLocal(toDateTimeLocal(event.endTime));
    setSelectedCategoryIds((event.categoryIds || []).map(String));
    setSubmitError(null);
  }, [open, event]);

  const toggleCategory = (id) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event) return;

    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      ...event,
      title,
      description,
      image,
      location,
      startTime: fromDateTimeLocal(startLocal),
      endTime: fromDateTimeLocal(endLocal),
      categoryIds: selectedCategoryIds.map((id) => Number(id)),
    };

    try {
      const res = await fetch(`${API_URL}/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Update HTTP ${res.status}`);
      }

      const updated = await res.json();
      onUpdated(updated);
      alert("Event is bijgewerkt.");
      onClose();
    } catch (e) {
      setSubmitError(e.message);
      alert("Bijwerken mislukt: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !event) return null;

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
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Event bewerken</h2>

        {submitError && (
          <p style={{ color: "red", marginBottom: 8 }}>Error: {submitError}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 8 }}>
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

          <div style={{ marginBottom: 8 }}>
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

          <div style={{ marginBottom: 8 }}>
            <label>
              Afbeelding-URL*{" "}
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>
              Locatie*{" "}
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 8 }}>
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

          <div style={{ marginBottom: 8 }}>
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

          <div style={{ marginBottom: 8 }}>
            <strong>Categorieën*</strong>
            <div style={{ marginTop: 4 }}>
              {categories.map((cat) => {
                const id = String(cat.id);
                const checked = selectedCategoryIds.includes(id);
                return (
                  <label
                    key={id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      marginRight: 12,
                      marginBottom: 4,
                    }}
                  >
                    <input
                      type="checkbox"
                      value={id}
                      checked={checked}
                      onChange={() => toggleCategory(id)}
                      style={{ marginRight: 4 }}
                      required={selectedCategoryIds.length === 0}
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
              onClick={handleClose}
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
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: "#0f766e",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {submitting ? "Opslaan…" : "Wijzigingen opslaan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regSubmitting, setRegSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);

        const [eventRes, catsRes] = await Promise.all([
          fetch(`${API_URL}/events/${id}`),
          fetch(`${API_URL}/categories`),
        ]);

        if (!eventRes.ok) throw new Error(`Event HTTP ${eventRes.status}`);
        if (!catsRes.ok) throw new Error(`Categories HTTP ${catsRes.status}`);

        const [eventData, catsData] = await Promise.all([
          eventRes.json(),
          catsRes.json(),
        ]);

        setEvent(eventData);
        setCategories(catsData);
      } catch (e) {
        setErr(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const actuallyDelete = async () => {
    if (!event) return;

    try {
      setDeleting(true);
      const res = await fetch(`${API_URL}/events/${event.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Delete HTTP ${res.status}`);
      }

      alert("Event is verwijderd.");
      navigate("/");
    } catch (e) {
      alert("Verwijderen mislukt: " + e.message);
      setDeleting(false);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!event) return;

    setRegSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          name: regName,
          email: regEmail,
        }),
      });

      if (!res.ok) {
        throw new Error(`Registration HTTP ${res.status}`);
      }

      alert("Je aanmelding is verstuurd!");
      setRegName("");
      setRegEmail("");
    } catch (e) {
      alert("Aanmelden is mislukt: " + e.message);
    } finally {
      setRegSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 16 }}>Event laden…</div>;
  }

  if (err) {
    return (
      <div style={{ padding: 16, color: "red" }}>
        Fout bij laden van event: {err.message}
        <div style={{ marginTop: 8 }}>
          <button onClick={() => navigate(-1)}>Terug</button>
        </div>
      </div>
    );
  }

  if (!event || !event.id) {
    return (
      <div style={{ padding: 16 }}>
        <p>Event niet gevonden.</p>
        <button onClick={() => navigate("/")}>Terug naar events</button>
      </div>
    );
  }

  const categoryNames =
    (event.categoryIds || [])
      .map((cid) => categories.find((c) => String(c.id) === String(cid)))
      .filter(Boolean)
      .map((c) => c.name) || [];

  return (
    <div style={{ padding: 4 }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 12,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#0f766e",
          fontWeight: 500,
        }}
      >
        ← Terug naar overzicht
      </button>

      <div
        style={{
          borderRadius: 12,
          padding: 16,
          background: "white",
          boxShadow:
            "0 1px 2px rgba(15,23,42,0.05), 0 2px 6px rgba(15,23,42,0.06)",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 22 }}>{event.title}</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowEdit(true)}
              disabled={deleting}
              style={{
                color: "white",
                background: "#0f766e",
                border: "none",
                padding: "6px 10px",
                borderRadius: 999,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Event bewerken
            </button>
            <button
              onClick={() => setShowDelete(true)}
              disabled={deleting}
              style={{
                color: "white",
                background: "#dc2626",
                border: "none",
                padding: "6px 10px",
                borderRadius: 999,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Event verwijderen
            </button>
          </div>
        </div>

        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            style={{
              width: "100%",
              maxHeight: 320,
              objectFit: "cover",
              borderRadius: 10,
              margin: "8px 0",
            }}
          />
        )}

        <p
          style={{
            margin: "4px 0",
            fontSize: 14,
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          📍 {event.location || "Locatie nog niet ingesteld"}
        </p>

        <p style={{ margin: "4px 0", fontSize: 14 }}>
          <b>Start:</b> {formatDateTime(event.startTime)}
        </p>
        <p style={{ margin: "4px 0", fontSize: 14 }}>
          <b>Einde:</b> {formatDateTime(event.endTime)}
        </p>

        <div style={{ margin: "8px 0" }}>
          <b>Categorieën:</b>{" "}
          {categoryNames.length > 0 ? (
            <span
              style={{
                display: "inline-flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {categoryNames.map((name) => (
                <span
                  key={name}
                  style={{
                    fontSize: 12,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "#e0f2fe",
                    color: "#0369a1",
                    fontWeight: 500,
                  }}
                >
                  {name}
                </span>
              ))}
            </span>
          ) : (
            <span>Geen categorieën</span>
          )}
        </div>

        <p style={{ marginTop: 8, fontSize: 14 }}>{event.description}</p>
      </div>

      {/* aanmelden voor dit event */}
      <div
        style={{
          borderRadius: 12,
          padding: 16,
          background: "white",
          boxShadow:
            "0 1px 2px rgba(15,23,42,0.05), 0 2px 6px rgba(15,23,42,0.06)",
          marginBottom: 16,
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 18 }}>
          Aanmelden voor dit event
        </h2>
        <p style={{ margin: "0 0 8px", fontSize: 14, color: "#64748b" }}>
          Vul je naam en e-mailadres in om je interesse door te geven.
        </p>
        <form onSubmit={handleRegistration}>
          <div style={{ marginBottom: 8 }}>
            <label>
              Naam*{" "}
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              E-mailadres*{" "}
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                }}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={regSubmitting}
            style={{
              background: "#0f766e",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: 999,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            {regSubmitting ? "Versturen…" : "Aanmelden"}
          </button>
        </form>
      </div>

      {/* modals */}
      <EditEventModal
        open={showEdit}
        event={event}
        categories={categories}
        onClose={() => setShowEdit(false)}
        onUpdated={(updated) => setEvent(updated)}
      />

      <DeleteConfirmModal
        open={showDelete}
        deleting={deleting}
        onCancel={() => setShowDelete(false)}
        onConfirm={actuallyDelete}
      />
    </div>
  );
}
