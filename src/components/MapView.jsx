import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { theme } from "../theme";
import { AUSTIN_CENTER, mapStyles, STATUS_COLORS } from "../data/mapConfig";

export default function MapView({ deals, selected, onSelect, onMapLoad }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  if (!isLoaded) {
    return (
      <div style={{ width: "100%", height: "100%", background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
        <div style={{ fontSize: "32px" }}>🗺️</div>
        <div style={{ color: theme.primary, fontSize: "12px" }}>Map loading...</div>
      </div>
    );
  }

  const center = selected ? { lat: selected.lat, lng: selected.lng } : AUSTIN_CENTER;
  const zoom = selected ? 15 : 13;

  return (
    <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={center} zoom={zoom} options={{ styles: mapStyles, disableDefaultUI: true, zoomControl: true }} onLoad={onMapLoad}>
      {deals.map((deal) => {
        if (!deal.lat) return null;
        const isSelected = selected?.id === deal.id;
        return (
          <Marker key={deal.id} position={{ lat: deal.lat, lng: deal.lng }} onClick={() => onSelect(deal)} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: isSelected ? 14 : deal.status === "active" ? 10 : 7, fillColor: STATUS_COLORS[deal.status] || theme.ended, fillOpacity: 1, strokeColor: isSelected ? "#fff" : "#000", strokeWeight: isSelected ? 3 : 2 }} />
        );
      })}
    </GoogleMap>
  );
}
