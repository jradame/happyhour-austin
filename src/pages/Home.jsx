import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useDeals } from "../hooks/useDeals";
import FilterBar from "../components/FilterBar";

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
  { id: "19", name: "Güero's Taco Bar", neighborhood: "South Congress", icon: "🌮", status: "upcoming", hours: "3-6pm", address: "1412 S Congress Ave", specials: ["$5.50 classic margaritas", "$1 off domestic beers", "$1 off nachos & queso"], days: ["Mon","Tue","Wed","Thu","Fri"], lat: 30.2499, lng: -97.7502 },
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

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [map, setMap] = useState(null);
  const [activeDay, setActiveDay] = useState("all");

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

  const pick = (deal) => {
    setSelected(deal);
    if (map && deal.lat) {
      map.panTo({ lat: deal.lat, lng: deal.lng });
      map.setZoom(15);
    }
  };

  const card = { background: "#161616", border: "1px solid rgba(212,160,23,0.15)", borderRadius: "12px", padding: "14px 18px" };

  return (
    <div style={{ background: "#0D0D0D", color: "#F0EDE6", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* SEARCH */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#161616", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "10px", padding: "9px 14px" }}>
        <span style={{ color: "#444" }}>⌕</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bars, deals, neighborhoods..." style={{ background: "transparent", border: "none", color: "#F0EDE6", fontSize: "13px", flex: 1, outline: "none" }} />
        {search && <span onClick={() => setSearch("")} style={{ color: "#444", cursor: "pointer" }}>✕</span>}
      </div>

      {/* LIVE BADGE */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(61,214,140,0.12)", border: "1px solid rgba(61,214,140,0.3)", color: "#3DD68C", borderRadius: "20px", padding: "5px 14px", fontSize: "12px", fontWeight: 700 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3DD68C", display: "inline-block", animation: "pulse 1.5s infinite" }} />
          {activeCount} live now
        </div>
        <span style={{ fontSize: "11px", color: "#555" }}>{filtered.length} spots · {activeDay === "all" ? "every day" : activeDay}</span>
      </div>

      {/* FILTERS */}
      <FilterBar active={filter} onChange={setFilter} activeDay={activeDay} onDayChange={setActiveDay} />

      {/* HORIZONTAL CARDS */}
      <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
        {filtered.length === 0 ? (
          <div style={{ color: "#555", fontSize: "13px", padding: "10px 0", whiteSpace: "nowrap" }}>No deals match -- try a different day or filter.</div>
        ) : filtered.map((deal) => (
          <div key={deal.id} onClick={() => pick(deal)} style={{ width: "185px", flexShrink: 0, background: selected?.id === deal.id ? "rgba(212,160,23,0.08)" : "#161616", border: `1px solid ${selected?.id === deal.id ? "#D4A017" : "rgba(212,160,23,0.15)"}`, borderRadius: "10px", padding: "12px", cursor: "pointer", transition: "border-color 0.15s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ fontSize: "16px" }}>{deal.icon}</span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#F0EDE6", lineHeight: 1.2 }}>{deal.name}</div>
                  <div style={{ fontSize: "10px", color: "#555" }}>{deal.neighborhood}</div>
                </div>
              </div>
              <span style={{ fontSize: "9px", fontWeight: 700, color: mc[deal.status] }}>{deal.status === "active" ? "LIVE" : deal.status === "upcoming" ? "SOON" : "ENDED"}</span>
            </div>
            <div style={{ fontSize: "10px", color: "#666", marginBottom: "6px" }}>{deal.hours}</div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {deal.specials?.slice(0, 2).map((s, i) => (
                <span key={i} style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "20px", fontWeight: 600, background: i === 0 ? "rgba(212,160,23,0.15)" : "rgba(61,214,140,0.1)", color: i === 0 ? "#F5C842" : "#3DD68C" }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* MAP + RIGHT SLIDE PANEL */}
      <div style={{ display: "flex", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(212,160,23,0.15)", height: "420px" }}>

        {/* MAP */}
        <div style={{ flex: 1, position: "relative" }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={selected ? { lat: selected.lat, lng: selected.lng } : AUSTIN_CENTER}
              zoom={selected ? 15 : 13}
              options={{ styles: mapStyles, disableDefaultUI: true, zoomControl: true }}
              onLoad={onMapLoad}
            >
              {filtered.map((deal) => deal.lat && (
                <Marker key={deal.id} position={{ lat: deal.lat, lng: deal.lng }} onClick={() => pick(deal)}
                  icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: selected?.id === deal.id ? 14 : deal.status === "active" ? 10 : 7, fillColor: mc[deal.status] || "#888", fillOpacity: 1, strokeColor: selected?.id === deal.id ? "#fff" : "#000", strokeWeight: selected?.id === deal.id ? 3 : 2 }}
                />
              ))}
            </GoogleMap>
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#0f1923", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "28px" }}>🗺️</div>
              <div style={{ color: "#D4A017", fontSize: "12px" }}>Add VITE_GOOGLE_MAPS_API_KEY to .env.local</div>
            </div>
          )}
          {!selected && (
            <div style={{ position: "absolute", bottom: "12px", right: "10px", background: "rgba(13,13,13,0.92)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px", padding: "8px 12px" }}>
              <div style={{ color: "#555", marginBottom: "4px", fontWeight: 700, fontSize: "9px", letterSpacing: "0.8px" }}>LEGEND</div>
              {[{ color: "#3DD68C", label: "Live" }, { color: "#F5C842", label: "Soon" }, { color: "#888", label: "Ended" }].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.color }} />
                  <span style={{ color: "#aaa", fontSize: "10px" }}>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: selected ? "300px" : "0", flexShrink: 0, overflow: "hidden", transition: "width 0.3s ease", background: "#161616", borderLeft: selected ? "1px solid rgba(212,160,23,0.2)" : "none" }}>
          {selected && (
            <div style={{ width: "300px", height: "100%", display: "flex", flexDirection: "column" }}>

              {/* Photo */}
              <div style={{ position: "relative", height: "175px", flexShrink: 0 }}>
                <img src={BAR_PHOTOS[selected.icon] || DEFAULT_PHOTO} alt={selected.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.src = DEFAULT_PHOTO; }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(22,22,22,0.95))" }} />
                <button onClick={() => setSelected(null)} style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.65)", border: "none", color: "#fff", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                <div style={{ position: "absolute", top: "10px", left: "10px", background: selected.status === "active" ? "rgba(61,214,140,0.9)" : "rgba(245,200,66,0.9)", color: "#000", borderRadius: "20px", padding: "3px 10px", fontSize: "10px", fontWeight: 700 }}>
                  {selected.status === "active" ? "LIVE NOW" : "STARTING SOON"}
                </div>
                <div style={{ position: "absolute", bottom: "10px", left: "12px", right: "12px" }}>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.9)", lineHeight: 1.2 }}>{selected.icon} {selected.name}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", marginTop: "2px" }}>{selected.neighborhood}</div>
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#F5C842", marginBottom: "3px" }}>{selected.hours}</div>
                  <div style={{ fontSize: "11px", color: "#555" }}>{selected.address}, Austin TX</div>
                  {selected.days && <div style={{ fontSize: "10px", color: "#444", marginTop: "4px" }}>{selected.days.join(" · ")}</div>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {selected.specials?.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", background: "rgba(212,160,23,0.06)", borderRadius: "8px", border: "1px solid rgba(212,160,23,0.1)" }}>
                      <span style={{ fontSize: "12px" }}>{i === 0 ? "🍺" : i === 1 ? "🍹" : "🎉"}</span>
                      <span style={{ fontSize: "11px", color: "#F0EDE6" }}>{s}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "4px" }}>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selected.address + ", Austin, TX")}`} target="_blank" rel="noreferrer" style={{ padding: "10px", background: "#D4A017", color: "#000", borderRadius: "8px", fontSize: "12px", fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
                    Get Directions →
                  </a>
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(selected.name + " Austin TX happy hour")}`} target="_blank" rel="noreferrer" style={{ padding: "10px", background: "transparent", color: "#888", borderRadius: "8px", fontSize: "12px", fontWeight: 600, textDecoration: "none", textAlign: "center", border: "1px solid rgba(212,160,23,0.2)" }}>
                    More Info
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BROWSE BY NEIGHBORHOOD */}
      <div style={card}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Browse by Neighborhood</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {Object.keys(neighborhoodCoords).map((n) => (
            <span key={n} onClick={() => { setSearch(n); const c = neighborhoodCoords[n]; if (c && map) { map.panTo(c); map.setZoom(14); } }} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: search === n ? "rgba(212,160,23,0.2)" : "rgba(212,160,23,0.06)", border: `1px solid ${search === n ? "#D4A017" : "rgba(212,160,23,0.15)"}`, color: search === n ? "#F5C842" : "#888", cursor: "pointer" }}>{n}</span>
          ))}
        </div>
      </div>

      {/* SUBMIT */}
      <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#F0EDE6" }}>Know a happy hour we're missing?</div>
          <div style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>Help Austin find the best deals.</div>
        </div>
        <a href="/submit" style={{ padding: "9px 18px", background: "#D4A017", color: "#000", borderRadius: "8px", fontSize: "12px", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", marginLeft: "16px" }}>+ Submit a Deal</a>
      </div>

      {/* FOOTER */}
      <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#F5C842" }}>HappyHour Austin</div>
          <div style={{ fontSize: "10px", color: "#444", marginTop: "2px" }}>Austin's best drink deals, live.</div>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <span style={{ fontSize: "11px", color: "#555" }}>{filtered.length} spots</span>
          <span style={{ fontSize: "11px", color: "#3DD68C", fontWeight: 700 }}>{activeCount} active</span>
        </div>
        <span style={{ fontSize: "10px", color: "#333" }}>© 2026 · Happy Hour · Austin, TX</span>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(212,160,23,0.25); border-radius: 4px; }
      `}</style>
    </div>
  );
}
