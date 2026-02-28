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
// Translation data — lazy-loaded per locale
// ---------------------------------------------------------------------------

/** Mutable map — locales are added lazily or eagerly (SSR) */
export const TRIVIA_TRANSLATIONS: TriviaTranslationMap = {};

const TRIVIA_LOCALE_LOADERS: Record<string, () => Promise<Record<string, string>>> = {
  es: () => import('./translations/trivia/es').then(m => m.ES_TRIVIA),
  fr: () => import('./translations/trivia/fr').then(m => m.FR_TRIVIA),
  de: () => import('./translations/trivia/de').then(m => m.DE_TRIVIA),
  it: () => import('./translations/trivia/it').then(m => m.IT_TRIVIA),
  pt: () => import('./translations/trivia/pt').then(m => m.PT_TRIVIA),
  ru: () => import('./translations/trivia/ru').then(m => m.RU_TRIVIA),
  ar: () => import('./translations/trivia/ar').then(m => m.AR_TRIVIA),
  hi: () => import('./translations/trivia/hi').then(m => m.HI_TRIVIA),
  tr: () => import('./translations/trivia/tr').then(m => m.TR_TRIVIA),
  nl: () => import('./translations/trivia/nl').then(m => m.NL_TRIVIA),
  pl: () => import('./translations/trivia/pl').then(m => m.PL_TRIVIA),
  sv: () => import('./translations/trivia/sv').then(m => m.SV_TRIVIA),
  id: () => import('./translations/trivia/id').then(m => m.ID_TRIVIA),
  vi: () => import('./translations/trivia/vi').then(m => m.VI_TRIVIA),
  th: () => import('./translations/trivia/th').then(m => m.TH_TRIVIA),
  'zh-CN': () => import('./translations/trivia/zh-CN').then(m => m.ZH_CN_TRIVIA),
  'zh-TW': () => import('./translations/trivia/zh-TW').then(m => m.ZH_TW_TRIVIA),
  ja: () => import('./translations/trivia/ja').then(m => m.JA_TRIVIA),
  ko: () => import('./translations/trivia/ko').then(m => m.KO_TRIVIA),
};

const _triviaLoadCache: Partial<Record<string, Promise<void>>> = {};

export function loadTriviaLocale(code: string): Promise<void> {
  if (code === 'en' || TRIVIA_TRANSLATIONS[code]) return Promise.resolve();
  if (_triviaLoadCache[code]) return _triviaLoadCache[code]!;
  const loader = TRIVIA_LOCALE_LOADERS[code];
  if (!loader) return Promise.resolve();
  _triviaLoadCache[code] = loader().then(data => {
    TRIVIA_TRANSLATIONS[code] = data;
  });
  return _triviaLoadCache[code]!;
}

export function registerTriviaTranslations(locale: string, map: Record<string, string>) {
  TRIVIA_TRANSLATIONS[locale] = map;
}
