import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Contact() {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "general", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => navigate("/"), 300);
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError("Name, email, and message are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://formspree.io/f/mlgolrqq", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Something went wrong. Try emailing jradame@gmail.com directly.");
      }
    } catch {
      setError("Something went wrong. Try emailing jradame@gmail.com directly.");
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: "100%", padding: "10px 13px", background: "#111",
    border: "1px solid rgba(201,104,58,0.2)", borderRadius: "8px",
    color: "#F0E9D6", fontSize: "13px", outline: "none",
  };

  return (
    <div
      onClick={close}
      style={{
        background: "rgba(0,0,0,0.7)",
        minHeight: "calc(100svh - 60px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#1A201A",
          border: "1px solid rgba(201,104,58,0.2)",
          borderRadius: "16px",
          padding: "32px 28px",
          maxWidth: "540px",
          width: "100%",
          position: "relative",
          transform: visible ? "translateY(0)" : "translateY(24px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.35s ease, opacity 0.35s ease",
        }}
      >
        {/* X close button */}
        <button
          onClick={close}
          style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,104,58,0.2)", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "#888", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >✕</button>

        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "44px", marginBottom: "14px" }}>🍺</div>
            <h2 style={{ color: "#C9683A", fontSize: "20px", fontWeight: 800, marginBottom: "8px" }}>Message sent!</h2>
            <p style={{ color: "#777", fontSize: "13px", marginBottom: "24px", lineHeight: 1.7 }}>We'll get back to you soon. In the meantime, go find a happy hour.</p>
            <button onClick={close} style={{ display: "inline-block", padding: "10px 24px", background: "#C9683A", color: "#000", borderRadius: "8px", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}>
              Back to map
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "20px", paddingRight: "40px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#C9683A", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Get in touch</div>
              <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#C9683A", margin: "0 0 8px" }}>Contact</h1>
              <p style={{ fontSize: "13px", color: "#777", lineHeight: 1.7, margin: 0 }}>
                Bar owner? Press? Just want to say hi? We're all ears.
              </p>
            </div>

            <div style={{ height: "1px", background: "rgba(201,104,58,0.1)", marginBottom: "20px" }} />

            {error && (
              <div style={{ background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.3)", color: "#f87171", borderRadius: "8px", padding: "10px 13px", fontSize: "12px", marginBottom: "16px" }}>{error}</div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10px", color: "#666", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>Name</label>
                  <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Justin Adame" style={inp} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", color: "#666", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>Email</label>
                  <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@email.com" style={inp} required />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "10px", color: "#666", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>Subject</label>
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
                <label style={{ display: "block", fontSize: "10px", color: "#666", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>Message</label>
                <textarea value={form.message} onChange={e => update("message", e.target.value)} placeholder="Tell us what's on your mind..." rows={4} style={{ ...inp, resize: "vertical" }} required />
              </div>

              <button type="submit" disabled={loading} style={{ padding: "12px", background: "#C9683A", color: "#000", fontWeight: 700, fontSize: "14px", border: "none", borderRadius: "8px", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            <div style={{ marginTop: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
              <Link to="/about" style={{ fontSize: "12px", color: "#C9683A", textDecoration: "none" }}>About</Link>
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