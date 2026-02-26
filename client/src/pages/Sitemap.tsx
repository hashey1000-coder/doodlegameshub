/**
 * HTML Sitemap page — /sitemap (or /:lang/sitemap)
 * Lists every URL on the site grouped by section: main pages, categories, and all games.
 */

import { Link } from 'wouter';
import {
  Map, Home, LayoutList, Trophy, CalendarDays, Info, Mail, Shield,
  Gamepad2, ArrowLeft,
} from 'lucide-react';
import { GAMES, CATEGORIES } from '@/data/games';
import { useT, useLanguage } from '@/contexts/LanguageContext';
import { useGameTranslate } from '@/data/gameTranslations';
import { useHead } from '@/hooks/useHead';
import { CATEGORY_COLORS } from '@/data/categoryColors';
import { useMemo } from 'react';

const MAIN_PAGES = [
  { href: '/',          icon: Home,         labelKey: 'nav.allGames' },
  { href: '/games/',    icon: LayoutList,   labelKey: 'nav.aToZ' },
  { href: '/top-rated/',icon: Trophy,       labelKey: 'nav.leaderboard' },
  { href: '/daily/',    icon: CalendarDays, labelKey: 'nav.daily' },
  { href: '/about/',    icon: Info,         labelKey: 'about.title' },
  { href: '/contact/',  icon: Mail,         labelKey: 'contact.title' },
  { href: '/privacy/',  icon: Shield,       labelKey: 'privacy.title' },
] as const;

export default function Sitemap() {
  const t = useT();
  const gt = useGameTranslate();
  const { locale } = useLanguage();

  useHead({
    title: t('seo.sitemap.title' as any),
    description: t('seo.sitemap.description' as any),
    routePath: '/sitemap/',
  });

  // Group games by category
  const gamesByCategory = useMemo(() => {
    const map: Record<string, typeof GAMES> = {};
    GAMES.forEach((game) => {
      if (!map[game.category]) map[game.category] = [];
      map[game.category].push(game);
    });
    // Sort games within each category alphabetically by translated title
    Object.values(map).forEach((games) =>
      games.sort((a, b) => gt(a).title.localeCompare(gt(b).title))
    );
    return map;
  }, [gt]);

  // Categories in order (skip "all")
  const categories = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-6">
          <Link href="/">
            <span className="hover:text-violet-600 transition-colors cursor-pointer">{t('nav.allGames')}</span>
          </Link>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300">{t('sitemap.title' as any)}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
              <Map className="w-5 h-5 text-violet-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('sitemap.title' as any)}
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
            {t('sitemap.subtitle' as any)}
          </p>
        </div>

        {/* Main Pages Section */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-violet-500" />
            {t('sitemap.mainPages' as any)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {MAIN_PAGES.map(({ href, icon: Icon, labelKey }) => (
              <Link key={href} href={href}>
                <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md transition-all cursor-pointer group">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {t(labelKey as any)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Games by Category */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <LayoutList className="w-5 h-5 text-violet-500" />
            {t('sitemap.allGames' as any)}
            <span className="text-sm font-normal text-slate-400 ml-1">({GAMES.length})</span>
          </h2>

          {categories.map((cat) => {
            const games = gamesByCategory[cat.id] ?? [];
            if (games.length === 0) return null;
            return (
              <div key={cat.id} className="mb-8">
                <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <span className="text-lg">{cat.emoji}</span>
                  {t(cat.labelKey as any)}
                  <span className="text-xs font-normal text-slate-400">({games.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {games.map((game) => (
                    <Link key={game.slug} href={`/play/${game.slug}/`}>
                      <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors cursor-pointer group">
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                            CATEGORY_COLORS[game.category]?.includes('bg-')
                              ? CATEGORY_COLORS[game.category].split(' ').find((c: string) => c.startsWith('bg-')) || 'bg-violet-400'
                              : 'bg-violet-400'
                          }`}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                          {gt(game).title}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Link href="/">
            <span className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              {t('common.backToHome' as any)}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
