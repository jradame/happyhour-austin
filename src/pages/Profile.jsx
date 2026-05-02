import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	const initials = user?.displayName
		? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase()
		: user?.email?.charAt(0).toUpperCase() || "?";

	return (
		<div style={{
			minHeight: "calc(100vh - 60px)",
			background: "#0F1410", padding: "32px 24px"
		}}>
			<div style={{ maxWidth: "480px", margin: "0 auto" }}>

				{/* Avatar + name */}
				<div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
					<div style={{
						width: "64px", height: "64px", borderRadius: "50%",
						background: "#C9683A", display: "flex", alignItems: "center",
						justifyContent: "center", fontSize: "24px", fontWeight: 800, color: "#000"
					}}>
						{initials}
					</div>
					<div>
						<div style={{ fontSize: "20px", fontWeight: 700, color: "#F0E9D6" }}>
							{user?.displayName || "Happy Hour Regular"}
						</div>
						<div style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>
							{user?.email}
						</div>
						<div style={{
							display: "inline-flex", alignItems: "center", gap: "5px",
							background: "rgba(201,104,58,0.12)", border: "1px solid rgba(201,104,58,0.25)",
							color: "#C9683A", borderRadius: "20px", padding: "3px 10px",
							fontSize: "11px", fontWeight: 600, marginTop: "6px"
						}}>
							Austin Local
						</div>
					</div>
				</div>

				{/* Stats row */}
				<div style={{
					display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
					gap: "10px", marginBottom: "28px"
				}}>
					{[
						{ label: "Saved", value: "0" },
						{ label: "Check-ins", value: "0" },
						{ label: "Submitted", value: "0" },
					].map((stat) => (
						<div key={stat.label} style={{
							background: "#222A22", border: "1px solid rgba(201,104,58,0.2)",
							borderRadius: "10px", padding: "14px", textAlign: "center"
						}}>
							<div style={{ fontSize: "22px", fontWeight: 700, color: "#C9683A" }}>
								{stat.value}
							</div>
							<div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
								{stat.label}
							</div>
						</div>
					))}
				</div>

				{/* Saved spots */}
				<Section label="Saved Spots">
					<div style={{
						background: "#222A22", border: "1px solid rgba(201,104,58,0.2)",
						borderRadius: "10px", padding: "20px", textAlign: "center"
					}}>
						<div style={{ fontSize: "28px", marginBottom: "8px" }}>🍺</div>
						<div style={{ color: "#888", fontSize: "13px" }}>
							No saved spots yet. Hit Save on any deal to add it here.
						</div>
					</div>
				</Section>

				{/* Settings */}
				<Section label="Settings">
					<SettingsRow label="Notifications" value="On" />
					<SettingsRow label="Email digest" value="Weekly" />
					<SettingsRow label="Location" value="Austin, TX" />
				</Section>

				{/* Account */}
				<Section label="Account">
					<SettingsRow label="Member since" value={
						user?.metadata?.creationTime
							? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { month: "long", year: "numeric" })
							: "Recently"
					} />
				</Section>

				{/* Logout */}
				<button
					onClick={handleLogout}
					style={{
						width: "100%", padding: "12px", background: "transparent",
						border: "1px solid rgba(226,75,74,0.3)", borderRadius: "8px",
						color: "#f87171", fontSize: "14px", fontWeight: 600,
						cursor: "pointer", marginTop: "8px"
					}}
				>
					Log out
				</button>

			</div>
		</div>
	);
}

function Section({ label, children }) {
	return (
		<div style={{ marginBottom: "24px" }}>
			<div style={{
				fontSize: "11px", fontWeight: 700, color: "#C9683A",
				textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px"
			}}>
				{label}
			</div>
			{children}
		</div>
	);
}

function SettingsRow({ label, value }) {
	return (
		<div style={{
			display: "flex", justifyContent: "space-between", alignItems: "center",
			background: "#222A22", border: "1px solid rgba(201,104,58,0.2)",
			borderRadius: "10px", padding: "13px 16px", marginBottom: "8px"
		}}>
			<span style={{ fontSize: "14px", color: "#F0E9D6" }}>{label}</span>
			<span style={{ fontSize: "13px", color: "#888" }}>{value}</span>
		</div>
	);
}