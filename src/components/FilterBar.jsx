import { theme } from "../theme";
import { TYPE_FILTERS, DAY_FILTERS } from "../data/mapConfig";

// Pill button used for both type and day filters
function Pill({ active, label, onClick, color = theme.primary }) {
	return (
		<button
			onClick={onClick}
			style={{
				padding: "5px 11px",
				borderRadius: "20px",
				fontSize: "11px",
				fontWeight: 600,
				whiteSpace: "nowrap",
				cursor: "pointer",
				border: "1px solid",
				flexShrink: 0,
				background: active ? color : "transparent",
				color: active ? (color === theme.live ? theme.liveDark : theme.primaryDark) : theme.textMuted,
				borderColor: active ? color : theme.borderMid,
			}}
		>
			{label}
		</button>
	);
}

export default function FilterBar({ filter, setFilter, activeDay, setActiveDay }) {
	return (
		<>
			{/* Type filter row */}
			<div className="pill-row" style={{ marginBottom: "7px" }}>
				{TYPE_FILTERS.map(f => (
					<Pill
						key={f.id}
						active={filter === f.id}
						label={f.label}
						onClick={() => setFilter(f.id)}
					/>
				))}
			</div>

			{/* Day filter row */}
			<div className="pill-row">
				<Pill
					active={activeDay === "all"}
					label="Every Day"
					onClick={() => setActiveDay("all")}
					color={theme.live}
				/>
				{DAY_FILTERS.map(d => (
					<Pill
						key={d}
						active={activeDay === d}
						label={d}
						onClick={() => setActiveDay(d)}
						color={theme.live}
					/>
				))}
			</div>
		</>
	);
}