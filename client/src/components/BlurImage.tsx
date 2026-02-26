/**
 * BlurImage — renders an image with a blur-up loading effect.
 * Shows a blurred low-opacity placeholder while the full image loads,
 * then transitions to sharp with a smooth CSS animation.
 *
 * CWV optimisations:
 * - Explicit width/height to prevent CLS
 * - fetchpriority="high" for above-fold (LCP) images
 * - decoding="async" to avoid blocking main thread
 * - CSS containment for paint optimisation
 */
import { useState, useRef, useEffect, memo } from "react";

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
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the image is already cached, it fires onLoad before mount
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  if (error) {
    return (
      <div className={`${aspectClass} bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${className}`}>
        <span className="text-3xl opacity-40">🎮</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectClass} ${className}`} style={{ contain: 'layout style paint' }}>
      {/* Blurred placeholder shown while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={src}
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
