/**
 * BlurImage — renders an image with a blur-up loading effect.
 * Shows a blurred low-opacity placeholder while the full image loads,
 * then transitions to sharp with a smooth CSS animation.
 *
 * GIF optimisation:
 * - GIF thumbnails initially render a lightweight static JPEG poster
 *   (first frame, ~15-20 KB each vs multi-MB animated GIFs).
 * - The full GIF loads automatically once the card scrolls into view
 *   (via IntersectionObserver with a generous rootMargin so it starts
 *   prefetching before the user reaches it).
 *
 * CWV optimisations:
 * - Explicit width/height to prevent CLS
 * - fetchpriority="high" for above-fold (LCP) images
 * - decoding="async" to avoid blocking main thread
 * - CSS containment for paint optimisation
 */
import { useState, useRef, useEffect, memo } from "react";

/** For a GIF src like "/thumbnails/foo.gif" return the static poster path
 *  "/thumbnails/posters/foo.jpg". Returns null for non-GIF sources. */
function gifPosterSrc(src: string): string | null {
  if (!src.endsWith(".gif")) return null;
  const lastSlash = src.lastIndexOf("/");
  const dir = src.slice(0, lastSlash);
  const name = src.slice(lastSlash + 1, -4); // strip ".gif"
  return `${dir}/posters/${name}.jpg`;
}

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string; // e.g. "aspect-[4/3]"
  /** Set to true for above-fold images (LCP candidates) */
  priority?: boolean;
  width?: number;
  height?: number;
}

export default memo(function BlurImage({
  src,
  alt,
  className = "",
  aspectClass = "aspect-[4/3]",
  priority = false,
  width = 400,
  height = 300,
}: BlurImageProps) {
  const poster = gifPosterSrc(src);
  const isGif = poster !== null;

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  // For GIFs: start with the lightweight poster, swap to full GIF once in view
  const [showGif, setShowGif] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine which src to actually render
  const activeSrc = isGif && !showGif ? poster : src;

  // If the image is already cached, it fires onLoad before mount
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  // When the GIF card scrolls near the viewport, prefetch the full GIF
  // and swap it in. Uses a 600px rootMargin so loading starts early.
  useEffect(() => {
    if (!isGif || showGif) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          const img = new Image();
          img.src = src;
          img.onload = () => setShowGif(true);
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isGif, showGif, src]);

  // Reset loaded state when we swap from poster → GIF
  useEffect(() => {
    if (showGif && imgRef.current) {
      if (imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        setLoaded(true);
      } else {
        setLoaded(false);
      }
    }
  }, [showGif]);

  if (error) {
    return (
      <div className={`${aspectClass} bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${className}`}>
        <span className="text-3xl opacity-40">🎮</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${aspectClass} ${className}`}
      style={{ contain: 'layout style paint' }}
    >
      {/* Blurred placeholder shown while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={activeSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ease-out ${
          loaded
            ? "opacity-100"
            : "opacity-0"
        }`}
      />
    </div>
  );
});
