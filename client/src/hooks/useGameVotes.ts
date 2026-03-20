/**
 * useGameVotes — Firebase Realtime Database-backed thumbs up/down for a single game.
 *
 * RTDB structure:
 *   gameVotes/{slug}               → { likes: number, dislikes: number }
 *   userVotes/{sessionId}/{slug}   → "like" | "dislike"
 *
 * Falls back to localStorage when Firebase is not configured.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
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

  // Refs so async callbacks always read the latest state without stale closures.
  const votesRef = useRef(votes);
  const userVoteStateRef = useRef(userVote);
  useEffect(() => { votesRef.current = votes; }, [votes]);
  useEffect(() => { userVoteStateRef.current = userVote; }, [userVote]);

  // True once the initial get() for the user's server-side vote has resolved.
  // If false when vote() is called, we must fetch inline to avoid double-counting.
  const userVoteLoadedRef = useRef(false);
  // Prevents onValue from reverting the optimistic count while a transaction is in flight.
  const pendingVoteRef = useRef(false);

  useEffect(() => {
    // Reset flags whenever the game changes
    userVoteLoadedRef.current = false;
    pendingVoteRef.current = false;

    if (!isFirebaseConfigured || !db) {
      setVotes(lsGetVotes(slug));
      setUserVote(lsGetUserVote(slug));
      userVoteLoadedRef.current = true;
      return;
    }

    // Subscribe to real-time vote counts
    const voteRef = ref(db, `gameVotes/${slug}`);
    const unsubVotes = onValue(voteRef, (snapshot) => {
      // Skip server updates while an optimistic vote is in flight to avoid
      // intermediate Firebase transaction states reverting the optimistic count.
      if (pendingVoteRef.current) return;
      if (snapshot.exists()) {
        const d = snapshot.val();
        setVotes({ likes: d.likes || 0, dislikes: d.dislikes || 0 });
      } else {
        setVotes({ likes: 0, dislikes: 0 });
      }
    });

    // One-time read for this user's current vote
    get(ref(db, `userVotes/${sessionId}/${slug}`)).then((snap) => {
      const serverVote = snap.exists() ? (snap.val() as 'like' | 'dislike') : null;
      // Only update state if the user hasn't already voted in this session
      // (vote() sets userVoteLoadedRef = true before we reach here in that case)
      if (!userVoteLoadedRef.current) {
        setUserVote(serverVote);
        userVoteStateRef.current = serverVote;
      }
      userVoteLoadedRef.current = true;
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

    pendingVoteRef.current = true; // suppress onValue during the transaction

    // ── Determine the authoritative previous vote ────────────────────────────
    // If the initial server read hasn't resolved yet, fetch inline NOW.
    // This is critical to avoid double-counting: if we assume prevUserVote=null
    // but the server already has 'like', the transaction would add a duplicate vote.
    let prevUserVote: 'like' | 'dislike' | null;
    if (userVoteLoadedRef.current) {
      // Already resolved — safe to use local state ref
      prevUserVote = userVoteStateRef.current;
    } else {
      // User clicked before the background get() resolved — fetch it inline
      try {
        const snap = await get(ref(db, `userVotes/${sessionId}/${slug}`));
        prevUserVote = snap.exists() ? (snap.val() as 'like' | 'dislike') : null;
      } catch {
        prevUserVote = null;
      }
      // Sync state and mark loaded so the background get() doesn't overwrite us
      userVoteStateRef.current = prevUserVote;
      userVoteLoadedRef.current = true;
      setUserVote(prevUserVote);
    }

    const prevVotes = { ...votesRef.current };

    // Optimistic local update for instant feedback
    const optimisticVotes = { ...prevVotes };
    let optimisticUserVote: 'like' | 'dislike' | null;

    if (prevUserVote === type) {
      // Toggle off
      if (type === 'like') optimisticVotes.likes = Math.max(0, optimisticVotes.likes - 1);
      else optimisticVotes.dislikes = Math.max(0, optimisticVotes.dislikes - 1);
      optimisticUserVote = null;
    } else {
      // New vote or switch
      if (prevUserVote === 'like') optimisticVotes.likes = Math.max(0, optimisticVotes.likes - 1);
      if (prevUserVote === 'dislike') optimisticVotes.dislikes = Math.max(0, optimisticVotes.dislikes - 1);
      if (type === 'like') optimisticVotes.likes += 1;
      else optimisticVotes.dislikes += 1;
      optimisticUserVote = type;
    }

    setVotes(optimisticVotes);
    setUserVote(optimisticUserVote);
    userVoteStateRef.current = optimisticUserVote;

    try {
      const gameVoteRef = ref(db, `gameVotes/${slug}`);
      const userVoteDbRef = ref(db, `userVotes/${sessionId}/${slug}`);

      // Atomic transaction on the game vote counters.
      // Uses the authoritative prevUserVote fetched above — no double-counting.
      let newUserVote: 'like' | 'dislike' | null = null;
      await runTransaction(gameVoteRef, (currentData) => {
        const data = currentData ?? { likes: 0, dislikes: 0 };
        const newVotes = { likes: data.likes || 0, dislikes: data.dislikes || 0 };

        if (prevUserVote === type) {
          // Toggle off
          if (type === 'like') newVotes.likes = Math.max(0, newVotes.likes - 1);
          else newVotes.dislikes = Math.max(0, newVotes.dislikes - 1);
          newUserVote = null;
        } else {
          // New vote or switch
          if (prevUserVote === 'like') newVotes.likes = Math.max(0, newVotes.likes - 1);
          if (prevUserVote === 'dislike') newVotes.dislikes = Math.max(0, newVotes.dislikes - 1);
          if (type === 'like') newVotes.likes += 1;
          else newVotes.dislikes += 1;
          newUserVote = type;
        }

        return newVotes;
      });

      // Write the user's personal vote record
      if (newUserVote === null) {
        await remove(userVoteDbRef);
      } else {
        await set(userVoteDbRef, newUserVote);
      }

      setUserVote(newUserVote);
      userVoteStateRef.current = newUserVote;

      // Re-enable onValue updates and fetch the confirmed count from Firebase
      pendingVoteRef.current = false;
      const finalSnap = await get(gameVoteRef);
      if (finalSnap.exists()) {
        const d = finalSnap.val();
        setVotes({ likes: d.likes || 0, dislikes: d.dislikes || 0 });
      }
    } catch (err) {
      // Revert optimistic update on failure
      pendingVoteRef.current = false;
      console.warn('Vote failed, reverting:', err);
      setVotes(prevVotes);
      setUserVote(prevUserVote);
      userVoteStateRef.current = prevUserVote;
    }
  }, [slug, sessionId]); // No votes/userVote deps — reads via refs, no stale closures

  return { votes, userVote, vote };
}
