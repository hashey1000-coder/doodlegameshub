/**
 * Static-rendering entry point.
 *
 * This module is built by Vite in SSR mode and consumed by the prerender
 * script.  It exports a `render(url)` function that returns the full HTML
 * string for a given URL path (e.g. "/fr/play/pacman").
 *
 * No browser APIs are used — everything runs in Node.
 */

import { renderToString } from 'react-dom/server';
import { Router as WouterRouter, Route, Switch } from 'wouter';
import { Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { StreakProvider } from './contexts/StreakContext';
import { KidsModeProvider } from './contexts/KidsModeContext';
import {
  LanguageProvider,
  SUPPORTED_LOCALES,
  getLocaleFromPath,
  getTranslation,
  registerTranslations,
} from './contexts/LanguageContext';
import { TooltipProvider } from './components/ui/tooltip';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Re-export data for the prerender script
export { GAMES } from './data/games';
export { getGameT } from './data/gameTranslations';
export { getTranslation, SUPPORTED_LOCALES } from './contexts/LanguageContext';

// ---------------------------------------------------------------------------
// Eagerly import ALL translations for SSR (runs at build time, not in browser)
// ---------------------------------------------------------------------------
import { registerGameTranslations } from './data/gameTranslations';
import { registerTriviaTranslations } from './data/triviaTranslations';

// UI translations
import { ES } from './contexts/locales/es';
import { FR } from './contexts/locales/fr';
import { DE } from './contexts/locales/de';
import { IT } from './contexts/locales/it';
import { PT } from './contexts/locales/pt';
import { RU } from './contexts/locales/ru';
import { AR } from './contexts/locales/ar';
import { HI } from './contexts/locales/hi';
import { TR } from './contexts/locales/tr';
import { NL } from './contexts/locales/nl';
import { PL } from './contexts/locales/pl';
import { SV } from './contexts/locales/sv';
import { ID } from './contexts/locales/id';
import { VI } from './contexts/locales/vi';
import { TH } from './contexts/locales/th';
import { ZH_CN } from './contexts/locales/zh-CN';
import { ZH_TW } from './contexts/locales/zh-TW';
import { JA } from './contexts/locales/ja';
import { KO } from './contexts/locales/ko';

// Game translations
import { ES_GAMES } from './data/translations/es';
import { FR_GAMES } from './data/translations/fr';
import { DE_GAMES } from './data/translations/de';
import { IT_GAMES } from './data/translations/it';
import { PT_GAMES } from './data/translations/pt';
import { RU_GAMES } from './data/translations/ru';
import { AR_GAMES } from './data/translations/ar';
import { HI_GAMES } from './data/translations/hi';
import { TR_GAMES } from './data/translations/tr';
import { NL_GAMES } from './data/translations/nl';
import { PL_GAMES } from './data/translations/pl';
import { SV_GAMES } from './data/translations/sv';
import { ID_GAMES } from './data/translations/id';
import { VI_GAMES } from './data/translations/vi';
import { TH_GAMES } from './data/translations/th';
import { ZH_CN_GAMES } from './data/translations/zh-CN';
import { ZH_TW_GAMES } from './data/translations/zh-TW';
import { JA_GAMES } from './data/translations/ja';
import { KO_GAMES } from './data/translations/ko';

// Register all UI translations eagerly for SSR
registerTranslations('es', ES); registerTranslations('fr', FR);
registerTranslations('de', DE); registerTranslations('it', IT);
registerTranslations('pt', PT); registerTranslations('ru', RU);
registerTranslations('ar', AR); registerTranslations('hi', HI);
registerTranslations('tr', TR); registerTranslations('nl', NL);
registerTranslations('pl', PL); registerTranslations('sv', SV);
registerTranslations('id', ID); registerTranslations('vi', VI);
registerTranslations('th', TH); registerTranslations('zh-CN', ZH_CN);
registerTranslations('zh-TW', ZH_TW); registerTranslations('ja', JA);
registerTranslations('ko', KO);

// Register all game translations eagerly for SSR
registerGameTranslations('es', ES_GAMES); registerGameTranslations('fr', FR_GAMES);
registerGameTranslations('de', DE_GAMES); registerGameTranslations('it', IT_GAMES);
registerGameTranslations('pt', PT_GAMES); registerGameTranslations('ru', RU_GAMES);
registerGameTranslations('ar', AR_GAMES); registerGameTranslations('hi', HI_GAMES);
registerGameTranslations('tr', TR_GAMES); registerGameTranslations('nl', NL_GAMES);
registerGameTranslations('pl', PL_GAMES); registerGameTranslations('sv', SV_GAMES);
registerGameTranslations('id', ID_GAMES); registerGameTranslations('vi', VI_GAMES);
registerGameTranslations('th', TH_GAMES); registerGameTranslations('zh-CN', ZH_CN_GAMES);
registerGameTranslations('zh-TW', ZH_TW_GAMES); registerGameTranslations('ja', JA_GAMES);
registerGameTranslations('ko', KO_GAMES);

// Trivia translations
import { ES_TRIVIA } from './data/translations/trivia/es';
import { FR_TRIVIA } from './data/translations/trivia/fr';
import { DE_TRIVIA } from './data/translations/trivia/de';
import { IT_TRIVIA } from './data/translations/trivia/it';
import { PT_TRIVIA } from './data/translations/trivia/pt';
import { RU_TRIVIA } from './data/translations/trivia/ru';
import { AR_TRIVIA } from './data/translations/trivia/ar';
import { HI_TRIVIA } from './data/translations/trivia/hi';
import { TR_TRIVIA } from './data/translations/trivia/tr';
import { NL_TRIVIA } from './data/translations/trivia/nl';
import { PL_TRIVIA } from './data/translations/trivia/pl';
import { SV_TRIVIA } from './data/translations/trivia/sv';
import { ID_TRIVIA } from './data/translations/trivia/id';
import { VI_TRIVIA } from './data/translations/trivia/vi';
import { TH_TRIVIA } from './data/translations/trivia/th';
import { ZH_CN_TRIVIA } from './data/translations/trivia/zh-CN';
import { ZH_TW_TRIVIA } from './data/translations/trivia/zh-TW';
import { JA_TRIVIA } from './data/translations/trivia/ja';
import { KO_TRIVIA } from './data/translations/trivia/ko';

registerTriviaTranslations('es', ES_TRIVIA); registerTriviaTranslations('fr', FR_TRIVIA);
registerTriviaTranslations('de', DE_TRIVIA); registerTriviaTranslations('it', IT_TRIVIA);
registerTriviaTranslations('pt', PT_TRIVIA); registerTriviaTranslations('ru', RU_TRIVIA);
registerTriviaTranslations('ar', AR_TRIVIA); registerTriviaTranslations('hi', HI_TRIVIA);
registerTriviaTranslations('tr', TR_TRIVIA); registerTriviaTranslations('nl', NL_TRIVIA);
registerTriviaTranslations('pl', PL_TRIVIA); registerTriviaTranslations('sv', SV_TRIVIA);
registerTriviaTranslations('id', ID_TRIVIA); registerTriviaTranslations('vi', VI_TRIVIA);
registerTriviaTranslations('th', TH_TRIVIA); registerTriviaTranslations('zh-CN', ZH_CN_TRIVIA);
registerTriviaTranslations('zh-TW', ZH_TW_TRIVIA); registerTriviaTranslations('ja', JA_TRIVIA);
registerTriviaTranslations('ko', KO_TRIVIA);

// Import all pages eagerly for static rendering (no lazy/Suspense)
import Home from './pages/Home';
import PlayGame from './pages/PlayGame';
import AllGames from './pages/AllGames';
import SearchResults from './pages/SearchResults';
import TopRated from './pages/TopRated';
import Daily from './pages/Daily';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import Sitemap from './pages/Sitemap';
import Redirect from './pages/Redirect';

function AppRoutes({ url }: { url: string }) {
  // Strip locale prefix to get the route-only path
  const routePath = url.replace(/^\/[a-z]{2}(-[A-Za-z]+)?(?=\/|$)/, '') || '/';

  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/play/:slug" component={PlayGame} />
        <Route path="/games" component={AllGames} />
        <Route path="/search" component={SearchResults} />
        <Route path="/top-rated" component={TopRated} />
        <Route path="/daily" component={Daily} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/sitemap" component={Sitemap} />
        <Route path="/leaderboard">{() => <Redirect to="/top-rated" />}</Route>
        <Route path="/a-z">{() => <Redirect to="/games" />}</Route>
        <Route path="/az">{() => <Redirect to="/games" />}</Route>
        <Route path="/kids">{() => <Redirect to="/" />}</Route>
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

/**
 * Render the app for a given full URL path (e.g. "/es/play/snake").
 *
 * We set the wouter Router's `ssrPath` so it resolves the correct route
 * without needing `window.location`.  The LanguageProvider reads locale from
 * the same path.
 */
export function render(url: string): string {
  // Determine locale + route-only path
  const locale = getLocaleFromPath(url);
  const base = locale === 'en' ? '' : `/${locale}`;

  const html = renderToString(
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <StreakProvider>
          <KidsModeProvider>
            <LanguageProvider ssrLocale={locale}>
              <TooltipProvider>
                <WouterRouter base={base} ssrPath={url}>
                  <AppRoutes url={url} />
                </WouterRouter>
              </TooltipProvider>
            </LanguageProvider>
          </KidsModeProvider>
        </StreakProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );

  return html;
}
