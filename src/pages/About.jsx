import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function About() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => navigate("/"), 300);
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
          maxWidth: "580px",
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

        {/* Header */}
        <div style={{ marginBottom: "24px", paddingRight: "40px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#C9683A", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>About</div>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#C9683A", margin: "0 0 10px", lineHeight: 1.1 }}>HappyHour Austin</h1>
          <p style={{ fontSize: "14px", color: "#777", lineHeight: 1.7, margin: 0 }}>
            Austin's most up-to-date happy hour finder. Built by someone who has actually worked these bars.
          </p>
        </div>

        <div style={{ height: "1px", background: "rgba(201,104,58,0.1)", marginBottom: "24px" }} />

        {/* Story */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#F0E9D6", marginBottom: "10px" }}>The Story</h2>
          <p style={{ fontSize: "13px", color: "#777", lineHeight: 1.8, marginBottom: "10px" }}>
            I'm Justin Adame -- Happy Hour -- and I've been working Austin bars since the early 2000s. Emo's, The Ritz, Liberty Bar, Jackalope, Dizzy Rooster, multiple SXSW runs. I know this scene from the inside.
          </p>
          <p style={{ fontSize: "13px", color: "#777", lineHeight: 1.8 }}>
            Every existing happy hour app has the same problem -- stale data, no Austin identity, and built by people who've never worked a bar. HappyHour Austin is the version I would want to use.
          </p>
        </div>

        <div style={{ height: "1px", background: "rgba(201,104,58,0.1)", marginBottom: "24px" }} />

        {/* Stats */}
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "24px" }}>
          {[
            { num: "25+", label: "Verified bars" },
            { num: "20+", label: "Years in Austin" },
            { num: "11", label: "Neighborhoods" },
          ].map(item => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "26px", fontWeight: 900, color: "#C9683A" }}>{item.num}</div>
              <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{ height: "1px", background: "rgba(201,104,58,0.1)", marginBottom: "24px" }} />

        {/* CTA */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <Link to="/submit" style={{ padding: "10px 20px", background: "#C9683A", color: "#000", borderRadius: "8px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
            + Submit a Deal
          </Link>
          <Link to="/contact" style={{ padding: "10px 20px", background: "transparent", color: "#888", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textDecoration: "none", border: "1px solid rgba(201,104,58,0.2)" }}>
            Contact
          </Link>
          <button onClick={close} style={{ marginLeft: "auto", fontSize: "12px", color: "#444", background: "transparent", border: "none", cursor: "pointer" }}>
            Back to map →
          </button>
        </div>
      </div>
    </div>
  );
}