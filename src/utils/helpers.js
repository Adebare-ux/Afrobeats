import { useState, useCallback, useEffect } from "react";

export function generateRoomCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

export function useSharedState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  const set = useCallback(
    (val) => {
      setState((prev) => {
        const next = typeof val === "function" ? val(prev) : val;
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key]
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key === key) {
        try {
          setState(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  return [state, set];
}

export function similarity(a, b) {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1;
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  return matches / longer.length;
}
