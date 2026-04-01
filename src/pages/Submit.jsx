import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDeals } from "../hooks/useDeals";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CATEGORIES = ["Bar", "Dive Bar", "Brewery", "Wine Bar", "Restaurant", "Rooftop", "Food Truck"];

export default function Submit() {
  const { user } = useAuth();
  const { addDeal } = useDeals();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const [form, setForm] = useState({
    name: "", neighborhood: "", category: "Bar", address: "",
    startTime: "16:00", endTime: "19:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    specials: ["", "", ""], icon: "🍺",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => navigate("/"), 300);
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }));
  };

  const updateSpecial = (index, value) => {
    const updated = [...form.specials];
    updated[index] = value;
    setForm(prev => ({ ...prev, specials: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.neighborhood) { setError("Venue name and neighborhood are required."); return; }
    const filledSpecials = form.specials.filter(s => s.trim() !== "");
    if (filledSpecials.length === 0) { setError("Add at least one special."); return; }
    setLoading(true);
    addDeal({ ...form, specials: filledSpecials, hours: `${form.startTime}-${form.endTime}`, submittedBy: user.uid });
    setTimeout(() => { setLoading(false); setSuccess(true); }, 500);
  };

  const inp = {
    width: "100%", padding: "9px 12px", background: "#0D0D0D",
    border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px",
    color: "#F0EDE6", fontSize: "13px", outline: "none",
  };

  return (
    <div
      onClick={close}
      style={{ background: "rgba(0,0,0,0.7)", minHeight: "calc(100svh - 60px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#161616",
          border: "1px solid rgba(212,160,23,0.2)",
          borderRadius: "16px",
          padding: "28px 24px",
          maxWidth: "560px",
          width: "100%",
          position: "relative",
          marginBottom: "24px",
          transform: visible ? "translateY(0)" : "translateY(24px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.35s ease, opacity 0.35s ease",
        }}
      >
        {/* X */}
        <button onClick={close} style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "#888", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "44px", marginBottom: "14px" }}>🍺</div>
            <h2 style={{ color: "#F5C842", fontSize: "20px", fontWeight: 800, marginBottom: "8px" }}>Deal submitted!</h2>
            <p style={{ color: "#777", fontSize: "13px", marginBottom: "24px", lineHeight: 1.7 }}>It's now live on the map. Thanks for adding to Austin's happy hour scene.</p>
            <button onClick={close} style={{ padding: "10px 24px", background: "#D4A017", color: "#000", borderRadius: "8px", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}>
              Back to map
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "20px", paddingRight: "40px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#D4A017", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Submit a Deal</div>
              <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#F5C842", margin: "0 0 6px" }}>Know a happy hour Austin needs to know about?</h1>
            </div>

            <div style={{ height: "1px", background: "rgba(212,160,23,0.1)", marginBottom: "20px" }} />

            {error && (
              <div style={{ background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.3)", color: "#f87171", borderRadius: "8px", padding: "10px 13px", fontSize: "12px", marginBottom: "16px" }}>{error}</div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Venue Info */}
              <Section label="Venue Info">
                <Row>
                  <Field label="Bar / Venue Name">
                    <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Hole in the Wall" style={inp} required />
                  </Field>
                  <Field label="Neighborhood">
                    <input value={form.neighborhood} onChange={e => update("neighborhood", e.target.value)} placeholder="West Campus" style={inp} required />
                  </Field>
                </Row>
                <Row>
                  <Field label="Category">
                    <select value={form.category} onChange={e => update("category", e.target.value)} style={inp}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Address (optional)">
                    <input value={form.address} onChange={e => update("address", e.target.value)} placeholder="2538 Guadalupe St" style={inp} />
                  </Field>
                </Row>
              </Section>

              {/* Times */}
              <Section label="Happy Hour Times">
                <Row>
                  <Field label="Start Time">
                    <input type="time" value={form.startTime} onChange={e => update("startTime", e.target.value)} style={inp} />
                  </Field>
                  <Field label="End Time">
                    <input type="time" value={form.endTime} onChange={e => update("endTime", e.target.value)} style={inp} />
                  </Field>
                </Row>
                <Field label="Days Active">
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "4px" }}>
                    {DAYS.map(day => (
                      <button key={day} type="button" onClick={() => toggleDay(day)} style={{ padding: "5px 11px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, cursor: "pointer", border: "1px solid", background: form.days.includes(day) ? "#D4A017" : "transparent", color: form.days.includes(day) ? "#000" : "#888", borderColor: form.days.includes(day) ? "#D4A017" : "rgba(212,160,23,0.25)" }}>{day}</button>
                    ))}
                  </div>
                </Field>
              </Section>

              {/* Specials */}
              <Section label="The Specials">
                <p style={{ color: "#666", fontSize: "12px", marginBottom: "10px", marginTop: 0 }}>Add up to 3 specials. Be specific -- "$3 Lone Stars" beats "cheap beer".</p>
                {form.specials.map((s, i) => (
                  <Field key={i} label={`Special ${i + 1}`}>
                    <input value={s} onChange={e => updateSpecial(i, e.target.value)} placeholder={i === 0 ? "$3 Lone Stars" : i === 1 ? "$5 wells" : "Half-off appetizers"} style={{ ...inp, marginBottom: "8px" }} />
                  </Field>
                ))}
              </Section>

              {/* Vibe */}
              <Section label="Venue Vibe">
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["🍺","🍸","🎸","🤘","🦌","🍹","🥃","🍕","🎵","🌮"].map(icon => (
                    <button key={icon} type="button" onClick={() => update("icon", icon)} style={{ width: "38px", height: "38px", borderRadius: "8px", fontSize: "18px", cursor: "pointer", border: "1px solid", background: form.icon === icon ? "rgba(212,160,23,0.15)" : "transparent", borderColor: form.icon === icon ? "#D4A017" : "rgba(212,160,23,0.2)" }}>{icon}</button>
                  ))}
                </div>
              </Section>

              <button type="submit" disabled={loading} style={{ padding: "13px", background: "#D4A017", color: "#000", fontWeight: 700, fontSize: "14px", border: "none", borderRadius: "8px", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Submitting..." : "Submit Deal"}
              </button>
            </form>

            <div style={{ marginTop: "14px", display: "flex" }}>
              <button onClick={close} style={{ marginLeft: "auto", fontSize: "12px", color: "#444", background: "transparent", border: "none", cursor: "pointer" }}>
                Back to map →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: "10px", fontWeight: 700, color: "#D4A017", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>{label}</div>
      {children}
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>{children}</div>;
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label style={{ display: "block", fontSize: "10px", color: "#666", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>{label}</label>
      {children}
    </div>
  );
}