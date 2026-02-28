/**
 * LanguageContext — i18n infrastructure for Doodle Games Hub
 *
 * URL scheme:
 *   English (default): /,  /daily,  /play/pacman
 *   Other locales:     /es/, /es/daily, /es/play/pacman
 *
 * The locale is read from the first URL segment on mount and kept in sync
 * whenever setLocale() is called (which also navigates to the new URL).
 *
 * HOW TO ADD TRANSLATIONS:
 *   1. Add the locale to SUPPORTED_LOCALES below
 *   2. Add a matching entry to TRANSLATIONS with all keys filled in
 *   3. The UI will automatically show the new language in the selector
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { loadGameLocale } from '@/data/gameTranslations';
import { loadTriviaLocale } from '@/data/triviaTranslations';

// ---------------------------------------------------------------------------
// Supported locales
// ---------------------------------------------------------------------------

export interface Locale {
  code: string;
  name: string;
  englishName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LOCALES: Locale[] = [
  { code: 'en',    name: 'English',    englishName: 'English',              flag: '🇬🇧', dir: 'ltr' },
  { code: 'es',    name: 'Español',    englishName: 'Spanish',              flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr',    name: 'Français',   englishName: 'French',               flag: '🇫🇷', dir: 'ltr' },
  { code: 'de',    name: 'Deutsch',    englishName: 'German',               flag: '🇩🇪', dir: 'ltr' },
  { code: 'it',    name: 'Italiano',   englishName: 'Italian',              flag: '🇮🇹', dir: 'ltr' },
  { code: 'pt',    name: 'Português',  englishName: 'Portuguese',           flag: '🇧🇷', dir: 'ltr' },
  { code: 'ru',    name: 'Русский',    englishName: 'Russian',              flag: '🇷🇺', dir: 'ltr' },
  { code: 'zh-CN', name: '中文(简体)',  englishName: 'Chinese (Simplified)',  flag: '🇨🇳', dir: 'ltr' },
  { code: 'zh-TW', name: '中文(繁體)',  englishName: 'Chinese (Traditional)', flag: '🇹🇼', dir: 'ltr' },
  { code: 'ja',    name: '日本語',      englishName: 'Japanese',             flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko',    name: '한국어',      englishName: 'Korean',               flag: '🇰🇷', dir: 'ltr' },
  { code: 'ar',    name: 'العربية',    englishName: 'Arabic',               flag: '🇸🇦', dir: 'rtl' },
  { code: 'hi',    name: 'हिन्दी',      englishName: 'Hindi',                flag: '🇮🇳', dir: 'ltr' },
  { code: 'tr',    name: 'Türkçe',     englishName: 'Turkish',              flag: '🇹🇷', dir: 'ltr' },
  { code: 'nl',    name: 'Nederlands', englishName: 'Dutch',                flag: '🇳🇱', dir: 'ltr' },
  { code: 'pl',    name: 'Polski',     englishName: 'Polish',               flag: '🇵🇱', dir: 'ltr' },
  { code: 'sv',    name: 'Svenska',    englishName: 'Swedish',              flag: '🇸🇪', dir: 'ltr' },
  { code: 'id',    name: 'Indonesia',  englishName: 'Indonesian',           flag: '🇮🇩', dir: 'ltr' },
  { code: 'vi',    name: 'Tiếng Việt', englishName: 'Vietnamese',           flag: '🇻🇳', dir: 'ltr' },
  { code: 'th',    name: 'ภาษาไทย',    englishName: 'Thai',                 flag: '🇹🇭', dir: 'ltr' },
];

/** All valid locale codes as a Set for fast lookup */
const LOCALE_CODES = new Set(SUPPORTED_LOCALES.map(l => l.code));

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

/**
 * Parse the locale from the current URL path.
 * e.g. /es/daily → 'es', /daily → 'en', / → 'en'
 */
export function getLocaleFromPath(pathname: string): string {
  const seg = pathname.split('/').filter(Boolean)[0];
  if (seg && LOCALE_CODES.has(seg)) return seg;
  return 'en';
}

/**
 * Strip the locale prefix from a path.
 * /es/daily → /daily, /daily → /daily, /es/ → /
 */
export function stripLocalePrefixFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && LOCALE_CODES.has(parts[0])) {
    const rest = parts.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }
  return pathname || '/';
}

/**
 * Build a localised path.
 * localePath('es', '/daily') → '/es/daily'
 * localePath('en', '/daily') → '/daily'
 *
 * Safety: strips any existing locale prefix first so callers can never
 * accidentally produce double-prefixed paths like /fr/es/play/pacman/.
 */
export function localePath(locale: string, path: string): string {
  // Defensive: strip any existing locale prefix to prevent /fr/es/… doubling
  const stripped = stripLocalePrefixFromPath(path);
  const clean = stripped.startsWith('/') ? stripped : `/${stripped}`;
  // Ensure trailing slash for all paths
  const withSlash = clean.endsWith('/') ? clean : `${clean}/`;
  if (locale === 'en') return withSlash;
  return `/${locale}${withSlash === '/' ? '/' : withSlash}`;
}

// ---------------------------------------------------------------------------
// Translation keys
// ---------------------------------------------------------------------------

export type TranslationKey =
  | 'nav.allGames' | 'nav.aToZ' | 'nav.daily' | 'nav.leaderboard'
  | 'nav.about' | 'nav.contact' | 'nav.privacy'
  | 'nav.kidsMode' | 'nav.darkMode' | 'nav.search' | 'nav.searchPlaceholder'
  | 'nav.surpriseMe' | 'nav.menu' | 'nav.closeMenu' | 'nav.language' | 'nav.streak'
  | 'home.heroTitle' | 'home.heroSubtitle' | 'home.heroBadge'
  | 'home.heroStats.games' | 'home.heroStats.categories' | 'home.heroStats.free'
  | 'home.cta.todayChallenge' | 'home.cta.surpriseMe' | 'home.cta.viewAll'
  | 'home.featured' | 'home.newGames' | 'home.topRated' | 'home.categories'
  | 'home.allCategories' | 'home.playNow' | 'home.new' | 'home.noGames'
  | 'game.play' | 'game.favourite' | 'game.unfavourite' | 'game.share'
  | 'game.difficulty' | 'game.category' | 'game.players' | 'game.year'
  | 'game.howToPlay' | 'game.funFact' | 'game.trivia' | 'game.relatedGames'
  | 'game.notFound' | 'game.notFoundDesc' | 'game.backToGames'
  | 'game.vote.helpful' | 'game.vote.notHelpful'
  | 'game.fullscreen' | 'game.exitFullscreen' | 'game.loading' | 'game.loadingDesc'
  | 'game.loadError' | 'game.loadErrorDesc' | 'game.tryAgain'
  | 'daily.title' | 'daily.subtitle'
  | 'daily.countdown.hours' | 'daily.countdown.minutes' | 'daily.countdown.seconds'
  | 'daily.nextIn' | 'daily.playToday' | 'daily.streak' | 'daily.streakDesc'
  | 'daily.history' | 'daily.completed' | 'daily.notCompleted'
  | 'topRated.title' | 'topRated.subtitle' | 'topRated.rank' | 'topRated.game'
  | 'topRated.category' | 'topRated.difficulty' | 'topRated.rating'
  | 'topRated.play' | 'topRated.filterAll'
  | 'allGames.title' | 'allGames.subtitle' | 'allGames.searchPlaceholder'
  | 'allGames.noResults' | 'allGames.clearSearch' | 'allGames.total'
  | 'search.title' | 'search.resultsFor' | 'search.noResults' | 'search.noResultsDesc'
  | 'search.filterByCategory' | 'search.filterByDifficulty'
  | 'search.allCategories' | 'search.allDifficulties' | 'search.results'
  | 'about.title' | 'about.subtitle'
  | 'about.stats.games' | 'about.stats.categories' | 'about.stats.free' | 'about.stats.updated'
  | 'about.mission' | 'about.missionText' | 'about.features'
  | 'about.curation' | 'about.curationText' | 'about.faq' | 'about.disclaimer' | 'about.startPlaying'
  | 'contact.title' | 'contact.subtitle'
  | 'contact.name' | 'contact.email' | 'contact.subject' | 'contact.message'
  | 'contact.send' | 'contact.success' | 'contact.successDesc'
  | 'contact.namePlaceholder' | 'contact.emailPlaceholder'
  | 'contact.subjectPlaceholder' | 'contact.messagePlaceholder'
  | 'contact.required' | 'contact.invalidEmail'
  | 'privacy.title' | 'privacy.subtitle' | 'privacy.lastUpdated'
  | 'footer.tagline' | 'footer.taglineDesc' | 'footer.madeWith' | 'footer.forGameLovers'
  | 'footer.quickLinks' | 'footer.popularGames'
  | 'footer.categories' | 'footer.legal' | 'footer.disclaimer' | 'footer.copyright'
  | 'about.madeWithDesc'
  | 'spin.title' | 'spin.subtitle' | 'spin.spin' | 'spin.spinning'
  | 'spin.youGot' | 'spin.playNow' | 'spin.spinAgain' | 'spin.close'
  | 'difficulty.easy' | 'difficulty.medium' | 'difficulty.hard'
  | 'category.arcade' | 'category.puzzle' | 'category.sports' | 'category.music'
  | 'category.educational' | 'category.seasonal' | 'category.adventure' | 'category.creative'
  | 'common.loading' | 'common.error' | 'common.retry' | 'common.close'
  | 'common.back' | 'common.next' | 'common.prev' | 'common.seeAll'
  | 'common.comingSoon' | 'common.new' | 'common.free' | 'common.play'
  | 'common.plays' | 'common.copied'
  // Home extras
  | 'home.heroTitleLine1' | 'home.kidsModeBanner' | 'home.turnOff'
  | 'home.recentlyPlayed' | 'home.recentlyPlayedHint' | 'home.recent'
  | 'home.favourites' | 'home.tags' | 'home.filterByTags' | 'home.tagHint'
  | 'home.clearAll' | 'home.searchPlaceholder'
  | 'home.sortBy' | 'home.sortDefault' | 'home.sortMostPlayed'
  | 'home.sortHighestRated' | 'home.sortAZ' | 'home.sortNewest'
  | 'home.favourited' | 'home.sortedByLikes' | 'home.available'
  | 'home.kidsModeEasy' | 'home.tagFiltersActive'
  | 'home.localLikes' | 'home.viewLeaderboard'
  | 'home.noFavourites' | 'home.noFavouritesDesc'
  | 'home.noLikes' | 'home.noLikesDesc'
  | 'home.noTagMatch' | 'home.noTagMatchDesc'
  | 'home.clearTagFilters' | 'home.noGamesDesc'
  | 'home.activeTags' | 'home.kidsModeOn'
  // Navbar extras
  | 'nav.navigate' | 'nav.settings' | 'nav.lightMode' | 'nav.chooseLang'
  | 'nav.kidsModeOn' | 'nav.kidsModeOff' | 'nav.kidsOn'
  | 'nav.streakAchieved' | 'nav.keepPlaying'
  // Daily extras
  | 'daily.todaysPick' | 'daily.playedToday' | 'daily.controls'
  | 'daily.copied' | 'daily.shareChallenge' | 'daily.save' | 'daily.saved'
  // TopRated extras
  | 'topRated.hallOfFame' | 'topRated.totalLikes' | 'topRated.gamesRated'
  | 'topRated.approval' | 'topRated.podium' | 'topRated.fullRankings'
  | 'topRated.likes' | 'topRated.dislikes'
  | 'topRated.noVotes' | 'topRated.noVotesDesc' | 'topRated.browseGames'
  // AllGames extras
  | 'allGames.sortAZ' | 'allGames.sortMostPlayed'
  | 'allGames.sortHighestRated' | 'allGames.sortNewest' | 'allGames.gamesCount'
  // Search extras
  | 'search.sort' | 'search.sortRelevance' | 'search.sortMostPlayed'
  | 'search.sortHighestRated' | 'search.sortAZ' | 'search.sortNewest'
  | 'search.clear' | 'search.whatLookingFor' | 'search.typeHint'
  | 'search.browseAll' | 'search.searchPlaceholder'
  // About extras
  | 'about.heroTitle' | 'about.heroDesc' | 'about.aboutBadge'
  | 'about.whatIs' | 'about.whatIsP1' | 'about.whatIsP2' | 'about.whatIsP3'
  | 'about.whatsBuiltIn' | 'about.featuresSubtitle'
  | 'about.disclaimerText'
  // Contact extras
  | 'contact.getInTouch' | 'contact.whatHelp' | 'contact.quickAnswers'
  | 'contact.sendMessage' | 'contact.sending' | 'contact.responseTime'
  | 'contact.backToGames'
  // Game/Play extras
  | 'game.playTime' | 'game.longestSession' | 'game.challenged'
  | 'game.challengeDesc' | 'game.challengeFriend'
  | 'game.details' | 'game.moreGames' | 'game.youMightLike'
  | 'game.keepPlaying' | 'game.startPlaying'
  | 'game.exitPrompt' | 'game.ratePrompt' | 'game.lovedIt' | 'game.notForMe'
  // NotFound
  | 'notFound.code' | 'notFound.title' | 'notFound.desc' | 'notFound.backHome'
  // Session
  | 'session.title' | 'session.today' | 'session.yesterday' | 'session.daysAgo'
  | 'session.personalBest' | 'session.noSessions' | 'session.inProgress' | 'session.best'
  | 'session.cleared' | 'session.timerHint' | 'session.clearTitle' | 'session.sessions'
  // Trivia
  | 'trivia.didYouKnow' | 'trivia.shareFact' | 'trivia.copied'
  // Search extras 2
  | 'search.gamesFound' | 'search.difficulty' | 'search.noGamesFor'
  | 'search.tryDifferent' | 'search.searchButton'
  // TopRated extras 2
  | 'topRated.backToAll' | 'topRated.voteHint'
  // Game extras 2
  | 'game.autoAdvance' | 'game.upNext' | 'game.pbToast'
  // Contact extras 2
  | 'contact.messageMinLength' | 'contact.sendAnother'
  | 'contact.gameNotLoading' | 'contact.missingGame' | 'contact.affiliatedGoogle'
  // Privacy extras
  | 'privacy.legal' | 'privacy.disclaimer' | 'privacy.contents'
  // Privacy page body keys
  | 'privacy.section.overview' | 'privacy.section.dataCollected' | 'privacy.section.cookies'
  | 'privacy.section.thirdParties' | 'privacy.section.dataSecurity' | 'privacy.section.yourRights'
  | 'privacy.section.childrensPrivacy' | 'privacy.section.changes' | 'privacy.section.contact'
  | 'privacy.overview.p1' | 'privacy.overview.p2'
  | 'privacy.dataCollected.intro' | 'privacy.dataCollected.localStorageTitle' | 'privacy.dataCollected.localStorageDesc'
  | 'privacy.dataCollected.analyticsTitle' | 'privacy.dataCollected.analyticsDesc'
  | 'privacy.dataCollected.contactFormTitle' | 'privacy.dataCollected.contactFormDesc'
  | 'privacy.dataCollected.noCollect'
  | 'privacy.cookies.p1' | 'privacy.cookies.p2' | 'privacy.cookies.p3' | 'privacy.cookies.p4'
  | 'privacy.thirdParties.intro' | 'privacy.thirdParties.service' | 'privacy.thirdParties.purpose'
  | 'privacy.thirdParties.privacyPolicy' | 'privacy.thirdParties.googlePurpose'
  | 'privacy.thirdParties.glovPurpose' | 'privacy.thirdParties.fontsPurpose'
  | 'privacy.thirdParties.seeTheirSite' | 'privacy.thirdParties.noSell'
  | 'privacy.dataSecurity.p1' | 'privacy.dataSecurity.p2'
  | 'privacy.yourRights.intro' | 'privacy.yourRights.access' | 'privacy.yourRights.accessDesc'
  | 'privacy.yourRights.erasure' | 'privacy.yourRights.erasureDesc'
  | 'privacy.yourRights.rectification' | 'privacy.yourRights.rectificationDesc'
  | 'privacy.yourRights.object' | 'privacy.yourRights.objectDesc'
  | 'privacy.yourRights.portability' | 'privacy.yourRights.portabilityDesc'
  | 'privacy.yourRights.exerciseRights' | 'privacy.yourRights.contactPage'
  | 'privacy.childrensPrivacy.p1' | 'privacy.childrensPrivacy.p2'
  | 'privacy.changes.p1'
  | 'privacy.contact.p1' | 'privacy.contact.p2'
  | 'privacy.disclaimerText' | 'privacy.disclaimerContact' | 'privacy.disclaimerEnd'
  // About extras 2
  | 'about.browseGames' | 'about.todayChallenge' | 'about.gamesLabel'
  | 'about.curationTitle' | 'about.curationP1' | 'about.curationP2' | 'about.curationP3'
  | 'about.faqTitle'
  // Category & Tag keys
  | 'category.all' | 'category.classic'
  | 'tag_music' | 'tag_multiplayer' | 'tag_kids' | 'tag_oneButton'
  | 'tag_keyboard' | 'tag_touch' | 'tag_relaxing' | 'tag_fastPaced'
  | 'tag_creative' | 'tag_educational' | 'tag_story' | 'tag_endless'
  | 'tag_sports' | 'tag_halloween' | 'tag_christmas' | 'tag_seasonal'
  | 'tag_ai' | 'tag_rhythm' | 'tag_trivia' | 'tag_cultural'
  | 'tag_coding' | 'tag_drawing' | 'tag_olympics'
  | 'tag_3d' | 'tag_action' | 'tag_adventure' | 'tag_aiming'
  | 'tag_arcade' | 'tag_brain' | 'tag_brainTeaser' | 'tag_cards'
  | 'tag_catching' | 'tag_classic' | 'tag_clicking' | 'tag_cute'
  | 'tag_daily' | 'tag_fighting' | 'tag_food' | 'tag_french'
  | 'tag_funny' | 'tag_geography' | 'tag_history' | 'tag_launching'
  | 'tag_logic' | 'tag_maze' | 'tag_miniGames' | 'tag_mouse'
  | 'tag_nature' | 'tag_platformer' | 'tag_pointAndClick' | 'tag_precision'
  | 'tag_puzzle' | 'tag_rpg' | 'tag_runner' | 'tag_sciFi'
  | 'tag_shooter' | 'tag_social' | 'tag_strategy' | 'tag_summer'
  | 'tag_timing' | 'tag_typing' | 'tag_vsAi' | 'tag_weapons' | 'tag_words'
  // Home extras 3
  | 'home.removeFromFavourites' | 'home.addToFavourites'
  | 'home.heroAriaLabel' | 'home.gamesCount'
  // Navbar extras 3
  | 'nav.langTooltip' | 'nav.streakTooltip'
  | 'nav.lightModeTooltip' | 'nav.darkModeTooltip'
  | 'nav.kidsModeTooltipOn' | 'nav.kidsModeTooltipOff'
  | 'nav.randomTooltip' | 'nav.openMenu'
  | 'milestone.3.title' | 'milestone.3.body'
  | 'milestone.7.title' | 'milestone.7.body'
  | 'milestone.30.title' | 'milestone.30.body'
  // Game extras 3
  | 'game.suggestNext' | 'game.shareGame' | 'game.suggestAnother'
  // Daily extras 2
  | 'daily.challengeLabel' | 'daily.shareText' | 'daily.shareDesc' | 'daily.shareTitle'
  // TopRated extras 3
  | 'topRated.all'
  // About extras 3 — stats, features, FAQ, disclaimer
  | 'about.stats.playableGames' | 'about.stats.freeToPlay' | 'about.stats.downloads'
  | 'about.features.search' | 'about.features.searchDesc'
  | 'about.features.daily' | 'about.features.dailyDesc'
  | 'about.features.leaderboard' | 'about.features.leaderboardDesc'
  | 'about.features.surprise' | 'about.features.surpriseDesc'
  | 'about.features.kidsMode' | 'about.features.kidsModeDesc'
  | 'about.features.favourites' | 'about.features.favouritesDesc'
  | 'about.faq.q1' | 'about.faq.a1' | 'about.faq.q2' | 'about.faq.a2'
  | 'about.faq.q3' | 'about.faq.a3' | 'about.faq.q4' | 'about.faq.a4'
  | 'about.faq.q5' | 'about.faq.a5' | 'about.faq.q6' | 'about.faq.a6'
  | 'about.disclaimer.p1' | 'about.disclaimer.p2' | 'about.disclaimer.p3' | 'about.disclaimer.p4'
  // Contact extras 3 — subject options, quick answer responses
  | 'contact.subject.broken' | 'contact.subject.suggestion'
  | 'contact.subject.general' | 'contact.subject.other'
  | 'contact.gameNotLoadingAnswer' | 'contact.missingGameAnswer' | 'contact.affiliatedGoogleAnswer'
  // SEO meta — localised page titles & descriptions
  | 'seo.siteName'
  | 'seo.defaultTitle' | 'seo.defaultDescription'
  | 'seo.home.title' | 'seo.home.description'
  | 'seo.play.title' | 'seo.play.description'
  | 'seo.allGames.title' | 'seo.allGames.description'
  | 'seo.search.title' | 'seo.search.titleWithQuery'
  | 'seo.daily.title' | 'seo.daily.description'
  | 'seo.topRated.title' | 'seo.topRated.description'
  | 'seo.about.title' | 'seo.contact.title' | 'seo.privacy.title' | 'seo.notFound.title';

export type TranslationMap = Record<TranslationKey, string>;

// ---------------------------------------------------------------------------
// English strings (default / fallback)
// ---------------------------------------------------------------------------

const EN: TranslationMap = {
  'nav.allGames': 'All Games',
  'nav.aToZ': 'A–Z',
  'nav.daily': 'Daily',
  'nav.leaderboard': 'Leaderboard',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.privacy': 'Privacy Policy',
  'nav.kidsMode': 'Kids Mode',
  'nav.darkMode': 'Dark Mode',
  'nav.search': 'Search',
  'nav.searchPlaceholder': 'Search games…',
  'nav.surpriseMe': 'Surprise Me!',
  'nav.menu': 'Menu',
  'nav.closeMenu': 'Close menu',
  'nav.language': 'Language',
  'nav.streak': 'day streak',
  'home.heroTitle': 'Google Doodle Games',
  'home.heroSubtitle': 'Every legendary Google Doodle game, collected in one place. Play for free, no sign-up needed.',
  'home.heroBadge': 'Updated Daily',
  'home.heroStats.games': 'Games',
  'home.heroStats.categories': 'Categories',
  'home.heroStats.free': 'Always',
  'home.cta.todayChallenge': "Today's Challenge",
  'home.cta.surpriseMe': 'Surprise Me',
  'home.cta.viewAll': 'View All Games',
  'home.featured': 'Featured Games',
  'home.newGames': 'New Arrivals',
  'home.topRated': 'Top Rated',
  'home.categories': 'Browse by Category',
  'home.allCategories': 'All Categories',
  'home.playNow': 'Play Now',
  'home.new': 'NEW',
  'home.noGames': 'No games found',
  'game.play': 'Play',
  'game.favourite': 'Add to Favourites',
  'game.unfavourite': 'Remove from Favourites',
  'game.share': 'Share',
  'game.difficulty': 'Difficulty',
  'game.category': 'Category',
  'game.players': 'Players',
  'game.year': 'Year',
  'game.howToPlay': 'How to Play',
  'game.funFact': 'Fun Fact',
  'game.trivia': 'Trivia',
  'game.relatedGames': 'Related Games',
  'game.notFound': 'Game Not Found',
  'game.notFoundDesc': "We couldn't find that game. It may have been removed or the URL is incorrect.",
  'game.backToGames': 'Back to All Games',
  'game.vote.helpful': 'Helpful',
  'game.vote.notHelpful': 'Not Helpful',
  'game.fullscreen': 'Fullscreen',
  'game.exitFullscreen': 'Exit Fullscreen',
  'game.loading': 'Loading Game',
  'game.loadingDesc': 'Getting everything ready for you…',
  'game.loadError': 'Game failed to load',
  'game.loadErrorDesc': 'This game might be temporarily unavailable. Try refreshing, or play another game.',
  'game.tryAgain': 'Try Again',
  'daily.title': 'Daily Challenge',
  'daily.subtitle': 'A new game every day. Come back tomorrow for the next one!',
  'daily.countdown.hours': 'hrs',
  'daily.countdown.minutes': 'min',
  'daily.countdown.seconds': 'sec',
  'daily.nextIn': 'Next challenge in',
  'daily.playToday': "Play Today's Game",
  'daily.streak': 'Day Streak',
  'daily.streakDesc': 'Play the daily challenge to keep your streak alive!',
  'daily.history': 'Previous Challenges',
  'daily.completed': 'Completed',
  'daily.notCompleted': 'Not played',
  'topRated.title': 'Top Rated Games',
  'topRated.subtitle': 'The most-loved Google Doodle games, ranked by the community.',
  'topRated.rank': 'Rank',
  'topRated.game': 'Game',
  'topRated.category': 'Category',
  'topRated.difficulty': 'Difficulty',
  'topRated.rating': 'Rating',
  'topRated.play': 'Play',
  'topRated.filterAll': 'All',
  'allGames.title': 'All Games A–Z',
  'allGames.subtitle': 'Every Google Doodle game in one place, sorted alphabetically.',
  'allGames.searchPlaceholder': 'Filter games…',
  'allGames.noResults': 'No games match your search.',
  'allGames.clearSearch': 'Clear search',
  'allGames.total': 'games total',
  'search.title': 'Search Results',
  'search.resultsFor': 'Results for',
  'search.noResults': 'No results found',
  'search.noResultsDesc': 'Try a different search term or browse all games.',
  'search.filterByCategory': 'Filter by Category',
  'search.filterByDifficulty': 'Filter by Difficulty',
  'search.allCategories': 'All Categories',
  'search.allDifficulties': 'All Difficulties',
  'search.results': 'results',
  'about.title': 'About Doodle Games Hub',
  'about.subtitle': 'Your home for every Google Doodle game ever made.',
  'about.stats.games': 'Games',
  'about.stats.categories': 'Categories',
  'about.stats.free': 'Free to Play',
  'about.stats.updated': 'Updated Regularly',
  'about.mission': 'Our Mission',
  'about.missionText': 'We preserve and celebrate every interactive Google Doodle game in one easy-to-browse hub.',
  'about.features': 'Features',
  'about.curation': 'How Games Are Curated',
  'about.curationText': 'Every game is manually verified to ensure it loads and plays correctly.',
  'about.faq': 'Frequently Asked Questions',
  'about.disclaimer': 'Legal Disclaimer',
  'about.startPlaying': 'Start Playing',
  'about.madeWithDesc': 'for Google Doodle fans everywhere',
  'contact.title': 'Contact Us',
  'contact.subtitle': "Have a question, suggestion, or found a broken game? We'd love to hear from you.",
  'contact.name': 'Your Name',
  'contact.email': 'Email Address',
  'contact.subject': 'Subject',
  'contact.message': 'Message',
  'contact.send': 'Send Message',
  'contact.success': 'Message sent!',
  'contact.successDesc': "Thanks for reaching out. We'll get back to you as soon as possible.",
  'contact.namePlaceholder': 'Jane Smith',
  'contact.emailPlaceholder': 'jane@example.com',
  'contact.subjectPlaceholder': 'e.g. Broken game link, suggestion…',
  'contact.messagePlaceholder': "Tell us what's on your mind…",
  'contact.required': 'This field is required',
  'contact.invalidEmail': 'Please enter a valid email address',
  'privacy.title': 'Privacy Policy',
  'privacy.subtitle': 'How we handle your data and protect your privacy.',
  'privacy.lastUpdated': 'Last updated',
  'footer.tagline': 'Every Google Doodle game, one place.',
  'footer.taglineDesc': 'A curated archive of every interactive Google Doodle — from Pac-Man\'s 30th anniversary to Bach\'s AI music toy. Discover, play, and revisit the moments that made Google\'s homepage unforgettable.',
  'footer.madeWith': 'Made with',
  'footer.forGameLovers': 'for game lovers',
  'footer.quickLinks': 'Quick Links',
  'footer.popularGames': 'Popular Games',
  'footer.categories': 'Categories',
  'footer.legal': 'Legal',
  'footer.disclaimer': 'Disclaimer',
  'footer.copyright': '© {year} Doodle Games Hub. Not affiliated with Google LLC.',
  'spin.title': 'Spin the Wheel',
  'spin.subtitle': "Can't decide? Let fate choose your next game!",
  'spin.spin': 'Spin the Wheel',
  'spin.spinning': 'Spinning…',
  'spin.youGot': 'YOU GOT',
  'spin.playNow': 'Play Now',
  'spin.spinAgain': 'Spin Again',
  'spin.close': 'Close',
  'difficulty.easy': 'Easy',
  'difficulty.medium': 'Medium',
  'difficulty.hard': 'Hard',
  'category.arcade': 'Arcade',
  'category.puzzle': 'Puzzle',
  'category.sports': 'Sports',
  'category.music': 'Music',
  'category.educational': 'Educational',
  'category.seasonal': 'Seasonal',
  'category.creative': 'Creative',
  'category.adventure': 'Adventure',
  'common.loading': 'Loading…',
  'common.error': 'Something went wrong',
  'common.retry': 'Retry',
  'common.close': 'Close',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.prev': 'Previous',
  'common.seeAll': 'See All',
  'common.comingSoon': 'Coming soon',
  'common.new': 'New',
  'common.free': 'Free',
  'common.play': 'Play',
  'common.plays': 'plays',
  'common.copied': 'Copied!',
  // Home extras
  'home.heroTitleLine1': 'Play the Best',
  'home.kidsModeBanner': 'is ON \u2014 showing only Easy games',
  'home.turnOff': 'Turn Off',
  'home.recentlyPlayed': 'Recently Played',
  'home.recentlyPlayedHint': 'pick up where you left off',
  'home.recent': 'Recent',
  'home.favourites': 'Favourites',
  'home.tags': 'Tags',
  'home.filterByTags': 'Filter by Tags',
  'home.tagHint': 'select multiple to narrow results',
  'home.clearAll': 'Clear all',
  'home.searchPlaceholder': 'Search games\u2026',
  'home.sortBy': 'Sort by',
  'home.sortDefault': 'Default',
  'home.sortMostPlayed': 'Most Played',
  'home.sortHighestRated': 'Highest Rated',
  'home.sortAZ': 'A\u2013Z',
  'home.sortNewest': 'Newest First',
  'home.favourited': 'favourited',
  'home.sortedByLikes': 'sorted by community likes',
  'home.available': 'available',
  'home.kidsModeEasy': 'Kids Mode (Easy only)',
  'home.tagFiltersActive': 'tag filter(s) active',
  'home.localLikes': 'Based on your local likes',
  'home.viewLeaderboard': 'View Full Leaderboard',
  'home.noFavourites': 'No favourites yet',
  'home.noFavouritesDesc': 'Click the heart icon on any game card to save it here',
  'home.noLikes': 'No likes recorded yet',
  'home.noLikesDesc': 'Play some games and hit the thumbs up \u2014 they will appear here ranked by community votes',
  'home.noTagMatch': 'No games match these tags',
  'home.noTagMatchDesc': 'Try removing some tag filters to see more results',
  'home.clearTagFilters': 'Clear Tag Filters',
  'home.noGamesDesc': 'Try a different search term or category',
  'home.activeTags': 'Active tags:',
  'home.kidsModeOn': 'Kids Mode: ON',
  // Navbar extras
  'nav.navigate': 'Navigate',
  'nav.settings': 'Settings',
  'nav.lightMode': 'Light Mode',
  'nav.chooseLang': 'Choose Language',
  'nav.kidsModeOn': 'Kids Mode: ON',
  'nav.kidsModeOff': 'Kids Mode: OFF',
  'nav.kidsOn': 'Kids: ON',
  'nav.streakAchieved': 'day streak achieved',
  'nav.keepPlaying': 'Keep Playing!',
  // Daily extras
  'daily.todaysPick': "Today's Pick",
  'daily.playedToday': 'Played Today',
  'daily.controls': 'Controls',
  'daily.copied': 'Copied!',
  'daily.shareChallenge': 'Share Challenge',
  'daily.save': 'Save',
  'daily.saved': 'Saved',
  // TopRated extras
  'topRated.hallOfFame': 'Hall of Fame',
  'topRated.totalLikes': 'Total Likes',
  'topRated.gamesRated': 'Games Rated',
  'topRated.approval': 'Approval',
  'topRated.podium': 'Podium',
  'topRated.fullRankings': 'Full Rankings',
  'topRated.likes': 'Likes',
  'topRated.dislikes': 'Dislikes',
  'topRated.noVotes': 'No votes recorded yet',
  'topRated.noVotesDesc': 'Play some games and leave a vote',
  'topRated.browseGames': 'Browse Games',
  // AllGames extras
  'allGames.sortAZ': 'A\u2013Z',
  'allGames.sortMostPlayed': 'Most Played',
  'allGames.sortHighestRated': 'Highest Rated',
  'allGames.sortNewest': 'Newest First',
  'allGames.gamesCount': 'games',
  'allGames.gameCount': 'game',
  // Search extras
  'search.sort': 'Sort',
  'search.sortRelevance': 'Relevance',
  'search.sortMostPlayed': 'Most Played',
  'search.sortHighestRated': 'Highest Rated',
  'search.sortAZ': 'A\u2013Z',
  'search.sortNewest': 'Newest',
  'search.clear': 'Clear',
  'search.whatLookingFor': 'What are you looking for?',
  'search.typeHint': 'Type a game name, category, or keyword\u2026',
  'search.browseAll': 'Browse All Games',
  'search.searchPlaceholder': 'Search games\u2026',
  // About extras
  'about.heroTitle': 'Every Google Doodle Game, in One Place',
  'about.heroDesc': 'A curated archive of every playable Google Doodle \u2014 from Pac-Man to Cricket. Discover, play, and revisit the mini-games that made Google\u2019s homepage unforgettable.',
  'about.aboutBadge': 'About Us',
  'about.whatIs': 'What is Doodle Games Hub?',
  'about.whatIsP1': 'Doodle Games Hub is a free, community-driven archive of every interactive Google Doodle game ever released.',
  'about.whatIsP2': 'Our mission is to preserve these delightful mini-games and make them easy to discover, play, and share.',
  'about.whatIsP3': 'Every game is manually tested and organized by category, difficulty, and tags so you can find exactly what you are looking for.',
  'about.whatsBuiltIn': "What's Built In",
  'about.featuresSubtitle': 'Features designed to make rediscovering Google Doodle games a joy.',
  'about.disclaimerText': 'Doodle Games Hub is a fan-made project and is not affiliated with, endorsed by, or connected to Google LLC. All Google Doodle games remain the property of Google. We simply provide links to these publicly available games for preservation and easy access.',
  // Contact extras
  'contact.getInTouch': 'Get in Touch',
  'contact.whatHelp': 'What can we help with?',
  'contact.quickAnswers': 'Quick answers',
  'contact.sendMessage': 'Send a Message',
  'contact.sending': 'Sending\u2026',
  'contact.responseTime': 'We typically respond within 1\u20132 business days.',
  'contact.backToGames': 'Back to Games',
  // Game/Play extras
  'game.playTime': 'You played for',
  'game.longestSession': 'your longest session yet!',
  'game.challenged': "You've been challenged!",
  'game.challengeDesc': 'A friend challenged you to beat their score. Good luck!',
  'game.challengeFriend': 'Challenge a friend',
  'game.details': 'Details',
  'game.moreGames': 'More Games',
  'game.youMightLike': 'You Might Also Like',
  'game.keepPlaying': 'Keep Playing',
  'game.startPlaying': 'Start Playing',
  'game.exitPrompt': 'Leaving already?',
  'game.ratePrompt': 'Leave a quick rating before you go',
  'game.lovedIt': 'Loved it!',
  'game.notForMe': 'Not for me',
  // NotFound
  'notFound.code': '404',
  'notFound.title': 'Page Not Found',
  'notFound.desc': "Sorry, the page you are looking for doesn't exist. It may have been moved or deleted.",
  'notFound.backHome': 'Back to Home',
  // Session
  'session.title': 'Your Best Sessions',
  'session.today': 'Today',
  'session.yesterday': 'Yesterday',
  'session.daysAgo': 'days ago',
  'session.personalBest': 'PB!',
  'session.noSessions': 'No sessions yet \u2014 start playing to record your time!',
  'session.inProgress': 'Session in progress',
  'session.best': 'Best',
  'session.cleared': 'Session history cleared.',
  'session.timerHint': 'Timer pauses when you switch tabs. Top 10 sessions saved locally.',
  'session.clearTitle': 'Clear session history for this game',
  'session.sessions': 'sessions',
  // Trivia
  'trivia.didYouKnow': 'Did you know?',
  'trivia.shareFact': 'Share fact',
  'trivia.copied': 'Copied!',
  // Search extras 2
  'search.gamesFound': 'games found',
  'search.difficulty': 'Difficulty:',
  'search.noGamesFor': 'No games found for',
  'search.tryDifferent': 'Try a different keyword, or browse all games below.',
  'search.searchButton': 'Search',
  // TopRated extras 2
  'topRated.backToAll': 'Back to All Games',
  'topRated.voteHint': 'Play any game and use the thumbs up / thumbs down buttons to cast your vote and build the leaderboard.',
  // Game extras 2
  'game.autoAdvance': 'Auto-advancing in',
  'game.upNext': 'Up next from',
  'game.pbToast': 'New personal best on',
  // Contact extras 2
  'contact.messageMinLength': 'Message must be at least 10 characters',
  'contact.sendAnother': 'Send another message',
  'contact.gameNotLoading': 'Game not loading?',
  'contact.missingGame': 'Missing a game?',
  'contact.affiliatedGoogle': 'Affiliated with Google?',
  // Privacy extras
  'privacy.legal': 'Legal',
  'privacy.disclaimer': 'Disclaimer',
  'privacy.contents': 'Contents',
  // Privacy page body
  'privacy.section.overview': 'Overview',
  'privacy.section.dataCollected': 'Information We Collect',
  'privacy.section.cookies': 'Cookies',
  'privacy.section.thirdParties': 'Third-Party Services',
  'privacy.section.dataSecurity': 'Data Security',
  'privacy.section.yourRights': 'Your Rights',
  'privacy.section.childrensPrivacy': 'Children\'s Privacy',
  'privacy.section.changes': 'Changes to This Policy',
  'privacy.section.contact': 'Contact',
  'privacy.overview.p1': 'Doodle Games Hub ("we", "us", or "our") is an independent fan site that aggregates and presents interactive Google Doodle games. We are not affiliated with, endorsed by, or connected to Google LLC in any way.',
  'privacy.overview.p2': 'This Privacy Policy explains what information we collect (very little), how we use it, and your rights regarding that information. By using this site, you agree to the practices described here.',
  'privacy.dataCollected.intro': 'We collect minimal information to operate the site:',
  'privacy.dataCollected.localStorageTitle': 'Local Storage Data',
  'privacy.dataCollected.localStorageDesc': 'We store your preferences (dark/light mode, Kids Mode, language choice, favourite games, and daily streak) in your browser\'s localStorage. This data never leaves your device and is not transmitted to any server.',
  'privacy.dataCollected.analyticsTitle': 'Analytics (Anonymous)',
  'privacy.dataCollected.analyticsDesc': 'We use privacy-respecting analytics to understand aggregate site traffic (page views, popular games). No personally identifiable information is collected. IP addresses are anonymised before processing.',
  'privacy.dataCollected.contactFormTitle': 'Contact Form',
  'privacy.dataCollected.contactFormDesc': 'If you submit the contact form, we collect your name, email address, and message content solely to respond to your enquiry. This information is not shared with third parties.',
  'privacy.dataCollected.noCollect': 'We do not collect: passwords, payment information, location data, device identifiers, or any sensitive personal data.',
  'privacy.cookies.p1': 'This site uses only functional cookies — small files stored in your browser that are strictly necessary for the site to work (e.g. remembering your theme preference).',
  'privacy.cookies.p2': 'We do not use advertising cookies, tracking pixels, or third-party marketing cookies.',
  'privacy.cookies.p3': 'The embedded games are hosted on www.google.com and glov3.me. These third-party services may set their own cookies when you interact with the game iframe. Please review their respective privacy policies for details.',
  'privacy.cookies.p4': 'You can disable cookies in your browser settings at any time. Note that disabling cookies may affect site functionality (e.g. your preferences will not be saved between visits).',
  'privacy.thirdParties.intro': 'The site embeds content from the following third-party services:',
  'privacy.thirdParties.service': 'Service',
  'privacy.thirdParties.purpose': 'Purpose',
  'privacy.thirdParties.privacyPolicy': 'Privacy Policy',
  'privacy.thirdParties.googlePurpose': 'Hosts original Doodle game files',
  'privacy.thirdParties.glovPurpose': 'Mirror host for some Doodle games',
  'privacy.thirdParties.fontsPurpose': 'Typography (loaded via CDN)',
  'privacy.thirdParties.seeTheirSite': 'See their site',
  'privacy.thirdParties.noSell': 'We do not sell, rent, or share your personal information with any third party for marketing purposes.',
  'privacy.dataSecurity.p1': 'Because this is a static website with no user accounts or server-side database, the risk surface is minimal. Your preference data lives entirely in your own browser.',
  'privacy.dataSecurity.p2': 'The site is served over HTTPS to protect data in transit. We do not store any personal data on our servers beyond what is described in the Contact Form section above.',
  'privacy.yourRights.intro': 'Depending on your location, you may have the following rights:',
  'privacy.yourRights.access': 'Right to access',
  'privacy.yourRights.accessDesc': 'Request a copy of any personal data we hold about you.',
  'privacy.yourRights.erasure': 'Right to erasure',
  'privacy.yourRights.erasureDesc': 'Request deletion of your personal data.',
  'privacy.yourRights.rectification': 'Right to rectification',
  'privacy.yourRights.rectificationDesc': 'Request correction of inaccurate personal data.',
  'privacy.yourRights.object': 'Right to object',
  'privacy.yourRights.objectDesc': 'Object to certain types of processing.',
  'privacy.yourRights.portability': 'Right to portability',
  'privacy.yourRights.portabilityDesc': 'Receive your data in a portable format.',
  'privacy.yourRights.exerciseRights': 'To exercise any of these rights, contact us via the',
  'privacy.yourRights.contactPage': 'Contact page',
  'privacy.childrensPrivacy.p1': 'This site is intended for general audiences. We do not knowingly collect personal information from children under the age of 13. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.',
  'privacy.childrensPrivacy.p2': 'The Kids Mode feature filters games by difficulty level (Easy only) and is a display preference stored locally in the browser — it does not involve any data collection.',
  'privacy.changes.p1': 'We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of the site after changes constitutes acceptance of the updated policy.',
  'privacy.contact.p1': 'If you have any questions about this Privacy Policy or how we handle your data, please use our',
  'privacy.contact.p2': 'For formal data protection enquiries (GDPR, CCPA, etc.), please include "Data Protection" in your message subject.',
  'privacy.disclaimerText': 'All Google Doodle games featured on this site are the intellectual property of Google LLC. Doodle Games Hub is an independent fan site created for educational and entertainment purposes. We do not claim ownership of any game content. If you are a rights holder and have concerns about content on this site, please',
  'privacy.disclaimerContact': 'contact us',
  'privacy.disclaimerEnd': 'and we will respond promptly.',
  // About extras 2
  'about.browseGames': 'Browse All Games',
  'about.todayChallenge': "Today's Challenge",
  'about.gamesLabel': 'games',
  'about.curationTitle': 'How Games Are Curated',
  'about.curationP1': 'Not every Google Doodle is interactive — most are static illustrations or animated GIFs that mark a date but don\u2019t respond to user input. We include only Doodles that have a genuine playable component: games, instruments, puzzles, or interactive experiences where the user can take meaningful actions.',
  'about.curationP2': 'Each game is manually reviewed to confirm it still loads from Google\u2019s servers, that the iframe embed works without requiring a Google account, and that the experience is substantially complete (not just a splash screen). Games that fail these checks are excluded until they can be verified.',
  'about.curationP3': 'Difficulty ratings (Easy / Medium / Hard) are assigned based on the complexity of controls, the depth of strategy required, and the learning curve for a first-time player. They are subjective estimates, not official Google ratings.',
  'about.faqTitle': 'Frequently Asked Questions',
  // Category & Tag
  'category.all': 'All Games',
  'category.classic': 'Classic',
  'tag_music': 'Music',
  'tag_multiplayer': 'Multiplayer',
  'tag_kids': 'Kids',
  'tag_oneButton': 'One Button',
  'tag_keyboard': 'Keyboard',
  'tag_touch': 'Touch',
  'tag_relaxing': 'Relaxing',
  'tag_fastPaced': 'Fast-Paced',
  'tag_creative': 'Creative',
  'tag_educational': 'Educational',
  'tag_story': 'Story',
  'tag_endless': 'Endless',
  'tag_sports': 'Sports',
  'tag_halloween': 'Halloween',
  'tag_christmas': 'Christmas',
  'tag_seasonal': 'Seasonal',
  'tag_ai': 'AI-Powered',
  'tag_rhythm': 'Rhythm',
  'tag_trivia': 'Trivia',
  'tag_cultural': 'Cultural',
  'tag_coding': 'Coding',
  'tag_drawing': 'Drawing',
  'tag_olympics': 'Olympics',
  'tag_3d': '3D',
  'tag_action': 'Action',
  'tag_adventure': 'Adventure',
  'tag_aiming': 'Aiming',
  'tag_arcade': 'Arcade',
  'tag_brain': 'Brain',
  'tag_brainTeaser': 'Brain Teaser',
  'tag_cards': 'Cards',
  'tag_catching': 'Catching',
  'tag_classic': 'Classic',
  'tag_clicking': 'Clicking',
  'tag_cute': 'Cute',
  'tag_daily': 'Daily',
  'tag_fighting': 'Fighting',
  'tag_food': 'Food',
  'tag_french': 'French',
  'tag_funny': 'Funny',
  'tag_geography': 'Geography',
  'tag_history': 'History',
  'tag_launching': 'Launching',
  'tag_logic': 'Logic',
  'tag_maze': 'Maze',
  'tag_miniGames': 'Mini Games',
  'tag_mouse': 'Mouse',
  'tag_nature': 'Nature',
  'tag_platformer': 'Platformer',
  'tag_pointAndClick': 'Point & Click',
  'tag_precision': 'Precision',
  'tag_puzzle': 'Puzzle',
  'tag_rpg': 'RPG',
  'tag_runner': 'Runner',
  'tag_sciFi': 'Sci-Fi',
  'tag_shooter': 'Shooter',
  'tag_social': 'Social',
  'tag_strategy': 'Strategy',
  'tag_summer': 'Summer',
  'tag_timing': 'Timing',
  'tag_typing': 'Typing',
  'tag_vsAi': 'Vs AI',
  'tag_weapons': 'Weapons',
  'tag_words': 'Words',
  // Home extras 3
  'home.removeFromFavourites': 'Remove from favourites',
  'home.addToFavourites': 'Add to favourites',
  'home.heroAriaLabel': 'Doodle Games Hub hero section',
  'home.gamesCount': 'games',
  // Navbar extras 3
  'nav.langTooltip': 'Language',
  'nav.streakTooltip': 'day play streak! Keep it going.',
  'nav.lightModeTooltip': 'Switch to light mode',
  'nav.darkModeTooltip': 'Switch to dark mode',
  'nav.kidsModeTooltipOn': 'Kids Mode is ON — click to turn off',
  'nav.kidsModeTooltipOff': 'Turn on Kids Mode (Easy games only)',
  'nav.randomTooltip': 'Play a random game',
  'nav.openMenu': 'Open navigation menu',
  'milestone.3.title': '3-Day Streak!',
  'milestone.3.body': "You're on fire! Three days in a row. Keep it up!",
  'milestone.7.title': 'One Week Streak!',
  'milestone.7.body': "Seven days straight — you're a true Doodle champion!",
  'milestone.30.title': '30-Day Legend!',
  'milestone.30.body': "A whole month! You've earned legendary status. Incredible!",
  // Game extras 3
  'game.suggestNext': 'Suggest next game',
  'game.shareGame': 'Share this game',
  'game.suggestAnother': 'Suggest another game',
  // Daily extras 2
  'daily.challengeLabel': 'Daily Challenge',
  'daily.shareText': "Today's Daily Doodle Challenge",
  'daily.shareDesc': 'Can you beat it? Play free at Doodle Games Hub!',
  'daily.shareTitle': 'Daily Doodle Challenge',
  // TopRated extras 3
  'topRated.all': 'All',
  // About extras 3
  'about.stats.playableGames': 'Playable Games',
  'about.stats.freeToPlay': 'Free to Play',
  'about.stats.downloads': 'Downloads Needed',
  'about.features.search': 'Smart Search',
  'about.features.searchDesc': 'Find any game by name, category, or description with instant text highlighting.',
  'about.features.daily': 'Daily Challenge',
  'about.features.dailyDesc': 'A fresh game is selected every day. Come back daily to keep your streak alive.',
  'about.features.leaderboard': 'Community Leaderboard',
  'about.features.leaderboardDesc': 'Vote for your favourites and see how the community ranks all the games.',
  'about.features.surprise': 'Surprise Me',
  'about.features.surpriseDesc': "Spin the wheel for a random game pick — great when you can't decide.",
  'about.features.kidsMode': 'Kids Mode',
  'about.features.kidsModeDesc': 'Filter to Easy-rated games only, making the collection safe for younger players.',
  'about.features.favourites': 'Favourites & History',
  'about.features.favouritesDesc': 'Save your favourite games and pick up right where you left off with play history.',
  'about.faq.q1': 'Are these games really free?',
  'about.faq.a1': 'Yes — every game on this site is hosted by Google and playable for free directly in your browser. We simply link to the official Google Doodle interactive pages.',
  'about.faq.q2': 'Do I need to create an account?',
  'about.faq.a2': 'No account is required. Your favourites, play history, votes, and preferences are stored locally in your browser using localStorage.',
  'about.faq.q3': "Why can't I find a specific Google Doodle game?",
  'about.faq.a3': 'We curate only the interactive, playable Doodles — not every commemorative illustration Google has published. If a game is missing, it may not have an embeddable play URL. We add new games as they become available.',
  'about.faq.q4': 'Is this site affiliated with Google?',
  'about.faq.a4': 'No. Doodle Games Hub is an independent fan-made directory. All Google Doodle games are the intellectual property of Google LLC. We are not affiliated with, endorsed by, or sponsored by Google.',
  'about.faq.q5': 'How does Kids Mode work?',
  'about.faq.a5': "Toggling Kids Mode on filters the game grid to show only games rated 'Easy'. This is a convenience filter — it does not block content at the network level.",
  'about.faq.q6': 'Can I suggest a game to add?',
  'about.faq.a6': "We're always looking to expand the collection. If you know of a playable Google Doodle that isn't listed, the best way to let us know is via the share/feedback options in the site.",
  'about.disclaimer.p1': 'Doodle Games Hub is an independent, fan-made website. It is not affiliated with, endorsed by, sponsored by, or in any way officially connected to Google LLC or any of its subsidiaries.',
  'about.disclaimer.p2': "All Google Doodle games, artwork, and associated intellectual property are the exclusive property of Google LLC. The games are embedded here via iframes pointing directly to Google's own servers at google.com/doodles. We do not host, store, or redistribute any game assets.",
  'about.disclaimer.p3': '"Google", "Google Doodle", and related marks are trademarks of Google LLC. Use of these names on this site is purely descriptive and does not imply any official relationship or endorsement.',
  'about.disclaimer.p4': 'If you are a rights holder and have concerns about any content on this site, please contact us and we will respond promptly.',
  // Contact extras 3
  'contact.subject.broken': '🐛 Broken game link',
  'contact.subject.suggestion': '💡 Game suggestion',
  'contact.subject.general': '💬 General question',
  'contact.subject.other': '📧 Other',
  'contact.gameNotLoadingAnswer': 'Try a different browser or disable ad-blockers.',
  'contact.missingGameAnswer': 'We cover all embeddable Google Doodles — some are blocked by Google.',
  'contact.affiliatedGoogleAnswer': 'No. This is an independent fan site.',
  // SEO meta
  'seo.siteName': 'Doodle Games Hub',
  'seo.defaultTitle': 'Doodle Games Hub — Play Free Google Doodle Games',
  'seo.defaultDescription': 'Play the best Google Doodle games free online — arcade, puzzle, sports, and seasonal games all in one place.',
  'seo.home.title': 'Play the Best Google Doodle Games Free | Doodle Games Hub',
  'seo.home.description': 'Discover and play every legendary Google Doodle game for free. Arcade, puzzle, sports, adventure, and seasonal games — no sign-up needed.',
  'seo.play.title': 'Play {title} — Doodle Games Hub',
  'seo.play.description': 'Play {title} free online — {description}',
  'seo.allGames.title': 'All Google Doodle Games A–Z — Doodle Games Hub',
  'seo.allGames.description': 'Browse all Google Doodle games sorted alphabetically. Play free online — arcade, puzzle, sports, and more.',
  'seo.search.title': 'Search Games — Doodle Games Hub',
  'seo.search.titleWithQuery': 'Search: "{query}" — Doodle Games Hub',
  'seo.daily.title': 'Daily Challenge — {title} | Doodle Games Hub',
  'seo.daily.description': "Play today's daily Google Doodle challenge: {title}. A new game every day!",
  'seo.topRated.title': 'Top Rated Games — Doodle Games Hub',
  'seo.topRated.description': 'The most-loved Google Doodle games, ranked by the community. Play free online.',
  'seo.about.title': 'About — Doodle Games Hub',
  'seo.contact.title': 'Contact Us — Doodle Games Hub',
  'seo.privacy.title': 'Privacy Policy — Doodle Games Hub',
  'seo.notFound.title': 'Page Not Found — Doodle Games Hub',
};

// ---------------------------------------------------------------------------
// Lazy locale loading
// ---------------------------------------------------------------------------

/**
 * Dynamic import map — Vite will code-split each locale into its own chunk.
 * Only the locale the user actually selects will be downloaded.
 */
const LOCALE_LOADERS: Record<string, () => Promise<{ default?: Partial<TranslationMap>; [k: string]: unknown }>> = {
  es: () => import('./locales/es').then(m => ({ default: m.ES })),
  fr: () => import('./locales/fr').then(m => ({ default: m.FR })),
  de: () => import('./locales/de').then(m => ({ default: m.DE })),
  it: () => import('./locales/it').then(m => ({ default: m.IT })),
  pt: () => import('./locales/pt').then(m => ({ default: m.PT })),
  ru: () => import('./locales/ru').then(m => ({ default: m.RU })),
  ar: () => import('./locales/ar').then(m => ({ default: m.AR })),
  hi: () => import('./locales/hi').then(m => ({ default: m.HI })),
  tr: () => import('./locales/tr').then(m => ({ default: m.TR })),
  nl: () => import('./locales/nl').then(m => ({ default: m.NL })),
  pl: () => import('./locales/pl').then(m => ({ default: m.PL })),
  sv: () => import('./locales/sv').then(m => ({ default: m.SV })),
  id: () => import('./locales/id').then(m => ({ default: m.ID })),
  vi: () => import('./locales/vi').then(m => ({ default: m.VI })),
  th: () => import('./locales/th').then(m => ({ default: m.TH })),
  'zh-CN': () => import('./locales/zh-CN').then(m => ({ default: m.ZH_CN })),
  'zh-TW': () => import('./locales/zh-TW').then(m => ({ default: m.ZH_TW })),
  ja: () => import('./locales/ja').then(m => ({ default: m.JA })),
  ko: () => import('./locales/ko').then(m => ({ default: m.KO })),
};

// ---------------------------------------------------------------------------
// Translations map — mutable so lazy-loaded locales can be registered
// ---------------------------------------------------------------------------

const TRANSLATIONS: Partial<Record<string, Partial<TranslationMap>>> = {
  en: EN,
};

/** Cache of in-flight / resolved locale loads */
const _loadCache: Partial<Record<string, Promise<void>>> = {};

/**
 * Lazily load a UI locale's translations. Returns immediately if already loaded.
 * Safe to call multiple times — deduplicates concurrent requests.
 */
export function loadUILocale(code: string): Promise<void> {
  if (code === 'en' || TRANSLATIONS[code]) return Promise.resolve();
  if (_loadCache[code]) return _loadCache[code]!;
  const loader = LOCALE_LOADERS[code];
  if (!loader) return Promise.resolve();
  _loadCache[code] = loader().then(mod => {
    TRANSLATIONS[code] = mod.default as Partial<TranslationMap>;
  });
  return _loadCache[code]!;
}

/**
 * Register translations eagerly (used by SSR / prerender).
 * Calling this from entry-static.tsx ensures all locales are available
 * synchronously during server-side rendering.
 */
export function registerTranslations(locale: string, map: Partial<TranslationMap>) {
  TRANSLATIONS[locale] = map;
}


// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface LanguageContextValue {
  locale: string;
  localeInfo: Locale;
  setLocale: (code: string) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  supportedLocales: Locale[];
  /** Build a localised path for internal navigation */
  lp: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'doodle-hub-locale';

export function LanguageProvider({ children, ssrLocale }: { children: React.ReactNode; ssrLocale?: string }) {
  const [locale, setLocaleState] = useState<string>(() => {
    if (ssrLocale) return ssrLocale;
    try {
      const fromUrl = getLocaleFromPath(window.location.pathname);
      return fromUrl !== 'en' ? fromUrl : 'en';
    } catch {
      return 'en';
    }
  });

  // Incremented after a lazy locale finishes loading → triggers re-render of `t`
  const [, setLoadTick] = useState(0);

  const localeInfo = SUPPORTED_LOCALES.find(l => l.code === locale) ?? SUPPORTED_LOCALES[0];

  // Lazy-load UI + game translations when locale changes
  useEffect(() => {
    if (locale === 'en') return;
    Promise.all([loadUILocale(locale), loadGameLocale(locale), loadTriviaLocale(locale)]).then(() => setLoadTick(n => n + 1));
  }, [locale]);

  // Listen for URL changes and update locale accordingly
  useEffect(() => {
    const handlePopState = () => {
      const newLocale = getLocaleFromPath(window.location.pathname);
      if (newLocale !== locale) {
        setLocaleState(newLocale);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [locale]);

  // Apply dir + lang attributes to <html>
  useEffect(() => {
    const bcp47Map: Record<string, string> = { 'zh-CN': 'zh-Hans', 'zh-TW': 'zh-Hant' };
    document.documentElement.lang = bcp47Map[locale] || locale;
    document.documentElement.dir = localeInfo.dir;
  }, [locale, localeInfo.dir]);

  const setLocale = useCallback((code: string) => {
    if (!LOCALE_CODES.has(code)) return;
    localStorage.setItem(STORAGE_KEY, code);
    // Pre-load the locale so it's ready by the time we re-render
    Promise.all([loadUILocale(code), loadGameLocale(code), loadTriviaLocale(code)]).then(() => setLoadTick(n => n + 1));
    setLocaleState(code);

    // Rewrite the URL to include/remove the locale prefix
    const currentPath = window.location.pathname;
    const strippedPath = stripLocalePrefixFromPath(currentPath);
    const newPath = localePath(code, strippedPath);
    const search = window.location.search;
    const newUrl = newPath + search;

    if (newUrl !== currentPath + search) {
      window.history.pushState({}, '', newUrl);
      // Dispatch a popstate so wouter re-evaluates the route
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, []);

  const t = useCallback((key: TranslationKey, vars?: Record<string, string | number>): string => {
    const localeMap = TRANSLATIONS[locale] ?? {};
    const enMap = TRANSLATIONS['en'] ?? EN;
    let str = (localeMap[key] ?? enMap[key] ?? key) as string;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  }, [locale]);

  /** Shorthand to build a localised internal link */
  const lp = useCallback((path: string) => localePath(locale, path), [locale]);

  return (
    <LanguageContext.Provider value={{ locale, localeInfo, setLocale, t, supportedLocales: SUPPORTED_LOCALES, lp }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

/** Shorthand hook — returns just the `t` function */
export function useT() {
  return useLanguage().t;
}

/** Shorthand hook — returns just the `lp` (localised path) function */
export function useLp() {
  return useLanguage().lp;
}

/**
 * Standalone translation lookup (no React context needed).
 * Used by the prerender script to inject localised meta tags at build time.
 */
export function getTranslation(locale: string, key: TranslationKey, vars?: Record<string, string | number>): string {
  const localeMap = TRANSLATIONS[locale] ?? {};
  const enMap = TRANSLATIONS['en'] ?? EN;
  let str = (localeMap[key] ?? enMap[key] ?? key) as string;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, String(v));
    });
  }
  return str;
}
