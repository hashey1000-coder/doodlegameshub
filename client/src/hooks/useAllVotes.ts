/**
 * useAllVotes — loads all game vote counts for the homepage (top-rated sort, badges).
 *
 * When Firebase is configured: subscribes to the entire gameVotes node in RTDB.
 * Fallback: reads per-game likes from localStorage.
 */
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db, isFirebaseConfigured } from '@/lib/firebase';

export type VotesMap = Map<string, { likes: number; dislikes: number }>;

// Module-level cache so re-renders don't reset the map unnecessarily
let cachedMap: VotesMap = new Map();

export function useAllVotes() {
  const [votesMap, setVotesMap] = useState<VotesMap>(cachedMap);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    const votesRef = ref(db, 'gameVotes');
    const unsubscribe = onValue(votesRef, (snapshot) => {
      const map = new Map<string, { likes: number; dislikes: number }>();
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          const d = child.val();
          map.set(child.key!, { likes: d.likes || 0, dislikes: d.dislikes || 0 });
        });
      }
      cachedMap = map;
      setVotesMap(new Map(map));
    });

    return () => unsubscribe();
  }, []);

  /** Get like count for a slug, falling back to localStorage. */
  function getLikes(slug: string): number {
    if (votesMap.has(slug)) return votesMap.get(slug)!.likes;
    // localStorage fallback (covers when Firebase is not configured)
    try {
      const raw = localStorage.getItem(`game-votes-${slug}`);
      if (raw) return JSON.parse(raw).likes || 0;
    } catch {}
    return 0;
  }

  return { votesMap, getLikes };
}

