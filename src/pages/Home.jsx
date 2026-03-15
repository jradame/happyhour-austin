import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { useDeals } from "../hooks/useDeals";
import DealCard from "../components/DealCard";
import FilterBar from "../components/FilterBar";

const AUSTIN_CENTER = { lat: 30.2672, lng: -97.7431 };

const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#0d0d0d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#888888" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0d0d0d" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e1e1e" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#2a2a2a" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#333333" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#555555" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#080808" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#D4A017" }] },
];

const SEED_DEALS = [
  {
    id: "1", name: "Hole in the Wall", neighborhood: "West Campus",
    icon: "🎸", status: "active", hours: "4–7pm",
    specials: ["$3 Lone Stars", "$5 wells"],
    lat: 30.2881, lng: -97.7401,
    endsAt: new Date(Date.now() + 7200000),
  },
  {
    id: "2", name: "Rainey St Bar", neighborhood: "Rainey Street",
    icon: "🍺", status: "active", hours: "3–6pm",
    specials: ["Half-off drafts", "$4 shots"],
    lat: 30.2588, lng: -97.7392,
    endsAt: new Date(Date.now() + 3600000),
  },
  {
    id: "3", name: "Barbarella", neighborhood: "Red River",
    icon: "🍸", status: "upcoming", hours: "5–8pm",
    specials: ["$5 margaritas", "$4 Tecate"],
    lat: 30.2677, lng: -97.7362,
  },
  {
    id: "4", name: "Emo's", neighborhood: "East 6th",
    icon: "🤘", status: "upcoming", hours: "4–7pm",
    specials: ["$2 PBR", "$4 wells", "Nachos special"],
    lat: 30.2601, lng: -97.7218,
  },
  {
    id: "5", name: "Jackalope", neighborhood: "6th Street",
    icon: "🦌", status: "ended", hours: "4–7pm",
    specials: ["$3 Shiner", "Half-off apps"],
    lat: 30.2692, lng: -97.7415,
  },
  {
    id: "6", name: "Cactus Cafe", neighborhood: "UT Campus",
    icon: "🌵", status: "active", hours: "5–8pm",
    specials: ["$4 margaritas", "$3 Lone Star"],
    lat: 30.2849, lng: -97.7341,
    endsAt: new Date(Date.now() + 5400000),
  },
  {
    id: "7", name: "The Liberty", neighborhood: "East Austin",
    icon: "🍕", status: "upcoming", hours: "4–6pm",
    specials: ["$2 off drafts", "Half-off pizza"],
    lat: 30.2641, lng: -97.7198,
  },
  {
    id: "8", name: "Dizzy Rooster", neighborhood: "6th Street",
    icon: "🐓", status: "active", hours: "4–7pm",
    specials: ["$3 Lone Stars", "$2 off wells"],
    lat: 30.2685, lng: -97.7398,
    endsAt: new Date(Date.now() + 4200000),
  },
  {
    id: "9", name: "Latchkey", neighborhood: "Downtown",
    icon: "🥃", status: "upcoming", hours: "5–7pm",
    specials: ["$6 cocktails", "$4 local drafts"],
    lat: 30.2658, lng: -97.7452,
  },
  {
    id: "10", name: "Handlebar", neighborhood: "East Austin",
    icon: "🍻", status: "active", hours: "3–7pm",
    specials: ["$3 PBR", "$5 margaritas", "Free pool"],
    lat: 30.2612, lng: -97.7225,
    endsAt: new Date(Date.now() + 6000000),
  },
];

const markerColor = { active: "#3DD68C", upcoming: "#F5C842", ended: "#888888" };

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [map, setMap] = useState(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const isMobile = window.innerWidth < 768;

  const { deals: firestoreDeals } = useDeals();
  const deals = firestoreDeals.length > 0 ? firestoreDeals : SEED_DEALS;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const onMapLoad = useCallback((m) => setMap(m), []);

  const filteredDeals = deals.filter((d) => {
    const matchesFilter =
      filter === "all" ? true :
      filter === "active" ? d.status === "active" :
      filter === "beer" ? d.specials?.some(s =>
        ["beer","draft","shiner","pbr"].some(k => s.toLowerCase().includes(k))) :
      filter === "cocktails" ? d.specials?.some(s =>
        ["cocktail","margarita","well"].some(k => s.toLowerCase().includes(k))) :
      filter === "food" ? d.specials?.some(s =>
        ["app","nacho","taco","pizza","food"].some(k => s.toLowerCase().includes(k))) :
      true;

    const matchesSearch = search === "" ? true :
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      d.specials?.some(s => s.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const activeCount = deals.filter(d => d.status === "active").length;

  const handleSelectDeal = (deal) => {
    setSelected(deal);
    setView("map");
    if (map && deal.lat) {
      map.panTo({ lat: deal.lat, lng: deal.lng });
      map.setZoom(16);
    }
  };

  const handleBack = () => {
    setView("list");
    setSelected(null);
  };

  // MOBILE
  if (isMobile) {
    return (
      <div style={{ height: "calc(100vh - 60px)", background: "#0D0D0D", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {view === "list" ? (
          <>
            <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(212,160,23,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  background: "rgba(61,214,140,0.12)", border: "1px solid rgba(61,214,140,0.25)",
                  color: "#3DD68C", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: 700
                }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3DD68C", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                  {activeCount} live now
                </div>
                <span style={{ fontSize: "11px", color: "#555" }}>{filteredDeals.length} spots</span>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "#111", border: "1px solid rgba(212,160,23,0.2)",
                borderRadius: "10px", padding: "8px 12px", marginBottom: "10px"
              }}>
                <span style={{ color: "#555" }}>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search bars, deals..."
                  style={{ background: "transparent", border: "none", color: "#F0EDE6", fontSize: "13px", flex: 1, outline: "none" }}
                />
                {search && <span onClick={() => setSearch("")} style={{ color: "#555", cursor: "pointer" }}>✕</span>}
              </div>
              <FilterBar active={filter} onChange={setFilter} />
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
              {filteredDeals.length === 0 ? (
                <div style={{ textAlign: "center", color: "#555", padding: "60px 20px", fontSize: "13px" }}>
                  No deals match right now.
                </div>
              ) : (
                filteredDeals.map((deal, i) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    featured={i === 0 && deal.status === "active"}
                    onSelect={handleSelectDeal}
                  />
                ))
              )}
            </div>
            <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(212,160,23,0.15)", textAlign: "center", fontSize: "11px", color: "#444" }}>
              Updated live · Austin, TX
            </div>
          </>
        ) : (
          <>
            <div style={{ flex: 1, position: "relative" }}>
              <button
                onClick={handleBack}
                style={{
                  position: "absolute", top: "12px", left: "12px", zIndex: 10,
                  background: "rgba(13,13,13,0.9)", border: "1px solid rgba(212,160,23,0.3)",
                  color: "#F0EDE6", borderRadius: "20px", padding: "8px 16px",
                  fontSize: "13px", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px"
                }}
              >
                ← Back
              </button>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={selected ? { lat: selected.lat, lng: selected.lng } : AUSTIN_CENTER}
                  zoom={selected ? 16 : 13}
                  options={{ styles: mapStyles, disableDefaultUI: true, zoomControl: true }}
                  onLoad={onMapLoad}
                >
                  {filteredDeals.map((deal) => (
                    deal.lat && (
                      <Marker
                        key={deal.id}
                        position={{ lat: deal.lat, lng: deal.lng }}
                        onClick={() => setSelected(deal)}
                        icon={{
                          path: window.google.maps.SymbolPath.CIRCLE,
                          scale: selected?.id === deal.id ? 14 : deal.status === "active" ? 10 : 7,
                          fillColor: markerColor[deal.status] || "#888",
                          fillOpacity: 1,
                          strokeColor: selected?.id === deal.id ? "#fff" : "#000",
                          strokeWeight: selected?.id === deal.id ? 3 : 2,
                        }}
                      />
                    )
                  ))}
                  {selected?.lat && (
                    <InfoWindow
                      position={{ lat: selected.lat, lng: selected.lng }}
                      onCloseClick={() => setSelected(null)}
                    >
                      <div style={{ padding: "6px", minWidth: "160px" }}>
                        <div style={{ fontSize: "16px" }}>{selected.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: "14px", color: "#111", marginTop: "4px" }}>{selected.name}</div>
                        <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{selected.neighborhood} · {selected.hours}</div>
                        {selected.specials?.map((s, i) => (
                          <div key={i} style={{ fontSize: "11px", color: "#1a7a4a", marginTop: "3px" }}>· {s}</div>
                        ))}
                        <div style={{
                          marginTop: "6px", fontSize: "11px", fontWeight: 700,
                          color: selected.status === "active" ? "#1a7a4a" : selected.status === "upcoming" ? "#b8860b" : "#888"
                        }}>
                          {selected.status === "active" ? "LIVE NOW" : selected.status === "upcoming" ? "STARTING SOON" : "ENDED"}
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#0f1923", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ color: "#D4A017", fontSize: "14px" }}>Loading map...</div>
                </div>
              )}
            </div>
            {selected && (
              <div style={{
                background: "#161616", borderTop: "1px solid rgba(212,160,23,0.25)",
                padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px"
              }}>
                <div style={{ fontSize: "24px" }}>{selected.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#F0EDE6" }}>{selected.name}</div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{selected.neighborhood} · {selected.hours}</div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                    {selected.specials?.map((s, i) => (
                      <span key={i} style={{
                        fontSize: "10px", padding: "2px 8px", borderRadius: "20px",
                        background: "rgba(212,160,23,0.15)", color: "#F5C842", fontWeight: 600
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{
                  fontSize: "11px", fontWeight: 700,
                  color: selected.status === "active" ? "#3DD68C" : selected.status === "upcoming" ? "#F5C842" : "#888"
                }}>
                  {selected.status === "active" ? "LIVE" : selected.status === "upcoming" ? "SOON" : "ENDED"}
                </div>
              </div>
            )}
          </>
        )}
        <style>{`
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
          ::-webkit-scrollbar{width:4px}
          ::-webkit-scrollbar-track{background:transparent}
          ::-webkit-scrollbar-thumb{background:rgba(212,160,23,0.3);border-radius:4px}
        `}</style>
      </div>
    );
  }

  // DESKTOP -- scrollable list + map same height
  return (
    <div style={{ padding: "20px 24px", background: "#0D0D0D", minHeight: "calc(100vh - 60px)" }}>

      {/* Top bar -- search + filters */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(61,214,140,0.12)", border: "1px solid rgba(61,214,140,0.25)",
            color: "#3DD68C", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: 700
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3DD68C", display: "inline-block", animation: "pulse 1.5s infinite" }} />
            {activeCount} live now
          </div>
          <span style={{ fontSize: "11px", color: "#555" }}>{filteredDeals.length} spots</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: "8px",
            background: "#111", border: "1px solid rgba(212,160,23,0.2)",
            borderRadius: "10px", padding: "8px 12px"
          }}>
            <span style={{ color: "#555" }}>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bars, deals, neighborhoods..."
              style={{ background: "transparent", border: "none", color: "#F0EDE6", fontSize: "13px", flex: 1, outline: "none" }}
            />
            {search && <span onClick={() => setSearch("")} style={{ color: "#555", cursor: "pointer" }}>✕</span>}
          </div>
        </div>
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      {/* List + map row */}
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>

        {/* Scrollable list -- 4 cards tall */}
        <div style={{
          width: "380px",
          flexShrink: 0,
          height: "472px",
          overflowY: "auto",
        }}>
          {filteredDeals.length === 0 ? (
            <div style={{ textAlign: "center", color: "#555", padding: "40px 20px", fontSize: "13px" }}>
              No deals match right now.
            </div>
          ) : (
            filteredDeals.map((deal, i) => (
              <div
                key={deal.id}
                style={{
                  outline: selected?.id === deal.id ? "1px solid #D4A017" : "none",
                  borderRadius: "12px",
                }}
              >
                <DealCard
                  deal={deal}
                  featured={i === 0 && deal.status === "active"}
                  onSelect={handleSelectDeal}
                />
              </div>
            ))
          )}
          <div style={{ padding: "8px", textAlign: "center", fontSize: "11px", color: "#333" }}>
            Updated live · Austin, TX
          </div>
        </div>

        {/* Map -- same height as list */}
        <div style={{
          flex: 1,
          height: "472px",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid rgba(212,160,23,0.2)",
          position: "relative",
        }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={AUSTIN_CENTER}
              zoom={13}
              options={{ styles: mapStyles, disableDefaultUI: true, zoomControl: true }}
              onLoad={onMapLoad}
            >
              {filteredDeals.map((deal) => (
                deal.lat && (
                  <Marker
                    key={deal.id}
                    position={{ lat: deal.lat, lng: deal.lng }}
                    onClick={() => handleSelectDeal(deal)}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: selected?.id === deal.id ? 14 : deal.status === "active" ? 10 : 7,
                      fillColor: markerColor[deal.status] || "#888",
                      fillOpacity: 1,
                      strokeColor: selected?.id === deal.id ? "#fff" : "#000",
                      strokeWeight: selected?.id === deal.id ? 3 : 2,
                    }}
                  />
                )
              ))}
              {selected?.lat && (
                <InfoWindow
                  position={{ lat: selected.lat, lng: selected.lng }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div style={{ padding: "6px", minWidth: "160px" }}>
                    <div style={{ fontSize: "16px" }}>{selected.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#111", marginTop: "4px" }}>{selected.name}</div>
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{selected.neighborhood} · {selected.hours}</div>
                    {selected.specials?.map((s, i) => (
                      <div key={i} style={{ fontSize: "11px", color: "#1a7a4a", marginTop: "3px" }}>· {s}</div>
                    ))}
                    <div style={{
                      marginTop: "6px", fontSize: "11px", fontWeight: 700,
                      color: selected.status === "active" ? "#1a7a4a" : selected.status === "upcoming" ? "#b8860b" : "#888"
                    }}>
                      {selected.status === "active" ? "LIVE NOW" : selected.status === "upcoming" ? "STARTING SOON" : "ENDED"}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#0f1923", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "32px" }}>🗺️</div>
              <div style={{ color: "#D4A017", fontSize: "14px" }}>
                {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? "Loading map..." : "Add VITE_GOOGLE_MAPS_API_KEY to .env.local"}
              </div>
            </div>
          )}

          {/* Legend */}
          <div style={{
            position: "absolute", bottom: "16px", right: "12px",
            background: "rgba(13,13,13,0.9)", border: "1px solid rgba(212,160,23,0.25)",
            borderRadius: "10px", padding: "10px 14px", fontSize: "11px"
          }}>
            <div style={{ color: "#555", marginBottom: "6px", fontWeight: 700, letterSpacing: "0.8px" }}>LEGEND</div>
            {[
              { color: "#3DD68C", label: "Live now" },
              { color: "#F5C842", label: "Starting soon" },
              { color: "#888", label: "Ended" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                <span style={{ color: "#aaa" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(212,160,23,0.3);border-radius:4px}
      `}</style>
    </div>
  );
}