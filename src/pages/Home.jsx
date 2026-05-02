import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useDeals } from "../hooks/useDeals";
import { SEED_DEALS } from "../data/seedDeals";

const AUSTIN_CENTER = { lat: 30.2672, lng: -97.7431 };

const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#0d0d0d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#888" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0d0d0d" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e1e1e" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#2a2a2a" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#333" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#080808" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#C9683A" }] },
];

const mc = { active: "#8FB996", upcoming: "#C9683A", ended: "#888" };

const BAR_PHOTOS = {
  "🎸": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80",
  "🥃": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
  "🎵": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  "🍹": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80",
  "🍺": "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=80",
  "🍻": "https://images.unsplash.com/photo-1559526324-c1f275fbfa32?w=800&q=80",
  "🌭": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  "🍔": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
  "🍸": "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=800&q=80",
  "🌮": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
  "🎷": "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80",
  "🍖": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  "🦪": "https://images.unsplash.com/photo-1565680018434-b9c0d27b2e5a?w=800&q=80",
  "💽": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  "🍣": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
  "🍶": "https://images.unsplash.com/photo-1614957229057-0fe72b00731f?w=800&q=80",
  "🥨": "https://images.unsplash.com/photo-1604908554007-5e57e0e4a47d?w=800&q=80",
  "🌶️": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
  "🥩": "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
  "🍛": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
  "🍑": "https://images.unsplash.com/photo-1559548331-f9cb98001426?w=800&q=80",
  "🦔": "https://images.unsplash.com/photo-1546622891-02c72c1537b6?w=800&q=80",
  "🍀": "https://images.unsplash.com/photo-1577931488167-6dba2ca2eb31?w=800&q=80",
  "🐎": "https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=800&q=80",
  "🗽": "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80",
  "🥈": "https://images.unsplash.com/photo-1546622891-02c72c1537b6?w=800&q=80",
  "🤘": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80",
  "🎰": "https://images.unsplash.com/photo-1485872299712-90e54e8d2a91?w=800&q=80",
  "🐇": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  "🤠": "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80",
  "🌙": "https://images.unsplash.com/photo-1485872299712-90e54e8d2a91?w=800&q=80",
};
const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1546622891-02c72c1537b6?w=800&q=80";

const NEIGHBORHOODS = ["6th Street", "Rainey Street", "Red River", "East Austin", "East 6th", "West Campus", "Downtown", "South Congress", "South Lamar", "South Shore", "South Austin", "Clarksville", "West 6th"];

const neighborhoodCoords = {
  "6th Street": { lat: 30.2685, lng: -97.7398 },
  "Rainey Street": { lat: 30.2585, lng: -97.7388 },
  "Red River": { lat: 30.2677, lng: -97.7362 },
  "East Austin": { lat: 30.2641, lng: -97.7198 },
  "East 6th": { lat: 30.2625, lng: -97.7195 },
  "West Campus": { lat: 30.2881, lng: -97.7401 },
  "Downtown": { lat: 30.2658, lng: -97.7452 },
  "South Congress": { lat: 30.2499, lng: -97.7502 },
  "South Lamar": { lat: 30.2545, lng: -97.7848 },
  "South Shore": { lat: 30.2295, lng: -97.7244 },
  "South Austin": { lat: 30.1761, lng: -97.8423 },
  "Clarksville": { lat: 30.2771, lng: -97.7558 },
  "West 6th": { lat: 30.2745, lng: -97.7515 },
};

const TYPE_FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Live Now" },
  { id: "beer", label: "Beer" },
  { id: "cocktails", label: "Cocktails" },
  { id: "food", label: "Food" },
  { id: "dive", label: "Dive Bars" },
  { id: "rooftop", label: "Rooftop" },
];

const DAY_FILTERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [activeDay, setActiveDay] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [map, setMap] = useState(null);
  const [mobileView, setMobileView] = useState("map");

  const { deals: userDeals } = useDeals();
  const deals = [...SEED_DEALS, ...userDeals];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const onMapLoad = useCallback((m) => setMap(m), []);

  const filtered = deals.filter((d) => {
    const mf =
      filter === "all" ? true :
        filter === "active" ? d.status === "active" :
          filter === "beer" ? d.specials?.some(s => ["beer", "draft", "shiner", "pbr", "lager", "pint"].some(k => s.toLowerCase().includes(k))) :
            filter === "cocktails" ? d.specials?.some(s => ["cocktail", "margarita", "well", "frozen", "spritz"].some(k => s.toLowerCase().includes(k))) :
              filter === "food" ? d.specials?.some(s => ["app", "nacho", "taco", "pizza", "food", "burger", "oyster", "snack"].some(k => s.toLowerCase().includes(k))) :
                true;
    const ms = search === "" ? true :
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      d.specials?.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const md = activeDay === "all" ? true : d.days ? d.days.includes(activeDay) : true;
    return mf && ms && md;
  });

  const activeCount = filtered.filter(d => d.status === "active").length;

  const pick = (deal) => {
    setSelected(deal);
    if (map && deal.lat) {
      map.panTo({ lat: deal.lat, lng: deal.lng });
      map.setZoom(15);
    }
    if (mobileView === "list") setMobileView("map");
  };

  const Pill = ({ active, label, onClick, color = "#C9683A" }) => (
    <button onClick={onClick} style={{
      padding: "5px 11px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
      whiteSpace: "nowrap", cursor: "pointer", border: "1px solid", flexShrink: 0,
      background: active ? color : "transparent",
      color: active ? "#000" : "#777",
      borderColor: active ? color : "rgba(201,104,58,0.2)",
    }}>{label}</button>
  );

  // Full detail view - fades in over map area
  const DetailView = () => (
    <div style={{
      position: "absolute", inset: 0, zIndex: 20,
      background: "#0F1410",
      animation: "fadeIn 0.2s ease",
      display: "flex", flexDirection: "column",
      overflowY: "auto",
    }}>
      {/* Hero photo */}
      <div style={{ position: "relative", height: "220px", flexShrink: 0 }}>
        <img
          src={BAR_PHOTOS[selected.icon] || DEFAULT_PHOTO}
          alt={selected.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { e.target.src = DEFAULT_PHOTO; }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(13,13,13,0.95))" }} />

        {/* Back button */}
        <button onClick={() => setSelected(null)} style={{ position: "absolute", top: "14px", left: "14px", background: "rgba(0,0,0,0.7)", border: "1px solid rgba(201,104,58,0.3)", color: "#F0E9D6", borderRadius: "8px", padding: "7px 14px", cursor: "pointer", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
          ← Back to map
        </button>

        {/* Status badge */}
        <div style={{ position: "absolute", top: "14px", right: "14px", background: selected.status === "active" ? "rgba(143,185,150,0.9)" : "rgba(201,104,58,0.9)", color: "#000", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: 700 }}>
          {selected.status === "active" ? "LIVE NOW" : "STARTING SOON"}
        </div>

        {/* Name over photo */}
        <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
          <div style={{ fontSize: "22px", fontWeight: 900, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
            {selected.icon} {selected.name}
          </div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>
            {selected.neighborhood} · {selected.hours}
          </div>
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: "20px 16px", flex: 1 }}>
        {selected.address && (
          <div style={{ fontSize: "12px", color: "#555", marginBottom: "16px" }}>
            📍 {selected.address}, Austin TX
          </div>
        )}

        {/* Specials */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#C9683A", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Specials</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {selected.specials?.map((s, i) => (
              <span key={i} style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "20px", background: "rgba(201,104,58,0.08)", border: "1px solid rgba(201,104,58,0.2)", color: "#C9683A" }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Days */}
        {selected.days && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#C9683A", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Days</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                <span key={day} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "20px", background: selected.days.includes(day) ? "rgba(143,185,150,0.15)" : "transparent", border: `1px solid ${selected.days.includes(day) ? "rgba(143,185,150,0.4)" : "rgba(255,255,255,0.08)"}`, color: selected.days.includes(day) ? "#8FB996" : "#444" }}>{day}</span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selected.address + ", Austin, TX")}`}
            target="_blank" rel="noreferrer"
            style={{ flex: 1, padding: "13px", background: "#C9683A", color: "#000", borderRadius: "10px", fontSize: "14px", fontWeight: 700, textDecoration: "none", textAlign: "center" }}
          >
            Directions →
          </a>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(selected.name + " Austin TX")}`}
            target="_blank" rel="noreferrer"
            style={{ flex: 1, padding: "13px", background: "transparent", color: "#888", borderRadius: "10px", fontSize: "14px", fontWeight: 600, textDecoration: "none", textAlign: "center", border: "1px solid rgba(201,104,58,0.2)" }}
          >
            More Info
          </a>
        </div>
      </div>
    </div>
  );

  const SearchHeader = () => (
    <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(201,104,58,0.1)", background: "#0F1410", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1A201A", border: "1px solid rgba(201,104,58,0.2)", borderRadius: "8px", padding: "7px 12px", marginBottom: "8px" }}>
        <span style={{ color: "#444" }}>⌕</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bars or neighborhoods..." style={{ background: "transparent", border: "none", color: "#F0E9D6", fontSize: "13px", flex: 1, outline: "none" }} />
        {search && <span onClick={() => setSearch("")} style={{ color: "#444", cursor: "pointer" }}>✕</span>}
      </div>
      <div className="pill-row" style={{ marginBottom: "6px" }}>
        {TYPE_FILTERS.map(f => <Pill key={f.id} active={filter === f.id} label={f.label} onClick={() => setFilter(f.id)} />)}
      </div>
      <div className="pill-row">
        <Pill active={activeDay === "all"} label="Every Day" onClick={() => setActiveDay("all")} color="#8FB996" />
        {DAY_FILTERS.map(d => <Pill key={d} active={activeDay === d} label={d} onClick={() => setActiveDay(d)} color="#8FB996" />)}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        * { box-sizing: border-box; }

        .pill-row { display:flex; gap:5px; overflow-x:auto; flex-wrap:nowrap; scrollbar-width:none; }
        .pill-row::-webkit-scrollbar { display:none; }

        .bar-list::-webkit-scrollbar { width:6px; }
        .bar-list::-webkit-scrollbar-track { background:rgba(255,255,255,0.03); }
        .bar-list::-webkit-scrollbar-thumb { background:rgba(201,104,58,0.4); border-radius:4px; }
        .bar-list { scrollbar-width:thin; scrollbar-color:rgba(201,104,58,0.4) transparent; }

        .hh-right::-webkit-scrollbar { width:6px; }
        .hh-right::-webkit-scrollbar-track { background:rgba(255,255,255,0.03); }
        .hh-right::-webkit-scrollbar-thumb { background:rgba(201,104,58,0.3); border-radius:4px; }
        .hh-right { scrollbar-width:thin; scrollbar-color:rgba(201,104,58,0.3) transparent; }

        .hh-root { display:flex; flex-direction:column; height:calc(100svh - 60px); overflow:hidden; background:#0F1410; }
        .hh-body { display:flex; flex:1; overflow:hidden; min-height:0; }
        .hh-left { width:400px; flex-shrink:0; display:flex; flex-direction:column; border-right:1px solid rgba(201,104,58,0.12); overflow:hidden; }
        .hh-right { flex:1; min-width:0; display:flex; flex-direction:column; overflow-y:scroll; overflow-x:hidden; }
        .hh-footer { background:#1A201A; border-top:1px solid rgba(201,104,58,0.2); height:56px; display:grid; grid-template-columns:1fr 1fr 1fr; align-items:center; padding:0 24px; flex-shrink:0; }

        .mobile-only { display:none; }
        .desktop-only { display:flex; }

        @media (max-width: 768px) {
          .mobile-only { display:flex; }
          .desktop-only { display:none !important; }
          .hh-footer { display:none; }
        }
        @media (max-width: 1024px) and (min-width: 769px) { .hh-left { width:320px; } }
      `}</style>

      <div className="hh-root">
        <div className="hh-body">

          {/* DESKTOP LEFT */}
          <div className="hh-left desktop-only" style={{ flexDirection: "column" }}>
            <div style={{ padding: "14px 12px 12px", borderBottom: "1px solid rgba(201,104,58,0.1)", flexShrink: 0, background: "#0F1410" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(143,185,150,0.12)", border: "1px solid rgba(143,185,150,0.25)", color: "#8FB996", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: 700 }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#8FB996", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                  {activeCount} live now
                </div>
                <span style={{ fontSize: "11px", color: "#444" }}>{filtered.length} spots</span>
              </div>
              <div className="pill-row" style={{ marginBottom: "7px" }}>
                {TYPE_FILTERS.map(f => <Pill key={f.id} active={filter === f.id} label={f.label} onClick={() => setFilter(f.id)} />)}
              </div>
              <div className="pill-row">
                <Pill active={activeDay === "all"} label="Every Day" onClick={() => setActiveDay("all")} color="#8FB996" />
                {DAY_FILTERS.map(d => <Pill key={d} active={activeDay === d} label={d} onClick={() => setActiveDay(d)} color="#8FB996" />)}
              </div>
            </div>
            <div className="bar-list" style={{ flex: 1, overflowY: "scroll", padding: "8px 10px" }}>
              {filtered.length === 0 ? (
                <div style={{ color: "#555", fontSize: "13px", padding: "16px 8px" }}>No deals match.</div>
              ) : filtered.map((deal) => (
                <div key={deal.id} onClick={() => pick(deal)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 12px", borderRadius: "10px", cursor: "pointer", marginBottom: "4px", background: selected?.id === deal.id ? "rgba(201,104,58,0.08)" : "transparent", border: `1px solid ${selected?.id === deal.id ? "rgba(201,104,58,0.4)" : "rgba(201,104,58,0.07)"}`, transition: "all 0.15s" }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{deal.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#F0E9D6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{deal.name}</div>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: mc[deal.status], flexShrink: 0 }}>{deal.status === "active" ? "LIVE" : deal.status === "upcoming" ? "SOON" : "ENDED"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
                      <span style={{ fontSize: "11px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{deal.neighborhood}</span>
                      <span style={{ fontSize: "11px", color: "#C9683A", flexShrink: 0, fontWeight: 600 }}>{deal.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "11px 12px", borderTop: "1px solid rgba(201,104,58,0.1)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0F1410" }}>
              <span style={{ fontSize: "12px", color: "#555" }}>Know a deal we're missing?</span>
              <a href="/submit" style={{ padding: "7px 14px", background: "#C9683A", color: "#000", borderRadius: "8px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>+ Submit</a>
            </div>
          </div>

          {/* DESKTOP RIGHT - map OR detail view */}
          <div className="hh-right desktop-only" style={{ flexDirection: "column", background: "#0F1410" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(201,104,58,0.1)", background: "#0F1410", position: "sticky", top: 0, zIndex: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1A201A", border: "1px solid rgba(201,104,58,0.2)", borderRadius: "8px", padding: "8px 12px", marginBottom: "9px" }}>
                <span style={{ color: "#444", fontSize: "14px" }}>⌕</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search neighborhoods or bar names..." style={{ background: "transparent", border: "none", color: "#F0E9D6", fontSize: "13px", flex: 1, outline: "none" }} />
                {search && <span onClick={() => setSearch("")} style={{ color: "#444", cursor: "pointer" }}>✕</span>}
              </div>
              <div className="pill-row">
                {NEIGHBORHOODS.map(n => (
                  <span key={n} onClick={() => { setSearch(n); const c = neighborhoodCoords[n]; if (c && map) { map.panTo(c); map.setZoom(14); } }}
                    style={{ padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, cursor: "pointer", flexShrink: 0, background: search === n ? "rgba(201,104,58,0.2)" : "rgba(201,104,58,0.05)", border: `1px solid ${search === n ? "#C9683A" : "rgba(201,104,58,0.15)"}`, color: search === n ? "#C9683A" : "#666" }}>
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Map area with detail view overlay */}
            <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
              {isLoaded ? (
                <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={selected ? { lat: selected.lat, lng: selected.lng } : AUSTIN_CENTER} zoom={selected ? 15 : 13} options={{ styles: mapStyles, disableDefaultUI: true, zoomControl: true }} onLoad={onMapLoad}>
                  {filtered.map((deal) => deal.lat && (
                    <Marker key={deal.id} position={{ lat: deal.lat, lng: deal.lng }} onClick={() => pick(deal)}
                      icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: selected?.id === deal.id ? 14 : deal.status === "active" ? 10 : 7, fillColor: mc[deal.status] || "#888", fillOpacity: 1, strokeColor: selected?.id === deal.id ? "#fff" : "#000", strokeWeight: selected?.id === deal.id ? 3 : 2 }}
                    />
                  ))}
                </GoogleMap>
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#0f1923", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
                  <div style={{ fontSize: "32px" }}>🗺️</div>
                  <div style={{ color: "#C9683A", fontSize: "12px" }}>Map loading...</div>
                </div>
              )}
              {!selected && (
                <div style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(13,13,13,0.92)", border: "1px solid rgba(201,104,58,0.2)", borderRadius: "8px", padding: "8px 12px" }}>
                  <div style={{ color: "#555", marginBottom: "4px", fontWeight: 700, fontSize: "9px", letterSpacing: "0.8px" }}>LEGEND</div>
                  {[{ color: "#8FB996", label: "Live" }, { color: "#C9683A", label: "Soon" }, { color: "#888", label: "Ended" }].map(item => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.color }} />
                      <span style={{ color: "#aaa", fontSize: "10px" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {selected && <DetailView />}
            </div>
          </div>

          {/* MOBILE */}
          <div className="mobile-only" style={{ flex: 1, flexDirection: "column", overflow: "hidden", background: "#0F1410", minHeight: 0 }}>
            {mobileView === "map" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <SearchHeader />
                <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
                  {isLoaded ? (
                    <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={selected ? { lat: selected.lat, lng: selected.lng } : AUSTIN_CENTER} zoom={selected ? 15 : 13} options={{ styles: mapStyles, disableDefaultUI: true, zoomControl: true }} onLoad={onMapLoad}>
                      {filtered.map((deal) => deal.lat && (
                        <Marker key={deal.id} position={{ lat: deal.lat, lng: deal.lng }} onClick={() => pick(deal)}
                          icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: selected?.id === deal.id ? 14 : deal.status === "active" ? 10 : 7, fillColor: mc[deal.status] || "#888", fillOpacity: 1, strokeColor: selected?.id === deal.id ? "#fff" : "#000", strokeWeight: selected?.id === deal.id ? 3 : 2 }}
                        />
                      ))}
                    </GoogleMap>
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#0f1923", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ color: "#C9683A", fontSize: "12px" }}>Map loading...</div>
                    </div>
                  )}
                  {selected && <DetailView />}
                </div>
              </div>
            )}
            {mobileView === "list" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                <SearchHeader />
                <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 4px 10px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(143,185,150,0.12)", border: "1px solid rgba(143,185,150,0.25)", color: "#8FB996", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: 700 }}>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#8FB996", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                      {activeCount} live now
                    </div>
                    <span style={{ fontSize: "11px", color: "#444" }}>{filtered.length} spots</span>
                  </div>
                  {filtered.length === 0 ? (
                    <div style={{ color: "#555", fontSize: "13px", padding: "16px 4px" }}>No deals match.</div>
                  ) : filtered.map((deal) => (
                    <div key={deal.id} onClick={() => pick(deal)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 12px", borderRadius: "10px", cursor: "pointer", marginBottom: "6px", background: selected?.id === deal.id ? "rgba(201,104,58,0.08)" : "#1A201A", border: `1px solid ${selected?.id === deal.id ? "rgba(201,104,58,0.4)" : "rgba(201,104,58,0.1)"}` }}>
                      <span style={{ fontSize: "22px", flexShrink: 0 }}>{deal.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#F0E9D6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{deal.name}</div>
                          <span style={{ fontSize: "10px", fontWeight: 700, color: mc[deal.status], flexShrink: 0 }}>{deal.status === "active" ? "LIVE" : deal.status === "upcoming" ? "SOON" : "ENDED"}</span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", marginTop: "3px" }}>
                          <span style={{ fontSize: "12px", color: "#555" }}>{deal.neighborhood}</span>
                          <span style={{ fontSize: "12px", color: "#C9683A", fontWeight: 600 }}>{deal.hours}</span>
                        </div>
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "6px" }}>
                          {deal.specials?.slice(0, 2).map((s, i) => (
                            <span key={i} style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px", background: i === 0 ? "rgba(201,104,58,0.12)" : "rgba(143,185,150,0.08)", color: i === 0 ? "#C9683A" : "#8FB996", border: `1px solid ${i === 0 ? "rgba(201,104,58,0.2)" : "rgba(143,185,150,0.15)"}` }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: "16px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", color: "#555" }}>Know a deal we're missing?</span>
                    <a href="/submit" style={{ padding: "8px 16px", background: "#C9683A", color: "#000", borderRadius: "8px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>+ Submit</a>
                  </div>
                </div>
              </div>
            )}
            <div style={{ flexShrink: 0, background: "#1A201A", borderTop: "1px solid rgba(201,104,58,0.15)", padding: "10px 16px", display: "flex", gap: "10px" }}>
              <button onClick={() => setMobileView("map")} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px", background: mobileView === "map" ? "#C9683A" : "rgba(201,104,58,0.08)", color: mobileView === "map" ? "#000" : "#888" }}>Map</button>
              <button onClick={() => setMobileView("list")} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px", background: mobileView === "list" ? "#C9683A" : "rgba(201,104,58,0.08)", color: mobileView === "list" ? "#000" : "#888" }}>List ({filtered.length})</button>
            </div>
          </div>
        </div>

        <div className="hh-footer desktop-only" style={{ display: "grid" }}>
          <div><span style={{ fontSize: "15px", fontWeight: 800, color: "#C9683A" }}>HappyHour Austin</span></div>
          <div style={{ textAlign: "center" }}><span style={{ fontSize: "12px", color: "#555" }}>Austin's best drink deals, live. &nbsp; © 2026 Created by Justin Adame</span></div>
          <div style={{ textAlign: "right" }}><span style={{ fontSize: "12px", color: "#444", fontStyle: "italic" }}>Drink responsibly.</span></div>
        </div>
      </div>
    </>
  );
}