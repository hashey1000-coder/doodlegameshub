import { useState, useCallback } from "react";

const STORAGE_KEY = "doodle_streak";
const MILESTONES = [3, 7, 30];

interface StreakData {
  currentStreak: number;
  lastPlayedDate: string | null; // ISO date string YYYY-MM-DD
  longestStreak: number;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function readStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { currentStreak: 0, lastPlayedDate: null, longestStreak: 0 };
    return JSON.parse(raw) as StreakData;
  } catch {
    return { currentStreak: 0, lastPlayedDate: null, longestStreak: 0 };
  }
}

function writeStreak(data: StreakData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>(() => readStreak());
  const [milestoneHit, setMilestoneHit] = useState<number | null>(null);

  const recordPlay = useCallback(() => {
    setStreakData((prev) => {
      const today = todayStr();
      const yesterday = yesterdayStr();

      // Already recorded today — no change
      if (prev.lastPlayedDate === today) return prev;

      let newStreak: number;
      if (prev.lastPlayedDate === yesterday) {
        // Consecutive day
        newStreak = prev.currentStreak + 1;
      } else {
        // Streak broken or first play
        newStreak = 1;
      }

      const newLongest = Math.max(newStreak, prev.longestStreak);
      const updated: StreakData = {
        currentStreak: newStreak,
        lastPlayedDate: today,
        longestStreak: newLongest,
      };
      writeStreak(updated);

      // Check for milestone
      if (MILESTONES.includes(newStreak)) {
        setMilestoneHit(newStreak);
      }

      return updated;
    });
  }, []);

  const dismissMilestone = useCallback(() => {
    setMilestoneHit(null);
  }, []);

  return {
    streak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    lastPlayedDate: streakData.lastPlayedDate,
    milestoneHit,
    recordPlay,
    dismissMilestone,
  };
}
