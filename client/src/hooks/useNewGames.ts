import { useState, useCallback } from 'react';
import { GAMES, type Game } from '@/data/games';

const STORAGE_KEY = 'dgh_seen_new_games';

function getSeenSlugs(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

function saveSeenSlugs(slugs: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(slugs)));
  } catch {}
}

/** Returns the count of isNew games the user hasn't seen yet, and a function to mark all as seen. */
export function useNewGames() {
  const [unseenCount, setUnseenCount] = useState<number>(() => {
    const seen = getSeenSlugs();
    const newSlugs = GAMES.filter((g: Game) => g.isNew).map((g: Game) => g.slug);
    return newSlugs.filter((s: string) => !seen.has(s)).length;
  });

  const markAllSeen = useCallback(() => {
    const newSlugs = GAMES.filter((g: Game) => g.isNew).map((g: Game) => g.slug);
    const seen = getSeenSlugs();
    newSlugs.forEach((s: string) => seen.add(s));
    saveSeenSlugs(seen);
    setUnseenCount(0);
  }, []);

  return { unseenCount, markAllSeen };
}
