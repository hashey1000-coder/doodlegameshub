/**
 * usePlayTimer
 * Tracks how long a user actively plays a game.
 *
 * Design:
 * - Starts counting when the hook mounts (game page opened)
 * - Pauses automatically when the browser tab loses focus (visibilitychange)
 * - Resumes when the tab regains focus
 * - Returns elapsed seconds (live, updating every second)
 * - Calls onSessionEnd(seconds) when the component unmounts so the caller
 *   can persist the session
 */

import { useEffect, useRef, useState } from "react";

export function usePlayTimer(onSessionEnd: (seconds: number) => void) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(Date.now());
  const accumulatedRef = useRef<number>(0);
  const activeRef = useRef<boolean>(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick every second
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (activeRef.current) {
        const now = Date.now();
        const sessionMs = now - startRef.current;
        setElapsed(Math.floor((accumulatedRef.current + sessionMs) / 1000));
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Pause/resume on tab visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        // Tab hidden — accumulate and pause
        if (activeRef.current) {
          accumulatedRef.current += Date.now() - startRef.current;
          activeRef.current = false;
        }
      } else {
        // Tab visible — resume
        if (!activeRef.current) {
          startRef.current = Date.now();
          activeRef.current = true;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // On unmount — save final session
  const onSessionEndRef = useRef(onSessionEnd);
  onSessionEndRef.current = onSessionEnd;

  useEffect(() => {
    return () => {
      // Final elapsed calculation
      let total = accumulatedRef.current;
      if (activeRef.current) {
        total += Date.now() - startRef.current;
      }
      const totalSeconds = Math.floor(total / 1000);
      if (totalSeconds >= 5) {
        // Only save sessions of at least 5 seconds
        onSessionEndRef.current(totalSeconds);
      }
    };
  }, []);

  return elapsed;
}

// ─── Session storage helpers ──────────────────────────────────────────────────

export interface PlaySession {
  duration: number; // seconds
  date: string;     // ISO date string
}

const STORAGE_KEY = "doodle-play-sessions";

function getAllSessions(): Record<string, PlaySession[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const result = raw ? JSON.parse(raw) : {};
    return result;
  } catch {
    return {};
  }
}

export function getSessionsForGame(slug: string): PlaySession[] {
  const all = getAllSessions();
  const result = (all[slug] || []).sort((a, b) => b.duration - a.duration);
  return result;
}

/** Returns true if this session is a new personal best for the game. */
export function saveSession(slug: string, seconds: number): boolean {
  const all = getAllSessions();
  const sessions = all[slug] || [];
  const previousBest = sessions.length > 0
    ? Math.max(...sessions.map((s) => s.duration))
    : 0;
  const isNewBest = seconds > previousBest;
  sessions.push({ duration: seconds, date: new Date().toISOString() });
  // Keep only the top 10 sessions per game (by duration)
  sessions.sort((a, b) => b.duration - a.duration);
  all[slug] = sessions.slice(0, 10);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // localStorage full — ignore
  }
  return isNewBest;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}
