import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const STORED_KEY = "hh_deals";

export function useDeals() {
  const [deals, setDeals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const q = query(collection(db, "deals"), where("approved", "==", true));
    const unsub = onSnapshot(q, (snap) => {
      const firestoreDeals = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDeals(firestoreDeals);
    });
    return unsub;
  }, []);

  const addDeal = async (deal) => {
    try {
      await addDoc(collection(db, "deals"), {
        ...deal,
        approved: true,
        status: "upcoming",
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error saving deal:", err);
      // fallback to localStorage
      const saved = localStorage.getItem(STORED_KEY);
      const existing = saved ? JSON.parse(saved) : [];
      const updated = [
        ...existing,
        {
          ...deal,
          id: Date.now().toString(),
          approved: true,
          status: "upcoming",
        },
      ];
      localStorage.setItem(STORED_KEY, JSON.stringify(updated));
      setDeals(updated);
    }
  };

  return { deals, loading: false, error: null, addDeal };
}
