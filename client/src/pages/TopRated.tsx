import { useMemo, useState, useEffect } from "react";
import { useT } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Trophy, ThumbsUp, ThumbsDown, ArrowLeft, Medal, TrendingUp, Star } from "lucide-react";
import { GAMES } from "@/data/games";
import { useGameTranslate } from '@/data/gameTranslations';
import AnimatedCard from "@/components/AnimatedCard";
import { CATEGORY_COLORS, CATEGORY_COLORS_BORDERED } from '@/data/categoryColors';
import { prefetchGameUrl } from '@/lib/utils';
import { useHead } from '@/hooks/useHead';

function readAllVotes(): Record<string, { likes: number; dislikes: number }> {
  const result: Record<string, { likes: number; dislikes: number }> = {};
  for (const game of GAMES) {
    try {
      const stored = localStorage.getItem(`game-votes-${game.slug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        result[game.slug] = { likes: parsed.likes || 0, dislikes: parsed.dislikes || 0 };
      } else {
        // Seed from game data when no user votes exist
        const baseLikes = Math.max(Math.round(game.rating * (game.playCount || 50) / 100), 1);
        const baseDislikes = Math.max(Math.round(baseLikes * (1 - game.rating / 5) * 0.3), 0);
        result[game.slug] = { likes: baseLikes, dislikes: baseDislikes };
      }
    } catch {
      const baseLikes = Math.max(Math.round(game.rating * (game.playCount || 50) / 100), 1);
      const baseDislikes = Math.max(Math.round(baseLikes * (1 - game.rating / 5) * 0.3), 0);
      result[game.slug] = { likes: baseLikes, dislikes: baseDislikes };
    }
  }
  return result;
}

function getRatioPercent(likes: number, dislikes: number): number {
  const total = likes + dislikes;
  if (total === 0) return 0;
  return Math.round((likes / total) * 100);
}

const RANK_STYLES = [
  { bg: "bg-gradient-to-br from-yellow-400 to-amber-500", text: "text-yellow-900", shadow: "shadow-amber-200", label: "🥇" },
  { bg: "bg-gradient-to-br from-slate-300 to-slate-400", text: "text-slate-800", shadow: "shadow-slate-200", label: "🥈" },
  { bg: "bg-gradient-to-br from-amber-600 to-orange-700", text: "text-amber-100", shadow: "shadow-orange-200", label: "🥉" },
];

export default function TopRated() {
  const t = useT();
  const gt = useGameTranslate();
  // Read votes fresh on every mount so navigation from a game page shows updated data
  const [allVotes, setAllVotes] = useState<Record<string, { likes: number; dislikes: number }>>(() => readAllVotes());

  useEffect(() => {
    setAllVotes(readAllVotes());
  }, []);

  // SEO — localised page title + meta description
  useHead({
    title: t('seo.topRated.title' as any),
    description: t('seo.topRated.description' as any),
    routePath: '/top-rated/',
  });

  const rankedGames = useMemo(() => {
    return GAMES.map((game) => {
      const votes = allVotes[game.slug] || { likes: 0, dislikes: 0 };
      return { ...game, ...votes, ratio: getRatioPercent(votes.likes, votes.dislikes) };
    }).sort((a, b) => {
      // Primary: likes descending; secondary: ratio descending; tertiary: title
      if (b.likes !== a.likes) return b.likes - a.likes;
      if (b.ratio !== a.ratio) return b.ratio - a.ratio;
      return a.title.localeCompare(b.title);
    });
  }, [allVotes]);

  const topThree = rankedGames.slice(0, 3);

  const totalLikes = rankedGames.reduce((s, g) => s + g.likes, 0);
  const totalDislikes = rankedGames.reduce((s, g) => s + g.dislikes, 0);
  const gamesWithVotes = rankedGames.filter((g) => g.likes + g.dislikes > 0).length;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        {/* Back link */}
        <Link href="/">
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 font-medium mb-6 transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            {t('topRated.backToAll')}
          </span>
        </Link>

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-8 md:p-12 mb-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full bg-white/5 translate-y-1/3" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">{t('topRated.hallOfFame')}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('topRated.title')}</h1>
              <p className="text-white/70 text-sm max-w-md">
                {t('topRated.all' as any)} {GAMES.length} {t('topRated.subtitle')}
              </p>
            </div>
            {/* Stats */}
            <div className="flex gap-3 sm:gap-4 shrink-0 flex-wrap">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-3 sm:px-5 py-3 sm:py-4 text-center min-w-0 flex-1 sm:flex-none">
                <div className="text-base sm:text-2xl font-bold text-white">{totalLikes >= 1_000_000 ? `${(totalLikes / 1_000_000).toFixed(1)}M` : totalLikes >= 1_000 ? `${(totalLikes / 1_000).toFixed(0)}K` : totalLikes}</div>
                <div className="text-white/70 text-[10px] sm:text-xs font-medium mt-0.5">{t('topRated.totalLikes')}</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-3 sm:px-5 py-3 sm:py-4 text-center min-w-0 flex-1 sm:flex-none">
                <div className="text-base sm:text-2xl font-bold text-white">{gamesWithVotes}</div>
                <div className="text-white/70 text-[10px] sm:text-xs font-medium mt-0.5">{t('topRated.gamesRated')}</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-3 sm:px-5 py-3 sm:py-4 text-center min-w-0 flex-1 sm:flex-none">
                <div className="text-base sm:text-2xl font-bold text-white">
                  {totalLikes + totalDislikes > 0
                    ? `${Math.round((totalLikes / (totalLikes + totalDislikes)) * 100)}%`
                    : "—"}
                </div>
                <div className="text-white/70 text-[10px] sm:text-xs font-medium mt-0.5">{t('topRated.approval')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Podium — Top 3 */}
        {topThree.some((g) => g.likes > 0) && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <Medal className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('topRated.podium')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topThree.map((game, i) => {
                const style = RANK_STYLES[i];
                const ratio = game.ratio;
                return (
                  <Link key={game.slug} href={`/play/${game.slug}/`}>
                    <div className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${style.shadow}`}>
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={game.thumbnail}
                          alt={gt(game).title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const el = e.target as HTMLImageElement;
                            el.style.display = 'none';
                            el.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-slate-200 text-4xl">🎮</div>';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      </div>
                      {/* Rank badge */}
                      <div className={`absolute top-3 left-3 w-9 h-9 rounded-full ${style.bg} ${style.text} flex items-center justify-center text-lg font-bold shadow-lg`}>
                        {style.label}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-2">
                          {gt(game).title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-white text-xs font-semibold">
                            <ThumbsUp className="w-3.5 h-3.5 fill-white" />
                            {game.likes}
                          </span>
                          {game.dislikes > 0 && (
                            <span className="flex items-center gap-1 text-white/70 text-xs">
                              <ThumbsDown className="w-3 h-3" />
                              {game.dislikes}
                            </span>
                          )}
                          {ratio > 0 && (
                            <span className="ml-auto text-xs font-bold text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
                              {ratio}% ✓
                            </span>
                          )}
                        </div>
                        {/* Approval bar */}
                        {game.likes + game.dislikes > 0 && (
                          <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-400 rounded-full transition-all duration-500"
                              style={{ width: `${ratio}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-violet-500" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('topRated.fullRankings')}</h2>
          <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">— {GAMES.length} {t('about.gamesLabel')}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[32px_1fr_64px] sm:grid-cols-[40px_1fr_80px_90px] md:grid-cols-[40px_1fr_100px_80px_80px_90px] gap-2 sm:gap-4 px-3 sm:px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            <div className="text-center">#</div>
            <div>{t('topRated.game')}</div>
            <div className="text-center hidden sm:block">{t('topRated.category')}</div>
            <div className="text-center hidden sm:block">
              <ThumbsUp className="w-3.5 h-3.5 inline" /> {t('topRated.likes')}
            </div>
            <div className="text-center hidden md:block">
              <ThumbsDown className="w-3.5 h-3.5 inline" /> {t('topRated.dislikes')}
            </div>
            <div className="text-center">{t('topRated.approval')}</div>
          </div>

          {/* Rows */}
          {rankedGames.map((game, index) => {
            const ratio = game.ratio;
            const hasVotes = game.likes + game.dislikes > 0;
            return (
              <AnimatedCard key={game.slug} index={index}>
              <Link href={`/play/${game.slug}/`}>
                <div
                  onMouseEnter={() => prefetchGameUrl(game.iframeUrl)}
                  className={`grid grid-cols-[32px_1fr_64px] sm:grid-cols-[40px_1fr_80px_90px] md:grid-cols-[40px_1fr_100px_80px_80px_90px] gap-2 sm:gap-4 px-3 sm:px-4 py-3 items-center border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-violet-50/50 dark:hover:bg-violet-950/30 transition-colors cursor-pointer group ${
                    index < 3 ? "bg-amber-50/30 dark:bg-amber-950/20" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="text-center">
                    {index < 3 ? (
                      <span className="text-lg">{RANK_STYLES[index].label}</span>
                    ) : (
                      <span className="text-sm font-bold text-slate-400">{index + 1}</span>
                    )}
                  </div>

                  {/* Game info */}
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={game.thumbnail}
                        alt={gt(game).title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.style.display = 'none';
                          el.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-slate-200 rounded-xl text-lg">🎮</div>';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-violet-600 transition-colors">
                        {gt(game).title}
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize border ${
                          CATEGORY_COLORS[game.category] || "text-violet-600 bg-violet-50 border-violet-100"
                        }`}>
                          {t(`category.${game.category}` as any)}
                        </span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          game.difficulty === 'easy' ? 'bg-green-50 text-green-600' :
                          game.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {t(`difficulty.${game.difficulty}` as any)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Category (hidden on small) */}
                  <div className="hidden sm:block" />

                  {/* Likes */}
                  <div className="text-center hidden sm:block">
                    <span className={`text-xs sm:text-sm font-bold ${game.likes > 0 ? "text-green-600" : "text-slate-300"}`}>
                      {game.likes > 0 ? (game.likes >= 1_000 ? `${(game.likes / 1_000).toFixed(0)}K` : game.likes) : "—"}
                    </span>
                  </div>

                  {/* Dislikes (hidden on small) */}
                  <div className="hidden md:block text-center">
                    <span className={`text-sm font-medium ${game.dislikes > 0 ? "text-red-400" : "text-slate-300"}`}>
                      {game.dislikes > 0 ? game.dislikes : "—"}
                    </span>
                  </div>

                  {/* Approval */}
                  <div className="text-center">
                    {hasVotes ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xs font-bold ${
                          ratio >= 80 ? "text-green-600" : ratio >= 50 ? "text-amber-600" : "text-red-500"
                        }`}>
                          {ratio}%
                        </span>
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              ratio >= 80 ? "bg-green-500" : ratio >= 50 ? "bg-amber-400" : "bg-red-400"
                            }`}
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-300 text-xs">{t('topRated.noVotes')}</span>
                    )}
                  </div>
                </div>
              </Link>
              </AnimatedCard>
            );
          })}
        </div>

        {/* CTA if no votes */}
        {gamesWithVotes === 0 && (
          <div className="mt-8 text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-5xl mb-3">🏆</div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('topRated.noVotes')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 max-w-sm mx-auto">
              {t('topRated.voteHint')}
            </p>
            <Link href="/">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-full text-sm font-semibold hover:bg-violet-700 transition-colors cursor-pointer">
                <Star className="w-4 h-4" />
                {t('topRated.browseGames')}
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
