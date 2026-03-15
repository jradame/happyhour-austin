import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";

export function useDeals(filterActive = false) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q;

    if (filterActive) {
      q = query(
        collection(db, "deals"),
        where("approved", "==", true),
        orderBy("createdAt", "desc"),
      );
    } else {
      q = query(
        collection(db, "deals"),
        where("approved", "==", true),
        orderBy("createdAt", "desc"),
      );
    }

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDeals(data);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [filterActive]);

  return { deals, loading, error };
}
