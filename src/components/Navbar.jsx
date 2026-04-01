import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav style={{
      background: "#161616",
      borderBottom: "1px solid rgba(212,160,23,0.25)",
      padding: "0 24px",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      flexShrink: 0,
    }}>

      {/* LEFT -- brand */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <span style={{ fontSize: "20px", fontWeight: 800, color: "#F5C842", letterSpacing: "-0.5px" }}>HappyHour</span>
        <span style={{ fontSize: "12px", color: "#888", marginLeft: "6px", fontWeight: 400 }}>AUSTIN</span>
      </Link>

      {/* RIGHT -- nav */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link to="/about" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>About</Link>
        <Link to="/contact" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>Contact</Link>

        {user ? (
          <>
            <Link to="/profile" style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#D4A017", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px", color: "#000", textDecoration: "none" }}>
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </Link>
            <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid rgba(212,160,23,0.3)", color: "#888", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", cursor: "pointer" }}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>Sign In</Link>
            <Link to="/signup" style={{ background: "#D4A017", color: "#000", padding: "7px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}