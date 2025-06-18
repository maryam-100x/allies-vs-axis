// src/hooks/useTokenStats.js
import { useEffect, useState } from "react";

export function useTokenStats(mint) {
  const [data, setData] = useState({
    marketCap: null,
    volume24h: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mint) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`🔄 Fetching stats for ${mint}`);
        const response = await fetch(`/api/bitquery?mint=${mint}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const json = await response.json();
        console.log(`✅ Received data for ${mint}:`, json);
        
        setData({
          marketCap: json.marketCap ?? 0,
          volume24h: json.volume24h ?? 0,
        });
      } catch (err) {
        console.error(`❌ Failed to fetch token stats for ${mint}:`, err);
        setError(err.message);
        // Set fallback values on error
        setData({
          marketCap: 0,
          volume24h: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, [mint]);

  return { ...data, loading, error };
}