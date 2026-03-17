import { useState, useEffect } from "react";

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

  const addDeal = (deal) => {
    const updated = [...deals, { ...deal, id: Date.now().toString(), approved: true, status: "upcoming" }];
    setDeals(updated);
    localStorage.setItem(STORED_KEY, JSON.stringify(updated));
  };

  return { deals, loading: false, error: null, addDeal };
}