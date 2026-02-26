import { useT } from "@/contexts/LanguageContext";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, Play, Heart, ArrowLeft, X, ArrowUpDown, Check } from "lucide-react";
import { GAMES } from "@/data/games";
import { useGameTranslate } from '@/data/gameTranslations';
import { useFavourites } from "@/hooks/useFavourites";
import AnimatedCard from "@/components/AnimatedCard";
import { CATEGORY_COLORS } from '@/data/categoryColors';
import { prefetchGameUrl } from '@/lib/utils';
import { useHead } from '@/hooks/useHead';

function getQueryParam(search: string, key: string): string {
  try {
    const params = new URLSearchParams(search);
    return params.get(key) || "";
  } catch {
    return "";
  }
}

const DIFFICULTY_OPTIONS = [
  { id: "easy", labelKey: "difficulty.easy" as const, color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100", activeColor: "bg-green-500 text-white border-green-500" },
  { id: "medium", labelKey: "difficulty.medium" as const, color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100", activeColor: "bg-amber-500 text-white border-amber-500" },
  { id: "hard", labelKey: "difficulty.hard" as const, color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100", activeColor: "bg-red-500 text-white border-red-500" },
];

export default function SearchResults() {
  const t = useT();
  const gt = useGameTranslate();
  const [location, navigate] = useLocation();
  const { favourites, toggleFavourite, isFavourite } = useFavourites();
  const [favPulse, setFavPulse] = useState(false);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'most-played' | 'highest-rated' | 'a-z' | 'newest'>(() => {
    try {
      const saved = localStorage.getItem('doodle-sort-by');
      const valid = ['default', 'most-played', 'highest-rated', 'a-z', 'newest'];
      if (valid.includes(saved ?? '')) return saved as 'default' | 'most-played' | 'highest-rated' | 'a-z' | 'newest';
    } catch {}
    return 'default';
  });
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sortBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortBtnRef.current && !sortBtnRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Parse query from URL — wouter doesn't expose search, so read window.location.search
  const [query, setQuery] = useState(() => {
    if (typeof window !== "undefined") {
      return getQueryParam(window.location.search, "q");
    }
    return "";
  });
  const [inputValue, setInputValue] = useState(query);

  // Sync query from URL when location changes
  useEffect(() => {
    const q = getQueryParam(window.location.search, "q");
    setQuery(q);
    setInputValue(q);
  }, [location]);

  // SEO — localised page title + meta description
  useHead({
    title: query
      ? (t('seo.search.titleWithQuery' as any) as string).replace('{query}', query)
      : t('seo.search.title' as any),
    description: query
      ? (t('search.resultsFor' as any) as string).replace('{query}', query)
      : t('seo.defaultDescription' as any),
    routePath: '/search/',
  });

  const handleToggleFavourite = useCallback((slug: string) => {
    const wasNotFav = !isFavourite(slug);
    toggleFavourite(slug);
    if (wasNotFav) {
      setFavPulse(true);
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
      pulseTimer.current = setTimeout(() => setFavPulse(false), 800);
    }
  }, [toggleFavourite, isFavourite]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      navigate(`/search/?q=${encodeURIComponent(trimmed)}`);
      setQuery(trimmed);
    }
  };

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    let filtered = GAMES.filter(
      (g) => {
        const translated = gt(g);
        return g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          translated.title.toLowerCase().includes(q) ||
          translated.description.toLowerCase().includes(q);
      }
    );
    if (activeDifficulty) {
      filtered = filtered.filter((g) => g.difficulty === activeDifficulty);
    }
    switch (sortBy) {
      case 'most-played': return filtered.sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0));
      case 'highest-rated': return filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case 'a-z': return filtered.sort((a, b) => gt(a).title.localeCompare(gt(b).title));
      case 'newest': return filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || gt(a).title.localeCompare(gt(b).title));
      default: return filtered;
    }
  }, [query, activeDifficulty, sortBy, gt]);

  // Highlight matching text
  function highlight(text: string, query: string): React.ReactNode {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-100 text-amber-800 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  // Suggested categories based on results
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    results.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [results]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Back link */}
        <Link href="/">
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {t('game.backToGames')}
          </span>
        </Link>

        {/* Search bar — prominent, full-width */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">
            {query ? (
              <>
                {t('search.resultsFor')}{" "}
                <span className="text-violet-600">"{query}"</span>
              </>
            ) : (
              t('search.title')
            )}
          </h1>
          {query && (
            <div className="mb-5">
              <div className="text-slate-500 text-sm mb-3">
                {results.length === 0
                  ? t('search.noResults')
                  : `${results.length} ${t('search.gamesFound')}`}
              {results.length > 1 && (
                <div className="inline-flex items-center gap-2 ml-3 relative" ref={sortBtnRef}>
                  <button
                    onClick={() => setShowSortMenu((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all shadow-sm"
                  >
                    <ArrowUpDown className="w-3 h-3" />
                    {sortBy === 'default' ? t('search.sort') : sortBy === 'most-played' ? t('search.sortMostPlayed') : sortBy === 'highest-rated' ? t('search.sortHighestRated') : sortBy === 'a-z' ? t('search.sortAZ') : t('search.sortNewest')}
                  </button>
                  {showSortMenu && (
                    <div className="absolute left-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/60 dark:shadow-black/40 z-50 overflow-hidden py-1">
                      {(['default', 'most-played', 'highest-rated', 'a-z', 'newest'] as const).map((opt) => {
                        const labels: Record<string, string> = { default: t('search.sortRelevance'), 'most-played': t('search.sortMostPlayed'), 'highest-rated': t('search.sortHighestRated'), 'a-z': t('search.sortAZ'), newest: t('search.sortNewest') };
                        const icons: Record<string, string> = { default: '🎯', 'most-played': '🔥', 'highest-rated': '⭐', 'a-z': '🔤', newest: '✨' };
                        return (
                          <button
                            key={opt}
                            onClick={() => { setSortBy(opt); localStorage.setItem('doodle-sort-by', opt); setShowSortMenu(false); }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                              sortBy === opt ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span>{icons[opt]}</span>
                            <span className="flex-1 text-left">{labels[opt]}</span>
                            {sortBy === opt && <Check className="w-3.5 h-3.5 text-violet-600" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              </div>
              {/* Difficulty filter chips */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('search.difficulty')}</span>
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setActiveDifficulty(activeDifficulty === opt.id ? null : opt.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
                      activeDifficulty === opt.id ? opt.activeColor : opt.color
                    }`}
                  >
                    {t(opt.labelKey as any)}
                  </button>
                ))}
                {activeDifficulty && (
                  <button
                    onClick={() => setActiveDifficulty(null)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    {t('search.clear')}
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('search.searchPlaceholder')}
                autoFocus
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/40 shadow-sm transition-all"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => setInputValue("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-slate-500" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm hover:shadow-md hover:shadow-violet-200/50 active:scale-95"
            >
              {t('search.searchButton')}
            </button>
          </form>
        </div>

        {/* No query state */}
        {!query && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('search.whatLookingFor')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
              {t('search.typeHint')}
            </p>
            <div className="mt-8 flex flex-wrap gap-2 justify-center">
              {["pacman", "cricket", "basketball", "puzzle", "halloween", "music"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setInputValue(term);
                    navigate(`/search/?q=${encodeURIComponent(term)}`);
                    setQuery(term);
                  }}
                  className="px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query && results.length > 0 && (
          <div className="flex gap-8">
            {/* Main results grid */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.map((game, idx) => (
                  <AnimatedCard key={game.slug} index={idx} className="h-full">
                  <div className="group relative h-full" onMouseEnter={() => prefetchGameUrl(game.iframeUrl)}>
                    <Link href={`/play/${game.slug}/`} className="block h-full">
                      <div className="h-full">
                        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 dark:hover:shadow-black/30 transition-all duration-500 hover:-translate-y-1.5 h-full flex flex-col">
                          {game.isNew && (
                            <div className="absolute top-0 left-0 z-10">
                              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-br-lg rounded-tl-2xl shadow-sm">
                                {t('common.new').toUpperCase()}
                              </div>
                            </div>
                          )}
                          <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                            <img
                              src={game.thumbnail}
                              alt={gt(game).title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                              onError={(e) => {
                                const el = e.target as HTMLImageElement;
                                el.style.display = 'none';
                                el.parentElement!.insertAdjacentHTML('afterbegin', '<div class="w-full h-full flex items-center justify-center bg-slate-200 text-4xl">🎮</div>');
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/95 shadow-lg flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                <Play className="w-5 h-5 text-violet-600 fill-violet-600 ml-0.5" />
                              </div>
                            </div>
                          </div>
                          <div className="p-3 flex-1 flex flex-col">
                            <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-tight line-clamp-2 mb-1">
                              {highlight(gt(game).title, query)}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-1.5 leading-relaxed">
                              {highlight(gt(game).description.slice(0, 80) + "...", query)}
                            </p>
                            <div className="flex items-center gap-1.5 flex-wrap mt-auto">
                              <span
                                className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${
                                  CATEGORY_COLORS[game.category] || "text-violet-500 bg-violet-50"
                                }`}
                              >
                                {t(`category.${game.category}` as any)}
                              </span>
                              {game.difficulty && (
                                <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                  game.difficulty === 'easy' ? 'bg-green-50 text-green-600' :
                                  game.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' :
                                  'bg-red-50 text-red-600'
                                }`}>
                                  {t(`difficulty.${game.difficulty}` as any)}
                                </span>
                              )}
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
                      aria-label={isFavourite(game.slug) ? t('game.unfavourite') : t('game.favourite')}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFavourite(game.slug) ? "fill-white" : ""}`} />
                    </button>
                  </div>
                  </AnimatedCard>
                ))}
              </div>
            </div>

            {/* Sidebar: category breakdown */}
            {categoryCounts.length > 1 && (
              <aside className="hidden lg:block w-56 shrink-0">
                <div className="sticky top-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    {t('search.filterByCategory')}
                  </h3>
                  <div className="space-y-1">
                    {categoryCounts.map(([cat, count]) => (
                      <button
                        key={cat}
                        onClick={() => {
                          const newQ = `${query} ${cat}`;
                          navigate(`/search/?q=${encodeURIComponent(newQ)}`);
                          setQuery(newQ);
                          setInputValue(newQ);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 transition-colors group"
                      >
                        <span className="capitalize font-medium">{t(`category.${cat}` as any)}</span>
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/40 px-2 py-0.5 rounded-full font-semibold transition-colors">
                          {count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        )}

        {/* No results */}
        {query && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('search.noGamesFor')} "{query}"</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              {t('search.tryDifferent')}
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {["pacman", "cricket", "basketball", "puzzle", "halloween", "music"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setInputValue(term);
                    navigate(`/search/?q=${encodeURIComponent(term)}`);
                    setQuery(term);
                  }}
                  className="px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
            <Link href="/">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm">
                {t('search.browseAll')}
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
