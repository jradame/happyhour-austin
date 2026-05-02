import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ADMIN_UID = "acPjidZ8vbYHHpJd5pAeZkZyT1i2";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [filter, setFilter] = useState("pending"); // "pending" | "approved" | "all"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.uid !== ADMIN_UID) {
      navigate("/");
      return;
    }
    const q = query(collection(db, "deals"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setDeals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [user, navigate]);

  const approve = async (id) => {
    await updateDoc(doc(db, "deals", id), { approved: true, status: "upcoming" });
  };

  const reject = async (id) => {
    await deleteDoc(doc(db, "deals", id));
  };

  const filtered = deals.filter(d => {
    if (filter === "pending") return !d.approved;
    if (filter === "approved") return d.approved;
    return true;
  });

  const pendingCount = deals.filter(d => !d.approved).length;

  if (!user || user.uid !== ADMIN_UID) return null;

  return (
    <div style={{ background: "#0F1410", minHeight: "calc(100svh - 60px)", padding: "32px 24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#C9683A", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Admin</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#C9683A", margin: 0 }}>Deal Submissions</h1>
            {pendingCount > 0 && (
              <div style={{ background: "rgba(143,185,150,0.12)", border: "1px solid rgba(143,185,150,0.3)", color: "#8FB996", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", fontWeight: 700 }}>
                {pendingCount} pending review
              </div>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
          {[
            { id: "pending", label: `Pending (${deals.filter(d => !d.approved).length})` },
            { id: "approved", label: `Approved (${deals.filter(d => d.approved).length})` },
            { id: "all", label: `All (${deals.length})` },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: "7px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "1px solid", background: filter === f.id ? "#C9683A" : "transparent", color: filter === f.id ? "#000" : "#777", borderColor: filter === f.id ? "#C9683A" : "rgba(201,104,58,0.2)" }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Deals list */}
        {loading ? (
          <div style={{ color: "#555", fontSize: "13px" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ color: "#555", fontSize: "13px", padding: "24px 0" }}>No deals in this category.</div>
        ) : filtered.map(deal => (
          <div key={deal.id} style={{ background: "#1A201A", border: "1px solid rgba(201,104,58,0.15)", borderRadius: "12px", padding: "20px", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>

              {/* Deal info */}
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "22px" }}>{deal.icon}</span>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#F0E9D6" }}>{deal.name}</div>
                    <div style={{ fontSize: "12px", color: "#555" }}>{deal.neighborhood} · {deal.category}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: deal.approved ? "rgba(143,185,150,0.12)" : "rgba(201,104,58,0.12)", color: deal.approved ? "#8FB996" : "#C9683A", border: `1px solid ${deal.approved ? "rgba(143,185,150,0.3)" : "rgba(201,104,58,0.3)"}` }}>
                    {deal.approved ? "APPROVED" : "PENDING"}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "2px" }}>Hours</div>
                    <div style={{ fontSize: "12px", color: "#C9683A" }}>{deal.hours}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "2px" }}>Days</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{deal.days?.join(", ")}</div>
                  </div>
                  {deal.address && (
                    <div>
                      <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "2px" }}>Address</div>
                      <div style={{ fontSize: "12px", color: "#888" }}>{deal.address}</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "2px" }}>Submitted</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : "unknown"}</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {deal.specials?.map((s, i) => (
                    <span key={i} style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: "rgba(201,104,58,0.08)", border: "1px solid rgba(201,104,58,0.15)", color: "#C9683A" }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {!deal.approved && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
                  <button onClick={() => approve(deal.id)} style={{ padding: "9px 20px", background: "#8FB996", color: "#000", borderRadius: "8px", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                    Approve
                  </button>
                  <button onClick={() => reject(deal.id)} style={{ padding: "9px 20px", background: "transparent", color: "#E24B4A", borderRadius: "8px", fontSize: "12px", fontWeight: 700, border: "1px solid rgba(226,75,74,0.4)", cursor: "pointer", whiteSpace: "nowrap" }}>
                    Reject
                  </button>
                </div>
              )}

              {deal.approved && (
                <button onClick={() => reject(deal.id)} style={{ padding: "9px 20px", background: "transparent", color: "#555", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}