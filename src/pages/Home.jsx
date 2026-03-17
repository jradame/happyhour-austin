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
  { id: "1", name: "Hole in the Wall", neighborhood: "West Campus", icon: "🎸", status: "active", hours: "4-7pm", specials: ["$3 Lone Stars", "$5 wells"], lat: 30.2881, lng: -97.7401 },
  { id: "2", name: "Rainey St Bar", neighborhood: "Rainey Street", icon: "🍺", status: "active", hours: "3-6pm", specials: ["Half-off drafts", "$4 shots"], lat: 30.2588, lng: -97.7392 },
  { id: "3", name: "Barbarella", neighborhood: "Red River", icon: "🍸", status: "upcoming", hours: "5-8pm", specials: ["$5 margaritas", "$4 Tecate"], lat: 30.2677, lng: -97.7362 },
  { id: "4", name: "Emo's", neighborhood: "East 6th", icon: "🤘", status: "upcoming", hours: "4-7pm", specials: ["$2 PBR", "$4 wells"], lat: 30.2601, lng: -97.7218 },
  { id: "5", name: "Jackalope", neighborhood: "6th Street", icon: "🦌", status: "ended", hours: "4-7pm", specials: ["$3 Shiner", "Half-off apps"], lat: 30.2692, lng: -97.7415 },
  { id: "6", name: "Cactus Cafe", neighborhood: "UT Campus", icon: "🌵", status: "active", hours: "5-8pm", specials: ["$4 margaritas", "$3 Lone Star"], lat: 30.2849, lng: -97.7341 },
  { id: "7", name: "The Liberty", neighborhood: "East Austin", icon: "🍕", status: "upcoming", hours: "4-6pm", specials: ["$2 off drafts", "Half-off pizza"], lat: 30.2641, lng: -97.7198 },
  { id: "8", name: "Dizzy Rooster", neighborhood: "6th Street", icon: "🐓", status: "active", hours: "4-7pm", specials: ["$3 Lone Stars", "$2 off wells"], lat: 30.2685, lng: -97.7398 },
  { id: "9", name: "Latchkey", neighborhood: "Downtown", icon: "🥃", status: "upcoming", hours: "5-7pm", specials: ["$6 cocktails", "$4 local drafts"], lat: 30.2658, lng: -97.7452 },
  { id: "10", name: "Handlebar", neighborhood: "East Austin", icon: "🍻", status: "active", hours: "3-7pm", specials: ["$3 PBR", "$5 margaritas"], lat: 30.2612, lng: -97.7225 },
];

const mc = { active: "#3DD68C", upcoming: "#F5C842", ended: "#888" };
const sl = { active: "LIVE", upcoming: "SOON", ended: "ENDED" };

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [map, setMap] = useState(null);

  const { deals: fd } = useDeals();
  const deals = fd.length > 0 ? fd : SEED_DEALS;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const onMapLoad = useCallback((m) => setMap(m), []);

  const filtered = deals.filter((d) => {
    const mf =
      filter === "all" ? true :
      filter === "active" ? d.status === "active" :
      filter === "beer" ? d.specials?.some(s => ["beer","draft","shiner","pbr"].some(k => s.toLowerCase().includes(k))) :
      filter === "cocktails" ? d.specials?.some(s => ["cocktail","margarita","well"].some(k => s.toLowerCase().includes(k))) :
      filter === "food" ? d.specials?.some(s => ["app","nacho","taco","pizza","food"].some(k => s.toLowerCase().includes(k))) :
      true;
    const ms = search === "" ? true :
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.neighborhood.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const activeCount = deals.filter(d => d.status === "active").length;

 const neighborhoodCoords = {
    "6th Street": { lat: 30.2685, lng: -97.7398 },
    "Rainey Street": { lat: 30.2588, lng: -97.7392 },
    "Red River": { lat: 30.2677, lng: -97.7362 },
    "East Austin": { lat: 30.2641, lng: -97.7198 },
    "West Campus": { lat: 30.2881, lng: -97.7401 },
    "Downtown": { lat: 30.2658, lng: -97.7452 },
    "South Congress": { lat: 30.2499, lng: -97.7502 },
    "North Loop": { lat: 30.3147, lng: -97.7185 },
    "Domain": { lat: 30.4017, lng: -97.7267 },
    "Cedar Park": { lat: 30.5052, lng: -97.8203 },
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

      {/* 1 -- SEARCH */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#161616", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "10px", padding: "9px 14px" }}>
        <span style={{ color: "#444" }}>⌕</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bars, deals, neighborhoods..." style={{ background: "transparent", border: "none", color: "#F0EDE6", fontSize: "13px", flex: 1, outline: "none" }} />
        {search && <span onClick={() => setSearch("")} style={{ color: "#444", cursor: "pointer" }}>✕</span>}
      </div>

      {/* 2 -- LIVE BADGE */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(61,214,140,0.12)", border: "1px solid rgba(61,214,140,0.3)", color: "#3DD68C", borderRadius: "20px", padding: "5px 14px", fontSize: "12px", fontWeight: 700 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3DD68C", display: "inline-block", animation: "pulse 1.5s infinite" }} />
          {activeCount} live now
        </div>
        <span style={{ fontSize: "11px", color: "#555" }}>{filtered.length} spots tonight</span>
      </div>

      {/* 3 -- FILTERS */}
      <FilterBar active={filter} onChange={setFilter} />

      {/* 4 -- HORIZONTAL CARDS */}
      <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
        {filtered.map((deal) => (
          <div key={deal.id} onClick={() => pick(deal)} style={{ width: "185px", flexShrink: 0, background: selected?.id === deal.id ? "rgba(212,160,23,0.08)" : "#161616", border: `1px solid ${selected?.id === deal.id ? "#D4A017" : "rgba(212,160,23,0.15)"}`, borderRadius: "10px", padding: "12px", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ fontSize: "16px" }}>{deal.icon}</span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#F0EDE6" }}>{deal.name}</div>
                  <div style={{ fontSize: "10px", color: "#555" }}>{deal.neighborhood}</div>
                </div>
              </div>
              <span style={{ fontSize: "9px", fontWeight: 700, color: mc[deal.status] }}>{sl[deal.status]}</span>
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

      {/* 5 -- MAP */}
      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(212,160,23,0.15)", height: "380px", position: "relative" }}>
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
        <div style={{ position: "absolute", bottom: "12px", right: "10px", background: "rgba(13,13,13,0.92)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px", padding: "8px 12px" }}>
          <div style={{ color: "#555", marginBottom: "4px", fontWeight: 700, fontSize: "9px", letterSpacing: "0.8px" }}>LEGEND</div>
          {[{ color: "#3DD68C", label: "Live" }, { color: "#F5C842", label: "Soon" }, { color: "#888", label: "Ended" }].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.color }} />
              <span style={{ color: "#aaa", fontSize: "10px" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6 -- BROWSE BY NEIGHBORHOOD */}
      <div style={card}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Browse by Neighborhood</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["6th Street", "Rainey Street", "Red River", "East Austin", "West Campus", "Downtown", "South Congress", "North Loop", "Domain", "Cedar Park"].map((n) => (
            <span key={n} onClick={() => { setSearch(n); const coords = neighborhoodCoords[n]; if (coords && map) { map.panTo(coords); map.setZoom(14); } }} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: search === n ? "#D4A017" : "rgba(212,160,23,0.06)", border: `1px solid ${search === n ? "#D4A017" : "rgba(212,160,23,0.15)"}`, color: search === n ? "#000" : "#888", cursor: "pointer" }}>{n}</span>
          ))}
        </div>
      </div>

      {/* 7 -- SUBMIT */}
      <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#F0EDE6" }}>Know a happy hour we're missing?</div>
          <div style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>Help Austin find the best deals.</div>
        </div>
        <a href="/submit" style={{ padding: "9px 18px", background: "#D4A017", color: "#000", borderRadius: "8px", fontSize: "12px", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", marginLeft: "16px" }}>+ Submit a Deal</a>
      </div>

      {/* 8 -- FOOTER */}
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