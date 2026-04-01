import { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "general", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError("Name, email, and message are required.");
      return;
    }

    try {
      const res = await fetch("https://formspree.io/f/xyzabcde", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Something went wrong. Email us directly at hello@happyhouraustin.com");
      }
    } catch {
      setError("Something went wrong. Email us directly at hello@happyhouraustin.com");
    }
  };

  const inp = {
    width: "100%", padding: "11px 14px", background: "#111",
    border: "1px solid rgba(212,160,23,0.25)", borderRadius: "8px",
    color: "#F0EDE6", fontSize: "14px", outline: "none",
  };

  if (sent) {
    return (
      <div style={{ background: "#0D0D0D", minHeight: "calc(100svh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "360px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍺</div>
          <h2 style={{ color: "#F5C842", fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>Message sent!</h2>
          <p style={{ color: "#888", fontSize: "14px", marginBottom: "28px" }}>We'll get back to you soon. In the meantime, go find a happy hour.</p>
          <Link to="/" style={{ display: "inline-block", padding: "12px 28px", background: "#D4A017", color: "#000", borderRadius: "8px", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
            Back to map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0D0D0D", color: "#F0EDE6", minHeight: "calc(100svh - 60px)", padding: "48px 24px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>

        <div style={{ marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#D4A017", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Get in touch</div>
          <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#F5C842", margin: "0 0 12px" }}>Contact</h1>
          <p style={{ fontSize: "14px", color: "#777", lineHeight: 1.7, margin: 0 }}>
            Bar owner wanting to add your happy hour? Press inquiry? Just want to say hi? We're all ears.
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.3)", color: "#f87171", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", marginBottom: "20px" }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Name</label>
              <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Justin Adame" style={inp} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Email</label>
              <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@email.com" style={inp} required />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Subject</label>
            <select value={form.subject} onChange={e => update("subject", e.target.value)} style={inp}>
              <option value="general">General inquiry</option>
              <option value="bar">Add my bar / happy hour</option>
              <option value="correction">Correct a listing</option>
              <option value="press">Press inquiry</option>
              <option value="partnership">Partnership</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Message</label>
            <textarea value={form.message} onChange={e => update("message", e.target.value)} placeholder="Tell us what's on your mind..." rows={5} style={{ ...inp, resize: "vertical" }} required />
          </div>

          <button type="submit" style={{ padding: "14px", background: "#D4A017", color: "#000", fontWeight: 700, fontSize: "15px", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            Send Message
          </button>
        </form>

        <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(212,160,23,0.1)", display: "flex", gap: "16px" }}>
          <Link to="/about" style={{ fontSize: "13px", color: "#D4A017", textDecoration: "none" }}>About</Link>
          <Link to="/" style={{ fontSize: "13px", color: "#555", textDecoration: "none" }}>Back to map</Link>
        </div>
      </div>
    </div>
  );
}