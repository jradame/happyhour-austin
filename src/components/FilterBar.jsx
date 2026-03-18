export default function FilterBar({ active, onChange, activeDay, onDayChange }) {
  const filters = [
    { id: "all", label: "All" },
    { id: "active", label: "Live Now" },
    { id: "beer", label: "Beer" },
    { id: "cocktails", label: "Cocktails" },
    { id: "food", label: "Food" },
    { id: "dive", label: "Dive Bars" },
    { id: "rooftop", label: "Rooftop" },
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const pillStyle = (isActive, color = "#D4A017") => ({
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    cursor: "pointer",
    border: "1px solid",
    background: isActive ? color : "transparent",
    color: isActive ? "#000" : "#888",
    borderColor: isActive ? color : "rgba(212,160,23,0.25)",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Type filters */}
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", scrollbarWidth: "none" }}>
        {filters.map((f) => (
          <button key={f.id} onClick={() => onChange(f.id)} style={pillStyle(active === f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Day filters */}
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", scrollbarWidth: "none" }}>
        <button onClick={() => onDayChange("all")} style={pillStyle(activeDay === "all", "#3DD68C")}>
          Every Day
        </button>
        {days.map((day) => (
          <button key={day} onClick={() => onDayChange(day)} style={pillStyle(activeDay === day, "#3DD68C")}>
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}