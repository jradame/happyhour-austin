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
        background: "#161616",
        borderBottom: "1px solid rgba(212,160,23,0.25)",
        padding: "0 20px",
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
          <span style={{ fontSize: "20px", fontWeight: 800, color: "#F5C842", letterSpacing: "-0.5px" }}>HappyHour</span>
          <span style={{ fontSize: "12px", color: "#888", marginLeft: "6px", fontWeight: 400 }}>AUSTIN</span>
        </Link>

        {/* Hamburger button */}
        <button
          onClick={() => setOpen(!open)}
          style={{ background: "transparent", border: "1px solid rgba(212,160,23,0.25)", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "5px", alignItems: "center", justifyContent: "center" }}
        >
          <span style={{ display: "block", width: "20px", height: "2px", background: open ? "#D4A017" : "#888", borderRadius: "2px", transition: "all 0.2s", transform: open ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ display: "block", width: "20px", height: "2px", background: open ? "#D4A017" : "#888", borderRadius: "2px", transition: "all 0.2s", opacity: open ? 0 : 1 }} />
          <span style={{ display: "block", width: "20px", height: "2px", background: open ? "#D4A017" : "#888", borderRadius: "2px", transition: "all 0.2s", transform: open ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </nav>

      {/* Dropdown menu */}
      {open && (
        <>
          {/* Backdrop */}
          <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(0,0,0,0.5)" }} />

          {/* Menu panel */}
          <div style={{
            position: "fixed",
            top: "60px",
            right: 0,
            width: "260px",
            background: "#161616",
            borderLeft: "1px solid rgba(212,160,23,0.2)",
            borderBottom: "1px solid rgba(212,160,23,0.2)",
            borderRadius: "0 0 0 14px",
            zIndex: 200,
            padding: "8px 0",
            animation: "slideDown 0.2s ease",
          }}>
            <MenuItem to="/" label="Home" onClick={close} />
            <MenuItem to="/about" label="About" onClick={close} />
            <MenuItem to="/contact" label="Contact" onClick={close} />

            <div style={{ height: "1px", background: "rgba(212,160,23,0.1)", margin: "8px 0" }} />

            {user ? (
              <>
                <MenuItem to="/profile" label={`Profile (${user.displayName || user.email?.split("@")[0]})`} onClick={close} />
                <MenuItem to="/submit" label="+ Submit a Deal" onClick={close} gold />
                <button onClick={handleLogout} style={{ width: "100%", textAlign: "left", padding: "13px 20px", background: "transparent", border: "none", color: "#888", fontSize: "14px", cursor: "pointer" }}>
                  Log out
                </button>
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
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </>
  );
}

function MenuItem({ to, label, onClick, gold }) {
  return (
    <Link to={to} onClick={onClick} style={{
      display: "block",
      padding: "13px 20px",
      fontSize: "14px",
      fontWeight: gold ? 700 : 400,
      color: gold ? "#D4A017" : "#C0B89A",
      textDecoration: "none",
      borderLeft: gold ? "2px solid #D4A017" : "2px solid transparent",
      transition: "all 0.15s",
    }}>
      {label}
    </Link>
  );
}