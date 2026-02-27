/**
 * Pre-render script for static site generation.
 *
 * 1. Runs the normal Vite client build  → dist/public (JS, CSS, assets)
 * 2. Runs a Vite SSR build of entry-static.tsx → dist/ssr/entry-static.js
 * 3. Loads the SSR bundle and calls render(url) for every route × locale
 * 4. Injects the rendered HTML into the template and writes individual
 *    HTML files (e.g. dist/public/fr/play/pacman/index.html)
 *
 * Run:  node scripts/prerender.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'dist/public');
const SSR_DIR = resolve(ROOT, 'dist/ssr');

// ---------------------------------------------------------------------------
// 1. Collect all routes to pre-render
// ---------------------------------------------------------------------------

const LOCALES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'ru',
  'zh-CN', 'zh-TW', 'ja', 'ko', 'ar', 'hi',
  'tr', 'nl', 'pl', 'sv', 'id', 'vi', 'th',
];

// Read game slugs from the source data
const gamesTs = readFileSync(resolve(ROOT, 'client/src/data/games.ts'), 'utf8');
const slugMatches = [...gamesTs.matchAll(/slug:\s*['"`]([^'"`]+)['"`]/g)];
const gameSlugs = slugMatches.map((m) => m[1]);

// Static paths (must match App.tsx routes)
const STATIC_PATHS = [
  '/',
  '/games',
  '/top-rated',
  '/daily',
  '/about',
  '/contact',
  '/privacy',
  '/sitemap',
  '/leaderboard',
  '/a-z',
  '/az',
  '/kids',
  '/404',
];

// Game paths
const GAME_PATHS = gameSlugs.map((slug) => `/play/${slug}`);

const ALL_PATHS = [...STATIC_PATHS, ...GAME_PATHS];

/** Build the full URL path for a locale + route */
function localeUrl(locale, routePath) {
  // Defensive: strip any existing locale prefix to prevent /fr/es/… doubling
  const stripped = stripLocalePrefix(routePath);
  // Ensure trailing slash
  const withSlash = stripped.endsWith('/') ? stripped : `${stripped}/`;
  if (locale === 'en') return withSlash;
  return `/${locale}${withSlash === '/' ? '/' : withSlash}`;
}

/** Strip any leading locale prefix from a path (e.g. /fr/play/pacman → /play/pacman) */
function stripLocalePrefix(path) {
  const parts = path.split('/').filter(Boolean);
  const localeSet = new Set(LOCALES);
  if (parts.length > 0 && localeSet.has(parts[0])) {
    const rest = parts.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }
  return path || '/';
}

/** Turn a URL path into a filesystem path for the HTML file */
function urlToFilePath(urlPath) {
  // "/" → "/index.html", "/fr/" → "/fr/index.html", "/fr/play/pacman/" → "/fr/play/pacman/index.html"
  const stripped = urlPath.endsWith('/') ? urlPath.slice(0, -1) : urlPath;
  const clean = stripped === '' ? '/index.html' : `${stripped}/index.html`;
  return resolve(OUT_DIR, clean.slice(1)); // remove leading /
}

// ---------------------------------------------------------------------------
// 2. Run Vite builds
// ---------------------------------------------------------------------------

console.log('📦 Building client bundle...');
await build({
  root: resolve(ROOT, 'client'),
  configFile: resolve(ROOT, 'vite.config.ts'),
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
  },
  logLevel: 'warn',
});

console.log('📦 Building SSR bundle...');
await build({
  root: resolve(ROOT, 'client'),
  configFile: resolve(ROOT, 'vite.config.ts'),
  build: {
    outDir: SSR_DIR,
    emptyOutDir: true,
    ssr: true,
    rollupOptions: {
      input: resolve(ROOT, 'client/src/entry-static.tsx'),
      output: {
        entryFileNames: 'entry-static.js',
      },
    },
  },
  logLevel: 'warn',
});

// ---------------------------------------------------------------------------
// 3. Load template + SSR module
// ---------------------------------------------------------------------------

const templatePath = resolve(OUT_DIR, 'index.html');
if (!existsSync(templatePath)) {
  console.error('❌ Client build did not produce index.html');
  process.exit(1);
}
const template = readFileSync(templatePath, 'utf8');

// Import the SSR bundle
const ssrModule = await import(resolve(SSR_DIR, 'entry-static.js'));
const { render, GAMES, getGameT, getTranslation } = ssrModule;

// Build a slug → game lookup
const gameBySlug = Object.fromEntries(GAMES.map((g) => [g.slug, g]));

const SITE_ORIGIN = 'https://doodlegameshub.com';

/** Map locale code to BCP-47 lang attribute */
function bcp47(locale) {
  const map = { 'zh-CN': 'zh-Hans', 'zh-TW': 'zh-Hant' };
  return map[locale] || locale;
}

/**
 * Truncate text to a maximum length, ending at the last full sentence or word
 * boundary. Avoids cutting mid-word or mid-sentence.
 */
function truncateCleanly(text, maxLen) {
  if (text.length <= maxLen) return text;
  // Try to end at the last sentence boundary (. ! ?) within maxLen
  const sentenceEnd = text.slice(0, maxLen).search(/[.!?][^.!?]*$/);
  if (sentenceEnd > maxLen * 0.6) {
    return text.slice(0, sentenceEnd + 1).trim();
  }
  // Fall back to last word boundary
  const wordEnd = text.lastIndexOf(' ', maxLen - 2);
  if (wordEnd > maxLen * 0.5) {
    return text.slice(0, wordEnd).trim() + '…';
  }
  // Last resort: hard cut
  return text.slice(0, maxLen - 1) + '…';
}

// ---------------------------------------------------------------------------
// 4. Per-page meta & schema helpers
// ---------------------------------------------------------------------------

/** Route key → SEO translation key mapping for static pages */
const PAGE_SEO_MAP = {
  '/': { titleKey: 'seo.home.title', descKey: 'seo.home.description' },
  '/games': { titleKey: 'seo.allGames.title', descKey: 'seo.allGames.description' },
  '/top-rated': { titleKey: 'seo.topRated.title', descKey: 'seo.topRated.description' },
  '/daily': { titleKey: 'seo.daily.title', descKey: 'seo.daily.description' },
  '/about': { titleKey: 'seo.about.title', descKey: null },
  '/contact': { titleKey: 'seo.contact.title', descKey: null },
  '/privacy': { titleKey: 'seo.privacy.title', descKey: null },
  '/sitemap': { titleKey: 'seo.sitemap.title', descKey: 'seo.sitemap.description' },
  '/404': { titleKey: 'seo.notFound.title', descKey: null, noindex: true },
  '/leaderboard': { titleKey: 'seo.topRated.title', descKey: null, noindex: true },
  '/a-z': { titleKey: 'seo.allGames.title', descKey: null, noindex: true },
  '/az': { titleKey: 'seo.allGames.title', descKey: null, noindex: true },
  '/kids': { titleKey: 'seo.home.title', descKey: null, noindex: true },
};

/**
 * Build per-page metadata (title, description, og/twitter tags, JSON-LD)
 * for a given route + locale combination.
 */
function buildPageMeta(routePath, locale) {
  const url = localeUrl(locale, routePath);
  const canonical = `${SITE_ORIGIN}${url.endsWith('/') ? url : `${url}/`}`;
  const lang = bcp47(locale);

  // Normalize routePath: strip trailing slash for lookups (except root)
  const normalizedPath = routePath === '/' ? '/' : routePath.replace(/\/+$/, '');

  // ----- Game pages -----
  const gameMatch = normalizedPath.match(/^\/play\/(.+)$/);
  if (gameMatch) {
    const slug = gameMatch[1];
    const game = gameBySlug[slug];
    if (game) {
      const { title: gameTitle, description: gameDesc } = getGameT(locale, game);
      const pageTitle = getTranslation(locale, 'seo.play.title').replace('{title}', gameTitle);
      const rawDesc = getTranslation(locale, 'seo.play.description')
        .replace('{title}', gameTitle)
        .replace('{description}', gameDesc.slice(0, 140));
      // Truncate meta description to <160 chars, ending at a sentence or word boundary
      const pageDesc = truncateCleanly(rawDesc, 155);

      const thumbnailUrl = game.thumbnail.startsWith('http')
        ? game.thumbnail
        : `${SITE_ORIGIN}${game.thumbnail}`;

      const difficultyMap = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: gameTitle,
        description: gameDesc,
        image: thumbnailUrl,
        url: canonical,
        genre: game.category,
        gamePlatform: 'Web Browser',
        applicationCategory: 'Game',
        operatingSystem: 'Any',
        inLanguage: lang,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        educationalLevel: difficultyMap[game.difficulty] ?? 'Medium',
        publisher: {
          '@type': 'Organization',
          name: 'Google',
        },
        provider: {
          '@type': 'Organization',
          name: 'Doodle Games Hub',
          url: `${SITE_ORIGIN}/`,
        },
      };

      // BreadcrumbList for game pages
      const siteName = getTranslation(locale, 'seo.siteName');
      const allGamesLabel = getTranslation(locale, 'nav.allGames');
      const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: siteName,
            item: `${SITE_ORIGIN}${localeUrl(locale, '/')}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: allGamesLabel,
            item: `${SITE_ORIGIN}${localeUrl(locale, '/games')}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: gameTitle,
            item: canonical,
          },
        ],
      };

      return {
        title: pageTitle,
        description: pageDesc,
        ogTitle: pageTitle,
        ogDescription: truncateCleanly(gameDesc, 200),
        ogImage: thumbnailUrl,
        ogUrl: canonical,
        ogType: 'website',
        twitterTitle: pageTitle,
        twitterDescription: truncateCleanly(gameDesc, 200),
        twitterImage: thumbnailUrl,
        jsonLd: [jsonLd, breadcrumb],
      };
    }
  }

  // ----- Static pages -----
  const seoMap = PAGE_SEO_MAP[normalizedPath];
  if (seoMap) {
    const title = getTranslation(locale, seoMap.titleKey);
    const description = seoMap.descKey
      ? getTranslation(locale, seoMap.descKey)
      : getTranslation(locale, 'seo.defaultDescription');

    return {
      title,
      description,
      noindex: !!seoMap.noindex,
      ogTitle: title,
      ogDescription: description,
      ogImage: null, // keep default site image
      ogUrl: canonical,
      ogType: 'website',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: null,
      jsonLd: null, // keep the WebSite schema from the template
    };
  }

  // Fallback
  return {
    title: getTranslation(locale, 'seo.defaultTitle'),
    description: getTranslation(locale, 'seo.defaultDescription'),
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    ogUrl: canonical,
    ogType: 'website',
    twitterTitle: null,
    twitterDescription: null,
    twitterImage: null,
    jsonLd: null,
  };
}

/**
 * Apply meta tag replacements to the HTML string.
 */
function applyMeta(html, meta, locale, routePath) {
  // <html lang>
  html = html.replace('<html lang="en">', `<html lang="${bcp47(locale)}">`);

  // <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`
  );

  // <meta name="description">
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`
  );

  // <meta name="robots"> — noindex for 404 pages
  if (meta.noindex) {
    html = html.replace(
      /<meta name="robots" content="[^"]*" \/>/,
      '<meta name="robots" content="noindex, nofollow" />'
    );
  }

  // <link rel="canonical">
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${meta.ogUrl}" />`
  );

  // --- hreflang alternate link tags ---
  const baseRoute = routePath === '/' ? '/' : routePath.replace(/\/+$/, '');
  const hreflangTags = LOCALES.map((loc) => {
    const lang = bcp47(loc);
    const href = `${SITE_ORIGIN}${localeUrl(loc, baseRoute)}`;
    return `<link rel="alternate" hreflang="${lang}" href="${href}" />`;
  });
  // Add x-default pointing to English
  hreflangTags.push(`<link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${localeUrl('en', baseRoute)}" />`);
  html = html.replace('</head>', `    ${hreflangTags.join('\n    ')}\n  </head>`);

  // --- Performance: Inject LCP preload hint for game thumbnails ---
  if (meta.ogImage && meta.ogImage.includes('/thumbnails/')) {
    // Extract the local path for the preload (works with both full URLs and relative paths)
    const thumbMatch = meta.ogImage.match(/(\/thumbnails\/[^\s"']+)/);
    if (thumbMatch) {
      const preloadTag = `<link rel="preload" as="image" href="${thumbMatch[1]}" fetchpriority="high" />`;
      html = html.replace('</head>', `    ${preloadTag}\n  </head>`);
    }
  }

  // OG tags
  if (meta.ogTitle) {
    html = html.replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escapeAttr(meta.ogTitle)}" />`
    );
  }
  if (meta.ogDescription) {
    html = html.replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${escapeAttr(meta.ogDescription)}" />`
    );
  }
  if (meta.ogImage) {
    html = html.replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${escapeAttr(meta.ogImage)}" />`
    );
  }
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${meta.ogUrl}" />`
  );

  // Twitter tags
  if (meta.twitterTitle) {
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escapeAttr(meta.twitterTitle)}" />`
    );
  }
  if (meta.twitterDescription) {
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${escapeAttr(meta.twitterDescription)}" />`
    );
  }
  if (meta.twitterImage) {
    html = html.replace(
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${escapeAttr(meta.twitterImage)}" />`
    );
  }

  // JSON-LD: for game pages, replace the generic WebSite schema with VideoGame + BreadcrumbList
  if (meta.jsonLd) {
    // Remove the existing WebSite JSON-LD
    html = html.replace(
      /\s*<script type="application\/ld\+json">[\s\S]*?<\/script>\s*(?=\s*<!--\s*Preload)/,
      '\n    ' + meta.jsonLd.map((ld) =>
        `<script type="application/ld+json">${JSON.stringify(ld)}</script>`
      ).join('\n    ') + '\n    '
    );
  }

  return html;
}

/** Escape HTML entities in text content */
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Escape for HTML attribute values (double-quoted) */
function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------------------------------------------------------------------------
// 4. Render all pages
// ---------------------------------------------------------------------------

const allUrls = [];
for (const routePath of ALL_PATHS) {
  for (const locale of LOCALES) {
    allUrls.push(localeUrl(locale, routePath));
  }
}

console.log(`\n🖨  Pre-rendering ${allUrls.length} pages (${ALL_PATHS.length} routes × ${LOCALES.length} locales)...`);

let rendered = 0;
let errors = 0;

for (const url of allUrls) {
  try {
    const appHtml = render(url);

    // Determine locale and route path for this URL
    const locale = (() => {
      for (const l of LOCALES) {
        if (l === 'en') continue;
        if (url === `/${l}` || url.startsWith(`/${l}/`)) return l;
      }
      return 'en';
    })();
    const routePath = locale === 'en' ? url : url.slice(`/${locale}`.length) || '/';

    // Build page-specific metadata
    const meta = buildPageMeta(routePath, locale);

    // Inject the rendered HTML into the template's <div id="root">
    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    // Apply all meta tag replacements
    html = applyMeta(html, meta, locale, routePath);

    const filePath = urlToFilePath(url);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, html, 'utf8');
    rendered++;
  } catch (err) {
    errors++;
    console.error(`  ❌ ${url}: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// 5. Generate 404.html files for hosting platforms
// ---------------------------------------------------------------------------
// Most static hosts (Cloudflare Pages, Netlify, GitHub Pages, Vercel, Apache)
// look for a 404.html at the root (and per-directory) to serve for missing routes.

const en404Source = resolve(OUT_DIR, '404/index.html');
if (existsSync(en404Source)) {
  // Root 404.html — served by virtually all static hosts
  const { copyFileSync } = await import('fs');
  copyFileSync(en404Source, resolve(OUT_DIR, '404.html'));
  console.log('\n📄 Generated 404.html files:');
  console.log('   ✓ 404.html (root, English)');

  // Per-locale 404.html — Cloudflare Pages checks /<locale>/404.html too
  for (const locale of LOCALES) {
    if (locale === 'en') continue;
    const locale404Source = resolve(OUT_DIR, `${locale}/404/index.html`);
    if (existsSync(locale404Source)) {
      copyFileSync(locale404Source, resolve(OUT_DIR, `${locale}/404.html`));
      console.log(`   ✓ ${locale}/404.html`);
    }
  }
} else {
  console.warn('\n⚠️  404/index.html not found — skipping 404.html generation');
}

console.log(`\n✅ Pre-rendered ${rendered} pages${errors > 0 ? ` (${errors} errors)` : ''}`);
console.log(`   Output: ${OUT_DIR}`);

// Verify a few key files exist
const spotChecks = [
  'index.html',
  '404.html',
  'fr/index.html',
  'fr/404.html',
  'ja/play/pacman/index.html',
  'es/play/snake/index.html',
];
for (const f of spotChecks) {
  const p = resolve(OUT_DIR, f);
  const exists = existsSync(p);
  console.log(`   ${exists ? '✓' : '✗'} ${f}`);
}
