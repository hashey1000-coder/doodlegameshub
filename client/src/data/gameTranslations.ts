/**
 * Game-specific translations — localised titles and descriptions for every game.
 *
 * Game titles are kept recognisable (proper nouns like "Google Doodle" are
 * retained) while the surrounding descriptive words are translated.
 * Descriptions are fully localised per locale.
 *
 * English is the fallback and comes from `games.ts` directly — no EN map needed here.
 */

import { useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Game } from './games';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GameTranslation {
  /** Translated game title — keep proper nouns (Google, Pac-Man…) intact */
  title: string;
  /** Translated short description (1-2 sentences) for cards & SEO */
  description: string;
  /** Translated controls / how-to-play instructions */
  controls?: string;
}

/** locale → slug → translation */
export type GameTranslationMap = Record<string, Record<string, GameTranslation>>;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns localised `title` and `description` for a given game.
 * Falls back to the English values from `games.ts` when no translation exists.
 */
export function useGameT(game: Game): { title: string; description: string; controls: string } {
  const { locale } = useLanguage();
  if (locale === 'en') return { title: game.title, description: game.description, controls: game.controls };
  const localeMap = GAME_TRANSLATIONS[locale];
  if (!localeMap) return { title: game.title, description: game.description, controls: game.controls };
  const t = localeMap[game.slug];
  if (!t) return { title: game.title, description: game.description, controls: game.controls };
  return { title: t.title || game.title, description: t.description || game.description, controls: t.controls || game.controls };
}

/**
 * Non-hook variant for use inside effects / callbacks where we already have
 * the locale string.
 */
export function getGameT(locale: string, game: Game): { title: string; description: string; controls: string } {
  if (locale === 'en') return { title: game.title, description: game.description, controls: game.controls };
  const localeMap = GAME_TRANSLATIONS[locale];
  if (!localeMap) return { title: game.title, description: game.description, controls: game.controls };
  const t = localeMap[game.slug];
  if (!t) return { title: game.title, description: game.description, controls: game.controls };
  return { title: t.title || game.title, description: t.description || game.description, controls: t.controls || game.controls };
}

/**
 * Returns a memoised translator function that can be used inside `.map()` and
 * other iteration helpers where calling a hook per-item is impossible.
 *
 * Usage:
 *   const gt = useGameTranslate();
 *   games.map(g => <span>{gt(g).title}</span>)
 */
export function useGameTranslate(): (game: Game) => { title: string; description: string; controls: string } {
  const { locale } = useLanguage();
  return useCallback((game: Game) => getGameT(locale, game), [locale]);
}

// ---------------------------------------------------------------------------
// Translation data  — lazy-loaded per locale to avoid a 762KB upfront download
// ---------------------------------------------------------------------------

/** Mutable map — locales are added lazily or eagerly (SSR) */
export const GAME_TRANSLATIONS: GameTranslationMap = {};

/** Dynamic import loaders for each locale's game translations */
const GAME_LOCALE_LOADERS: Record<string, () => Promise<Record<string, GameTranslation>>> = {
  es: () => import('./translations/es').then(m => m.ES_GAMES),
  fr: () => import('./translations/fr').then(m => m.FR_GAMES),
  de: () => import('./translations/de').then(m => m.DE_GAMES),
  it: () => import('./translations/it').then(m => m.IT_GAMES),
  pt: () => import('./translations/pt').then(m => m.PT_GAMES),
  ru: () => import('./translations/ru').then(m => m.RU_GAMES),
  ar: () => import('./translations/ar').then(m => m.AR_GAMES),
  hi: () => import('./translations/hi').then(m => m.HI_GAMES),
  tr: () => import('./translations/tr').then(m => m.TR_GAMES),
  nl: () => import('./translations/nl').then(m => m.NL_GAMES),
  pl: () => import('./translations/pl').then(m => m.PL_GAMES),
  sv: () => import('./translations/sv').then(m => m.SV_GAMES),
  id: () => import('./translations/id').then(m => m.ID_GAMES),
  vi: () => import('./translations/vi').then(m => m.VI_GAMES),
  th: () => import('./translations/th').then(m => m.TH_GAMES),
  'zh-CN': () => import('./translations/zh-CN').then(m => m.ZH_CN_GAMES),
  'zh-TW': () => import('./translations/zh-TW').then(m => m.ZH_TW_GAMES),
  ja: () => import('./translations/ja').then(m => m.JA_GAMES),
  ko: () => import('./translations/ko').then(m => m.KO_GAMES),
};

const _gameLoadCache: Partial<Record<string, Promise<void>>> = {};

/**
 * Lazily load game translations for a locale. Safe to call multiple times.
 */
export function loadGameLocale(code: string): Promise<void> {
  if (code === 'en' || GAME_TRANSLATIONS[code]) return Promise.resolve();
  if (_gameLoadCache[code]) return _gameLoadCache[code]!;
  const loader = GAME_LOCALE_LOADERS[code];
  if (!loader) return Promise.resolve();
  _gameLoadCache[code] = loader().then(data => {
    GAME_TRANSLATIONS[code] = data;
  });
  return _gameLoadCache[code]!;
}

/**
 * Register game translations eagerly (used by SSR / prerender).
 */
export function registerGameTranslations(locale: string, map: Record<string, GameTranslation>) {
  GAME_TRANSLATIONS[locale] = map;
}
