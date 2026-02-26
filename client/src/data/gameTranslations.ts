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
// Translation data  — imported from per-locale files to keep this file small
// ---------------------------------------------------------------------------

import { ES_GAMES } from './translations/es';
import { FR_GAMES } from './translations/fr';
import { DE_GAMES } from './translations/de';
import { IT_GAMES } from './translations/it';
import { PT_GAMES } from './translations/pt';
import { RU_GAMES } from './translations/ru';
import { AR_GAMES } from './translations/ar';
import { HI_GAMES } from './translations/hi';
import { TR_GAMES } from './translations/tr';
import { NL_GAMES } from './translations/nl';
import { PL_GAMES } from './translations/pl';
import { SV_GAMES } from './translations/sv';
import { ID_GAMES } from './translations/id';
import { VI_GAMES } from './translations/vi';
import { TH_GAMES } from './translations/th';
import { ZH_CN_GAMES } from './translations/zh-CN';
import { ZH_TW_GAMES } from './translations/zh-TW';
import { JA_GAMES } from './translations/ja';
import { KO_GAMES } from './translations/ko';

export const GAME_TRANSLATIONS: GameTranslationMap = {
  es: ES_GAMES,
  fr: FR_GAMES,
  de: DE_GAMES,
  it: IT_GAMES,
  pt: PT_GAMES,
  ru: RU_GAMES,
  ar: AR_GAMES,
  hi: HI_GAMES,
  tr: TR_GAMES,
  nl: NL_GAMES,
  pl: PL_GAMES,
  sv: SV_GAMES,
  id: ID_GAMES,
  vi: VI_GAMES,
  th: TH_GAMES,
  'zh-CN': ZH_CN_GAMES,
  'zh-TW': ZH_TW_GAMES,
  ja: JA_GAMES,
  ko: KO_GAMES,
};
