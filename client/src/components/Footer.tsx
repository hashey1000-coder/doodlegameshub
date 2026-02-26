import { Link } from "wouter";
import { Joystick, Heart } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import { GAMES } from "@/data/games";
import { useGameTranslate } from "@/data/gameTranslations";

// Design: Clean, informative footer with sitemap links for SEO and navigation
// Categories match the CATEGORIES array in games.ts

const CATEGORY_LINKS = [
  { labelKey: "footer.popularGames", href: "/" },
  { labelKey: "category.classic", href: "/?category=classic" },
  { labelKey: "category.arcade", href: "/?category=arcade" },
  { labelKey: "category.puzzle", href: "/?category=puzzle" },
  { labelKey: "category.sports", href: "/?category=sports" },
  { labelKey: "category.creative", href: "/?category=creative" },
  { labelKey: "category.educational", href: "/?category=educational" },
  { labelKey: "category.seasonal", href: "/?category=seasonal" },
  { labelKey: "category.adventure", href: "/?category=adventure" },
];

const QUICK_LINKS = [
  { labelKey: "nav.aToZ", href: "/games" },
  { labelKey: "nav.daily", href: "/daily" },
  { labelKey: "nav.leaderboard", href: "/top-rated" },
  { labelKey: "common.seeAll", href: "/" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.contact", href: "/contact" },
  { labelKey: "nav.privacy", href: "/privacy" },
];

const POPULAR_GAME_SLUGS = [
  "pacman",
  "snake",
  "doodle-cricket-game",
  "champion-island-games",
  "magic-cat-academy",
  "doodle-jump",
  "solitaire",
  "minesweeper",
];

export default function Footer() {
  const t = useT();
  const gt = useGameTranslate();
  const popularGames = POPULAR_GAME_SLUGS.map(slug => GAMES.find(g => g.slug === slug)).filter(Boolean) as typeof GAMES;
  return (
    <footer className="bg-slate-900 text-slate-400 mt-8 md:mt-16">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/">
              <div className="flex items-center gap-2 mb-4 group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Joystick className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-bold text-white text-sm">DoodleGames</span>
                  <span className="text-violet-400 font-bold text-sm">HUB</span>
                </div>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              {t('footer.taglineDesc')}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>{t('footer.madeWith')}</span>
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              <span>{t('footer.forGameLovers')}</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{t('footer.categories')}</h3>
            <ul className="space-y-2">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-slate-400 hover:text-violet-400 transition-colors text-sm cursor-pointer">
                      {t(link.labelKey as any)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-slate-400 hover:text-violet-400 transition-colors text-sm cursor-pointer">
                      {t(link.labelKey as any)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Games */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{t('footer.popularGames')}</h3>
            <ul className="space-y-2">
              {popularGames.map((game) => (
                <li key={game.slug}>
                  <Link href={`/play/${game.slug}/`}>
                    <span className="text-slate-400 hover:text-violet-400 transition-colors text-sm cursor-pointer">
                      {gt(game).title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-500 text-xs">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/games/">
              <span className="hover:text-slate-300 transition-colors cursor-pointer">{t('nav.aToZ')}</span>
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/privacy/">
              <span className="hover:text-slate-300 transition-colors cursor-pointer">{t('nav.privacy')}</span>
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/contact/">
              <span className="hover:text-slate-300 transition-colors cursor-pointer">{t('nav.contact')}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
