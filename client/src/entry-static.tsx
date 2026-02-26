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
} from './contexts/LanguageContext';
import { TooltipProvider } from './components/ui/tooltip';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Re-export data for the prerender script
export { GAMES } from './data/games';
export { getGameT } from './data/gameTranslations';
export { getTranslation, SUPPORTED_LOCALES } from './contexts/LanguageContext';

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
