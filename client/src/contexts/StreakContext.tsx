import { createContext, useContext, ReactNode } from "react";
import { useStreak } from "@/hooks/useStreak";

interface StreakContextValue {
  streak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
  milestoneHit: number | null;
  recordPlay: () => void;
  dismissMilestone: () => void;
}

const StreakContext = createContext<StreakContextValue | null>(null);

export function StreakProvider({ children }: { children: ReactNode }) {
  const value = useStreak();
  return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>;
}

export function useStreakContext(): StreakContextValue {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error("useStreakContext must be used within StreakProvider");
  return ctx;
}
