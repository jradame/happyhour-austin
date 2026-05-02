import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  const close = () => setOpen(false);

  return (
    <>
      <nav style={{
        background: "#1A201A",
        borderBottom: "1px solid rgba(201,104,58,0.25)",
        padding: "0 24px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 200,
        flexShrink: 0,
      }}>
        {/* Brand */}
        <Link to="/" onClick={close} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: "20px", fontWeight: 800, color: "#C9683A", letterSpacing: "-0.5px" }}>HappyHour</span>
          <span style={{ fontSize: "12px", color: "#888", marginLeft: "6px", fontWeight: 400 }}>AUSTIN</span>
        </Link>

        {/* DESKTOP nav -- hidden on mobile */}
        <div className="nav-desktop">
          <Link to="/about" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>About</Link>
          <Link to="/contact" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>Contact</Link>
          {user ? (
            <>
              <Link to="/profile" style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#C9683A", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px", color: "#000", textDecoration: "none" }}>
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </Link>
              <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid rgba(201,104,58,0.3)", color: "#888", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", cursor: "pointer" }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>Sign In</Link>
              <Link to="/signup" style={{ background: "#C9683A", color: "#000", padding: "7px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>Sign Up</Link>
            </>
          )}
        </div>

        {/* MOBILE hamburger -- hidden on desktop */}
        <button
          className="nav-hamburger"
          onClick={() => setOpen(!open)}
          style={{ background: "transparent", border: "1px solid rgba(201,104,58,0.25)", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", flexDirection: "column", gap: "5px", alignItems: "center", justifyContent: "center" }}
        >
          <span style={{ display: "block", width: "20px", height: "2px", background: open ? "#C9683A" : "#888", borderRadius: "2px", transition: "all 0.2s", transform: open ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ display: "block", width: "20px", height: "2px", background: open ? "#C9683A" : "#888", borderRadius: "2px", transition: "all 0.2s", opacity: open ? 0 : 1 }} />
          <span style={{ display: "block", width: "20px", height: "2px", background: open ? "#C9683A" : "#888", borderRadius: "2px", transition: "all 0.2s", transform: open ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </nav>

      {/* MOBILE dropdown */}
      {open && (
        <>
          <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(0,0,0,0.5)" }} />
          <div style={{ position: "fixed", top: "60px", right: 0, width: "260px", background: "#1A201A", borderLeft: "1px solid rgba(201,104,58,0.2)", borderBottom: "1px solid rgba(201,104,58,0.2)", borderRadius: "0 0 0 14px", zIndex: 200, padding: "8px 0", animation: "slideDown 0.2s ease" }}>
            <MenuItem to="/" label="Home" onClick={close} />
            <MenuItem to="/about" label="About" onClick={close} />
            <MenuItem to="/contact" label="Contact" onClick={close} />
            <div style={{ height: "1px", background: "rgba(201,104,58,0.1)", margin: "8px 0" }} />
            {user ? (
              <>
                <MenuItem to="/profile" label={`Profile (${user.displayName || user.email?.split("@")[0]})`} onClick={close} />
                <MenuItem to="/submit" label="+ Submit a Deal" onClick={close} gold />
                <button onClick={handleLogout} style={{ width: "100%", textAlign: "left", padding: "13px 20px", background: "transparent", border: "none", color: "#888", fontSize: "14px", cursor: "pointer" }}>Log out</button>
              </>
            ) : (
              <>
                <MenuItem to="/login" label="Sign In" onClick={close} />
                <MenuItem to="/signup" label="Sign Up" onClick={close} gold />
              </>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .nav-desktop { display: flex; align-items: center; gap: 12px; }
        .nav-hamburger { display: none !important; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function MenuItem({ to, label, onClick, gold }) {
  return (
    <Link to={to} onClick={onClick} style={{ display: "block", padding: "13px 20px", fontSize: "14px", fontWeight: gold ? 700 : 400, color: gold ? "#C9683A" : "#C0B89A", textDecoration: "none", borderLeft: gold ? "2px solid #C9683A" : "2px solid transparent" }}>
      {label}
    </Link>
  );
}