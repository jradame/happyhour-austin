import { useState, useCallback, useMemo } from "react";
import { theme } from "../theme";
import { useDeals } from "../hooks/useDeals";
import { SEED_DEALS } from "../data/seedDeals";
import { NEIGHBORHOODS, NEIGHBORHOOD_COORDS, STATUS_COLORS, matchesFilter } from "../data/mapConfig";
import FilterBar from "../components/FilterBar";
import BarList from "../components/BarList";
import BarDetail from "../components/BarDetail";
import MapView from "../components/MapView";

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [activeDay, setActiveDay] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [map, setMap] = useState(null);
  const [mobileView, setMobileView] = useState("map");

  const { deals: userDeals } = useDeals();
  const allDeals = useMemo(() => [...SEED_DEALS, ...userDeals], [userDeals]);

  const filtered = useMemo(() => {
    return allDeals.filter((d) => {
      if (!matchesFilter(d, filter)) return false;
      if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.neighborhood.toLowerCase().includes(search.toLowerCase()) && !d.specials?.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
      if (activeDay !== "all" && d.days && !d.days.includes(activeDay)) return false;
      return true;
    });
  }, [allDeals, filter, search, activeDay]);

  const activeCount = filtered.filter(d => d.status === "active").length;
  const onMapLoad = useCallback((m) => setMap(m), []);

  const pick = (deal) => {
    setSelected(deal);
    if (map && deal.lat) {
      map.panTo({ lat: deal.lat, lng: deal.lng });
      map.setZoom(15);
    }
    if (mobileView === "list") setMobileView("map");
  };

  const MobileSearchHeader = () => (
    <div style={{ padding: "10px 12px", borderBottom: `1px solid ${theme.border}`, background: theme.bg, flexShrink: 0 }}>
      <SearchBox value={search} onChange={setSearch} />
      <FilterBar filter={filter} setFilter={setFilter} activeDay={activeDay} setActiveDay={setActiveDay} />
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
        .bar-list::-webkit-scrollbar-thumb { background:${theme.borderStrong}; border-radius:4px; }
        .bar-list { scrollbar-width:thin; scrollbar-color:${theme.borderStrong} transparent; }
        .hh-right::-webkit-scrollbar { width:6px; }
        .hh-right::-webkit-scrollbar-track { background:rgba(255,255,255,0.03); }
        .hh-right::-webkit-scrollbar-thumb { background:${theme.borderMid}; border-radius:4px; }
        .hh-right { scrollbar-width:thin; scrollbar-color:${theme.borderMid} transparent; }
        .hh-root { display:flex; flex-direction:column; height:calc(100svh - 60px); overflow:hidden; background:${theme.bg}; }
        .hh-body { display:flex; flex:1; overflow:hidden; min-height:0; }
        .hh-left { width:400px; flex-shrink:0; display:flex; flex-direction:column; border-right:1px solid ${theme.border}; overflow:hidden; }
        .hh-right { flex:1; min-width:0; display:flex; flex-direction:column; overflow-y:scroll; overflow-x:hidden; }
        .hh-footer { background:${theme.surface}; border-top:1px solid ${theme.borderMid}; height:56px; display:grid; grid-template-columns:1fr 1fr 1fr; align-items:center; padding:0 24px; flex-shrink:0; }
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
          <div className="hh-left desktop-only" style={{ flexDirection: "column" }}>
            <div style={{ padding: "14px 12px 12px", borderBottom: `1px solid ${theme.border}`, flexShrink: 0, background: theme.bg }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <LiveBadge count={activeCount} />
                <span style={{ fontSize: "11px", color: theme.textFaint }}>{filtered.length} spots</span>
              </div>
              <FilterBar filter={filter} setFilter={setFilter} activeDay={activeDay} setActiveDay={setActiveDay} />
            </div>
            <div className="bar-list" style={{ flex: 1, overflowY: "scroll", padding: "8px 10px" }}>
              <BarList deals={filtered} selected={selected} onSelect={pick} compact />
            </div>
            <SubmitFooter />
          </div>
          <div className="hh-right desktop-only" style={{ flexDirection: "column", background: theme.bg }}>
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${theme.border}`, background: theme.bg, position: "sticky", top: 0, zIndex: 10 }}>
              <SearchBox value={search} onChange={setSearch} />
              <NeighborhoodPills search={search} setSearch={setSearch} map={map} />
            </div>
            <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
              <MapView deals={filtered} selected={selected} onSelect={pick} onMapLoad={onMapLoad} />
              {!selected && <MapLegend />}
              {selected && <BarDetail deal={selected} onClose={() => setSelected(null)} />}
            </div>
          </div>
          <div className="mobile-only" style={{ flex: 1, flexDirection: "column", overflow: "hidden", background: theme.bg, minHeight: 0 }}>
            {mobileView === "map" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <MobileSearchHeader />
                <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
                  <MapView deals={filtered} selected={selected} onSelect={pick} onMapLoad={onMapLoad} />
                  {selected && <BarDetail deal={selected} onClose={() => setSelected(null)} />}
                </div>
              </div>
            )}
            {mobileView === "list" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                <MobileSearchHeader />
                <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 4px 10px" }}>
                    <LiveBadge count={activeCount} />
                    <span style={{ fontSize: "11px", color: theme.textFaint }}>{filtered.length} spots</span>
                  </div>
                  <BarList deals={filtered} selected={selected} onSelect={pick} />
                  <SubmitInline />
                </div>
              </div>
            )}
            <div style={{ flexShrink: 0, background: theme.surface, borderTop: `1px solid ${theme.borderStrong}`, padding: "10px 16px", display: "flex", gap: "10px" }}>
              <MobileTabButton active={mobileView === "map"} onClick={() => setMobileView("map")}>Map</MobileTabButton>
              <MobileTabButton active={mobileView === "list"} onClick={() => setMobileView("list")}>List ({filtered.length})</MobileTabButton>
            </div>
          </div>
        </div>
        <div className="hh-footer desktop-only" style={{ display: "grid" }}>
          <div><span style={{ fontSize: "15px", fontWeight: 800, color: theme.primary }}>HappyHour Austin</span></div>
          <div style={{ textAlign: "center" }}><span style={{ fontSize: "12px", color: theme.textFaint }}>Austin's best drink deals, live. &nbsp; © 2026 Created by Justin Adame</span></div>
          <div style={{ textAlign: "right" }}><span style={{ fontSize: "12px", color: theme.textGhost, fontStyle: "italic" }}>Drink responsibly.</span></div>
        </div>
      </div>
    </>
  );
}

function SearchBox({ value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", background: theme.surface, border: `1px solid ${theme.borderMid}`, borderRadius: "8px", padding: "8px 12px", marginBottom: "9px" }}>
      <span style={{ color: theme.textFaint, fontSize: "14px" }}>⌕</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder="Search neighborhoods or bar names..." style={{ background: "transparent", border: "none", color: theme.text, fontSize: "13px", flex: 1, outline: "none" }} />
      {value && <span onClick={() => onChange("")} style={{ color: theme.textFaint, cursor: "pointer" }}>✕</span>}
    </div>
  );
}

function NeighborhoodPills({ search, setSearch, map }) {
  return (
    <div className="pill-row">
      {NEIGHBORHOODS.map(n => {
        const active = search === n;
        return (
          <span key={n} onClick={() => { setSearch(n); const c = NEIGHBORHOOD_COORDS[n]; if (c && map) { map.panTo(c); map.setZoom(14); } }} style={{ padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, cursor: "pointer", flexShrink: 0, background: active ? theme.primaryAlpha20 : theme.primaryAlpha10, border: `1px solid ${active ? theme.primary : theme.borderMid}`, color: active ? theme.primary : theme.textDim }}>{n}</span>
        );
      })}
    </div>
  );
}

function LiveBadge({ count }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: theme.liveAlpha15, border: `1px solid ${theme.liveAlpha25}`, color: theme.live, borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: 700 }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: theme.live, display: "inline-block", animation: "pulse 1.5s infinite" }} />
      {count} live now
    </div>
  );
}

function MapLegend() {
  const items = [
    { color: STATUS_COLORS.active, label: "Live" },
    { color: STATUS_COLORS.upcoming, label: "Soon" },
    { color: STATUS_COLORS.ended, label: "Ended" },
  ];
  return (
    <div style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(15,20,16,0.92)", border: `1px solid ${theme.borderMid}`, borderRadius: "8px", padding: "8px 12px" }}>
      <div style={{ color: theme.textFaint, marginBottom: "4px", fontWeight: 700, fontSize: "9px", letterSpacing: "0.8px" }}>LEGEND</div>
      {items.map(item => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.color }} />
          <span style={{ color: theme.textMuted, fontSize: "10px" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function SubmitFooter() {
  return (
    <div style={{ padding: "11px 12px", borderTop: `1px solid ${theme.border}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", background: theme.bg }}>
      <span style={{ fontSize: "12px", color: theme.textFaint }}>Know a deal we're missing?</span>
      <a href="/submit" style={{ padding: "7px 14px", background: theme.primary, color: theme.primaryDark, borderRadius: "8px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>+ Submit</a>
    </div>
  );
}

function SubmitInline() {
  return (
    <div style={{ padding: "16px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "13px", color: theme.textFaint }}>Know a deal we're missing?</span>
      <a href="/submit" style={{ padding: "8px 16px", background: theme.primary, color: theme.primaryDark, borderRadius: "8px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>+ Submit</a>
    </div>
  );
}

function MobileTabButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px", background: active ? theme.primary : theme.primaryAlpha10, color: active ? theme.primaryDark : theme.textDim }}>{children}</button>
  );
}
