import { theme } from "../theme";
import { BAR_PHOTOS, DEFAULT_PHOTO } from "../data/mapConfig";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BarDetail({ deal, onClose }) {
  if (!deal) return null;

  const isLive = deal.status === "active";
  const photo = BAR_PHOTOS[deal.icon] || DEFAULT_PHOTO;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 20, background: theme.bg, animation: "fadeIn 0.2s ease", display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ position: "relative", height: "220px", flexShrink: 0 }}>
        <img src={photo} alt={deal.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.src = DEFAULT_PHOTO; }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(0,0,0,0.2), ${theme.bg} 95%)` }} />
        <button onClick={onClose} style={{ position: "absolute", top: "14px", left: "14px", background: "rgba(0,0,0,0.7)", border: `1px solid ${theme.borderStrong}`, color: theme.text, borderRadius: "8px", padding: "7px 14px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>← Back to map</button>
        <div style={{ position: "absolute", top: "14px", right: "14px", background: isLive ? "rgba(143,185,150,0.9)" : "rgba(201,104,58,0.9)", color: isLive ? theme.liveDark : theme.primaryDark, borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: 700 }}>{isLive ? "LIVE NOW" : "STARTING SOON"}</div>
        <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
          <div style={{ fontSize: "22px", fontWeight: 900, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>{deal.icon} {deal.name}</div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>{deal.neighborhood} · {deal.hours}</div>
        </div>
      </div>
      <div style={{ padding: "20px 16px", flex: 1 }}>
        {deal.address && <div style={{ fontSize: "12px", color: theme.textDim, marginBottom: "16px" }}>📍 {deal.address}, Austin TX</div>}
        <Section label="Specials">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {deal.specials?.map((s, i) => (
              <span key={i} style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "20px", background: theme.primaryAlpha10, border: `1px solid ${theme.borderMid}`, color: theme.primary }}>{s}</span>
            ))}
          </div>
        </Section>
        {deal.days && (
          <Section label="Days">
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {ALL_DAYS.map(day => {
                const active = deal.days.includes(day);
                return <span key={day} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "20px", background: active ? theme.liveAlpha15 : "transparent", border: `1px solid ${active ? theme.liveAlpha35 : theme.textGhost}`, color: active ? theme.live : theme.textFaint }}>{day}</span>;
              })}
            </div>
          </Section>
        )}
        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(deal.address + ", Austin, TX")}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: "13px", background: theme.primary, color: theme.primaryDark, borderRadius: "10px", fontSize: "14px", fontWeight: 700, textDecoration: "none", textAlign: "center" }}>Directions →</a>
          <a href={`https://www.google.com/search?q=${encodeURIComponent(deal.name + " Austin TX")}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: "13px", background: "transparent", color: theme.textMuted, borderRadius: "10px", fontSize: "14px", fontWeight: 600, textDecoration: "none", textAlign: "center", border: `1px solid ${theme.borderMid}` }}>More Info</a>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ fontSize: "10px", fontWeight: 700, color: theme.primary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>{label}</div>
      {children}
    </div>
  );
}
