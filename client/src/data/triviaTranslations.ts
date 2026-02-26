/**
 * Trivia-specific translations — localised "Did you know?" facts for every game.
 *
 * English is the fallback and comes from `trivia.ts` directly — no EN map needed here.
 */

import { useLanguage } from '@/contexts/LanguageContext';
import { GAME_TRIVIA } from './trivia';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** locale → slug → translated trivia string */
export type TriviaTranslationMap = Record<string, Record<string, string>>;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns localised trivia text for a given game slug.
 * Falls back to the English value from `trivia.ts` when no translation exists.
 */
export function useTriviaT(slug: string): string | undefined {
  const { locale } = useLanguage();
  const enTrivia = GAME_TRIVIA[slug];
  if (!enTrivia) return undefined;
  if (locale === 'en') return enTrivia;
  const localeMap = TRIVIA_TRANSLATIONS[locale];
  if (!localeMap) return enTrivia;
  return localeMap[slug] || enTrivia;
}

/**
 * Non-hook variant for use inside effects / callbacks where we already have
 * the locale string.
 */
export function getTriviaT(locale: string, slug: string): string | undefined {
  const enTrivia = GAME_TRIVIA[slug];
  if (!enTrivia) return undefined;
  if (locale === 'en') return enTrivia;
  const localeMap = TRIVIA_TRANSLATIONS[locale];
  if (!localeMap) return enTrivia;
  return localeMap[slug] || enTrivia;
}

// ---------------------------------------------------------------------------
// Translation data — imported from per-locale files
// ---------------------------------------------------------------------------

import { ES_TRIVIA } from './translations/trivia/es';
import { FR_TRIVIA } from './translations/trivia/fr';
import { DE_TRIVIA } from './translations/trivia/de';
import { IT_TRIVIA } from './translations/trivia/it';
import { PT_TRIVIA } from './translations/trivia/pt';
import { RU_TRIVIA } from './translations/trivia/ru';
import { AR_TRIVIA } from './translations/trivia/ar';
import { HI_TRIVIA } from './translations/trivia/hi';
import { TR_TRIVIA } from './translations/trivia/tr';
import { NL_TRIVIA } from './translations/trivia/nl';
import { PL_TRIVIA } from './translations/trivia/pl';
import { SV_TRIVIA } from './translations/trivia/sv';
import { ID_TRIVIA } from './translations/trivia/id';
import { VI_TRIVIA } from './translations/trivia/vi';
import { TH_TRIVIA } from './translations/trivia/th';
import { ZH_CN_TRIVIA } from './translations/trivia/zh-CN';
import { ZH_TW_TRIVIA } from './translations/trivia/zh-TW';
import { JA_TRIVIA } from './translations/trivia/ja';
import { KO_TRIVIA } from './translations/trivia/ko';

export const TRIVIA_TRANSLATIONS: TriviaTranslationMap = {
  es: ES_TRIVIA,
  fr: FR_TRIVIA,
  de: DE_TRIVIA,
  it: IT_TRIVIA,
  pt: PT_TRIVIA,
  ru: RU_TRIVIA,
  ar: AR_TRIVIA,
  hi: HI_TRIVIA,
  tr: TR_TRIVIA,
  nl: NL_TRIVIA,
  pl: PL_TRIVIA,
  sv: SV_TRIVIA,
  id: ID_TRIVIA,
  vi: VI_TRIVIA,
  th: TH_TRIVIA,
  'zh-CN': ZH_CN_TRIVIA,
  'zh-TW': ZH_TW_TRIVIA,
  ja: JA_TRIVIA,
  ko: KO_TRIVIA,
};
