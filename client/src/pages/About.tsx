import { useT } from "@/contexts/LanguageContext";
import { useHead } from '@/hooks/useHead';
/**
 * About page — /about
 * Design: Clean, editorial layout with a warm off-white background.
 * Sections: Hero, What is this site, How games are curated, Stats grid,
 *           FAQ, Disclaimer.
 */
import { Link } from "wouter";
import {
  Gamepad2, Heart, Search, CalendarDays, Trophy, Shuffle,
  Baby, Star, Info, BookOpen, Shield,
} from "lucide-react";
import { GAMES } from "@/data/games";

const CATEGORY_COUNTS = GAMES.reduce<Record<string, number>>((acc, g) => {
  acc[g.category] = (acc[g.category] ?? 0) + 1;
  return acc;
}, {});

const STATS = [
  { value: GAMES.length.toString(), labelKey: "about.stats.playableGames", icon: "🎮" },
  { value: String(new Set(GAMES.map(g => g.category)).size), labelKey: "about.stats.categories", icon: "🗂️" },
  { value: "100%", labelKey: "about.stats.freeToPlay", icon: "✅" },
  { value: "0", labelKey: "about.stats.downloads", icon: "🚀" },
];

const FEATURES = [
  {
    icon: <Search className="w-5 h-5" />,
    titleKey: "about.features.search",
    descKey: "about.features.searchDesc",
  },
  {
    icon: <CalendarDays className="w-5 h-5" />,
    titleKey: "about.features.daily",
    descKey: "about.features.dailyDesc",
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    titleKey: "about.features.leaderboard",
    descKey: "about.features.leaderboardDesc",
  },
  {
    icon: <Shuffle className="w-5 h-5" />,
    titleKey: "about.features.surprise",
    descKey: "about.features.surpriseDesc",
  },
  {
    icon: <Baby className="w-5 h-5" />,
    titleKey: "about.features.kidsMode",
    descKey: "about.features.kidsModeDesc",
  },
  {
    icon: <Star className="w-5 h-5" />,
    titleKey: "about.features.favourites",
    descKey: "about.features.favouritesDesc",
  },
];

const FAQ_KEYS = [
  { qKey: "about.faq.q1", aKey: "about.faq.a1" },
  { qKey: "about.faq.q2", aKey: "about.faq.a2" },
  { qKey: "about.faq.q3", aKey: "about.faq.a3" },
  { qKey: "about.faq.q4", aKey: "about.faq.a4" },
  { qKey: "about.faq.q5", aKey: "about.faq.a5" },
  { qKey: "about.faq.q6", aKey: "about.faq.a6" },
];

export default function About() {
  const t = useT();

  // SEO — localised page title + meta description
  useHead({
    title: t('seo.about.title' as any),
    description: t('about.heroDesc' as any),
    routePath: '/about/',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-600 via-violet-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Info className="w-3.5 h-3.5" />
            {t('about.aboutBadge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            {t('about.heroTitle')}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t('about.heroDesc')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-violet-700 font-semibold text-sm hover:bg-violet-50 transition-colors shadow-lg shadow-violet-900/20 cursor-pointer">
                <Gamepad2 className="w-4 h-4" />
                {t('about.browseGames')}
              </span>
            </Link>
            <Link href="/daily/">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm text-white font-semibold text-sm hover:bg-white/25 transition-colors border border-white/20 cursor-pointer">
                <CalendarDays className="w-4 h-4" />
                {t('about.todayChallenge')}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div
              key={s.labelKey}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 text-center"
            >
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{t(s.labelKey as any)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What is this site */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('about.whatIs')}</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {t('about.whatIsP1')}
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {t('about.whatIsP2')}
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('about.whatIsP3')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(CATEGORY_COUNTS).map(([cat, count]) => (
              <Link key={cat} href={`/?category=${cat}`}>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 hover:border-violet-200 dark:hover:border-violet-600 hover:shadow-md transition-all cursor-pointer group">
                  <div className="text-2xl font-extrabold text-violet-600 group-hover:scale-110 transition-transform inline-block">{count}</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize mt-0.5">{t(`category.${cat}` as any)}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{t('about.gamesLabel')}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('about.whatsBuiltIn')}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
            {t('about.featuresSubtitle')}
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.titleKey}
                className="flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  {f.icon}
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t(f.titleKey as any)}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{t(f.descKey as any)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How games are curated */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('about.curationTitle')}</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
          <p>{t('about.curationP1')}</p>
          <p>{t('about.curationP2')}</p>
          <p>{t('about.curationP3')}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="w-5 h-5 text-violet-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('about.faqTitle')}</h2>
          </div>
          <div className="space-y-5">
            {FAQ_KEYS.map((faq) => (
              <div key={faq.qKey} className="border border-slate-100 dark:border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{t(faq.qKey as any)}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{t(faq.aKey as any)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-amber-900 dark:text-amber-300 mb-3">{t('about.disclaimer')}</h2>
              <div className="text-sm text-amber-800 dark:text-amber-400 leading-relaxed space-y-2">
                <p>{t('about.disclaimer.p1' as any)}</p>
                <p>{t('about.disclaimer.p2' as any)}</p>
                <p>{t('about.disclaimer.p3' as any)}</p>
                <p>{t('about.disclaimer.p4' as any)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Made with love footer CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-slate-400 dark:text-slate-600 text-sm">
          <span>{t('footer.madeWith')}</span>
          <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
          <span>{t('about.madeWithDesc')}</span>
        </div>
        <div className="mt-4">
          <Link href="/">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 transition-colors shadow-md shadow-violet-200/40 cursor-pointer">
              <Gamepad2 className="w-4 h-4" />
              {t('about.startPlaying')}
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
