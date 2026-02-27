import { useT } from "@/contexts/LanguageContext";
import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Search, Heart, Play, ArrowUpDown, Check } from "lucide-react";
import { GAMES } from "@/data/games";
import { useFavourites } from "@/hooks/useFavourites";
import AnimatedCard from "@/components/AnimatedCard";
import { useGameTranslate } from '@/data/gameTranslations';
import { prefetchGameUrl } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/data/categoryColors';
import { useHead } from '@/hooks/useHead';

export default function AllGames() {
  const t = useT();
  const gt = useGameTranslate();
  const [searchQuery, setSearchQuery] = useState("");
  const { favourites, toggleFavourite, isFavourite } = useFavourites();
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [sortBy, setSortBy] = useState<'a-z' | 'most-played' | 'highest-rated' | 'newest'>(() => {
    try {
      const saved = localStorage.getItem('doodle-sort-by');
      const valid = ['a-z', 'most-played', 'highest-rated', 'newest'];
      if (valid.includes(saved ?? '')) return saved as 'a-z' | 'most-played' | 'highest-rated' | 'newest';
    } catch {}
    return 'a-z';
  });
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // SEO — localised page title + meta description
  useHead({
    title: t('seo.allGames.title' as any),
    description: t('seo.allGames.description' as any),
    routePath: '/games/',
  });

  const sortedGames = useMemo(() => {
    let games = [...GAMES];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      games = games.filter(
        (g) => {
          const translated = gt(g);
          return g.title.toLowerCase().includes(q) ||
            g.category.toLowerCase().includes(q) ||
            translated.title.toLowerCase().includes(q);
        }
      );
    }
    switch (sortBy) {
      case 'most-played': return games.sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0));
      case 'highest-rated': return games.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case 'newest': return games.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || gt(a).title.localeCompare(gt(b).title));
      default: return games.sort((a, b) => gt(a).title.localeCompare(gt(b).title));
    }
  }, [searchQuery, sortBy, gt]);

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, typeof GAMES> = {};
    sortedGames.forEach((game) => {
      const letter = gt(game).title[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(game);
    });
    return map;
  }, [sortedGames, gt]);

  const letters = Object.keys(grouped).sort();
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const scrollToLetter = (letter: string) => {
    const el = letterRefs.current[letter];
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-3">
            <Link href="/">
              <span className="hover:text-violet-600 transition-colors cursor-pointer">{t('nav.allGames')}</span>
            </Link>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">{t('allGames.sortAZ')}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{t('allGames.title')}</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{GAMES.length} {t('allGames.gamesCount')} — {t('allGames.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Sort dropdown */}
              <div className="relative" ref={sortMenuRef}>
                <button
                  onClick={() => setShowSortMenu((v) => !v)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-violet-300 hover:text-violet-600 transition-all shadow-sm whitespace-nowrap"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  {sortBy === 'a-z' ? t('allGames.sortAZ') : sortBy === 'most-played' ? t('allGames.sortMostPlayed') : sortBy === 'highest-rated' ? t('allGames.sortHighestRated') : t('allGames.sortNewest')}
                </button>
                {showSortMenu && (
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 z-50 overflow-hidden py-1">
                    {(['a-z', 'most-played', 'highest-rated', 'newest'] as const).map((opt) => {
                      const labels: Record<string, string> = { 'a-z': t('allGames.sortAZ'), 'most-played': t('allGames.sortMostPlayed'), 'highest-rated': t('allGames.sortHighestRated'), 'newest': t('allGames.sortNewest') };
                      const icons: Record<string, string> = { 'a-z': '🔤', 'most-played': '🔥', 'highest-rated': '⭐', 'newest': '✨' };
                      return (
                        <button
                          key={opt}
                          onClick={() => { setSortBy(opt); localStorage.setItem('doodle-sort-by', opt); setShowSortMenu(false); }}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                            sortBy === opt ? 'bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
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
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                placeholder={t('home.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Letter jump bar */}
        {!searchQuery && (
          <div className="sticky top-14 z-30 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm py-3 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap gap-1">
              {allLetters.map((letter) => {
                const hasGames = !!grouped[letter];
                return (
                  <button
                    key={letter}
                    onClick={() => hasGames && scrollToLetter(letter)}
                    disabled={!hasGames}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-all duration-150 ${
                      hasGames
                        ? "bg-white dark:bg-slate-800 text-violet-600 border border-violet-200 dark:border-violet-500 hover:bg-violet-600 hover:text-white hover:border-violet-600 shadow-sm cursor-pointer"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
              <div className="ml-auto text-sm text-slate-400 self-center">
                {sortedGames.length} {t('allGames.gamesCount')}
              </div>
            </div>
          </div>
        )}

        {/* Games grouped by letter */}
        {letters.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-medium">{t('allGames.noResults')}</p>
            <p className="text-sm mt-1">{t('allGames.clearSearch')}</p>
          </div>
        ) : (
          <div className="space-y-10">
            {letters.map((letter) => (
              <div
                key={letter}
                ref={(el) => { letterRefs.current[letter] = el; }}
              >
                {/* Letter heading */}
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md shadow-violet-200/50 shrink-0">
                    <span className="text-white font-bold text-lg leading-none">{letter}</span>
                  </h2>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <span className="text-xs text-slate-400 font-medium">{grouped[letter].length} {grouped[letter].length === 1 ? (t('allGames.gameCount' as any) || t('allGames.gamesCount')) : t('allGames.gamesCount')}</span>
                </div>

                {/* Games list for this letter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {grouped[letter].map((game, idx) => (
                    <AnimatedCard key={game.slug} index={idx}>
                    <div className="group relative" onMouseEnter={() => prefetchGameUrl(game.iframeUrl)}>
                      <Link href={`/play/${game.slug}/`}>
                        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-500 hover:shadow-lg hover:shadow-violet-100/50 dark:hover:shadow-violet-900/30 transition-all duration-300 cursor-pointer flex gap-3 p-3 items-center">
                          {/* Thumbnail */}
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <img
                              src={game.thumbnail}
                              alt={gt(game).title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                const el = e.target as HTMLImageElement;
                                el.style.display = 'none';
                                el.parentElement!.insertAdjacentHTML('afterbegin', '<div class="w-full h-full flex items-center justify-center bg-slate-200 rounded-xl text-2xl">🎮</div>');
                              }}
                            />
                            {/* Play overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                              <Play className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 fill-white" />
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight truncate group-hover:text-violet-600 transition-colors">
                                {gt(game).title}
                              </h3>
                              {game.isNew && (
                                <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                                  {t('common.new').toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[game.category] || "text-slate-500 bg-slate-100"}`}>
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
                      </Link>

                      {/* Heart button — rendered after Link for correct z-order */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavourite(game.slug);
                        }}
                        className={`absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 ${
                          isFavourite(game.slug)
                            ? "bg-rose-500 text-white opacity-100"
                            : "bg-white/90 text-slate-400 hover:text-rose-400 hover:bg-white"
                        }`}
                        title={isFavourite(game.slug) ? t('game.unfavourite') : t('game.favourite')}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavourite(game.slug) ? "fill-white" : ""}`} />
                      </button>
                    </div>
                    </AnimatedCard>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
