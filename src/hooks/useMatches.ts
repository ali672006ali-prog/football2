import { useState, useEffect, useCallback } from "react";
import { API } from "../services/api";

export function useMatches(type: "today" | "live" = "today") {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setError(null);
      const data = type === "live" ? await API.getLiveMatches() : await API.getTodayMatches();
      setMatches(data.matches || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    setLoading(true);
    fetchMatches();

    const interval = setInterval(() => {
      fetchMatches();
    }, 30000); // 30 seconds auto refresh

    return () => clearInterval(interval);
  }, [fetchMatches]);

  return { matches, loading, error, refresh: fetchMatches };
}
