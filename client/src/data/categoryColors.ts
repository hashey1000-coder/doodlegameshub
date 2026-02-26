/**
 * Shared category → Tailwind class mapping.
 * Import this everywhere instead of duplicating the map per page/component.
 */
export const CATEGORY_COLORS: Record<string, string> = {
  classic: "text-violet-600 bg-violet-50",
  arcade: "text-fuchsia-600 bg-fuchsia-50",
  sports: "text-emerald-600 bg-emerald-50",
  puzzle: "text-amber-600 bg-amber-50",
  adventure: "text-orange-600 bg-orange-50",
  educational: "text-cyan-600 bg-cyan-50",
  seasonal: "text-pink-600 bg-pink-50",
  creative: "text-indigo-600 bg-indigo-50",
};

/** Same palette but with border classes — useful for badges that need outlines. */
export const CATEGORY_COLORS_BORDERED: Record<string, string> = {
  classic: "text-violet-600 bg-violet-50 border border-violet-100",
  arcade: "text-fuchsia-600 bg-fuchsia-50 border border-fuchsia-100",
  sports: "text-emerald-600 bg-emerald-50 border border-emerald-100",
  puzzle: "text-amber-600 bg-amber-50 border border-amber-100",
  adventure: "text-orange-600 bg-orange-50 border border-orange-100",
  educational: "text-cyan-600 bg-cyan-50 border border-cyan-100",
  seasonal: "text-pink-600 bg-pink-50 border border-pink-100",
  creative: "text-indigo-600 bg-indigo-50 border border-indigo-100",
};

/** Map category id to the accent colour for colour bars / indicators. */
export const CATEGORY_ACCENT: Record<string, string> = {
  classic: "bg-violet-500",
  arcade: "bg-fuchsia-500",
  sports: "bg-emerald-500",
  puzzle: "bg-amber-500",
  adventure: "bg-orange-500",
  educational: "bg-cyan-500",
  seasonal: "bg-pink-500",
  creative: "bg-indigo-500",
};

export const CATEGORY_FALLBACK = "text-violet-600 bg-violet-50";
export const CATEGORY_BORDERED_FALLBACK = "text-violet-600 bg-violet-50 border border-violet-100";
