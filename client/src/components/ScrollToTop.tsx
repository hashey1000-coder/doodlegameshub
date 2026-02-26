import { useLayoutEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [location] = useLocation();

  // useLayoutEffect fires before the browser paints, so the user never
  // sees the new page at the old scroll position.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  return null;
}
