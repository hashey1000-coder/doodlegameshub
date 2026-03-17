/**
 * useGameVotes — Firebase Realtime Database-backed thumbs up/down for a single game.
 *
 * RTDB structure:
 *   gameVotes/{slug}               → { likes: number, dislikes: number }
 *   userVotes/{sessionId}/{slug}   → "like" | "dislike"
 *
 * Falls back to localStorage when Firebase is not configured.
 */
import { useState, useEffect, useCallback } from 'react';
import { ref, get, set, remove, onValue, runTransaction } from 'firebase/database';
import { db, isFirebaseConfigured } from '@/lib/firebase';

// ── Session ID (anonymous user identity) ─────────────────────────────────────
function getSessionId(): string {
  const KEY = 'doodle-hub-session-id';
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

// ── localStorage helpers (fallback & cache) ───────────────────────────────────
function lsGetVotes(slug: string) {
  try {
    const raw = localStorage.getItem(`game-votes-${slug}`);
    if (raw) {
      const p = JSON.parse(raw);
      return { likes: p.likes || 0, dislikes: p.dislikes || 0 };
    }
  } catch {}
  return { likes: 0, dislikes: 0 };
}
function lsSetVotes(slug: string, v: { likes: number; dislikes: number }) {
  try { localStorage.setItem(`game-votes-${slug}`, JSON.stringify(v)); } catch {}
}
function lsGetUserVote(slug: string): 'like' | 'dislike' | null {
  try {
    return (localStorage.getItem(`game-uservote-${slug}`) as 'like' | 'dislike' | null);
  } catch { return null; }
}
function lsSetUserVote(slug: string, v: 'like' | 'dislike' | null) {
  try {
    if (v === null) localStorage.removeItem(`game-uservote-${slug}`);
    else localStorage.setItem(`game-uservote-${slug}`, v);
  } catch {}
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useGameVotes(slug: string) {
  const sessionId = getSessionId();
  const [votes, setVotes] = useState<{ likes: number; dislikes: number }>({ likes: 0, dislikes: 0 });
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setVotes(lsGetVotes(slug));
      setUserVote(lsGetUserVote(slug));
      return;
    }

    // Subscribe to real-time vote counts
    const voteRef = ref(db, `gameVotes/${slug}`);
    const unsubVotes = onValue(voteRef, (snapshot) => {
      if (snapshot.exists()) {
        const d = snapshot.val();
        setVotes({ likes: d.likes || 0, dislikes: d.dislikes || 0 });
      } else {
        setVotes({ likes: 0, dislikes: 0 });
      }
    });

    // One-time read for this user's current vote
    get(ref(db, `userVotes/${sessionId}/${slug}`)).then((snap) => {
      setUserVote(snap.exists() ? (snap.val() as 'like' | 'dislike') : null);
    });

    return () => unsubVotes();
  }, [slug, sessionId]);

  // Cast / toggle a vote
  const vote = useCallback(async (type: 'like' | 'dislike') => {
    if (!isFirebaseConfigured || !db) {
      // localStorage fallback
      const current = lsGetVotes(slug);
      const currentUserVote = lsGetUserVote(slug);
      const newVotes = { ...current };
      let newUserVote: 'like' | 'dislike' | null;

      if (currentUserVote === type) {
        if (type === 'like') newVotes.likes = Math.max(0, newVotes.likes - 1);
        else newVotes.dislikes = Math.max(0, newVotes.dislikes - 1);
        newUserVote = null;
      } else {
        if (currentUserVote === 'like') newVotes.likes = Math.max(0, newVotes.likes - 1);
        if (currentUserVote === 'dislike') newVotes.dislikes = Math.max(0, newVotes.dislikes - 1);
        if (type === 'like') newVotes.likes += 1;
        else newVotes.dislikes += 1;
        newUserVote = type;
      }

      lsSetVotes(slug, newVotes);
      lsSetUserVote(slug, newUserVote);
      setVotes(newVotes);
      setUserVote(newUserVote);
      return;
    }

    // Optimistic local update for instant feedback
    const optimisticVotes = { ...votes };
    const prevUserVote = userVote;
    let optimisticUserVote: 'like' | 'dislike' | null;

    if (prevUserVote === type) {
      if (type === 'like') optimisticVotes.likes = Math.max(0, optimisticVotes.likes - 1);
      else optimisticVotes.dislikes = Math.max(0, optimisticVotes.dislikes - 1);
      optimisticUserVote = null;
    } else {
      if (prevUserVote === 'like') optimisticVotes.likes = Math.max(0, optimisticVotes.likes - 1);
      if (prevUserVote === 'dislike') optimisticVotes.dislikes = Math.max(0, optimisticVotes.dislikes - 1);
      if (type === 'like') optimisticVotes.likes += 1;
      else optimisticVotes.dislikes += 1;
      optimisticUserVote = type;
    }

    setVotes(optimisticVotes);
    setUserVote(optimisticUserVote);

    try {
      const gameVoteRef = ref(db, `gameVotes/${slug}`);
      const userVoteRef = ref(db, `userVotes/${sessionId}/${slug}`);

      // Read the user's current server-side vote first
      const userVoteSnap = await get(userVoteRef);
      const currentUserVote = userVoteSnap.exists()
        ? (userVoteSnap.val() as 'like' | 'dislike')
        : null;

      // Atomic transaction on the game vote counters
      let newUserVote: 'like' | 'dislike' | null = null;
      await runTransaction(gameVoteRef, (currentData) => {
        const data = currentData ?? { likes: 0, dislikes: 0 };
        const newVotes = { likes: data.likes || 0, dislikes: data.dislikes || 0 };

        if (currentUserVote === type) {
          // Toggle off — remove the existing vote
          if (type === 'like') newVotes.likes = Math.max(0, newVotes.likes - 1);
          else newVotes.dislikes = Math.max(0, newVotes.dislikes - 1);
          newUserVote = null;
        } else {
          // Switch from previous vote (or cast fresh)
          if (currentUserVote === 'like') newVotes.likes = Math.max(0, newVotes.likes - 1);
          if (currentUserVote === 'dislike') newVotes.dislikes = Math.max(0, newVotes.dislikes - 1);
          if (type === 'like') newVotes.likes += 1;
          else newVotes.dislikes += 1;
          newUserVote = type;
        }

        return newVotes;
      });

      // Write the user's personal vote record
      if (newUserVote === null) {
        await remove(userVoteRef);
      } else {
        await set(userVoteRef, newUserVote);
      }
    } catch (err) {
      // Revert optimistic update on failure
      console.warn('Vote failed, reverting:', err);
      setVotes(votes);
      setUserVote(userVote);
    }
  }, [slug, sessionId, votes, userVote]);

  return { votes, userVote, vote };
}
