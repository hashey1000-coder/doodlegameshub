/**
 * Sitemap generator for Doodle Games Hub
 * Run: node scripts/generate-sitemap.mjs
 * Output: client/public/sitemap.xml
 *
 * Generates a multilingual sitemap with:
 *  - All static routes × 20 languages
 *  - All game pages (/play/:slug) × 20 languages
 *  - xhtml:link hreflang alternates for every URL
 */

import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Extract game slugs from games.ts via regex (avoids needing ts-node)
// ---------------------------------------------------------------------------
const gamesTs = readFileSync(resolve(ROOT, 'client/src/data/games.ts'), 'utf8');
const slugMatches = [...gamesTs.matchAll(/slug:\s*['"`]([^'"`]+)['"`]/g)];
const slugs = slugMatches.map((m) => m[1]);

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** Site base URL — update when deploying */
const BASE_URL = 'https://doodlegameshub.com';

/**
 * All supported locales.  Must stay in sync with SUPPORTED_LOCALES in
 * client/src/contexts/LanguageContext.tsx.
 *
 * 'en' is the default locale and uses un-prefixed paths (e.g. /play/snake).
 * Every other locale uses /:locale prefix    (e.g. /es/play/snake).
 */
const LOCALES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'ru',
  'zh-CN', 'zh-TW', 'ja', 'ko', 'ar', 'hi',
  'tr', 'nl', 'pl', 'sv', 'id', 'vi', 'th',
];

/**
 * Map locale codes to the hreflang value Google expects.
 * Most are identical; zh-CN → zh-Hans, zh-TW → zh-Hant for BCP-47 compliance.
 */
const HREFLANG_MAP = {
  'en': 'en',
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
  'it': 'it',
  'pt': 'pt',
  'ru': 'ru',
  'zh-CN': 'zh-Hans',
  'zh-TW': 'zh-Hant',
  'ja': 'ja',
  'ko': 'ko',
  'ar': 'ar',
  'hi': 'hi',
  'tr': 'tr',
  'nl': 'nl',
  'pl': 'pl',
  'sv': 'sv',
  'id': 'id',
  'vi': 'vi',
  'th': 'th',
};

const today = new Date().toISOString().split('T')[0];

// ---------------------------------------------------------------------------
// Routes — must match the <Route> definitions in App.tsx
// ---------------------------------------------------------------------------

/** Indexable static routes (no /search — it's dynamic, no /404) */
const STATIC_PATHS = [
  { path: '/',          priority: '1.0', changefreq: 'daily'   },
  { path: '/games',     priority: '0.9', changefreq: 'weekly'  },
  { path: '/top-rated', priority: '0.8', changefreq: 'daily'   },
  { path: '/daily',     priority: '0.9', changefreq: 'daily'   },
  { path: '/about',     priority: '0.5', changefreq: 'monthly' },
  { path: '/contact',   priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy',   priority: '0.4', changefreq: 'monthly' },
];

/** Per-game routes */
const GAME_PATHS = slugs.map((slug) => ({
  path: `/play/${slug}`,
  priority: '0.7',
  changefreq: 'monthly',
}));

const ALL_PATHS = [...STATIC_PATHS, ...GAME_PATHS];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build the full URL for a given locale + path */
function localeUrl(locale, path) {
  // Defensive: strip any existing locale prefix to prevent /fr/es/… doubling
  const stripped = stripLocalePrefix(path);
  // Ensure trailing slash
  const withSlash = stripped.endsWith('/') ? stripped : `${stripped}/`;
  if (locale === 'en') return `${BASE_URL}${withSlash}`;
  return `${BASE_URL}/${locale}${withSlash === '/' ? '/' : withSlash}`;
}

/** Strip any leading locale prefix from a path */
function stripLocalePrefix(path) {
  const parts = path.split('/').filter(Boolean);
  const localeSet = new Set(LOCALES);
  if (parts.length > 0 && localeSet.has(parts[0])) {
    const rest = parts.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }
  return path || '/';
}

/**
 * Build one <url> block including all xhtml:link hreflang alternates.
 * Google requires every language version to reference ALL other versions
 * (including itself) via rel="alternate" hreflang="..." links.
 */
function buildUrlBlock(path, priority, changefreq, locale) {
  const loc = localeUrl(locale, path);

  const hreflangs = LOCALES.map((alt) => {
    const href = localeUrl(alt, path);
    const hl = HREFLANG_MAP[alt] || alt;
    return `    <xhtml:link rel="alternate" hreflang="${hl}" href="${href}" />`;
  });

  // Also add x-default pointing to English version
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${localeUrl('en', path)}" />`;

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${[...hreflangs, xDefault].join('\n')}
  </url>`;
}

// ---------------------------------------------------------------------------
// Generate
// ---------------------------------------------------------------------------

const urlBlocks = [];
for (const { path, priority, changefreq } of ALL_PATHS) {
  for (const locale of LOCALES) {
    urlBlocks.push(buildUrlBlock(path, priority, changefreq, locale));
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks.join('\n')}
</urlset>
`;

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

const outDir = resolve(ROOT, 'client/public');
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, 'sitemap.xml');
writeFileSync(outPath, sitemap, 'utf8');

const totalUrls = ALL_PATHS.length * LOCALES.length;
console.log(`✅ Sitemap generated: ${outPath}`);
console.log(`   ${totalUrls} URLs (${ALL_PATHS.length} routes × ${LOCALES.length} locales)`);
console.log(`   ${slugs.length} game pages, ${STATIC_PATHS.length} static pages`);
