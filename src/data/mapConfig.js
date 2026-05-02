// Map styles, neighborhoods, photo lookup, and color config
// Edit map look here, add neighborhoods, swap bar photos.

export const AUSTIN_CENTER = { lat: 30.2672, lng: -97.7431 };

// Dark map theme matching Live Oak palette
export const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#0F1410" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8A9485" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0F1410" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1F261F" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#2A322A" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#333" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#080808" }],
  },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#C9683A" }],
  },
];

// Marker color by status
export const STATUS_COLORS = {
  active: "#8FB996", // sage - live
  upcoming: "#C9683A", // copper - soon
  ended: "#666",
};

// Bar photos keyed by emoji icon
export const BAR_PHOTOS = {
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

export const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1546622891-02c72c1537b6?w=800&q=80";

// Neighborhood quick-jump pills
export const NEIGHBORHOODS = [
  "6th Street",
  "Rainey Street",
  "Red River",
  "East Austin",
  "East 6th",
  "West Campus",
  "Downtown",
  "South Congress",
  "South Lamar",
  "South Shore",
  "South Austin",
  "Clarksville",
  "West 6th",
];

export const NEIGHBORHOOD_COORDS = {
  "6th Street": { lat: 30.2685, lng: -97.7398 },
  "Rainey Street": { lat: 30.2585, lng: -97.7388 },
  "Red River": { lat: 30.2677, lng: -97.7362 },
  "East Austin": { lat: 30.2641, lng: -97.7198 },
  "East 6th": { lat: 30.2625, lng: -97.7195 },
  "West Campus": { lat: 30.2881, lng: -97.7401 },
  Downtown: { lat: 30.2658, lng: -97.7452 },
  "South Congress": { lat: 30.2499, lng: -97.7502 },
  "South Lamar": { lat: 30.2545, lng: -97.7848 },
  "South Shore": { lat: 30.2295, lng: -97.7244 },
  "South Austin": { lat: 30.1761, lng: -97.8423 },
  Clarksville: { lat: 30.2771, lng: -97.7558 },
  "West 6th": { lat: 30.2745, lng: -97.7515 },
};

// Filter options
export const TYPE_FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Live Now" },
  { id: "beer", label: "Beer" },
  { id: "cocktails", label: "Cocktails" },
  { id: "food", label: "Food" },
  { id: "dive", label: "Dive Bars" },
  { id: "rooftop", label: "Rooftop" },
];

export const DAY_FILTERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Filter logic - takes a deal and the current filter ID, returns true if it matches
export function matchesFilter(deal, filter) {
  if (filter === "all") return true;
  if (filter === "active") return deal.status === "active";

  const keywords = {
    beer: ["beer", "draft", "shiner", "pbr", "lager", "pint"],
    cocktails: ["cocktail", "margarita", "well", "frozen", "spritz"],
    food: [
      "app",
      "nacho",
      "taco",
      "pizza",
      "food",
      "burger",
      "oyster",
      "snack",
    ],
  };

  if (!keywords[filter]) return true;
  return deal.specials?.some((s) =>
    keywords[filter].some((k) => s.toLowerCase().includes(k)),
  );
}
