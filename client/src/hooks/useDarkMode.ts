/**
 * useDarkMode — persists dark/light preference in localStorage and
 * toggles the .dark class on <html> so Tailwind's dark variant applies.
 */
import { useState, useEffect } from "react";

export function useDarkMode() {
  // Always start with false (matching SSR) to avoid hydration mismatch.
  // The inline script in <head> applies the .dark class immediately so
  // the page looks correct; we sync state after mount.
  const [isDark, setIsDark] = useState(false);

  // Read the real preference after mount (avoids hydration error #418)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("doodle-dark-mode");
      if (stored !== null) {
        setIsDark(stored === "true");
      } else {
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    try {
      localStorage.setItem("doodle-dark-mode", String(isDark));
    } catch {}
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return { isDark, toggle };
}
