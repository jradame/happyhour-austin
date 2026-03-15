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

// fallback seed data until Firestore is wired up
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
];

const markerColor = { active: "#3DD68C", upcoming: "#F5C842", ended: "#888888" };

export default function Home() {
	const [filter, setFilter] = useState("all");
	const [selected, setSelected] = useState(null);
	const [map, setMap] = useState(null);
	const [search, setSearch] = useState("");

	const { deals: firestoreDeals, loading } = useDeals();
	const deals = firestoreDeals.length > 0 ? firestoreDeals : SEED_DEALS;

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
	});

	const onMapLoad = useCallback((mapInstance) => setMap(mapInstance), []);

	const filteredDeals = deals.filter((d) => {
		const matchesFilter =
			filter === "all" ? true :
				filter === "active" ? d.status === "active" :
					filter === "beer" ? d.specials?.some(s => s.toLowerCase().includes("beer") || s.toLowerCase().includes("draft") || s.toLowerCase().includes("lager") || s.toLowerCase().includes("shiner") || s.toLowerCase().includes("pbr")) :
						filter === "cocktails" ? d.specials?.some(s => s.toLowerCase().includes("cocktail") || s.toLowerCase().includes("margarita") || s.toLowerCase().includes("well")) :
							filter === "food" ? d.specials?.some(s => s.toLowerCase().includes("app") || s.toLowerCase().includes("nacho") || s.toLowerCase().includes("taco") || s.toLowerCase().includes("food")) :
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
		if (map && deal.lat) {
			map.panTo({ lat: deal.lat, lng: deal.lng });
			map.setZoom(15);
		}
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>

			{/* Map */}
			<div style={{ height: "45%", position: "relative" }}>
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
									onClick={() => setSelected(deal)}
									icon={{
										path: window.google.maps.SymbolPath.CIRCLE,
										scale: deal.status === "active" ? 10 : 7,
										fillColor: markerColor[deal.status] || "#888",
										fillOpacity: 1,
										strokeColor: "#000",
										strokeWeight: 2,
									}}
								/>
							)
						))}
						{selected && selected.lat && (
							<InfoWindow
								position={{ lat: selected.lat, lng: selected.lng }}
								onCloseClick={() => setSelected(null)}
							>
								<div style={{ background: "#1E1E1E", padding: "8px", borderRadius: "8px", minWidth: "160px" }}>
									<div style={{ fontWeight: 700, fontSize: "14px", color: "#F0EDE6" }}>{selected.name}</div>
									<div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{selected.neighborhood}</div>
									<div style={{ fontSize: "12px", color: "#F5C842", marginTop: "4px" }}>{selected.hours}</div>
								</div>
							</InfoWindow>
						)}
					</GoogleMap>
				) : (
					<div style={{
						width: "100%", height: "100%", background: "#0f1923",
						display: "flex", alignItems: "center", justifyContent: "center",
						color: "#D4A017", fontSize: "14px"
					}}>
						{import.meta.env.VITE_GOOGLE_MAPS_API_KEY
							? "Loading map..."
							: "Add VITE_GOOGLE_MAPS_API_KEY to .env.local to enable map"}
					</div>
				)}
			</div>

			{/* Live badge + search */}
			<div style={{ padding: "12px 16px 8px", background: "#0D0D0D" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
					<div style={{
						display: "inline-flex", alignItems: "center", gap: "6px",
						background: "rgba(61,214,140,0.12)", border: "1px solid rgba(61,214,140,0.25)",
						color: "#3DD68C", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: 700
					}}>
						<span style={{
							width: "6px", height: "6px", borderRadius: "50%",
							background: "#3DD68C", display: "inline-block",
							animation: "pulse 1.5s infinite"
						}} />
						{activeCount} live now
					</div>
					<span style={{ fontSize: "12px", color: "#555" }}>Updated live</span>
				</div>

				{/* Search */}
				<div style={{
					display: "flex", alignItems: "center", gap: "8px",
					background: "#111", border: "1px solid rgba(212,160,23,0.2)",
					borderRadius: "10px", padding: "8px 14px", marginBottom: "10px"
				}}>
					<span style={{ color: "#555", fontSize: "14px" }}>⌕</span>
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search bars, deals, neighborhoods..."
						style={{
							background: "transparent", border: "none", color: "#F0EDE6",
							fontSize: "13px", flex: 1, outline: "none"
						}}
					/>
				</div>

				<FilterBar active={filter} onChange={setFilter} />
			</div>

			{/* Deals list */}
			<div style={{ flex: 1, overflowY: "auto", padding: "10px 16px" }}>
				{filteredDeals.length === 0 ? (
					<div style={{ textAlign: "center", color: "#555", padding: "40px 0", fontSize: "14px" }}>
						No deals match that filter right now.
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

			<style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
		</div>
	);
}