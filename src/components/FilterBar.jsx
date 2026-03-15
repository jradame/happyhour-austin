export default function FilterBar({ active, onChange }) {
	const filters = [
		{ id: "all", label: "All" },
		{ id: "active", label: "Live Now" },
		{ id: "beer", label: "Beer" },
		{ id: "cocktails", label: "Cocktails" },
		{ id: "food", label: "Food" },
		{ id: "dive", label: "Dive Bars" },
		{ id: "rooftop", label: "Rooftop" },
		{ id: "brunch", label: "Brunch" },
	];

	return (
		<div style={{
			display: "flex", gap: "6px", overflowX: "auto",
			padding: "0 16px", scrollbarWidth: "none",
			msOverflowStyle: "none",
		}}>
			{filters.map((f) => (
				<button
					key={f.id}
					onClick={() => onChange(f.id)}
					style={{
						padding: "6px 14px", borderRadius: "20px",
						fontSize: "12px", fontWeight: 600,
						whiteSpace: "nowrap", cursor: "pointer",
						border: "1px solid",
						transition: "all 0.15s",
						background: active === f.id ? "#D4A017" : "transparent",
						color: active === f.id ? "#000" : "#888",
						borderColor: active === f.id ? "#D4A017" : "rgba(212,160,23,0.25)",
					}}
				>
					{f.label}
				</button>
			))}
		</div>
	);
}