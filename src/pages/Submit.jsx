import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDeals } from "../hooks/useDeals";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CATEGORIES = ["Bar", "Dive Bar", "Brewery", "Wine Bar", "Restaurant", "Rooftop", "Food Truck"];

export default function Submit() {
  const { user } = useAuth();
  const { addDeal } = useDeals();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", neighborhood: "", category: "Bar", address: "",
    hours: "", startTime: "16:00", endTime: "19:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    specials: ["", "", ""], icon: "🍺",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
    addDeal({ ...form, specials: filledSpecials, hours: `${form.startTime}–${form.endTime}`, submittedBy: user.uid });
    setTimeout(() => { setLoading(false); setSuccess(true); }, 500);
  };

  if (success) {
    return (
      <div style={{ minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D0D0D", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "360px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍺</div>
          <h2 style={{ color: "#F5C842", fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>Deal submitted!</h2>
          <p style={{ color: "#888", fontSize: "14px", marginBottom: "28px" }}>It's now live on the map. Thanks for adding to Austin's happy hour scene.</p>
          <button onClick={() => navigate("/")} style={{ background: "#D4A017", color: "#000", fontWeight: 700, padding: "12px 28px", borderRadius: "8px", border: "none", fontSize: "14px", cursor: "pointer" }}>
            Back to map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "#0D0D0D", padding: "32px 24px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <h1 style={{ color: "#F5C842", fontSize: "24px", fontWeight: 800, marginBottom: "6px" }}>Submit a Deal</h1>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "32px" }}>Know a happy hour Austin needs to know about?</p>

        {error && (
          <div style={{ background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.3)", color: "#f87171", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", marginBottom: "20px" }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <Section label="Venue Info">
            <Row>
              <Field label="Bar / Venue Name"><input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Hole in the Wall" style={inp} required /></Field>
              <Field label="Neighborhood"><input value={form.neighborhood} onChange={e => update("neighborhood", e.target.value)} placeholder="West Campus" style={inp} required /></Field>
            </Row>
            <Row>
              <Field label="Category">
                <select value={form.category} onChange={e => update("category", e.target.value)} style={inp}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Address (optional)"><input value={form.address} onChange={e => update("address", e.target.value)} placeholder="2538 Guadalupe St" style={inp} /></Field>
            </Row>
          </Section>

          <Section label="Happy Hour Times">
            <Row>
              <Field label="Start Time"><input type="time" value={form.startTime} onChange={e => update("startTime", e.target.value)} style={inp} /></Field>
              <Field label="End Time"><input type="time" value={form.endTime} onChange={e => update("endTime", e.target.value)} style={inp} /></Field>
            </Row>
            <Field label="Days Active">
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                {DAYS.map(day => (
                  <button key={day} type="button" onClick={() => toggleDay(day)} style={{ padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "1px solid", background: form.days.includes(day) ? "#D4A017" : "transparent", color: form.days.includes(day) ? "#000" : "#888", borderColor: form.days.includes(day) ? "#D4A017" : "rgba(212,160,23,0.25)" }}>{day}</button>
                ))}
              </div>
            </Field>
          </Section>

          <Section label="The Specials">
            <p style={{ color: "#888", fontSize: "12px", marginBottom: "12px" }}>Add up to 3 specials. Be specific -- "$3 Lone Stars" beats "cheap beer".</p>
            {form.specials.map((s, i) => (
              <Field key={i} label={`Special ${i + 1}`}>
                <input value={s} onChange={e => updateSpecial(i, e.target.value)} placeholder={i === 0 ? "$3 Lone Stars" : i === 1 ? "$5 wells" : "Half-off appetizers"} style={inp} />
              </Field>
            ))}
          </Section>

          <Section label="Venue Vibe">
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["🍺","🍸","🎸","🤘","🦌","🍹","🥃","🍕","🎵","🌮"].map(icon => (
                <button key={icon} type="button" onClick={() => update("icon", icon)} style={{ width: "40px", height: "40px", borderRadius: "8px", fontSize: "20px", cursor: "pointer", border: "1px solid", background: form.icon === icon ? "rgba(212,160,23,0.15)" : "transparent", borderColor: form.icon === icon ? "#D4A017" : "rgba(212,160,23,0.2)" }}>{icon}</button>
              ))}
            </div>
          </Section>

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: "#D4A017", color: "#000", fontWeight: 700, fontSize: "15px", border: "none", borderRadius: "8px", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Submitting..." : "Submit Deal"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: "#D4A017", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>{label}</div>
      {children}
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>{children}</div>;
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>{label}</label>
      {children}
    </div>
  );
}

const inp = { width: "100%", padding: "10px 14px", background: "#111", border: "1px solid rgba(212,160,23,0.25)", borderRadius: "8px", color: "#F0EDE6", fontSize: "14px", outline: "none", boxSizing: "border-box" };