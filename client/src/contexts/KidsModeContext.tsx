/**
 * KidsModeContext — global Kids Mode state shared across all components.
 * Persists to localStorage so the preference survives page refreshes.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

const STORAGE_KEY = "doodle-kids-mode";

function loadKidsMode(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

interface KidsModeContextValue {
  kidsMode: boolean;
  toggleKidsMode: () => void;
}

const KidsModeContext = createContext<KidsModeContextValue | null>(null);

export function KidsModeProvider({ children }: { children: ReactNode }) {
  const [kidsMode, setKidsMode] = useState<boolean>(() => loadKidsMode());

  const toggleKidsMode = useCallback(() => {
    setKidsMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  return (
    <KidsModeContext.Provider value={{ kidsMode, toggleKidsMode }}>
      {children}
    </KidsModeContext.Provider>
  );
}

export function useKidsModeContext() {
  const ctx = useContext(KidsModeContext);
  if (!ctx) throw new Error("useKidsModeContext must be used inside KidsModeProvider");
  return ctx;
}
