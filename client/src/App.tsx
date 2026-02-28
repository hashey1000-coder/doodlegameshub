import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Router as WouterRouter, Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./contexts/ThemeContext";
import { StreakProvider } from "./contexts/StreakContext";
import { KidsModeProvider } from "./contexts/KidsModeContext";
import { LanguageProvider, useLanguage, SUPPORTED_LOCALES } from "./contexts/LanguageContext";

// All pages loaded eagerly — prerendered HTML hydrates seamlessly without
// content flash. The big perf win is lazy translations, not page splitting.
import Home from "./pages/Home";
import PlayGame from "./pages/PlayGame";
import AllGames from "./pages/AllGames";
import SearchResults from "./pages/SearchResults";
import TopRated from "./pages/TopRated";
import Daily from "./pages/Daily";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Sitemap from "./pages/Sitemap";
import Redirect from "./pages/Redirect";
import NotFound from "./pages/NotFound";

/**
 * The inner routes — rendered inside a WouterRouter whose `base` is already
 * set to the locale prefix (e.g. "/es" or "").  All useParams() calls in page
 * components therefore see the correct param names (slug, etc.).
 */
function AppRoutes() {
  const [location] = useLocation();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
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
      </main>
      <Footer />
    </>
  );
}

/**
 * Reads the current locale from LanguageContext and sets the wouter Router
 * base to "/<locale>" (or "" for English so URLs stay clean).
 */
function LocaleRouter() {
  const { locale } = useLanguage();
  const base = locale === "en" ? "" : `/${locale}`;
  return (
    <WouterRouter base={base}>
      <AppRoutes />
    </WouterRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <StreakProvider>
          <KidsModeProvider>
            <LanguageProvider>
              <TooltipProvider>
                <Toaster />
                <LocaleRouter />
              </TooltipProvider>
            </LanguageProvider>
          </KidsModeProvider>
        </StreakProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
