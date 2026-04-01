import { Link } from "react-router-dom";

export default function About() {
  return (
    <div style={{ background: "#0D0D0D", color: "#F0EDE6", minHeight: "calc(100svh - 60px)", padding: "48px 24px", maxWidth: "680px", margin: "0 auto" }}>

      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#D4A017", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>About</div>
        <h1 style={{ fontSize: "36px", fontWeight: 900, color: "#F5C842", margin: "0 0 16px", lineHeight: 1.1 }}>HappyHour Austin</h1>
        <p style={{ fontSize: "16px", color: "#888", lineHeight: 1.7, margin: 0 }}>
          Austin's most up-to-date happy hour finder. Built by someone who has actually worked these bars.
        </p>
      </div>

      <div style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F0EDE6", marginBottom: "12px" }}>The Story</h2>
        <p style={{ fontSize: "14px", color: "#777", lineHeight: 1.8, marginBottom: "14px" }}>
          I'm Justin Adame -- Happy Hour -- and I've been working Austin bars since the early 2000s. Emo's, The Ritz, Liberty Bar, Jackalope, Dizzy Rooster, multiple SXSW runs. I know this scene from the inside.
        </p>
        <p style={{ fontSize: "14px", color: "#777", lineHeight: 1.8, marginBottom: "14px" }}>
          Every existing happy hour app has the same problem -- stale data, no Austin identity, and built by people who've never actually worked a bar. HappyHour Austin is the version I would want to use: real bars, verified specials, built by someone with 20+ years of Austin bartending behind them.
        </p>
        <p style={{ fontSize: "14px", color: "#777", lineHeight: 1.8 }}>
          The app is live, actively maintained, and growing. App Store launch is coming soon.
        </p>
      </div>

      <div style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F0EDE6", marginBottom: "16px" }}>By the numbers</h2>
        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
          {[
            { num: "25+", label: "Verified Austin bars" },
            { num: "20+", label: "Years in Austin bars" },
            { num: "11", label: "Neighborhoods covered" },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#D4A017" }}>{item.num}</div>
              <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F0EDE6", marginBottom: "12px" }}>Know a deal we're missing?</h2>
        <p style={{ fontSize: "14px", color: "#777", lineHeight: 1.8, marginBottom: "16px" }}>
          Every bar owner, bartender, and regular who submits a deal makes this better for everyone. Help Austin find the best happy hours.
        </p>
        <Link to="/submit" style={{ display: "inline-block", padding: "12px 24px", background: "#D4A017", color: "#000", borderRadius: "8px", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
          + Submit a Deal
        </Link>
      </div>

      <div style={{ borderTop: "1px solid rgba(212,160,23,0.1)", paddingTop: "24px", display: "flex", gap: "16px" }}>
        <Link to="/contact" style={{ fontSize: "13px", color: "#D4A017", textDecoration: "none" }}>Contact</Link>
        <Link to="/" style={{ fontSize: "13px", color: "#555", textDecoration: "none" }}>Back to map</Link>
      </div>
    </div>
  );
}