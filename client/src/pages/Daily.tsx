import { useState, useEffect } from "react";
import { Link } from "wouter";
import { GAMES } from "@/data/games";
import { CalendarDays, Play, Share2, Check, ChevronLeft, Clock, Flame, Trophy } from "lucide-react";
import { useFavourites } from "@/hooks/useFavourites";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { useGameT, getGameT } from '@/data/gameTranslations';
import { prefetchGameUrl } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/data/categoryColors';
import { useHead } from '@/hooks/useHead';

// Seed a deterministic game from today's date, with seasonal awareness
function getDailyGame() {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();
  const seed = now.getFullYear() * 10000 + month * 100 + day;

  // Seasonal slug preferences by month/date range
  const seasonalPicks: { month: number; dayRange?: [number, number]; slugs: string[] }[] = [
    { month: 2, dayRange: [10, 15], slugs: ['doodle-valentines-day', 'doodle-valentines-day-2022'] },
    { month: 5, dayRange: [8, 14], slugs: ['mothers-day-2013-doodle', 'mothers-day-2020-doodle'] },
    { month: 4, dayRange: [18, 24], slugs: ['doodle-earth-day-2020'] },
    { month: 10, dayRange: [25, 31], slugs: ['magic-cat-academy', 'halloween', 'magic-cat-academy-2', 'magic-cat-academy-3'] },
    { month: 12, dayRange: [15, 28], slugs: ['google-santa-tracker', 'global-candy-cup-2015'] },
    { month: 1, dayRange: [20, 31], slugs: ['chinese-new-year-snake-game'] },
  ];

  // Check for seasonal match
  const seasonal = seasonalPicks.find(
    (s) => s.month === month && (!s.dayRange || (day >= s.dayRange[0] && day <= s.dayRange[1]))
  );

  if (seasonal) {
    const matching = GAMES.filter((g) => seasonal.slugs.includes(g.slug));
    if (matching.length > 0) {
      return matching[seed % matching.length];
    }
  }

  // Default: deterministic pick from all games
  const idx = seed % GAMES.length;
  return GAMES[idx];
}

function getDayLabel() {
  return new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getCountdownToMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s, total: diff };
}

function getDayNumber() {
  // Day number since Jan 1, 2025 (the "epoch" of this site)
  const epoch = new Date("2025-01-01").getTime();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.floor((today - epoch) / 86400000) + 1;
}

export default function Daily() {
  const game = getDailyGame();
  const t = useT();
  const { locale } = useLanguage();
  const { title: gameTitle, description: gameDesc, controls: gameControls } = useGameT(game);
  const { isFavourite, toggleFavourite } = useFavourites();
  const [countdown, setCountdown] = useState(getCountdownToMidnight());
  const [copied, setCopied] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const dayNumber = getDayNumber();

  // Check if user already played today's challenge
  useEffect(() => {
    const key = `daily-played-${getTodayKey()}`;
    if (localStorage.getItem(key)) setHasPlayed(true);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdownToMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePlay = () => {
    const key = `daily-played-${getTodayKey()}`;
    localStorage.setItem(key, "1");
    setHasPlayed(true);
  };

  const handleShare = async () => {
    const text = `\ud83c\udfae ${t('daily.shareText' as any)}: "${gameTitle}" \u2014 ${t('daily.shareDesc' as any)}`;
    const url = window.location.origin + (locale === 'en' ? '' : `/${locale}`) + "/daily";
    try {
      if (navigator.share) {
        await navigator.share({ title: t('daily.shareTitle' as any), text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Get past 5 days' games for the history strip
  const history = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (i + 1));
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    return { game: GAMES[seed % GAMES.length], date: d };
  });

  const pad = (n: number) => String(n).padStart(2, "0");

  const difficultyColorMap: Record<string, string> = {
    easy: "text-emerald-600 bg-emerald-50 border-emerald-200",
    medium: "text-amber-600 bg-amber-50 border-amber-200",
    hard: "text-rose-600 bg-rose-50 border-rose-200",
  };
  const difficultyColor = difficultyColorMap[game.difficulty] ?? "text-slate-600 bg-slate-50 border-slate-200";

  // SEO — localised page title + meta description + OG tags
  useHead({
    title: (t('seo.daily.title' as any) as string).replace('{title}', gameTitle),
    description: (t('seo.daily.description' as any) as string).replace('{title}', gameTitle),
    routePath: '/daily/',
    ogImage: game.thumbnail,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header strip */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 text-center text-sm font-medium">
        <span className="opacity-90">🎯 {t('daily.challengeLabel' as any)} #{dayNumber} — {getDayLabel()}</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back nav */}
        <Link href="/">
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-6 cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
            {t('game.backToGames')}
          </span>
        </Link>

        {/* Page title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('daily.title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('daily.subtitle')}</p>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-black/30 overflow-hidden mb-8 border border-slate-100 dark:border-slate-800">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Thumbnail */}
            <div className="relative aspect-video md:aspect-auto md:min-h-[280px] overflow-hidden bg-slate-100">
              <img
                src={game.thumbnail}
                alt={gameTitle}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                  el.parentElement!.insertAdjacentHTML('afterbegin', '<div class="w-full h-full flex items-center justify-center bg-slate-200 text-5xl">🎮</div>');
                }}
              />
              {/* Overlay badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold shadow-lg">
                  <Flame className="w-3.5 h-3.5" />
                  {t('daily.todaysPick')}
                </span>
              </div>
              {hasPlayed && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg">
                    <Check className="w-3.5 h-3.5" />
                    {t('daily.playedToday')}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${difficultyColor}`}>
                    {t(`difficulty.${game.difficulty}` as any)}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${CATEGORY_COLORS[game.category] ?? "bg-slate-100 text-slate-600"}`}>
                    {t(`category.${game.category}` as any)}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 leading-tight">{gameTitle}</h2>
                <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 space-y-2">
                  {gameDesc.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {gameControls && (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 mb-4">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t('daily.controls')}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{gameControls}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Link href={`/play/${game.slug}/`} onClick={handlePlay}>
                  <span onMouseEnter={() => prefetchGameUrl(game.iframeUrl)} className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-200 active:scale-95 cursor-pointer">
                    <Play className="w-5 h-5 fill-white" />
                    {hasPlayed ? t('game.play') : t('daily.playToday')}
                  </span>
                </Link>

                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                    {copied ? t('daily.copied') : t('daily.shareChallenge')}
                  </button>
                  <button
                    onClick={() => toggleFavourite(game.slug)}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                      isFavourite(game.slug)
                        ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {isFavourite(game.slug) ? "❤️" : "🤍"}
                    <span className="hidden sm:inline">{isFavourite(game.slug) ? t('daily.saved') : t('daily.save')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown to next challenge */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{t('daily.nextIn')}</h3>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: t('daily.countdown.hours'), value: pad(countdown.h) },
              { label: t('daily.countdown.minutes'), value: pad(countdown.m) },
              { label: t('daily.countdown.seconds'), value: pad(countdown.s) },
            ].map(({ label, value }, i) => (
              <div key={label} className="flex items-center gap-3">
                {i > 0 && <span className="text-2xl font-bold text-slate-300">:</span>}
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums w-16 text-center bg-slate-50 dark:bg-slate-800 rounded-xl py-2">
                    {value}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Previous challenges */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{t('daily.history')}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {history.map(({ game: g, date }, i) => (
              <Link key={i} href={`/play/${g.slug}/`} className="block h-full">
                <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer h-full flex flex-col">
                  <div className="aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={g.thumbnail}
                      alt={getGameT(locale, g).title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = 'none';
                        el.parentElement!.insertAdjacentHTML('afterbegin', '<div class="w-full h-full flex items-center justify-center bg-slate-200 text-2xl">🎮</div>');
                      }}
                    />
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">{getGameT(locale, g).title}</p>
                    <p className="text-[10px] text-slate-400 mt-auto">
                      {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
