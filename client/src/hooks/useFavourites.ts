import { useState, useCallback } from "react";

const STORAGE_KEY = "doodle-favourites";

function loadFavourites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavourites(slugs: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // ignore
  }
}

export function useFavourites() {
  const [favourites, setFavourites] = useState<string[]>(() => loadFavourites());

  const toggleFavourite = useCallback((slug: string) => {
    setFavourites((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [slug, ...prev];
      saveFavourites(next);
      return next;
    });
  }, []);

  const isFavourite = useCallback(
    (slug: string) => favourites.includes(slug),
    [favourites]
  );

  return { favourites, toggleFavourite, isFavourite };
}
