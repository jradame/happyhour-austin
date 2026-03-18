import { useState } from "react";

const STORED_KEY = "hh_deals";

export function useDeals() {
  const [userDeals, setUserDeals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addDeal = (deal) => {
    const updated = [...userDeals, {
      ...deal,
      id: Date.now().toString(),
      approved: true,
      status: "upcoming",
    }];
    setUserDeals(updated);
    localStorage.setItem(STORED_KEY, JSON.stringify(updated));
  };

  return { deals: userDeals, loading: false, error: null, addDeal };
}