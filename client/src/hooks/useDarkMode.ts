/**
 * useDarkMode — persists dark/light preference in localStorage and
 * toggles the .dark class on <html> so Tailwind's dark variant applies.
 */
import { useState, useEffect } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("doodle-dark-mode");
      if (stored !== null) return stored === "true";
      // Default to system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

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
