/**
 * Navbar — Doodle Games Hub
 * Design: Brutalist-editorial, sticky top bar with glass morphism
 * Includes: logo, search, nav links, language selector, dark mode, kids mode, mobile drawer
 */

import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link, useLocation } from "wouter";
import {
  Joystick, Shuffle, LayoutList, Search, Baby, X, Trophy,
  CalendarDays, Sun, Moon, Menu, Home, Info, Heart, Globe, Check, Mail, Shield,
} from "lucide-react";
const SpinWheel = lazy(() => import("@/components/SpinWheel"));
import { GAMES } from "@/data/games";
import { useKidsMode } from "@/hooks/useKidsMode";
import { useNewGames } from "@/hooks/useNewGames";
import { useStreakContext } from "@/contexts/StreakContext";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useLanguage, SUPPORTED_LOCALES, useT } from "@/contexts/LanguageContext";

// Lazy-load confetti to reduce initial JS bundle (only needed on milestone)
const lazyConfetti = () => import("canvas-confetti").then(m => m.default);

const MILESTONE_MESSAGES: Record<number, { emoji: string; titleKey: string; bodyKey: string }> = {
  3: { emoji: "🔥", titleKey: 'milestone.3.title', bodyKey: 'milestone.3.body' },
  7: { emoji: "⚡", titleKey: 'milestone.7.title', bodyKey: 'milestone.7.body' },
  30: { emoji: "🏆", titleKey: 'milestone.30.title', bodyKey: 'milestone.30.body' },
};

/** Compact language selector dropdown for the desktop navbar */
function LanguageSelector() {
  const { locale, setLocale } = useLanguage();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SUPPORTED_LOCALES.find(l => l.code === locale) ?? SUPPORTED_LOCALES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        title={`${t('nav.langTooltip' as any)}: ${current.englishName}`}
        aria-label={`${t('nav.langTooltip' as any)}: ${current.englishName}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
      >
        <Globe className="w-3.5 h-3.5 shrink-0" />
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden xl:inline text-xs">{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-5rem)]">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{t('nav.chooseLang')}</p>
          </div>
          <div className="max-h-[min(18rem,calc(100vh-8rem))] overflow-y-auto py-1">
            {SUPPORTED_LOCALES.map(loc => (
              <button
                key={loc.code}
                onClick={() => { setLocale(loc.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/50 ${
                  locale === loc.code
                    ? "text-violet-600 dark:text-violet-400 font-medium"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <span className="text-base leading-none w-5 shrink-0">{loc.flag}</span>
                <span className="flex-1 text-left">{loc.name}</span>
                {locale === loc.code && <Check className="w-3.5 h-3.5 shrink-0 text-violet-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [, navigate] = useLocation();
  const t = useT();
  const [searchQuery, setSearchQuery] = useState("");
  const { kidsMode, toggleKidsMode } = useKidsMode();
  const { streak, milestoneHit, dismissMilestone } = useStreakContext();
  const [showMilestone, setShowMilestone] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { unseenCount, markAllSeen } = useNewGames();
  const { locale, setLocale } = useLanguage();
  const current = SUPPORTED_LOCALES.find(l => l.code === locale) ?? SUPPORTED_LOCALES[0];

  // Mobile language sub-panel
  const [showLangPanel, setShowLangPanel] = useState(false);

  // Close mobile menu on route change
  const [location] = useLocation();
  /** Check if a nav link path matches the current route */
  const isActive = (path: string) => {
    if (path === '/') return location === '/' || location === '';
    return location.startsWith(path);
  };
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowLangPanel(false);
  }, [location]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Fire confetti when a milestone is hit (lazy-loaded)
  useEffect(() => {
    if (milestoneHit) {
      setShowMilestone(true);
      lazyConfetti().then(confettiFn => {
        const fire = (particleRatio: number, opts: any) => {
          confettiFn({
            origin: { y: 0.6 },
            ...opts,
            particleCount: Math.floor(200 * particleRatio),
          });
        };
        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      });
    }
  }, [milestoneHit]);

  const handleDismissMilestone = () => {
    setShowMilestone(false);
    dismissMilestone();
  };

  const handleRandomGame = () => {
    setMobileMenuOpen(false);
    setShowSpinWheel(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search/?q=${encodeURIComponent(trimmed)}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const milestone = milestoneHit ? MILESTONE_MESSAGES[milestoneHit] : null;

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md shadow-violet-200/50 group-hover:shadow-violet-300/60 transition-shadow">
                <Joystick className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-[15px] tracking-tight">
                <span className="text-violet-600">Doodle</span>
                <span>Games</span>
                <span className="text-[10px] font-semibold text-violet-500 ml-0.5 align-top mt-0.5 inline-block">HUB</span>
              </span>
            </div>
          </Link>

          {/* Center: Search bar (desktop) */}
          <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:bg-white dark:focus:bg-slate-700 transition-all"
            />
          </form>

          {/* Right side */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile search icon */}
            <Link href="/search/" aria-label="Search games">
              <span className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Search className="w-4 h-4" />
              </span>
            </Link>

            {/* Desktop nav links */}
            <Link href="/" onClick={markAllSeen} className="hidden md:block" aria-label={t('nav.allGames')}>
              <span className={`relative text-sm font-medium transition-colors px-3 py-1.5 rounded-full inline-flex items-center gap-1 ${isActive('/') ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50' : 'text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/50'}`}>
                {t('nav.allGames')}
                {unseenCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none animate-pulse">
                    {unseenCount}
                  </span>
                )}
              </span>
            </Link>

            <Link href="/games/" className="hidden md:block" aria-label={t('nav.aToZ')}>
              <span className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1.5 rounded-full inline-flex ${isActive('/games/') ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50' : 'text-slate-600 dark:text-slate-300 hover:text-violet-600 hover:bg-violet-50'}`}>
                <LayoutList className="w-3.5 h-3.5" />
                {t('nav.aToZ')}
              </span>
            </Link>

            <Link href="/daily/" className="hidden lg:block" aria-label={t('nav.daily')}>
              <span className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1.5 rounded-full inline-flex ${isActive('/daily/') ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50' : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50'}`}>
                <CalendarDays className="w-3.5 h-3.5" />
                {t('nav.daily')}
              </span>
            </Link>

            <Link href="/top-rated/" className="hidden lg:block" aria-label={t('nav.leaderboard')}>
              <span className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1.5 rounded-full inline-flex ${isActive('/top-rated/') ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/50' : 'text-slate-600 dark:text-slate-300 hover:text-yellow-600 hover:bg-yellow-50'}`}>
                <Trophy className="w-3.5 h-3.5" />
                {t('nav.leaderboard')}
              </span>
            </Link>

            {/* Streak counter */}
            {streak >= 1 && (
              <Link href="/top-rated/">
                <span
                  title={`${streak} ${t('nav.streakTooltip' as any)}`}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-bold hover:bg-orange-100 transition-colors cursor-pointer hidden md:flex"
                >
                  <span className="text-base leading-none">🔥</span>
                  <span>{streak}</span>
                </span>
              </Link>
            )}

            {/* Language selector (desktop) */}
            <div className="hidden md:block">
              <LanguageSelector />
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              title={isDark ? t('nav.lightModeTooltip' as any) : t('nav.darkModeTooltip' as any)}
              aria-label={isDark ? t('nav.lightModeTooltip' as any) : t('nav.darkModeTooltip' as any)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Kids Mode toggle (desktop) */}
            <button
              onClick={toggleKidsMode}
              title={kidsMode ? t('nav.kidsModeTooltipOn' as any) : t('nav.kidsModeTooltipOff' as any)}
              aria-label={kidsMode ? t('nav.kidsModeTooltipOn' as any) : t('nav.kidsModeTooltipOff' as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hidden md:flex ${
                kidsMode
                  ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
              }`}
            >
              <Baby className="w-4 h-4" />
              <span className="hidden lg:inline">{kidsMode ? t('nav.kidsOn') : t('nav.kidsMode')}</span>
            </button>

            {/* Random button (desktop) */}
            <button
              onClick={handleRandomGame}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm font-medium hover:from-violet-600 hover:to-violet-700 transition-all shadow-sm hover:shadow-md hover:shadow-violet-200/50 active:scale-95"
              title={t('nav.randomTooltip' as any)}
              aria-label={t('nav.randomTooltip' as any)}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('nav.surpriseMe')}</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t('nav.openMenu' as any)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer overlay ── */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.mobileMenu' as any)}
          className="fixed inset-0 z-50 flex"
          onClick={(e) => { if (e.target === e.currentTarget) { setMobileMenuOpen(false); setShowLangPanel(false); } }}
          onKeyDown={(e) => { if (e.key === 'Escape') { setMobileMenuOpen(false); setShowLangPanel(false); } }}
          style={{ background: "rgba(0,0,0,0.45)" }}
        >
          {/* Drawer panel */}
          <div className="ml-auto w-72 h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col min-h-0 overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                  <Joystick className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  <span className="text-violet-600">Doodle</span>Games
                </span>
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); setShowLangPanel(false); }}
                aria-label={t('nav.closeMenu' as any)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language sub-panel (slides in) */}
            {showLangPanel ? (
              <div className="flex flex-col flex-1 overflow-hidden">
                <button
                  onClick={() => setShowLangPanel(false)}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-violet-600 hover:bg-violet-50 transition-colors border-b border-slate-100 dark:border-slate-800"
                >
                  <span className="text-base">←</span> {t('common.back')}
                </button>
                <p className="px-5 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">{t('nav.language')}</p>
                <div className="flex-1 overflow-y-auto py-1">
                  {SUPPORTED_LOCALES.map(loc => (
                    <button
                      key={loc.code}
                      onClick={() => { setLocale(loc.code); setShowLangPanel(false); }}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/50 ${
                        locale === loc.code
                          ? "text-violet-600 dark:text-violet-400 font-medium"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span className="text-base leading-none w-5 shrink-0">{loc.flag}</span>
                      <span className="flex-1 text-left">{loc.name}</span>
                      {locale === loc.code && <Check className="w-3.5 h-3.5 shrink-0 text-violet-500" />}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Search bar in drawer */}
                <form onSubmit={handleSearch} className="px-5 pt-4 pb-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('nav.searchPlaceholder')}
                      className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:bg-white dark:focus:bg-slate-700 transition-all"
                    />
                  </div>
                </form>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto px-3 py-2">
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">{t('nav.navigate')}</p>

                  <Link href="/" onClick={markAllSeen}>
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${isActive('/') ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/50 hover:text-violet-600'}`}>
                      <Home className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">{t('nav.allGames')}</span>
                      {unseenCount > 0 && (
                        <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                          {unseenCount}
                        </span>
                      )}
                    </div>
                  </Link>

                  <Link href="/games/">
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${isActive('/games/') ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/50 hover:text-violet-600'}`}>
                      <LayoutList className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">{t('nav.aToZ')}</span>
                    </div>
                  </Link>

                  <Link href="/daily/">
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${isActive('/daily/') ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200 hover:bg-amber-50 hover:text-amber-600'}`}>
                      <CalendarDays className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">{t('nav.daily')}</span>
                    </div>
                  </Link>

                  <Link href="/top-rated/">
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${isActive('/top-rated/') ? 'bg-yellow-50 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400' : 'text-slate-700 dark:text-slate-200 hover:bg-yellow-50 hover:text-yellow-600'}`}>
                      <Trophy className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">{t('nav.leaderboard')}</span>
                      {streak >= 1 && (
                        <span className="ml-auto flex items-center gap-0.5 text-orange-500 text-xs font-bold">
                          🔥 {streak}
                        </span>
                      )}
                    </div>
                  </Link>

                  <Link href="/about/">
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${isActive('/about/') ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900'}`}>
                      <Info className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">{t('nav.about')}</span>
                    </div>
                  </Link>

                  <Link href="/contact/">
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${isActive('/contact/') ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900'}`}>
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">{t('nav.contact')}</span>
                    </div>
                  </Link>

                  <Link href="/privacy/">
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${isActive('/privacy/') ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900'}`}>
                      <Shield className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">{t('nav.privacy')}</span>
                    </div>
                  </Link>

                  <div className="my-2 border-t border-slate-100 dark:border-slate-800" />
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">{t('nav.settings')}</p>

                  {/* Language selector in drawer */}
                  <button
                    onClick={() => setShowLangPanel(true)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Globe className="w-4 h-4 shrink-0" />
                    <span>{t('nav.language')}</span>
                    <span className="ml-auto flex items-center gap-1.5 text-slate-400 text-xs">
                      <span className="text-base leading-none">{current.flag}</span>
                      {current.name}
                      <span className="text-slate-300">›</span>
                    </span>
                  </button>

                  {/* Kids Mode toggle in drawer */}
                  <button
                    onClick={() => { toggleKidsMode(); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      kidsMode
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Baby className="w-4 h-4 shrink-0" />
                    <span>{kidsMode ? t('nav.kidsModeOn') : t('nav.kidsModeOff')}</span>
                    <span className={`ml-auto w-8 h-4 rounded-full transition-colors ${kidsMode ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`}>
                      <span className={`block w-3 h-3 bg-white rounded-full shadow mt-0.5 transition-transform ${kidsMode ? "translate-x-4" : "translate-x-0.5"}`} />
                    </span>
                  </button>

                  {/* Dark mode toggle in drawer */}
                  <button
                    onClick={toggleDark}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {isDark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
                    <span>{isDark ? t('nav.lightMode') : t('nav.darkMode')}</span>
                  </button>
                </nav>

                {/* Random button at bottom of drawer */}
                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={handleRandomGame}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm font-semibold hover:from-violet-600 hover:to-violet-700 transition-all shadow-md shadow-violet-200/40 active:scale-95"
                  >
                    <Shuffle className="w-4 h-4" />
                    {t('nav.surpriseMe')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Milestone celebration modal */}
      {showMilestone && milestone && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(milestone.titleKey as any)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={(e) => { if (e.target === e.currentTarget) handleDismissMilestone(); }}
          onKeyDown={(e) => { if (e.key === 'Escape') handleDismissMilestone(); }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden text-center animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 px-6 pt-8 pb-6">
              <div className="text-6xl mb-3">{milestone.emoji}</div>
              <h2 className="text-2xl font-bold text-white">{t(milestone.titleKey as any)}</h2>
              <p className="text-white/80 text-sm mt-1">{t(milestone.bodyKey as any)}</p>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                  {milestoneHit} {t('nav.streakAchieved')}
                </span>
              </div>
              <button
                onClick={handleDismissMilestone}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl text-sm font-semibold hover:from-violet-600 hover:to-violet-700 transition-all"
              >
                {t('nav.keepPlaying')}
              </button>
            </div>
            <button
              onClick={handleDismissMilestone}
              aria-label={t('common.close' as any)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Spin Wheel overlay — lazy loaded on demand */}
      {showSpinWheel && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" /></div>}>
          <SpinWheel onClose={() => setShowSpinWheel(false)} />
        </Suspense>
      )}
    </>
  );
}
