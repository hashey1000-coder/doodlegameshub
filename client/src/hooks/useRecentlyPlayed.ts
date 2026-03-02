import { useState, useEffect, useCallback } from "react";
import type { Game } from "@/data/games";

const STORAGE_KEY = "doodle_recently_played";
const MAX_RECENT = 8;

export function useRecentlyPlayed(allGames: Game[]) {
  // Start with empty array (matching SSR) to avoid hydration mismatch
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  // Sync from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentSlugs(JSON.parse(stored));
    } catch {}
  }, []);

  const addRecentlyPlayed = useCallback((slug: string) => {
    setRecentSlugs((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      const updated = [slug, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  }, []);

  const clearRecent = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setRecentSlugs([]);
  }, []);

  const recentGames = recentSlugs
    .map((slug) => allGames.find((g) => g.slug === slug))
    .filter((g): g is Game => g !== undefined);

  return { recentGames, addRecentlyPlayed, clearRecent };
}
