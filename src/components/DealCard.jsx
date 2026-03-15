import { useState } from "react";

export default function DealCard({ deal, featured = false, onSelect }) {
	const [saved, setSaved] = useState(false);

	const statusColor = {
		active: "#3DD68C",
		upcoming: "#F5C842",
		ended: "#888888",
	};

	const statusLabel = {
		active: "LIVE",
		upcoming: "SOON",
		ended: "ENDED",
	};

	const getTimeLeft = () => {
		if (!deal.endsAt) return null;
		const now = new Date();
		const end = deal.endsAt.toDate ? deal.endsAt.toDate() : new Date(deal.endsAt);
		const diff = Math.floor((end - now) / 1000);
		if (diff <= 0) return null;
		const h = Math.floor(diff / 3600);
		const m = Math.floor((diff % 3600) / 60);
		const s = diff % 60;
		return h > 0
			? `${h}h ${m}m left`
			: `${m}m ${String(s).padStart(2, "0")}s left`;
	};

	return (
		<div
			onClick={() => onSelect && onSelect(deal)}
			style={{
				background: featured ? "rgba(212,160,23,0.06)" : "#1E1E1E",
				border: `1px solid ${featured ? "#D4A017" : "rgba(212,160,23,0.2)"}`,
				borderRadius: "12px",
				padding: "14px 16px",
				display: "flex",
				gap: "14px",
				alignItems: "flex-start",
				cursor: "pointer",
				transition: "border-color 0.15s",
				marginBottom: "10px",
			}}
		>
			{/* Icon */}
			<div style={{
				width: "42px", height: "42px", borderRadius: "10px",
				background: "rgba(212,160,23,0.12)", display: "flex",
				alignItems: "center", justifyContent: "center",
				fontSize: "20px", flexShrink: 0
			}}>
				{deal.icon || "🍺"}
			</div>

			{/* Body */}
			<div style={{ flex: 1, minWidth: 0 }}>
				<div style={{ fontSize: "14px", fontWeight: 700, color: "#F0EDE6" }}>
					{deal.name}
				</div>
				<div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>
					{deal.neighborhood}
				</div>

				{/* Specials tags */}
				<div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}>
					{deal.specials && deal.specials.map((s, i) => (
						<span key={i} style={{
							fontSize: "10px", padding: "3px 8px", borderRadius: "20px",
							fontWeight: 600,
							background: i === 0 ? "rgba(212,160,23,0.15)" : "rgba(61,214,140,0.1)",
							color: i === 0 ? "#F5C842" : "#3DD68C",
						}}>
							{s}
						</span>
					))}
				</div>
			</div>

			{/* Meta */}
			<div style={{ textAlign: "right", flexShrink: 0 }}>
				<div style={{
					fontSize: "11px", fontWeight: 700,
					color: statusColor[deal.status] || "#888"
				}}>
					{statusLabel[deal.status] || "—"}
				</div>
				<div style={{ fontSize: "11px", color: "#888", marginTop: "3px" }}>
					{deal.hours}
				</div>
				{deal.status === "active" && (
					<div style={{
						fontSize: "12px", fontWeight: 700,
						color: "#F5C842", marginTop: "6px",
						fontVariantNumeric: "tabular-nums"
					}}>
						{getTimeLeft()}
					</div>
				)}
				<button
					onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
					style={{
						marginTop: "8px", fontSize: "11px",
						background: saved ? "rgba(212,160,23,0.15)" : "transparent",
						border: "1px solid rgba(212,160,23,0.25)",
						color: saved ? "#F5C842" : "#888",
						borderRadius: "6px", padding: "3px 8px", cursor: "pointer"
					}}
				>
					{saved ? "Saved" : "Save"}
				</button>
			</div>
		</div>
	);
}