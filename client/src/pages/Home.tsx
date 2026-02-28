import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Search, Gamepad2, Clock, Play, Heart, ThumbsUp, Baby, X, Tag, ChevronDown, ChevronUp, Star, ArrowUpDown } from "lucide-react";
import { GAMES, CATEGORIES, ALL_TAGS } from "@/data/games";
import { useRecentlyPlayed } from "@/hooks/useRecentlyPlayed";
import { useFavourites } from "@/hooks/useFavourites";
import { useKidsMode } from "@/hooks/useKidsMode";
import { useNewGames } from "@/hooks/useNewGames";
import TiltCard from '@/components/TiltCard';
import AnimatedCard from '@/components/AnimatedCard';
import BlurImage from "@/components/BlurImage";
import { useT } from "@/contexts/LanguageContext";
import { useGameTranslate } from '@/data/gameTranslations';
import { CATEGORY_COLORS } from '@/data/categoryColors';
import { prefetchGameUrl } from '@/lib/utils';
import { useHead } from '@/hooks/useHead';

function formatPlayCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function getLikeCount(slug: string): number {
  try {
    const stored = localStorage.getItem(`game-votes-${slug}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.likes || 0;
    }
    // Seed from game data when no user votes exist
    const game = GAMES.find((g) => g.slug === slug);
    if (game) {
      return Math.max(Math.round(game.rating * (game.playCount || 50) / 100), 1);
    }
    return 0;
  } catch {
    return 0;
  }
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) return cat;
    } catch { /* SSR */ }
    return "all";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [favPulse, setFavPulse] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'most-played' | 'highest-rated' | 'a-z' | 'newest'>(() => {
    try {
      const saved = localStorage.getItem('doodle-sort-by');
      const valid = ['default', 'most-played', 'highest-rated', 'a-z', 'newest'];
      if (valid.includes(saved ?? '')) return saved as 'default' | 'most-played' | 'highest-rated' | 'a-z' | 'newest';
    } catch { /* SSR */ }
    return 'default';
  });

  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const categoryFilterRef = useRef<HTMLDivElement>(null);
  const [showTagPanel, setShowTagPanel] = useState(false);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { recentGames } = useRecentlyPlayed(GAMES);
  const { favourites, toggleFavourite, isFavourite } = useFavourites();
  const { kidsMode, toggleKidsMode } = useKidsMode();
  const { markAllSeen } = useNewGames();
  const [, navigate] = useLocation();
  const searchStr = useSearch();
  const t = useT();

  // Sync activeCategory when URL query param changes (e.g. footer category links)
  useEffect(() => {
    const params = new URLSearchParams(searchStr);
    const cat = params.get('category');
    if (cat) {
      setActiveCategory(cat);
      // Scroll the category filter section into view
      requestAnimationFrame(() => {
        categoryFilterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Also scroll the active category button into view within the horizontal scroll
        const activeBtn = categoryFilterRef.current?.querySelector('[data-category-active="true"]') as HTMLElement | null;
        activeBtn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    }
  }, [searchStr]);

  const gt = useGameTranslate();
  // SEO — localised page title + meta description
  useHead({
    title: t('seo.home.title' as any),
    description: t('seo.home.description' as any),
    routePath: '/',
  });

  // Mark all new games as seen when user visits the homepage
  useEffect(() => {
    markAllSeen();
  }, [markAllSeen]);
  // Close sort menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggleFavourite = useCallback((slug: string) => {
    const wasNotFav = !isFavourite(slug);
    toggleFavourite(slug);
    if (wasNotFav) {
      setFavPulse(true);
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
      pulseTimer.current = setTimeout(() => setFavPulse(false), 800);
    }
  }, [toggleFavourite, isFavourite]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleTag = (tagId: string) => {
    setActiveTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const clearTags = () => setActiveTags([]);

  const filteredGames = useMemo(() => {
    let games = GAMES;

    // Kids Mode: only Easy games
    if (kidsMode) {
      games = games.filter((g) => g.difficulty === "easy");
    }

    if (activeCategory === "favourites") {
      games = games.filter((g) => favourites.includes(g.slug));
    } else if (activeCategory === "top-rated") {
      // Top Rated: sort by like count descending, keep all games
    } else if (activeCategory !== "all") {
      games = games.filter((g) => g.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      games = games.filter(
        (g) => {
          const translated = gt(g);
          return g.title.toLowerCase().includes(q) ||
            g.category.toLowerCase().includes(q) ||
            g.description.toLowerCase().includes(q) ||
            translated.title.toLowerCase().includes(q) ||
            translated.description.toLowerCase().includes(q);
        }
      );
    }

    // Multi-tag filter: game must have ALL selected tags
    if (activeTags.length > 0) {
      games = games.filter((g) =>
        activeTags.every((tag) => g.tags.includes(tag))
      );
    }

    // Sort by likes for Top Rated tab
    if (activeCategory === "top-rated") {
      games = [...games].sort((a, b) => getLikeCount(b.slug) - getLikeCount(a.slug));
    } else {
      // Apply user-selected sort
      if (sortBy === 'most-played') {
        games = [...games].sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
      } else if (sortBy === 'highest-rated') {
        games = [...games].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortBy === 'a-z') {
        games = [...games].sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'newest') {
        games = [...games].sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
      }
    }

    return games;
  }, [activeCategory, searchQuery, favourites, kidsMode, activeTags, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

      {/* Kids Mode Banner */}
      {kidsMode && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Baby className="w-4 h-4 shrink-0" />
                <span className="text-sm font-semibold">{t('nav.kidsMode')} {t('home.kidsModeBanner')}</span>
            </div>
            <button
              onClick={toggleKidsMode}
              className="flex items-center gap-1 text-xs font-medium bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-full transition-colors"
            >
              <X className="w-3 h-3" />
              {t('home.turnOff')}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Hero Section */}
        <div
          className="hero-bg relative overflow-hidden rounded-3xl p-5 md:p-12 mb-10"
          role="banner"
          aria-label={t('home.heroAriaLabel' as any)}
        >
          {/* Real <img> for the hero background — discoverable from prerendered HTML
              without waiting for CSS to download. Uses srcSet for responsive loading. */}
          <img
            src="/hero-bg.webp"
            srcSet="/hero-bg-480.webp 480w, /hero-bg-960.webp 960w, /hero-bg.webp 1498w"
            sizes="(max-width: 640px) 480px, (max-width: 1024px) 960px, 1498px"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="hero-bg-img"
          />
          {/* Animated gradient overlay — breathes in/out */}
          <div className="hero-overlay-breathe absolute inset-0 bg-gradient-to-r from-violet-950/88 via-violet-900/72 to-violet-900/20 rounded-3xl" />

          {/* Scanline sweep */}
          <div className="hero-scanline" aria-hidden="true" />

          {/* Floating emoji particles — right half of hero */}
          {[
            { emoji: "🎮", style: { top: "12%",  right: "22%", "--duration": "4.2s", "--delay": "0s"    } },
            { emoji: "⭐", style: { top: "55%",  right: "38%", "--duration": "5.1s", "--delay": "0.8s"  } },
            { emoji: "🕹️", style: { top: "25%",  right: "8%",  "--duration": "3.8s", "--delay": "1.4s"  } },
            { emoji: "🏆", style: { top: "68%",  right: "18%", "--duration": "4.7s", "--delay": "0.3s"  } },
            { emoji: "🎯", style: { top: "8%",   right: "45%", "--duration": "5.5s", "--delay": "2.1s"  } },
            { emoji: "🎲", style: { top: "78%",  right: "42%", "--duration": "4.0s", "--delay": "1.7s"  } },
            { emoji: "✨", style: { top: "40%",  right: "3%",  "--duration": "3.3s", "--delay": "0.5s"  } },
            { emoji: "🌟", style: { top: "85%",  right: "28%", "--duration": "6.0s", "--delay": "2.8s"  } },
          ].map(({ emoji, style }) => (
            <span
              key={emoji + JSON.stringify(style)}
              className="hero-particle hidden md:block"
              style={style as React.CSSProperties}
              aria-hidden="true"
            >
              {emoji}
            </span>
          ))}

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
            <div className="flex-1">
              {/* Badge */}
              <div className="hero-text-enter inline-flex items-center gap-2 mb-2 md:mb-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5">
                <div className="w-5 h-5 rounded-md bg-violet-400/60 flex items-center justify-center" aria-hidden="true">
                  <Gamepad2 className="w-3 h-3 text-white" />
                </div>
                <span className="text-white/90 text-[11px] font-semibold tracking-widest uppercase">
                  Doodle Games Hub
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
              </div>

              {/* Headline */}
              <h1 className="hero-text-enter-delay-1 text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-1.5 md:mb-3">
                {t('home.heroTitleLine1')}<br />
                <span className="hero-shimmer-text">{t('home.heroTitle')}</span>
              </h1>

              {/* Subtext */}
              <p className="hero-text-enter-delay-2 text-white/70 text-xs md:text-base max-w-md leading-relaxed">
                {t('home.heroSubtitle')}
              </p>

              {/* Stats row */}
              <div className="hero-text-enter-delay-2 flex items-center gap-3 md:gap-4 mt-3 md:mt-4 mb-1">
                {[
                  { value: String(GAMES.length), label: t('home.heroStats.games') },
                  { value: String(new Set(GAMES.map(g => g.category)).size), label: t('home.heroStats.categories') },
                  { value: t('common.free'), label: t('home.heroStats.free') },
                ].map(({ value, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="text-white font-bold text-base">{value}</span>
                    <span className="text-white/50 text-xs">{label}</span>
                    <span className="w-px h-3 bg-white/20 last:hidden" />
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="hero-text-enter-delay-3 flex flex-wrap items-center gap-2 md:gap-3 mt-3 md:mt-5">
                <Link href="/daily/">
                  <span className="hero-cta-glow inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold bg-yellow-400 text-yellow-900 hover:bg-yellow-300 shadow-lg shadow-yellow-400/30 transition-all cursor-pointer active:scale-95">
                    🎯 {t('home.cta.todayChallenge')}
                  </span>
                </Link>
                <button
                  onClick={toggleKidsMode}
                  aria-pressed={kidsMode}
                  aria-label={kidsMode ? t('nav.kidsModeTooltipOn' as any) : t('nav.kidsModeTooltipOff' as any)}
                  className={`inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    kidsMode
                      ? "bg-green-400 text-green-900 shadow-lg shadow-green-400/30"
                      : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
                  }`}
                >
                  <Baby className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" aria-hidden="true" />
                  {kidsMode ? t('home.kidsModeOn') : t('nav.kidsMode')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Played Section */}
        {recentGames.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <Clock className="w-4 h-4 text-violet-600" />
              </div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">{t('home.recentlyPlayed')}</h2>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium ml-1">— {t('home.recentlyPlayedHint')}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentGames.map((game) => (
                <div key={game.slug} className="group relative h-full" onMouseEnter={() => prefetchGameUrl(game.iframeUrl)}>
                  <Link href={`/play/${game.slug}/`} className="block h-full">
                    <div className="h-full">
                      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-violet-100 dark:border-violet-900/40 shadow-sm
                        transition-all duration-300 ease-out
                        hover:scale-[1.03] hover:-translate-y-1.5
                        hover:shadow-2xl hover:shadow-violet-400/25 dark:hover:shadow-violet-600/30
                        hover:border-violet-300 dark:hover:border-violet-600
                        h-full flex flex-col">
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.06) 50%, rgba(6,182,212,0.06) 100%)' }}
                        />
                        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-violet-600/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          <Clock className="w-2.5 h-2.5" />
                          {t('home.recent')}
                        </div>
                        <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                          <BlurImage
                            src={game.thumbnail}
                            alt={gt(game).title}
                            className="group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/95 shadow-xl flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                              <Play className="w-5 h-5 text-violet-600 fill-violet-600 ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                          <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2 mb-1.5">
                            {gt(game).title}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                            <span
                              className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${
                                CATEGORY_COLORS[game.category] || "text-violet-600 bg-violet-50"
                              }`}
                            >
                              {t(`category.${game.category}` as any)}
                            </span>
                            {game.difficulty && (
                              <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                game.difficulty === 'easy' ? 'bg-green-50 text-green-700' :
                                game.difficulty === 'medium' ? 'bg-amber-50 text-amber-700' :
                                'bg-red-50 text-red-600'
                              }`}>
                                {t(`difficulty.${game.difficulty}` as any)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-500">{game.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{formatPlayCount(game.playCount)} {t('common.plays')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleFavourite(game.slug);
                    }}
                    className={`absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                      isFavourite(game.slug)
                        ? "bg-rose-500 text-white"
                        : "bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700"
                    }`}
                    aria-label={isFavourite(game.slug) ? t('home.removeFromFavourites' as any) : t('home.addToFavourites' as any)}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavourite(game.slug) ? "fill-white" : ""}`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-slate-200 dark:border-slate-800" />
          </div>
        )}

        {/* Category Filter + Search */}
        <div ref={categoryFilterRef} className="flex items-center gap-2 mb-3 overflow-x-auto pb-2 scrollbar-none scroll-mt-20">
          {/* "All" tab */}
          <button
            onClick={() => setActiveCategory("all")}
            data-category-active={activeCategory === "all" ? "true" : undefined}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
              activeCategory === "all"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300"
            }`}
          >
            <span className="text-base">🎮</span>
            {t('category.all' as any)}
          </button>

          {/* Favourites tab — placed early so users can always find it */}
          <button
            onClick={() => setActiveCategory("favourites")}
            data-category-active={activeCategory === "favourites" ? "true" : undefined}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
              activeCategory === "favourites"
                ? "bg-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300"
            }`}
          >
            <Heart className={`w-4 h-4 ${activeCategory === "favourites" ? "fill-white" : ""} ${favPulse ? "text-rose-500" : ""}`} />
            {t('home.favourites')}
            {favourites.length > 0 && (
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center transition-all duration-200 ${
                activeCategory === "favourites" ? "bg-white/20" : "bg-rose-100 text-rose-600"
              } ${favPulse ? "scale-125 bg-rose-500 text-white" : ""}`}>
                {favourites.length}
              </span>
            )}
          </button>

          {/* Top Rated tab */}
          <button
            onClick={() => setActiveCategory("top-rated")}
            data-category-active={activeCategory === "top-rated" ? "true" : undefined}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
              activeCategory === "top-rated"
                ? "bg-amber-500 text-white shadow-lg shadow-amber-200 dark:shadow-amber-900"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300"
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${activeCategory === "top-rated" ? "fill-white" : ""}`} />
            {t('home.topRated')}
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 shrink-0 mx-1" />

          {/* Category tabs (skip "all" since it's rendered above) */}
          {CATEGORIES.filter(cat => cat.id !== 'all').map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              data-category-active={activeCategory === cat.id ? "true" : undefined}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeCategory === cat.id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="text-base">{cat.emoji}</span>
              {t(cat.labelKey as any)}
            </button>
          ))}

          <div className="w-px h-6 bg-slate-200 shrink-0 mx-1" />

          {/* Tags toggle button */}
          <button
            onClick={() => setShowTagPanel((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
              showTagPanel || activeTags.length > 0
                ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300"
            }`}
          >
            <Tag className="w-4 h-4" />
            {t('home.tags')}
            {activeTags.length > 0 && (
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                showTagPanel || activeTags.length > 0 ? "bg-white/20" : "bg-violet-100 text-violet-600"
              }`}>
                {activeTags.length}
              </span>
            )}
            {showTagPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="w-px h-6 bg-slate-200 shrink-0 mx-1" />

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('home.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 w-44 transition-all"
            />
          </form>
        </div>

        {/* Tag Panel */}
        {showTagPanel && (
          <div className="mb-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('home.filterByTags')}</span>
                <span className="text-xs text-slate-400">— {t('home.tagHint')}</span>
              </div>
              {activeTags.length > 0 && (
                <button
                  onClick={clearTags}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  <X className="w-3 h-3" />
                  {t('home.clearAll')}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => {
                const isActive = activeTags.includes(tag.id);
                // Count matching games for this tag (considering current filters except tags)
                const matchCount = GAMES.filter((g) => {
                  if (kidsMode && g.difficulty !== "easy") return false;
                  if (activeCategory === "favourites" && !favourites.includes(g.slug)) return false;
                  if (activeCategory !== "all" && activeCategory !== "favourites" && activeCategory !== "top-rated" && g.category !== activeCategory) return false;
                  return g.tags.includes(tag.id);
                }).length;
                if (matchCount === 0) return null;
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 border border-slate-200 dark:border-slate-700 hover:border-violet-200"
                    }`}
                  >
                    <span>{tag.emoji}</span>
                    {t(tag.labelKey as any)}
                    <span className={`text-[10px] font-bold px-1 py-0.5 rounded-full ${
                      isActive ? "bg-white/20" : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    }`}>
                      {matchCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active tag chips (visible even when panel is closed) */}
        {activeTags.length > 0 && !showTagPanel && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-slate-500 font-medium">{t('home.activeTags')}</span>
            {activeTags.map((tagId) => {
              const tag = ALL_TAGS.find((t) => t.id === tagId);
              if (!tag) return null;
              return (
                <button
                  key={tagId}
                  onClick={() => toggleTag(tagId)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                >
                  {tag.emoji} {t(tag.labelKey as any)}
                  <X className="w-3 h-3 ml-0.5" />
                </button>
              );
            })}
            <button
              onClick={clearTags}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
            >
              {t('home.clearAll')}
            </button>
          </div>
        )}

        {/* Games count + context */}
        <div className="mb-6 flex items-center gap-3 flex-wrap justify-between">
          {/* Sort dropdown */}
          {activeCategory !== 'top-rated' && (
            <div className="relative ml-auto" ref={sortMenuRef}>
              <button
                onClick={() => setShowSortMenu((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 hover:border-violet-300 hover:text-violet-600 transition-all shadow-sm"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span className="font-medium">
                  {sortBy === 'default' ? t('home.sortBy') :
                   sortBy === 'most-played' ? t('home.sortMostPlayed') :
                   sortBy === 'highest-rated' ? t('home.sortHighestRated') :
                   sortBy === 'a-z' ? t('home.sortAZ') : t('home.sortNewest')}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 z-50 overflow-hidden py-1">
                  {([
                    { id: 'default', label: t('home.sortDefault'), icon: '🎲' },
                    { id: 'most-played', label: t('home.sortMostPlayed'), icon: '🔥' },
                    { id: 'highest-rated', label: t('home.sortHighestRated'), icon: '⭐' },
                    { id: 'a-z', label: t('home.sortAZ'), icon: '🔤' },
                    { id: 'newest', label: t('home.sortNewest'), icon: '✨' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { setSortBy(opt.id); localStorage.setItem('doodle-sort-by', opt.id); setShowSortMenu(false); }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.id
                          ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                      {sortBy === opt.id && <span className="ml-auto text-violet-500">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Games count + context — below sort */}
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{activeCategory === 'all' ? t('nav.allGames') : activeCategory === 'favourites' ? t('home.favourites') : activeCategory === 'top-rated' ? t('home.topRated') : t(`category.${activeCategory}` as any)}</h2>
          <p className="text-sm text-slate-500 font-medium">
            {filteredGames.length} {t('home.gamesCount' as any)}{" "}
            {activeCategory === "favourites"
              ? t('home.favourited')
              : activeCategory === "top-rated"
              ? t('home.sortedByLikes')
              : t('home.available')}
            {kidsMode ? ` · ${t('home.kidsModeEasy')}` : ""}
            {activeTags.length > 0 ? ` · ${activeTags.length} ${t('home.tagFiltersActive')}` : ""}
          </p>
          {activeCategory === "top-rated" && (
            <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-medium">
              {t('home.localLikes')}
            </span>
          )}
          {/* Link to full leaderboard */}
          {activeCategory === "top-rated" && (
            <Link href="/top-rated/">
              <span className="text-[11px] bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full font-medium hover:bg-violet-100 transition-colors cursor-pointer">
                {t('home.viewLeaderboard')} →
              </span>
            </Link>
          )}
        </div>

        {/* Game Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredGames.map((game, index) => {
              const likeCount = getLikeCount(game.slug);
              /* First 6 images are above-fold LCP candidates — load eagerly */
              const isAboveFold = index < 6;
              return (
                <AnimatedCard key={game.slug} index={index % 8} className="h-full">
                <TiltCard className="group relative h-full" onMouseEnter={() => prefetchGameUrl(game.iframeUrl)}>
                  <Link href={`/play/${game.slug}/`} className="block h-full">
                    <div className="h-full">
                      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-violet-100 dark:border-violet-900/40 shadow-sm
                        transition-all duration-300 ease-out
                        hover:scale-[1.03] hover:-translate-y-1.5
                        hover:shadow-2xl hover:shadow-violet-400/25 dark:hover:shadow-violet-600/30
                        hover:border-violet-300 dark:hover:border-violet-600
                        h-full flex flex-col">
                        {/* Shimmer border on hover */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.06) 50%, rgba(6,182,212,0.06) 100%)' }}
                        />
                        {/* New ribbon */}
                        {game.isNew && activeCategory !== "top-rated" && (
                          <div className="absolute top-0 left-0 z-10">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-br-lg rounded-tl-2xl shadow-sm">
                              {t('common.new').toUpperCase()}
                            </div>
                          </div>
                        )}
                        <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                          <BlurImage
                            src={game.thumbnail}
                            alt={gt(game).title}
                            priority={isAboveFold}
                            className="group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/95 shadow-xl flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                              <Play className="w-5 h-5 text-violet-600 fill-violet-600 ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                          <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2 mb-1.5">
                            {gt(game).title}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                            <span
                              className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${
                                CATEGORY_COLORS[game.category] || "text-violet-600 bg-violet-50"
                              }`}
                            >
                              {t(`category.${game.category}` as any)}
                            </span>
                            {game.difficulty && (
                              <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                game.difficulty === 'easy' ? 'bg-green-50 text-green-700' :
                                game.difficulty === 'medium' ? 'bg-amber-50 text-amber-700' :
                                'bg-red-50 text-red-600'
                              }`}>
                                {t(`difficulty.${game.difficulty}` as any)}
                              </span>
                            )}
                            {/* Like count badge for Top Rated view */}
                            {activeCategory === "top-rated" && likeCount > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
                                <ThumbsUp className="w-2.5 h-2.5" />
                                {likeCount}
                              </span>
                            )}
                          </div>
                          {/* Show active tags on card */}
                          {activeTags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {game.tags.filter((tag) => activeTags.includes(tag)).map((tag) => {
                                const tagInfo = ALL_TAGS.find((at) => at.id === tag);
                                return (
                                  <span key={tag} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600">
                                    {tagInfo?.emoji} {tagInfo ? t(tagInfo.labelKey as any) : tag}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          {/* Rating + play count row */}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-500">{game.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{formatPlayCount(game.playCount)} {t('common.plays')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Heart button — rendered after Link for correct z-order */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleFavourite(game.slug);
                    }}
                    className={`absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 ${
                      isFavourite(game.slug)
                        ? "bg-rose-500 text-white opacity-100"
                        : "bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700"
                    }`}
                    aria-label={isFavourite(game.slug) ? t('home.removeFromFavourites' as any) : t('home.addToFavourites' as any)}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavourite(game.slug) ? "fill-white" : ""}`} />
                  </button>

                  {/* Top Rated rank badge */}
                  {activeCategory === "top-rated" && index < 3 && (
                    <div className="absolute top-2 left-2 z-20 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md"
                      style={{
                        background: index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32",
                        color: index === 0 ? "#7a5c00" : index === 1 ? "#4a4a4a" : "#5a3000"
                      }}
                    >
                      {index + 1}
                    </div>
                  )}
                </TiltCard>
              </AnimatedCard>
              );
            })}
          </div>
        ) : activeCategory === "favourites" ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">💔</div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('home.noFavourites')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t('home.noFavouritesDesc')}
            </p>
          </div>
        ) : activeCategory === "top-rated" ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">👍</div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('home.noLikes')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t('home.noLikesDesc')}
            </p>
          </div>
        ) : activeTags.length > 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏷️</div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('home.noTagMatch')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              {t('home.noTagMatchDesc')}
            </p>
            <button
              onClick={clearTags}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-full text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              <X className="w-4 h-4" />
              {t('home.clearTagFilters')}
            </button>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('search.noResults')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t('home.noGamesDesc')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
