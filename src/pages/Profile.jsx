import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";

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

  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: theme.bg, padding: "32px 24px" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>

        {/* Avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, color: theme.primaryDark }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: theme.text }}>
              {user?.displayName || "Happy Hour Regular"}
            </div>
            <div style={{ fontSize: "13px", color: theme.textDim, marginTop: "2px" }}>
              {user?.email}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: theme.primaryAlpha10, border: `1px solid ${theme.primaryAlpha20}`, color: theme.primary, borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: 600, marginTop: "8px" }}>
              Austin Local
            </div>
          </div>
        </div>

        {/* Account info */}
        <div style={{ background: theme.surfaceHover, border: `1px solid ${theme.borderMid}`, borderRadius: "10px", padding: "16px 18px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: theme.textDim }}>Member since</span>
          <span style={{ fontSize: "13px", color: theme.text, fontWeight: 500 }}>{memberSince}</span>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{ width: "100%", padding: "12px", background: "transparent", border: `1px solid ${theme.errorBorder}`, borderRadius: "8px", color: theme.error, fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
          Log out
        </button>
      </div>
    </div>
  );
}
