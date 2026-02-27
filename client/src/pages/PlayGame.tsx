import { useT, useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePlayTimer, saveSession, formatDuration } from "@/hooks/usePlayTimer";
import { SessionHistory } from "@/components/SessionHistory";
const lazyConfetti = () => import("canvas-confetti").then(m => m.default);
import { toast } from "sonner";
import { Link, useParams, useLocation, useSearch } from "wouter";
import { Maximize2, Minimize2, ChevronLeft, Play, ThumbsUp, ThumbsDown, Gamepad2, X, Share2, Check, ArrowRight, Shuffle, SkipForward, Trophy } from "lucide-react";
import { GAMES, type Game } from "@/data/games";
import { useGameTranslate, getGameT } from '@/data/gameTranslations';
import { GAME_TRIVIA } from "@/data/trivia";
import GamePageSkeleton from "@/components/GamePageSkeleton";
import TriviaCard from "@/components/TriviaCard";
import { useRecentlyPlayed } from "@/hooks/useRecentlyPlayed";
import { useStreakContext } from "@/contexts/StreakContext";
import { CATEGORY_COLORS, CATEGORY_COLORS_BORDERED, CATEGORY_ACCENT, CATEGORY_FALLBACK } from '@/data/categoryColors';
import { prefetchGameUrl } from '@/lib/utils';
import { useHead } from '@/hooks/useHead';

// Persist likes/dislikes in localStorage — seeded from game.rating
function useLikeDislike(slug: string) {
  const storageKey = `game-votes-${slug}`;
  const userVoteKey = `game-uservote-${slug}`;

  const getSeededVotes = () => {
    // Seed realistic initial vote counts from the game's rating/playCount
    const game = GAMES.find((g) => g.slug === slug);
    if (!game) return { likes: 0, dislikes: 0 };
    // Generate a base vote count from rating & popularity
    const baseLikes = Math.round(game.rating * (game.playCount || 50) / 100);
    const baseDislikes = Math.round(baseLikes * (1 - game.rating / 5) * 0.3);
    return { likes: Math.max(baseLikes, 1), dislikes: Math.max(baseDislikes, 0) };
  };

  const getVotes = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : getSeededVotes();
    } catch {
      return getSeededVotes();
    }
  };

  const getUserVote = (): "like" | "dislike" | null => {
    try {
      return (localStorage.getItem(userVoteKey) as "like" | "dislike" | null);
    } catch {
      return null;
    }
  };

  const [votes, setVotes] = useState(getVotes);
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(getUserVote);

  useEffect(() => {
    setVotes(getVotes());
    setUserVote(getUserVote());
  }, [slug]);

  const vote = (type: "like" | "dislike") => {
    const current = getVotes();
    const currentUserVote = getUserVote();
    let newVotes = { ...current };

    if (currentUserVote === type) {
      newVotes[type === "like" ? "likes" : "dislikes"] = Math.max(0, newVotes[type === "like" ? "likes" : "dislikes"] - 1);
      localStorage.removeItem(userVoteKey);
      setUserVote(null);
    } else {
      if (currentUserVote === "like") newVotes.likes = Math.max(0, newVotes.likes - 1);
      if (currentUserVote === "dislike") newVotes.dislikes = Math.max(0, newVotes.dislikes - 1);
      if (type === "like") newVotes.likes += 1;
      else newVotes.dislikes += 1;
      localStorage.setItem(userVoteKey, type);
      setUserVote(type);
    }

    localStorage.setItem(storageKey, JSON.stringify(newVotes));
    setVotes(newVotes);
  };

  return { votes, userVote, vote };
}

// Get related games: same category first, then random
function getRelatedGames(game: Game, count = 20): Game[] {
  const sameCategory = GAMES.filter((g) => g.slug !== game.slug && g.category === game.category);
  const others = GAMES.filter((g) => g.slug !== game.slug && g.category !== game.category);
  const shuffledSame = [...sameCategory].sort(() => Math.random() - 0.5);
  const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
  return [...shuffledSame, ...shuffledOthers].slice(0, count);
}

// Get a single "play next" suggestion (same category, different game)
function getNextSuggestion(game: Game): Game {
  const sameCategory = GAMES.filter((g) => g.slug !== game.slug && g.category === game.category);
  if (sameCategory.length > 0) {
    return sameCategory[Math.floor(Math.random() * sameCategory.length)];
  }
  const others = GAMES.filter((g) => g.slug !== game.slug);
  return others[Math.floor(Math.random() * others.length)];
}

const PLAY_NEXT_COUNTDOWN = 15; // seconds

/** Extract the origin from a URL for preconnect hints */
function getOrigin(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export default function PlayGame() {
  // --- Fullscreen helpers ---

  // CSS-based fullscreen: React controls the class via isFakeFullscreen state.
  // We must NOT mutate classList directly — React re-render will overwrite it.
  function enterCSSFullscreen() {
    document.body.style.overflow = "hidden";
    // Setting state triggers re-render which adds 'fullscreen-container' class via JSX
    setIsFakeFullscreen(true);
  }

  function exitCSSFullscreen() {
    document.body.style.overflow = "";
    // Setting state triggers re-render which removes 'fullscreen-container' class via JSX
    setIsFakeFullscreen(false);
  }

  async function enterFullscreen() {
    const container = document.getElementById("game-player-container");
    if (!container) { enterCSSFullscreen(); return; }
    try {
      // requestFullscreen rejects on iOS for iframe-containing divs — catch it
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        await (container as any).webkitRequestFullscreen();
      } else {
        enterCSSFullscreen();
      }
    } catch {
      // Native fullscreen denied or not supported (common on iOS) — use CSS fallback
      enterCSSFullscreen();
    }
  }

  function exitFullscreen() {
    const isNativeFS = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
    if (isNativeFS) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
      else if ((document as any).mozCancelFullScreen) (document as any).mozCancelFullScreen();
      else if ((document as any).msExitFullscreen) (document as any).msExitFullscreen();
    } else {
      exitCSSFullscreen();
    }
  }
  const t = useT();
  const gt = useGameTranslate();
  const { locale } = useLanguage();
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isFakeFullscreen, setIsFakeFullscreen] = useState(false);
  const [moreGames, setMoreGames] = useState<Game[]>([]);

  // Play Next overlay state
  const [showPlayNext, setShowPlayNext] = useState(false);
  const [nextGame, setNextGame] = useState<Game | null>(null);
  const [countdown, setCountdown] = useState(PLAY_NEXT_COUNTDOWN);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Timer to show Play Next overlay after game has been playing for a while
  const playNextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { addRecentlyPlayed } = useRecentlyPlayed(GAMES);
  const { recordPlay } = useStreakContext();
  const searchStr = useSearch();
  const isChallenge = new URLSearchParams(searchStr).get("challenge") === "true";

  // ── Preconnect to the game's host as soon as we know the URL ────────────
  // This starts DNS + TLS handshake before the user clicks Play, shaving
  // 200-600 ms off the perceived load time.
  const gameOrigin = useMemo(() => (game ? getOrigin(game.iframeUrl) : null), [game]);
  useEffect(() => {
    if (!gameOrigin) return;
    // Inject <link rel="preconnect"> into <head> (idempotent)
    const id = `preconnect-${gameOrigin}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'preconnect';
    link.href = gameOrigin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, [gameOrigin]);

  // Preload the game document at high priority as soon as we know the URL.
  // This tells the browser to start fetching the iframe HTML immediately,
  // often shaving seconds off the load because the request is queued before
  // the iframe element even renders in the DOM.
  useEffect(() => {
    if (!game?.iframeUrl) return;
    const id = 'preload-game-doc';
    if (document.getElementById(id)) {
      (document.getElementById(id) as HTMLLinkElement).href = game.iframeUrl;
      return;
    }
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'preload';
    link.as = 'document';
    link.href = game.iframeUrl;
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, [game?.iframeUrl]);

  // Reset iframe-loaded flag when game changes
  useEffect(() => { setIframeLoaded(false); setIframeError(false); }, [routeSlug]);

  // ── Iframe load timeout — show error UI if iframe hasn't loaded in 30s ──
  useEffect(() => {
    if (iframeLoaded || iframeError || !game) return;
    const timer = setTimeout(() => {
      if (!iframeLoaded) setIframeError(true);
    }, 30_000);
    return () => clearTimeout(timer);
  }, [game, iframeLoaded, iframeError]);

  // ── Playtime tracker ──────────────────────────────────────────────────────
  // Use routeSlug directly (always available from URL) rather than game?.slug
  // which is only set after the useEffect runs. This ensures sessions are
  // always saved even if the user navigates away very quickly.
  const gameTitle = game?.title ?? "";
  // Use refs so the onSessionEnd callback always has the latest slug/title
  // even though the callback is captured as a closure at mount time
  const currentSlugRef = useRef(routeSlug ?? "");
  const gameTitleRef = useRef(gameTitle);
  currentSlugRef.current = routeSlug ?? "";
  gameTitleRef.current = gameTitle;
  const elapsed = usePlayTimer((seconds) => {
    const slug = currentSlugRef.current;
    if (!slug) return;
    const isNewBest = saveSession(slug, seconds);
    if (isNewBest && seconds >= 30) {
      // Fire confetti burst from both sides (lazy-loaded)
      lazyConfetti().then(confettiFn => {
        const fire = (angle: number, origin: { x: number; y: number }) => {
          confettiFn({
            angle,
            spread: 55,
            particleCount: 80,
            origin,
            colors: ["#7c3aed", "#a855f7", "#f59e0b", "#10b981", "#ec4899", "#ffffff"],
            scalar: 1.1,
            gravity: 1.2,
          });
        };
        fire(60, { x: 0, y: 0.7 });
        fire(120, { x: 1, y: 0.7 });
        setTimeout(() => {
          fire(70, { x: 0.1, y: 0.6 });
          fire(110, { x: 0.9, y: 0.6 });
        }, 200);
      });
      // Show PB toast
      toast(
        `🏆 ${t('game.pbToast')} ${gameTitleRef.current}!`,
        {
          description: `${t('game.playTime')} ${formatDuration(seconds)} — ${t('game.longestSession')}`,
          duration: 6000,
          classNames: {
            toast: "!bg-gradient-to-br !from-[#1e1b4b] !to-[#2e1065] !border-violet-600",
            title: "!text-violet-100",
            description: "!text-violet-300",
          },
        }
      );
    }
  });
  const isPlaying = gameStarted && elapsed >= 5;
  const [challengeBannerDismissed, setChallengeBannerDismissed] = useState(false);
  const [challengeCopied, setChallengeCopied] = useState(false);

  // Exit-intent vote prompt
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const [exitPromptDismissed, setExitPromptDismissed] = useState(false);
  const pendingNavRef = useRef<string | null>(null);
  const exitPromptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Refs for latest values so click handler closure always reads current state
  const gameStartedRef = useRef(false);
  const userVoteRef = useRef<string | null>(null);
  const exitPromptDismissedRef = useRef(false);

  // Dismiss exit prompt and optionally navigate
  const dismissExitPrompt = useCallback((doNavigate = false) => {
    setShowExitPrompt(false);
    setExitPromptDismissed(true);
    if (exitPromptTimerRef.current) clearTimeout(exitPromptTimerRef.current);
    if (doNavigate && pendingNavRef.current) {
      const dest = pendingNavRef.current;
      pendingNavRef.current = null;
      navigate(dest);
    }
  }, [navigate]);

  const dismissPlayNext = useCallback(() => {
    setShowPlayNext(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const goToNextGame = useCallback((slug: string) => {
    dismissPlayNext();
    navigate(`/play/${slug}/`);
  }, [dismissPlayNext, navigate]);

  const refreshNextSuggestion = useCallback(() => {
    if (game) {
      setNextGame(getNextSuggestion(game));
      setCountdown(PLAY_NEXT_COUNTDOWN);
    }
  }, [game]);

  // Auto-dismiss exit prompt after 8 seconds
  useEffect(() => {
    if (showExitPrompt) {
      exitPromptTimerRef.current = setTimeout(() => {
        setShowExitPrompt(false);
        setExitPromptDismissed(true);
        if (pendingNavRef.current) {
          const dest = pendingNavRef.current;
          pendingNavRef.current = null;
          navigate(dest);
        }
      }, 8000);
    }
    return () => {
      if (exitPromptTimerRef.current) clearTimeout(exitPromptTimerRef.current);
    };
  }, [showExitPrompt, navigate]);

  // Start countdown when overlay appears
  useEffect(() => {
    if (showPlayNext && nextGame) {
      setCountdown(PLAY_NEXT_COUNTDOWN);
      if (countdownRef.current) clearInterval(countdownRef.current);
      countdownRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            goToNextGame(nextGame.slug);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [showPlayNext, nextGame, goToNextGame]);

  // Show Play Next overlay after 3 minutes of gameplay
  useEffect(() => {
    if (gameStarted && game) {
      if (playNextTimerRef.current) clearTimeout(playNextTimerRef.current);
      playNextTimerRef.current = setTimeout(() => {
        setNextGame(getNextSuggestion(game));
        setShowPlayNext(true);
      }, 3 * 60 * 1000); // 3 minutes
    }
    return () => {
      if (playNextTimerRef.current) clearTimeout(playNextTimerRef.current);
    };
  }, [gameStarted, game]);

  useEffect(() => {
    if (routeSlug) {
      const found = GAMES.find((g) => g.slug === routeSlug);
      if (found) {
        setGame(found);
        setGameStarted(false);
        setShowPlayNext(false);
        setMoreGames(getRelatedGames(found, 20));
        addRecentlyPlayed(routeSlug);
        recordPlay();
      }
    }
    setIsLoading(false);
  }, [routeSlug]);

  // Escape key exits CSS fullscreen
  useEffect(() => {
    if (!isFakeFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exitCSSFullscreen();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFakeFullscreen]);

  const gameSlug = routeSlug ?? game?.slug ?? "";
  const { votes, userVote, vote } = useLikeDislike(gameSlug);
  const [copied, setCopied] = useState(false);

  // SEO — useHead manages title, meta, OG, twitter, hreflang, canonical
  const gameSeo = useMemo(() => {
    if (!game) return null;
    const { title: gameTitle, description: gameDesc } = getGameT(locale, game);
    const pageTitle = (t('seo.play.title' as any) as string).replace('{title}', gameTitle);
    const pageDesc = (t('seo.play.description' as any) as string)
      .replace('{title}', gameTitle)
      .replace('{description}', gameDesc.slice(0, 140));
    return { pageTitle, pageDesc, gameTitle, gameDesc };
  }, [game, locale, t]);

  useHead({
    title: gameSeo?.pageTitle ?? t('seo.defaultTitle' as any),
    description: gameSeo?.pageDesc ?? t('seo.defaultDescription' as any),
    routePath: game ? `/play/${game.slug}/` : undefined,
    ogImage: game?.thumbnail,
  });

  // JSON-LD VideoGame structured data (separate from useHead)
  useEffect(() => {
    if (game && gameSeo) {
      const existingScript = document.getElementById('jsonld-game');
      if (existingScript) existingScript.remove();
      const script = document.createElement('script');
      script.id = 'jsonld-game';
      script.type = 'application/ld+json';
      const difficultyMap: Record<string, string> = {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
      };
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: gameSeo.gameTitle,
        description: gameSeo.gameDesc,
        image: game.thumbnail,
        url: window.location.href,
        genre: game.category,
        gamePlatform: 'Web Browser',
        applicationCategory: 'Game',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        educationalLevel: difficultyMap[game.difficulty] ?? 'Medium',
        publisher: {
          '@type': 'Organization',
          name: 'Google',
        },
        provider: {
          '@type': 'Organization',
          name: 'Doodle Games Hub',
          url: window.location.origin,
        },
      });
      document.head.appendChild(script);
    }
    return () => {
      const script = document.getElementById('jsonld-game');
      if (script) script.remove();
    };
  }, [game, gameSeo]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: game ? gt(game).title : '', url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyChallenge = async () => {
    const url = `${window.location.origin}${locale === 'en' ? '' : `/${locale}`}/play/${game?.slug}/?challenge=true`;
    try {
      await navigator.clipboard.writeText(url);
      setChallengeCopied(true);
      setTimeout(() => setChallengeCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  // Keep refs in sync with state so click handler always reads latest values
  useEffect(() => { gameStartedRef.current = gameStarted; }, [gameStarted]);
  useEffect(() => { userVoteRef.current = userVote ?? null; }, [userVote]);
  useEffect(() => { exitPromptDismissedRef.current = exitPromptDismissed; }, [exitPromptDismissed]);

  // Navigation interception: intercept Link clicks to show exit prompt if no vote yet
  useEffect(() => {
    if (!game) return;
    // wouter's Router base — links rendered by <Link> include it in href
    const base = locale === "en" ? "" : `/${locale}`;
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('//')) return;
      // Strip the locale base prefix so navigate() (which re-adds it) doesn't double it
      const stripped = base && href.startsWith(base + '/') ? href.slice(base.length)
                     : base && href === base ? '/'
                     : href;
      // Only intercept navigation away from this game page
      if (stripped.startsWith(`/play/${game.slug}`)) return;
      // Use refs so we always read the latest values (not stale closure)
      if (!userVoteRef.current && !exitPromptDismissedRef.current && gameStartedRef.current) {
        e.preventDefault();
        e.stopPropagation();
        pendingNavRef.current = stripped;
        setShowExitPrompt(true);
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [game, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
        <GamePageSkeleton />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('game.notFound')}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{t('game.notFoundDesc')}</p>
          <Link href="/">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-full text-sm font-medium hover:bg-violet-700 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              {t('game.backToGames')}
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
        {/* Challenge banner */}
        {isChallenge && !challengeBannerDismissed && (
          <div className="mb-4 flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl px-4 py-3 shadow-sm">
            <span className="text-xl">🏆</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{t('game.challenged')}</p>
              <p className="text-xs text-white/80">{t('game.challengeDesc')}</p>
            </div>
            <button
              onClick={() => setChallengeBannerDismissed(true)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
              aria-label={t('common.close' as any)}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link href="/">
            <span className="flex items-center gap-1 text-violet-600 hover:text-violet-700 transition-colors font-medium">
              <ChevronLeft className="w-4 h-4" />
              {t('nav.allGames')}
            </span>
          </Link>
          <span className="text-slate-300 dark:text-slate-400">/</span>
          <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{gt(game).title}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">
          {gt(game).title}
        </h1>
        {/* Difficulty badge + play count — no fake star ratings */}
        <div className="flex items-center gap-3 mb-5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            game.difficulty === 'easy'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
              : game.difficulty === 'hard'
              ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
          }`}>
            {game.difficulty === 'easy' ? '😊' : game.difficulty === 'hard' ? '🔥' : '⚡'} {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
          </span>
          <span className="text-slate-300 dark:text-slate-400">·</span>
          <span className="text-sm text-slate-500 dark:text-slate-300">
            {game.playCount >= 1_000_000
              ? `${(game.playCount / 1_000_000).toFixed(1)}M ${t('common.plays')}`
              : game.playCount >= 1_000
              ? `${(game.playCount / 1_000).toFixed(0)}K ${t('common.plays')}`
              : `${game.playCount} ${t('common.plays')}`}
          </span>
        </div>

        {/* Main layout: Game + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Game column */}
          <div className="flex-1 min-w-0 overflow-hidden w-full">

            {/* Game iframe with click-to-play overlay */}
            <div id="game-player-container" className={`game-iframe-container relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm ${
              isFakeFullscreen
                ? 'fullscreen-container'
                : 'overflow-hidden rounded-2xl'
            }`}>
              {/* Fullscreen / Exit fullscreen button */}
              {gameStarted && (
                <button
                  onClick={isFakeFullscreen ? exitFullscreen : enterFullscreen}
                  className="absolute top-3 right-3 z-20 w-8 h-8 bg-slate-800/70 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center transition-colors backdrop-blur-sm"
                  title={t('game.fullscreen' as any)}
                  aria-label={t('game.fullscreen' as any)}
                >
                  {isFakeFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              )}

              {/* Play Next button (visible while playing) */}
              {gameStarted && (
                <button
                  onClick={() => {
                    if (isFakeFullscreen) exitFullscreen();
                    setNextGame(getNextSuggestion(game));
                    setShowPlayNext(true);
                  }}
                  className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/80 hover:bg-violet-600 text-white text-xs font-semibold rounded-lg transition-colors backdrop-blur-sm"
                  title={t('game.suggestNext' as any)}
                  aria-label={t('game.suggestNext' as any)}
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  {t('game.moreGames')}
                </button>
              )}

              {/* Click-to-play overlay */}
              {!gameStarted && (
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`${t('game.play')} ${gt(game).title}`}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer group"
                  style={{ background: "rgba(0,0,0,0.55)" }}
                  onClick={() => { setGameStarted(true); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setGameStarted(true); } }}
                >
                  <img
                    src={game.thumbnail}
                    alt={gt(game).title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: "brightness(0.45)" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-200 shadow-2xl">
                      <Play className="w-9 h-9 text-white fill-white ml-1" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-xl drop-shadow-lg">{gt(game).title}</p>
                      <p className="text-white/70 text-sm mt-1">{iframeLoaded ? t('game.play') : (t('game.loading' as any) || 'Loading...')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading overlay — shown after play clicked but iframe hasn't finished yet */}
              {gameStarted && !iframeLoaded && !iframeError && (
                <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-violet-500/30" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" />
                  </div>
                  <p className="text-white/90 text-sm font-medium">{t('game.loading' as any) || 'Loading game...'}</p>
                </div>
              )}

              {/* Error overlay — shown when iframe fails to load (timeout or error) */}
              {iframeError && (
                <div className="absolute inset-0 z-[15] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
                  <div className="w-16 h-16 mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-white font-bold text-lg mb-1">{t('game.loadError' as any)}</p>
                  <p className="text-white/60 text-sm text-center max-w-xs mb-6">{t('game.loadErrorDesc' as any)}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setIframeError(false);
                        setIframeLoaded(false);
                        // Force iframe reload by briefly clearing src
                        const iframe = iframeRef.current;
                        if (iframe && game) {
                          const url = game.iframeUrl;
                          iframe.src = '';
                          requestAnimationFrame(() => { iframe.src = url; });
                        }
                      }}
                      className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      {t('game.tryAgain' as any)}
                    </button>
                    <button
                      onClick={() => {
                        const suggestion = getNextSuggestion(game!);
                        navigate(`/play/${suggestion.slug}/`);
                      }}
                      className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Shuffle className="w-4 h-4" />
                      {t('game.moreGames')}
                    </button>
                  </div>
                </div>
              )}

              {/* Game iframe — loads eagerly so it's ready when the user clicks Play.
                  pointer-events disabled while overlay is showing to prevent accidental
                  interaction and to stop the iframe from stealing scroll/touch events. */}
              <iframe
                ref={iframeRef}
                id="game-iframe"
                src={game.iframeUrl}
                title={gt(game).title}
                className={isFakeFullscreen
                  ? 'w-full h-full'
                  : 'w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-auto md:h-[520px]'
                }
                style={{
                  border: "none",
                  display: "block",
                  pointerEvents: gameStarted ? "auto" : "none",
                }}
                allowFullScreen
                allow="fullscreen; autoplay"
                // @ts-expect-error -- fetchpriority is valid HTML but not yet in React's types
                fetchpriority="high"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>

            {/* Action bar: Like, Dislike, Controls */}
            <div className="mt-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Like button */}
              <button
                onClick={() => vote("like")}
                aria-label={`${t('game.vote.helpful' as any)} (${votes.likes})`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                  userVote === "like"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{votes.likes}</span>
              </button>

              {/* Dislike button */}
              <button
                onClick={() => vote("dislike")}
                aria-label={`${t('game.vote.notHelpful' as any)} (${votes.dislikes})`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                  userVote === "dislike"
                    ? "bg-red-500 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500"
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>{votes.dislikes}</span>
              </button>

              <div className="flex-1" />

              {/* Challenge a Friend button */}
              <button
                onClick={handleCopyChallenge}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                  challengeCopied
                    ? "bg-amber-500 text-white"
                    : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                }`}
                title={t('game.challengeFriend')}
                aria-label={t('game.challengeFriend')}
              >
                {challengeCopied ? <Check className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
                <span className="hidden sm:inline">{challengeCopied ? t('common.copied') : t('game.challengeFriend')}</span>
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
                title={t('game.shareGame' as any)}
                aria-label={t('game.share')}
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? t('common.copied') : t('game.share')}</span>
              </button>

              {/* Controls button */}
              <button
                onClick={() => setShowControls(true)}
                aria-label={t('game.howToPlay')}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>{t('game.howToPlay')}</span>
              </button>
            </div>

            {/* About section */}
            <div className="mt-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">{t('game.details')}</h2>
              <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3 space-y-2">
                {gt(game).description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-full capitalize ${
                    CATEGORY_COLORS[game.category] || "text-violet-600 bg-violet-50"
                  }`}
                >
                  {t(`category.${game.category}` as any)}
                </span>
                <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  game.difficulty === 'easy' ? 'bg-green-50 text-green-600' :
                  game.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {t(`difficulty.${game.difficulty}` as any)}
                </span>
                {game.tags
                  .filter((tag) => tag !== game.category && tag !== game.difficulty)
                  .slice(0, 4)
                  .map((tag) => {
                    const label = (t(`tag.${tag.replace(/-/g, '')}` as any) || tag.replace(/-/g, ' ')).replace(/^tag[.:]\s*/i, '');
                    return (
                      <span key={tag} className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 capitalize">
                        {label}
                      </span>
                    );
                  })}
              </div>
            </div>

            {/* Did You Know trivia card */}
            {GAME_TRIVIA[game.slug] && (
              <TriviaCard slug={game.slug} title={gt(game).title} />
            )}

            {/* Personal best sessions */}
            <SessionHistory
              slug={game.slug}
              currentElapsed={elapsed}
              isPlaying={isPlaying}
            />

            {/* More Like This section */}
            {(() => {
              const sameCategory = moreGames.filter((g) => g.category === game.category);
              const otherGames = moreGames.filter((g) => g.category !== game.category).slice(0, Math.max(0, 8 - sameCategory.length));
              const allRelated = [...sameCategory, ...otherGames].slice(0, 8);
              return (
                <div className="mt-8">
                  {/* Same-category section */}
                  {sameCategory.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-6 rounded-full ${CATEGORY_ACCENT[game.category] || 'bg-violet-500'}`} />
                          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 capitalize">
                            {t('game.moreGames')} — {t(`category.${game.category}` as any)}
                          </h2>
                        </div>
                        <Link href={`/?category=${game.category}`}>
                          <span className="text-xs text-violet-500 hover:text-violet-700 font-medium flex items-center gap-1 cursor-pointer transition-colors">
                            {t('common.seeAll')} <ArrowRight className="w-3 h-3" />
                          </span>
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {sameCategory.slice(0, 4).map((g) => (
                          <Link key={g.slug} href={`/play/${g.slug}/`} className="block h-full">
                            <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full flex flex-col"
                              onMouseEnter={() => prefetchGameUrl(g.iframeUrl)}>
                              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img
                                  src={g.thumbnail}
                                  alt={gt(g).title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                  onError={(e) => {
                                    const el = e.target as HTMLImageElement;
                                    el.style.display = 'none';
                                    el.parentElement!.insertAdjacentHTML('afterbegin', '<div class="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-3xl">🎮</div>');
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-3">
                                  <div className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 rounded-full px-3 py-1">
                                    <Play className="w-3 h-3 text-violet-600 fill-violet-600" />
                                    <span className="text-[11px] font-bold text-violet-600">{t('common.play')}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="p-2.5 flex-1 flex flex-col">
                                <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 leading-tight line-clamp-2 group-hover:text-violet-600 transition-colors mb-1">
                                  {gt(g).title}
                                </p>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-auto self-start ${
                                  g.difficulty === 'easy' ? 'bg-green-50 text-green-600' :
                                  g.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' :
                                  'bg-red-50 text-red-600'
                                }`}>
                                  {t(`difficulty.${g.difficulty}` as any)}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* You might also like */}
                  {otherGames.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-6 rounded-full bg-slate-300" />
                        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{t('game.youMightLike')}</h2>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {allRelated.filter((g) => g.category !== game.category).slice(0, 4).map((g) => (
                          <Link key={g.slug} href={`/play/${g.slug}/`} className="block h-full">
                            <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full flex flex-col"
                              onMouseEnter={() => prefetchGameUrl(g.iframeUrl)}>
                              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img
                                  src={g.thumbnail}
                                  alt={gt(g).title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                  onError={(e) => {
                                    const el = e.target as HTMLImageElement;
                                    el.style.display = 'none';
                                    el.parentElement!.insertAdjacentHTML('afterbegin', '<div class="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-3xl">🎮</div>');
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-3">
                                  <div className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 rounded-full px-3 py-1">
                                    <Play className="w-3 h-3 text-violet-600 fill-violet-600" />
                                    <span className="text-[11px] font-bold text-violet-600">{t('common.play')}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="p-2.5 flex-1 flex flex-col">
                                <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 leading-tight line-clamp-2 group-hover:text-violet-600 transition-colors mb-1">
                                  {gt(g).title}
                                </p>
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 capitalize mt-auto self-start">
                                  {t(`category.${g.category}` as any)}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Sidebar: compact game list — hidden on mobile, visible on lg+ */}
          <div className="hidden lg:block lg:w-[220px] lg:shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden sticky top-4">
              <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t('game.moreGames')}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{t('game.youMightLike')}</p>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-[520px] overflow-y-auto">
                {GAMES.filter((g) => g.slug !== game.slug)
                  .slice(0, 8)
                  .map((related) => (
                    <Link key={related.slug} href={`/play/${related.slug}/`}>
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                        onMouseEnter={() => prefetchGameUrl(related.iframeUrl)}>
                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                          <img
                            src={related.thumbnail}
                            alt={gt(related).title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const el = e.target as HTMLImageElement;
                              el.style.display = 'none';
                              el.parentElement!.insertAdjacentHTML('afterbegin', '<div class="w-full h-full flex items-center justify-center bg-slate-200 rounded-lg text-lg">🎮</div>');
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-slate-700 dark:text-slate-300 leading-tight line-clamp-2 group-hover:text-violet-600 transition-colors">
                            {gt(related).title}
                          </p>
                          <p className="text-[10px] text-slate-400 capitalize mt-0.5">
                            {t(`category.${related.category}` as any)}
                          </p>
                        </div>
                        <Play className="w-3 h-3 text-slate-300 group-hover:text-violet-400 transition-colors shrink-0" />
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Modal */}
      {showControls && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('game.howToPlay')}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowControls(false);
          }}
          onKeyDown={(e) => { if (e.key === 'Escape') setShowControls(false); }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{t('game.howToPlay')}</h3>
                  <p className="text-xs text-slate-400">{gt(game).title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowControls(false)}
                aria-label={t('common.close' as any)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {gt(game).controls}
              </p>
            </div>
            <div className="px-6 pb-5">
              {!gameStarted ? (
                <button
                  onClick={() => {
                    setShowControls(false);
                    setGameStarted(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {t('game.startPlaying')}
                </button>
              ) : (
                <button
                  onClick={() => setShowControls(false)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors"
                >
                  {t('game.keepPlaying')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Play Next Overlay */}
      {showPlayNext && nextGame && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('game.moreGames')}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
          style={{ background: "rgba(0,0,0,0.65)" }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-violet-600 px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SkipForward className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-sm">{t('game.moreGames')}</span>
                </div>
                <button
                  onClick={dismissPlayNext}
                  aria-label={t('common.close' as any)}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {/* Countdown ring */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 shrink-0">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                    <circle
                      cx="28" cy="28" r="24"
                      fill="none"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 24}`}
                      strokeDashoffset={`${2 * Math.PI * 24 * (1 - countdown / PLAY_NEXT_COUNTDOWN)}`}
                      style={{ transition: "stroke-dashoffset 1s linear" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{countdown}</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/80 text-xs font-medium">{t('game.autoAdvance')} {countdown}s</p>
                  <p className="text-white font-semibold text-sm mt-0.5">{t('game.upNext')} {nextGame.category}</p>
                </div>
              </div>
            </div>

            {/* Next game preview */}
            <div className="p-4">
              <div className="flex gap-4 items-center mb-4">
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={nextGame.thumbnail}
                    alt={gt(nextGame).title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      el.parentElement!.insertAdjacentHTML('afterbegin', '<div class="w-full h-full flex items-center justify-center bg-slate-200 rounded-xl text-2xl">🎮</div>');
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight line-clamp-2 mb-1.5">
                    {gt(nextGame).title}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${
                      CATEGORY_COLORS[nextGame.category] || CATEGORY_FALLBACK
                    }`}>
                      {t(`category.${nextGame.category}` as any)}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      nextGame.difficulty === 'easy' ? 'bg-green-50 text-green-600' :
                      nextGame.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {t(`difficulty.${nextGame.difficulty}` as any)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => goToNextGame(nextGame.slug)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {t('game.startPlaying')}
                </button>
                <button
                  onClick={refreshNextSuggestion}
                  className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors"
                  title={t('game.suggestAnother' as any)}
                  aria-label={t('game.suggestAnother' as any)}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                <button
                  onClick={dismissPlayNext}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors"
                >
                  {t('game.keepPlaying')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit-intent vote prompt toast */}
      {showExitPrompt && game && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-full max-w-sm px-4"
          style={{ animation: 'slideUpFade 0.3s ease-out' }}
        >
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-sm">{t('game.exitPrompt')}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{t('game.ratePrompt')}</p>
                </div>
                <button
                  onClick={() => dismissExitPrompt(true)}
                  aria-label={t('common.close' as any)}
                  className="w-6 h-6 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors shrink-0 mt-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { vote('like'); dismissExitPrompt(true); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-sm font-semibold transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {t('game.lovedIt')}
                </button>
                <button
                  onClick={() => { vote('dislike'); dismissExitPrompt(true); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-semibold transition-colors"
                >
                  <ThumbsDown className="w-4 h-4" />
                  {t('game.notForMe')}
                </button>
              </div>
            </div>
            {/* Progress bar auto-dismiss */}
            <div className="h-1 bg-slate-700">
              <div
                className="h-1 bg-violet-500"
                style={{ animation: 'shrinkWidth 8s linear forwards' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
