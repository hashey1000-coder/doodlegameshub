import { useState, useEffect, useCallback } from "react";
import type { Game } from "@/data/games";

const STORAGE_KEY = "doodle_recently_played";
const MAX_RECENT = 8;

export function useRecentlyPlayed(allGames: Game[]) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

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
