import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Prefetch a game's iframe URL by injecting a `<link rel="prefetch">` tag.
 * Also injects a preconnect link for the game host if not already present.
 * Intended to be called on hover over a game card so the browser warms
 * the connection + starts downloading the game HTML before the user clicks.
 */
export function prefetchGameUrl(url: string): void {
  if (!url) return;
  try {
    const origin = new URL(url).origin;
    // Preconnect (DNS + TLS handshake)
    const pcId = `preconnect-${origin}`;
    if (!document.getElementById(pcId)) {
      const pc = document.createElement('link');
      pc.id = pcId;
      pc.rel = 'preconnect';
      pc.href = origin;
      pc.crossOrigin = 'anonymous';
      document.head.appendChild(pc);
    }
    // Prefetch the actual game page (low-priority, cacheable)
    const pfId = `prefetch-${url.slice(0, 80)}`;
    if (!document.getElementById(pfId)) {
      const pf = document.createElement('link');
      pf.id = pfId;
      pf.rel = 'prefetch';
      pf.href = url;
      pf.as = 'document';
      document.head.appendChild(pf);
    }
  } catch {
    // invalid URL, skip
  }
}
