import { useState, useEffect } from "react";

/**
 * useState that persists to localStorage.
 * Used for UI preferences (e.g. sidebar collapsed state).
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable (private mode) — ignore */
    }
  }, [key, value]);

  return [value, setValue];
}
