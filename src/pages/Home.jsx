import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useDeals } from "../hooks/useDeals";

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
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#D4A017" }] },
];

const SEED_DEALS = [
  { id: "1", name: "Hole in the Wall", neighborhood: "West Campus", icon: "🎸", status: "active", hours: "3-8pm", address: "2538 Guadalupe St", specials: ["Select drink specials", "Live music nightly"], days: ["Mon","Tue","Wed","Thu","Fri","Sat"], lat: 30.2881, lng: -97.7401 },
  { id: "2", name: "Jackalope", neighborhood: "6th Street", icon: "🦌", status: "active", hours: "2-7pm", address: "404 E 6th St", specials: ["$2 tall boys", "$2 wells", "$4 margaritas"], days: ["Mon","Tue","Wed","Thu","Fri"], lat: 30.2692, lng: -97.7415 },
  { id: "3", name: "Whisler's", neighborhood: "East 6th", icon: "🥃", status: "upcoming", hours: "4-7pm", address: "1816 E 6th St", specials: ["$7-9 cocktails"], days: ["Mon","Tue","Wed","Thu","Fri"], lat: 30.2612, lng: -97.7198 },
  { id: "4", name: "Volstead Lounge", neighborhood: "East 6th", icon: "🎵", status: "upcoming", hours: "5-7pm", address: "1500 E 6th St", specials: ["$3 well cocktails", "$2 Lone Stars", "$6 classic cocktails"], days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], lat: 30.2618, lng: -97.7205 },
  { id: "5", name: "Cheer Up Charlie's", neighborhood: "Red River", icon: "🌈", status: "upcoming", hours: "6-8pm", address: "900 Red River St", specials: ["$6 micheladas & margs & frozens", "$3 tall boys"], days: ["Tue","Wed","Thu","Fri","Sat"], lat: 30.2677, lng: -97.7362 },
  { id: "6", name: "Las Perlas", neighborhood: "Downtown", icon: "🍹", status: "upcoming", hours: "4-8pm", address: "405 E 7th St", specials: ["$4 Carta Blanca", "$7 draft margarita", "$7 draft paloma"], days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], lat: 30.2658, lng: -97.7415 },
  { id: "7", name: "Half Step", neighborhood: "Rainey Street", icon: "🍺", status: "upcoming", hours: "4-7pm", address: "75 1/2 Rainey St", specials: ["$8 select cocktails", "$2 off all draft beer"], days: ["Mon","Tue","Wed","Thu","Fri"], lat: 30.2588, lng: -97.7392 },
  { id: "8", name: "Stagger Lee", neighborhood: "Rainey Street", icon: "🍖", status: "upcoming", hours: "3-7pm", address: "87 Rainey St", specials: ["$5 house wine & frozens", "$3 domestic beers & wells"], days: ["Mon","Tue","Wed","Thu","Fri"], lat: 30.2585, lng: -97.7388 },
  { id: "9", name: "Banger's", neighborhood: "Rainey Street", icon: "🌭", status: "upcoming", hours: "5-6pm", address: "79 Rainey St", specials: ["$3 snacks", "$5 sausages", "$4 beer"], days: ["Mon","Tue","Wed","Thu","Fri"], lat: 30.2582, lng: -97.7385 },
  { id: "10", name: "Crown & Anchor", neighborhood: "UT Campus", icon: "⚓", status: "active", hours: "2-7pm", address: "2911 San Jacinto Blvd", specials: ["Daily specials", "Extensive beer selection"], days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], lat: 30.2849, lng: -97.7341 },
  { id: "11", name: "Black Sheep Lodge", neighborhood: "South Lamar", icon: "🍔", status: "active", hours: "All day", address: "2108 S Lamar Blvd", specials: ["Mon: $2 off TX pints", "Thu: $4 frozen margs", "Sun: $5 mimosas"], days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], lat: 30.2499, lng: -97.7502 },
  { id: "12", name: "Lazarus Brewing", neighborhood: "East 6th", icon: "🍺", status: "upcoming", hours: "4-6pm", address: "1902 E 6th St", specials: ["$2 Time Machine lager", "$2 off wine/beer/frozens", "$2 bean & cheese tostadas"], days: ["Mon","Tue","Wed","Thu"], lat: 30.2628, lng: -97.7188 },
  { id: "13", name: "Haymaker", neighborhood: "East Austin", icon: "🍸", status: "active", hours: "All day", address: "2310 Manor Rd", specials: ["All day every day specials", "Daily rotating deals"], days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], lat: 30.2641, lng: -97.7198 },
  { id: "14", name: "The Cavalier", neighborhood: "East Austin", icon: "🥃", status: "active", hours: "3-7pm", address: "2400 Webberville Rd", specials: ["$1 off draft beer & wine", "$3 wells", "$7 frozens"], days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], lat: 30.2601, lng: -97.7178 },
  { id: "15", name: "Hotel Vegas", neighborhood: "East 6th", icon: "🎸", status: "upcoming", hours: "5-7pm", address: "1502 E 6th St", specials: ["$6 classic cocktails", "$3 well cocktails", "$2 Lone Star tallboys"], days: ["Mon","Tue","Wed","Thu","Fri"], lat: 30.2622, lng: -97.7202 },
  { id: "16", name: "Pelon's Tex-Mex", neighborhood: "Red River", icon: "🌮", status: "upcoming", hours: "3-6pm", address: "802 Red River St", specials: ["$4 draft Modelo", "$6 beer-and-shot combos"], days: ["Mon","Tue","Wed","Thu","Fri"], lat: 30.2671, lng: -97.7358 },
  { id: "17", name: "Speakeasy Austin", neighborhood: "Downtown", icon: "🎷", status: "upcoming", hours: "3-7pm", address: "412 Congress Ave", specials: ["$2 off specialty cocktails, beer & wine"], days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], lat: 30.2665, lng: -97.7432 },
  { id: "18", name: "Dumont's Down Low", neighborhood: "Downtown", icon: "🥃", status: "upcoming", hours: "5-7pm", address: "214 W 4th St", specials: ["$5-7 selected cocktails", "$3 Miller Lite & Lone Stars", "$5 house wine"], days: ["Mon","Tue","Wed","Thu","Fri"], lat: 30.2672, lng: -97.7458 },
  { id: "19", name: "Guero's Taco Bar", neighborhood: "South Congress", icon: "🌮", status: "upcoming", hours: "3-6pm", address: "1412 S Congress Ave", specials: ["$5.50 classic margaritas", "$1 off domestic beers", "$1 off nachos & queso"], days: ["Mon","Tue","Wed","Thu","Fri"], lat: 30.2499, lng: -97.7502 },
  { id: "20", name: "Gibson Street Bar", neighborhood: "South Lamar", icon: "🍺", status: "upcoming", hours: "4-7pm", address: "1109 S Lamar Blvd", specials: ["$5 wells", "$6 tequila & bourbon", "$5 draft beers"], days: ["Mon","Tue","Wed","Thu","Fri"], lat: 30.2545, lng: -97.7535 },
  { id: "21", name: "Sour Duck Market", neighborhood: "East Austin", icon: "🍔", status: "upcoming", hours: "3-6pm", address: "1814 E MLK Jr Blvd", specials: ["$6 single cheeseburger", "$6 palomas & daiquiris", "$3 Lone Star cans all day"], days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], lat: 30.2812, lng: -97.7145 },
  { id: "22", name: "Revelry Kitchen & Bar", neighborhood: "East 6th", icon: "💽", status: "upcoming", hours: "4-7pm", address: "1410 E 6th St", specials: ["$2 off house cocktails & wines", "$1 off local beers", "$5 wells"], days: ["Tue","Wed","Thu","Fri"], lat: 30.2625, lng: -97.7195 },
  { id: "23", name: "Il Brutto", neighborhood: "East 6th", icon: "🍕", status: "upcoming", hours: "4-6pm", address: "1601 E 6th St", specials: ["1/2 off all cocktails, wine & beer"], days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], lat: 30.2630, lng: -97.7192 },
  { id: "24", name: "Clark's Oyster Bar", neighborhood: "Clarksville", icon: "🦪", status: "upcoming", hours: "3-5pm", address: "1200 W 6th St", specials: ["Half off martinis & burgers", "$5 oyster shooters & drafts"], days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], lat: 30.2771, lng: -97.7558 },
  { id: "25", name: "Verbena", neighborhood: "West 6th", icon: "🍸", status: "upcoming", hours: "3-6pm", address: "612 W 6th St", specials: ["$10 flatbreads", "$2 fresh oysters", "$5 martinis", "$3 rotating beer"], days: ["Mon","Tue","Wed","Thu","Fri"], lat: 30.2745, lng: -97.7515 },
];

const mc = { active: "#3DD68C", upcoming: "#F5C842", ended: "#888" };

const BAR_PHOTOS = {
  "🎸": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80",
  "🦌": "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=800&q=80",
  "🥃": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
  "🎵": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  "🍹": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80",
  "🍺": "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=80",
  "🌭": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  "⚓": "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80",
  "🍔": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
  "🍸": "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=800&q=80",
  "🌮": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
  "🎷": "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80",
  "🌈": "https://images.unsplash.com/photo-1527090526205-beaac8dc3c62?w=800&q=80",
  "🍖": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  "🦪": "https://images.unsplash.com/photo-1565680018434-b9c0d27b2e5a?w=800&q=80",
  "🍕": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
  "💽": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
};
const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1546622891-02c72c1537b6?w=800&q=80";

const NEIGHBORHOODS = ["6th Street","Rainey Street","Red River","East Austin","East 6th","West Campus","Downtown","South Congress","South Lamar","Clarksville","North Loop"];

const neighborhoodCoords = {
  "6th Street": { lat: 30.2685, lng: -97.7398 },
  "Rainey Street": { lat: 30.2585, lng: -97.7388 },
  "Red River": { lat: 30.2677, lng: -97.7362 },
  "East Austin": { lat: 30.2641, lng: -97.7198 },
  "East 6th": { lat: 30.2625, lng: -97.7195 },
  "West Campus": { lat: 30.2881, lng: -97.7401 },
  "Downtown": { lat: 30.2658, lng: -97.7452 },
  "South Congress": { lat: 30.2499, lng: -97.7502 },
  "South Lamar": { lat: 30.2545, lng: -97.7535 },
  "Clarksville": { lat: 30.2771, lng: -97.7558 },
  "North Loop": { lat: 30.3147, lng: -97.7185 },
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

const DAY_FILTERS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

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
      filter === "beer" ? d.specials?.some(s => ["beer","draft","shiner","pbr","lager","pint"].some(k => s.toLowerCase().includes(k))) :
      filter === "cocktails" ? d.specials?.some(s => ["cocktail","margarita","well","frozen","spritz"].some(k => s.toLowerCase().includes(k))) :
      filter === "food" ? d.specials?.some(s => ["app","nacho","taco","pizza","food","burger","oyster","snack"].some(k => s.toLowerCase().includes(k))) :
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

  const Pill = ({ active, label, onClick, color = "#D4A017" }) => (
    <button onClick={onClick} style={{
      padding: "5px 11px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
      whiteSpace: "nowrap", cursor: "pointer", border: "1px solid", flexShrink: 0,
      background: active ? color : "transparent",
      color: active ? "#000" : "#777",
      borderColor: active ? color : "rgba(212,160,23,0.2)",
    }}>{label}</button>
  );

  const SearchHeader = () => (
    <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(212,160,23,0.1)", background: "#0D0D0D", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#161616", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px", padding: "7px 12px", marginBottom: "8px" }}>
        <span style={{ color: "#444" }}>⌕</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bars or neighborhoods..." style={{ background: "transparent", border: "none", color: "#F0EDE6", fontSize: "13px", flex: 1, outline: "none" }} />
        {search && <span onClick={() => setSearch("")} style={{ color: "#444", cursor: "pointer" }}>✕</span>}
      </div>
      <div className="pill-row" style={{ marginBottom: "6px" }}>
        {TYPE_FILTERS.map(f => <Pill key={f.id} active={filter === f.id} label={f.label} onClick={() => setFilter(f.id)} />)}
      </div>
      <div className="pill-row">
        <Pill active={activeDay === "all"} label="Every Day" onClick={() => setActiveDay("all")} color="#3DD68C" />
        {DAY_FILTERS.map(d => <Pill key={d} active={activeDay === d} label={d} onClick={() => setActiveDay(d)} color="#3DD68C" />)}
      </div>
    </div>
  );

  const DetailOverlay = () => selected ? (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#161616", borderTop: "1px solid rgba(212,160,23,0.25)", borderRadius: "14px 14px 0 0", animation: "slideUp 0.25s ease", overflow: "hidden", maxHeight: "75%", zIndex: 20 }}>
      <div style={{ position: "relative", height: "140px" }}>
        <img src={BAR_PHOTOS[selected.icon] || DEFAULT_PHOTO} alt={selected.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.src = DEFAULT_PHOTO; }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(22,22,22,0.95))" }} />
        <button onClick={() => setSelected(null)} style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.65)", border: "none", color: "#fff", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        <div style={{ position: "absolute", top: "10px", left: "10px", background: selected.status === "active" ? "rgba(61,214,140,0.9)" : "rgba(245,200,66,0.9)", color: "#000", borderRadius: "20px", padding: "3px 10px", fontSize: "10px", fontWeight: 700 }}>
          {selected.status === "active" ? "LIVE NOW" : "STARTING SOON"}
        </div>
        <div style={{ position: "absolute", bottom: "8px", left: "14px", right: "50px" }}>
          <div style={{ fontSize: "15px", fontWeight: 800, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{selected.icon} {selected.name}</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", marginTop: "2px" }}>{selected.neighborhood} · {selected.hours}</div>
        </div>
      </div>
      <div style={{ padding: "14px 16px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "11px", color: "#555", marginBottom: "8px" }}>{selected.address}, Austin TX</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {selected.specials?.map((s, i) => (
              <span key={i} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "20px", background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.15)", color: "#F5C842" }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "7px", flexShrink: 0 }}>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selected.address + ", Austin, TX")}`} target="_blank" rel="noreferrer" style={{ padding: "9px 16px", background: "#D4A017", color: "#000", borderRadius: "8px", fontSize: "12px", fontWeight: 700, textDecoration: "none", textAlign: "center", whiteSpace: "nowrap" }}>Directions →</a>
          <a href={`https://www.google.com/search?q=${encodeURIComponent(selected.name + " Austin TX happy hour")}`} target="_blank" rel="noreferrer" style={{ padding: "9px 16px", background: "transparent", color: "#888", borderRadius: "8px", fontSize: "12px", fontWeight: 600, textDecoration: "none", textAlign: "center", border: "1px solid rgba(212,160,23,0.2)", whiteSpace: "nowrap" }}>More Info</a>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
        * { box-sizing: border-box; }

        .pill-row { display:flex; gap:5px; overflow-x:auto; flex-wrap:nowrap; scrollbar-width:none; }
        .pill-row::-webkit-scrollbar { display:none; }

        .bar-list::-webkit-scrollbar { width:6px; }
        .bar-list::-webkit-scrollbar-track { background:rgba(255,255,255,0.03); }
        .bar-list::-webkit-scrollbar-thumb { background:rgba(212,160,23,0.4); border-radius:4px; }
        .bar-list { scrollbar-width:thin; scrollbar-color:rgba(212,160,23,0.4) transparent; }

        .hh-right::-webkit-scrollbar { width:6px; }
        .hh-right::-webkit-scrollbar-track { background:rgba(255,255,255,0.03); }
        .hh-right::-webkit-scrollbar-thumb { background:rgba(212,160,23,0.3); border-radius:4px; }
        .hh-right { scrollbar-width:thin; scrollbar-color:rgba(212,160,23,0.3) transparent; }

        /* Use 100svh -- accounts for browser chrome on all devices */
        .hh-root {
          display: flex;
          flex-direction: column;
          height: calc(100svh - 60px);
          overflow: hidden;
          background: #0D0D0D;
        }

        .hh-body { display:flex; flex:1; overflow:hidden; min-height:0; }

        .hh-left {
          width: 400px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(212,160,23,0.12);
          overflow: hidden;
        }

        .hh-right {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          overflow-y: scroll;
          overflow-x: hidden;
        }

        .hh-footer {
          background: #161616;
          border-top: 1px solid rgba(212,160,23,0.2);
          height: 56px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          align-items: center;
          padding: 0 24px;
          flex-shrink: 0;
        }

        .mobile-only { display: none; }
        .desktop-only { display: flex; }

        @media (max-width: 768px) {
          .mobile-only { display: flex; }
          .desktop-only { display: none !important; }
          .hh-footer { display: none; }
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          .hh-left { width: 320px; }
        }
      `}</style>

      <div className="hh-root">
        <div className="hh-body">

          {/* DESKTOP LEFT */}
          <div className="hh-left desktop-only" style={{ flexDirection: "column" }}>
            <div style={{ padding: "14px 12px 12px", borderBottom: "1px solid rgba(212,160,23,0.1)", flexShrink: 0, background: "#0D0D0D" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(61,214,140,0.12)", border: "1px solid rgba(61,214,140,0.25)", color: "#3DD68C", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: 700 }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#3DD68C", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                  {activeCount} live now
                </div>
                <span style={{ fontSize: "11px", color: "#444" }}>{filtered.length} spots</span>
              </div>
              <div className="pill-row" style={{ marginBottom: "7px" }}>
                {TYPE_FILTERS.map(f => <Pill key={f.id} active={filter === f.id} label={f.label} onClick={() => setFilter(f.id)} />)}
              </div>
              <div className="pill-row">
                <Pill active={activeDay === "all"} label="Every Day" onClick={() => setActiveDay("all")} color="#3DD68C" />
                {DAY_FILTERS.map(d => <Pill key={d} active={activeDay === d} label={d} onClick={() => setActiveDay(d)} color="#3DD68C" />)}
              </div>
            </div>

            <div className="bar-list" style={{ flex: 1, overflowY: "scroll", padding: "8px 10px" }}>
              {filtered.length === 0 ? (
                <div style={{ color: "#555", fontSize: "13px", padding: "16px 8px" }}>No deals match.</div>
              ) : filtered.map((deal) => (
                <div key={deal.id} onClick={() => pick(deal)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 12px", borderRadius: "10px", cursor: "pointer", marginBottom: "4px", background: selected?.id === deal.id ? "rgba(212,160,23,0.08)" : "transparent", border: `1px solid ${selected?.id === deal.id ? "rgba(212,160,23,0.4)" : "rgba(212,160,23,0.07)"}`, transition: "all 0.15s" }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{deal.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#F0EDE6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{deal.name}</div>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: mc[deal.status], flexShrink: 0 }}>{deal.status === "active" ? "LIVE" : deal.status === "upcoming" ? "SOON" : "ENDED"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
                      <span style={{ fontSize: "11px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{deal.neighborhood}</span>
                      <span style={{ fontSize: "11px", color: "#F5C842", flexShrink: 0, fontWeight: 600 }}>{deal.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "11px 12px", borderTop: "1px solid rgba(212,160,23,0.1)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0D0D0D" }}>
              <span style={{ fontSize: "12px", color: "#555" }}>Know a deal we're missing?</span>
              <a href="/submit" style={{ padding: "7px 14px", background: "#D4A017", color: "#000", borderRadius: "8px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>+ Submit</a>
            </div>
          </div>

          {/* DESKTOP RIGHT */}
          <div className="hh-right desktop-only" style={{ flexDirection: "column", background: "#0D0D0D" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(212,160,23,0.1)", background: "#0D0D0D", position: "sticky", top: 0, zIndex: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#161616", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px", padding: "8px 12px", marginBottom: "9px" }}>
                <span style={{ color: "#444", fontSize: "14px" }}>⌕</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search neighborhoods or bar names..." style={{ background: "transparent", border: "none", color: "#F0EDE6", fontSize: "13px", flex: 1, outline: "none" }} />
                {search && <span onClick={() => setSearch("")} style={{ color: "#444", cursor: "pointer" }}>✕</span>}
              </div>
              <div className="pill-row">
                {NEIGHBORHOODS.map(n => (
                  <span key={n} onClick={() => { setSearch(n); const c = neighborhoodCoords[n]; if (c && map) { map.panTo(c); map.setZoom(14); } }}
                    style={{ padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, cursor: "pointer", flexShrink: 0, background: search === n ? "rgba(212,160,23,0.2)" : "rgba(212,160,23,0.05)", border: `1px solid ${search === n ? "#D4A017" : "rgba(212,160,23,0.15)"}`, color: search === n ? "#F5C842" : "#666" }}>
                    {n}
                  </span>
                ))}
              </div>
            </div>

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
                  <div style={{ color: "#D4A017", fontSize: "12px" }}>Map loading...</div>
                </div>
              )}
              {!selected && (
                <div style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(13,13,13,0.92)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px", padding: "8px 12px" }}>
                  <div style={{ color: "#555", marginBottom: "4px", fontWeight: 700, fontSize: "9px", letterSpacing: "0.8px" }}>LEGEND</div>
                  {[{ color: "#3DD68C", label: "Live" }, { color: "#F5C842", label: "Soon" }, { color: "#888", label: "Ended" }].map(item => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.color }} />
                      <span style={{ color: "#aaa", fontSize: "10px" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
              <DetailOverlay />
            </div>
          </div>

          {/* MOBILE */}
          <div className="mobile-only" style={{ flex: 1, flexDirection: "column", overflow: "hidden", background: "#0D0D0D", minHeight: 0 }}>
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
                      <div style={{ color: "#D4A017", fontSize: "12px" }}>Map loading...</div>
                    </div>
                  )}
                  <DetailOverlay />
                </div>
              </div>
            )}

            {mobileView === "list" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                <SearchHeader />
                <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 4px 10px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(61,214,140,0.12)", border: "1px solid rgba(61,214,140,0.25)", color: "#3DD68C", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: 700 }}>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#3DD68C", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                      {activeCount} live now
                    </div>
                    <span style={{ fontSize: "11px", color: "#444" }}>{filtered.length} spots</span>
                  </div>
                  {filtered.length === 0 ? (
                    <div style={{ color: "#555", fontSize: "13px", padding: "16px 4px" }}>No deals match.</div>
                  ) : filtered.map((deal) => (
                    <div key={deal.id} onClick={() => pick(deal)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 12px", borderRadius: "10px", cursor: "pointer", marginBottom: "6px", background: selected?.id === deal.id ? "rgba(212,160,23,0.08)" : "#161616", border: `1px solid ${selected?.id === deal.id ? "rgba(212,160,23,0.4)" : "rgba(212,160,23,0.1)"}` }}>
                      <span style={{ fontSize: "22px", flexShrink: 0 }}>{deal.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#F0EDE6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{deal.name}</div>
                          <span style={{ fontSize: "10px", fontWeight: 700, color: mc[deal.status], flexShrink: 0 }}>{deal.status === "active" ? "LIVE" : deal.status === "upcoming" ? "SOON" : "ENDED"}</span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", marginTop: "3px" }}>
                          <span style={{ fontSize: "12px", color: "#555" }}>{deal.neighborhood}</span>
                          <span style={{ fontSize: "12px", color: "#F5C842", fontWeight: 600 }}>{deal.hours}</span>
                        </div>
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "6px" }}>
                          {deal.specials?.slice(0, 2).map((s, i) => (
                            <span key={i} style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px", background: i === 0 ? "rgba(212,160,23,0.12)" : "rgba(61,214,140,0.08)", color: i === 0 ? "#F5C842" : "#3DD68C", border: `1px solid ${i === 0 ? "rgba(212,160,23,0.2)" : "rgba(61,214,140,0.15)"}` }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: "16px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", color: "#555" }}>Know a deal we're missing?</span>
                    <a href="/submit" style={{ padding: "8px 16px", background: "#D4A017", color: "#000", borderRadius: "8px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>+ Submit</a>
                  </div>
                </div>
              </div>
            )}

            {/* MOBILE TOGGLE */}
            <div style={{ flexShrink: 0, background: "#161616", borderTop: "1px solid rgba(212,160,23,0.15)", padding: "10px 16px", display: "flex", gap: "10px" }}>
              <button onClick={() => setMobileView("map")} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px", background: mobileView === "map" ? "#D4A017" : "rgba(212,160,23,0.08)", color: mobileView === "map" ? "#000" : "#888" }}>
                Map
              </button>
              <button onClick={() => setMobileView("list")} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px", background: mobileView === "list" ? "#D4A017" : "rgba(212,160,23,0.08)", color: mobileView === "list" ? "#000" : "#888" }}>
                List ({filtered.length})
              </button>
            </div>
          </div>
        </div>

        {/* DESKTOP FOOTER */}
        <div className="hh-footer desktop-only" style={{ display: "grid" }}>
          <div><span style={{ fontSize: "15px", fontWeight: 800, color: "#F5C842" }}>HappyHour Austin</span></div>
          <div style={{ textAlign: "center" }}><span style={{ fontSize: "12px", color: "#555" }}>Austin's best drink deals, live. &nbsp; © 2026 Created by Justin Adame</span></div>
          <div style={{ textAlign: "right" }}><span style={{ fontSize: "12px", color: "#444", fontStyle: "italic" }}>Drink responsibly.</span></div>
        </div>
      </div>
    </>
  );
}