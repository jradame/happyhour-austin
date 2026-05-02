import { theme } from "../theme";
import { STATUS_COLORS } from "../data/mapConfig";

// Used in both desktop sidebar and mobile list view
// `compact` prop = desktop mode (smaller, single line preview)
export default function BarList({ deals, selected, onSelect, compact = false }) {
	if (deals.length === 0) {
		return (
			<div style={{ color: theme.textFaint, fontSize: "13px", padding: "16px 8px" }}>
				No deals match.
			</div>
		);
	}

	return (
		<>
			{deals.map((deal) => {
				const isSelected = selected?.id === deal.id;
				const statusColor = STATUS_COLORS[deal.status] || theme.ended;
				const statusLabel = deal.status === "active" ? "LIVE" : deal.status === "upcoming" ? "SOON" : "ENDED";

				return (
					<div
						key={deal.id}
						onClick={() => onSelect(deal)}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
							padding: compact ? "11px 12px" : "13px 12px",
							borderRadius: "10px",
							cursor: "pointer",
							marginBottom: compact ? "4px" : "6px",
							background: isSelected ? theme.primaryAlpha10 : (compact ? "transparent" : theme.surface),
							border: `1px solid ${isSelected ? theme.borderStrong : theme.border}`,
							transition: "all 0.15s",
						}}
					>
						<span style={{ fontSize: compact ? "20px" : "22px", flexShrink: 0 }}>
							{deal.icon}
						</span>

						<div style={{ flex: 1, minWidth: 0 }}>
							{/* Top row: name + status */}
							<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
								<div
									style={{
										fontSize: compact ? "13px" : "14px",
										fontWeight: 700,
										color: theme.text,
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
									}}
								>
									{deal.name}
								</div>
								<span style={{ fontSize: "10px", fontWeight: 700, color: statusColor, flexShrink: 0 }}>
									{statusLabel}
								</span>
							</div>

							{/* Meta row: neighborhood + hours */}
							<div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
								<span style={{ fontSize: compact ? "11px" : "12px", color: theme.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
									{deal.neighborhood}
								</span>
								<span style={{ fontSize: compact ? "11px" : "12px", color: theme.primary, flexShrink: 0, fontWeight: 600 }}>
									{deal.hours}
								</span>
							</div>

							{/* Specials preview - only on mobile (non-compact) */}
							{!compact && deal.specials && (
								<div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "6px" }}>
									{deal.specials.slice(0, 2).map((s, i) => (
										<span
											key={i}
											style={{
												fontSize: "10px",
												padding: "2px 8px",
												borderRadius: "20px",
												background: i === 0 ? theme.primaryAlpha10 : theme.liveAlpha15,
												color: i === 0 ? theme.primary : theme.live,
												border: `1px solid ${i === 0 ? theme.borderMid : theme.liveAlpha35}`,
											}}
										>
											{s}
										</span>
									))}
								</div>
							)}
						</div>
					</div>
				);
			})}
		</>
	);
}