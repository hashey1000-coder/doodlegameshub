/**
 * SessionHistory
 * Design: Gaming leaderboard aesthetic — dark card with violet accent,
 * rank medals, live timer badge, and animated row reveals.
 * Shows up to 10 personal best sessions per game, sorted by duration.
 */

import { useEffect, useState, useCallback } from "react";
import { Clock, Trophy, Trash2, Timer } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import {
  formatDuration,
  getSessionsForGame,
  type PlaySession,
} from "@/hooks/usePlayTimer";

interface SessionHistoryProps {
  slug: string;
  currentElapsed: number; // live seconds from usePlayTimer
  isPlaying: boolean;     // true once the game has been open > 5s
}

function formatDate(iso: string, t: (key: any) => string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return t('session.today');
  if (diffDays === 1) return t('session.yesterday');
  if (diffDays < 7) return `${diffDays} ${t('session.daysAgo')}`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow-md">
        🥇
      </span>
    );
  if (rank === 2)
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-700 text-xs font-bold shadow">
        🥈
      </span>
    );
  if (rank === 3)
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-amber-100 text-xs font-bold shadow">
        🥉
      </span>
    );
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white/60 text-xs font-semibold">
      {rank}
    </span>
  );
}

export function SessionHistory({
  slug,
  currentElapsed,
  isPlaying,
}: SessionHistoryProps) {
  const t = useT();
  const [sessions, setSessions] = useState<PlaySession[]>([]);
  const [cleared, setCleared] = useState(false);

  // Refresh sessions from localStorage whenever slug changes or a new session is saved
  const refresh = useCallback(() => {

    setSessions(getSessionsForGame(slug));
  }, [slug]);

  useEffect(() => {
    refresh();
    // Listen for storage events (e.g. another tab saves a session)
    const handler = (e: StorageEvent) => {
      if (e.key === "doodle-play-sessions") refresh();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [slug, refresh]);

  // Re-read sessions whenever currentElapsed changes (catches new saves)
  useEffect(() => {
    refresh();
  }, [currentElapsed, refresh]);

  const handleClear = () => {
    try {
      const raw = localStorage.getItem("doodle-play-sessions");
      if (!raw) return;
      const all = JSON.parse(raw);
      delete all[slug];
      localStorage.setItem("doodle-play-sessions", JSON.stringify(all));
      setSessions([]);
      setCleared(true);
      setTimeout(() => setCleared(false), 2000);
    } catch {
      // ignore
    }
  };

  const bestSession = sessions[0];
  const isNewBest =
    isPlaying &&
    currentElapsed > 0 &&
    (!bestSession || currentElapsed > bestSession.duration);

  return (
    <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900 via-violet-950/30 to-slate-900 shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-5 py-4 border-b border-white/10 flex-wrap">
        <div className="flex items-center gap-2.5">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="font-bold text-white text-sm tracking-wide uppercase">
            {t('session.title')}
          </h3>
          {sessions.length > 0 && (
            <span className="text-xs bg-violet-600/40 text-violet-300 px-2 py-0.5 rounded-full font-medium">
              {sessions.length} {t('session.sessions')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Live timer badge */}
          {isPlaying && currentElapsed >= 5 && (
            <div
              className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full transition-all ${
                isNewBest
                  ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                  : "bg-violet-600/20 text-violet-300 border border-violet-500/30"
              }`}
            >
              <Timer className="w-3.5 h-3.5 animate-pulse" />
              <span>{formatDuration(currentElapsed)}</span>
              {isNewBest && (
                <span className="text-yellow-400 font-bold ml-0.5">★ {t('session.personalBest')}</span>
              )}
            </div>
          )}
          {/* Clear button */}
          {sessions.length > 0 && (
            <button
              onClick={handleClear}
              className="text-white/30 hover:text-red-400 transition-colors p-1 rounded"
              title={t('session.clearTitle')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {cleared ? (
        <div className="py-8 text-center text-white/40 text-sm">
          {t('session.cleared')}
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-3 text-white/40">
          <Clock className="w-8 h-8 opacity-30" />
          <p className="text-sm">{t('session.noSessions')}</p>
          {isPlaying && currentElapsed >= 5 && (
            <p className="text-xs text-violet-400 animate-pulse">
              ⏱ {t('session.inProgress')} — {formatDuration(currentElapsed)}
            </p>
          )}
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {sessions.map((session, i) => (
            <div
              key={`${session.date}-${i}`}
              className="flex items-center gap-4 px-5 py-3 hover:bg-white/5 transition-colors"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <RankBadge rank={i + 1} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono font-semibold text-sm">
                    {formatDuration(session.duration)}
                  </span>
                  {i === 0 && (
                    <span className="text-xs bg-yellow-400/15 text-yellow-400 px-1.5 py-0.5 rounded font-medium">
                      {t('session.best')}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-white/40 text-xs shrink-0">
                {formatDate(session.date, t)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Footer hint */}
      <div className="px-5 py-3 border-t border-white/5 text-xs text-white/25 flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        <span>{t('session.timerHint')}</span>
      </div>
    </div>
  );
}
