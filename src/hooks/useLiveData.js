import { useEffect, useState } from "react";
import { getDashboard } from "@/services/api";

const POLL_MS = 5000;

export default function useLiveData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const dashboardData = await getDashboard();
        if (!cancelled) {
          setData(dashboardData);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message);
        }
      }
    }

    poll();

    const id = setInterval(poll, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { data, error };
}