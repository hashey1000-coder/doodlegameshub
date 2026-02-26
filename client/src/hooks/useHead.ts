import { useEffect } from 'react';
import { useLanguage, localePath, SUPPORTED_LOCALES } from '@/contexts/LanguageContext';

const SITE_ORIGIN = 'https://doodlegameshub.com';

/** Map internal locale codes → BCP-47 lang attribute values */
const BCP47_MAP: Record<string, string> = {
  'zh-CN': 'zh-Hans',
  'zh-TW': 'zh-Hant',
};
function bcp47(locale: string): string {
  return BCP47_MAP[locale] || locale;
}

export interface HeadOptions {
  title: string;
  description: string;
  /** Relative route path WITHOUT locale prefix, e.g. '/' or '/play/pacman' */
  routePath?: string;
  ogImage?: string;
  ogType?: string;
  /** Extra meta tags (OG/Twitter) */
  extraMeta?: Record<string, string>;
}

/**
 * Manages `<head>` tags on client-side navigation:
 * - `<html lang>` and `dir`
 * - `<title>`
 * - `<meta name="description">`
 * - `<link rel="canonical">`
 * - `<meta property="og:*">` and `<meta name="twitter:*">`
 * - `<link rel="alternate" hreflang="...">`
 *
 * On cleanup (unmount / route change), resets to default values.
 */
export function useHead({ title, description, routePath, ogImage, ogType = 'website', extraMeta }: HeadOptions) {
  const { locale, localeInfo, t } = useLanguage();

  useEffect(() => {
    // --- <html lang> and dir ---
    document.documentElement.lang = bcp47(locale);
    document.documentElement.dir = localeInfo.dir;

    // --- <title> ---
    document.title = title;

    // --- <meta name="description"> ---
    setMeta('name', 'description', description);

    // --- <link rel="canonical"> ---
    if (routePath !== undefined) {
      const canonicalUrl = `${SITE_ORIGIN}${localePath(locale, routePath)}`;
      setLink('canonical', canonicalUrl);

      // --- hreflang alternates ---
      SUPPORTED_LOCALES.forEach((loc) => {
        const href = `${SITE_ORIGIN}${localePath(loc.code, routePath)}`;
        setHreflang(bcp47(loc.code), href);
      });
      // x-default → English
      setHreflang('x-default', `${SITE_ORIGIN}${routePath}`);
    }

    // --- OG tags ---
    const ogUrl = routePath !== undefined ? `${SITE_ORIGIN}${localePath(locale, routePath)}` : undefined;
    const ogTags: Record<string, string | undefined> = {
      'og:title': title,
      'og:description': description,
      'og:type': ogType,
      'og:url': ogUrl,
      'og:site_name': 'Doodle Games Hub',
      'og:locale': locale.replace('-', '_'),
      'og:image': ogImage,
    };
    Object.entries(ogTags).forEach(([prop, content]) => {
      if (content) setMeta('property', prop, content);
    });

    // --- Twitter tags ---
    const twitterTags: Record<string, string | undefined> = {
      'twitter:card': ogImage ? 'summary_large_image' : 'summary',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': ogImage,
    };
    Object.entries(twitterTags).forEach(([name, content]) => {
      if (content) setMeta('name', name, content);
    });

    // --- Extra meta ---
    if (extraMeta) {
      Object.entries(extraMeta).forEach(([key, content]) => {
        const attr = key.startsWith('og:') ? 'property' : 'name';
        setMeta(attr, key, content);
      });
    }

    // --- Cleanup ---
    return () => {
      const defaultTitle = t('seo.defaultTitle' as any);
      const defaultDesc = t('seo.defaultDescription' as any);
      document.title = defaultTitle;
      setMeta('name', 'description', defaultDesc);

      // Reset OG tags
      ['og:title', 'og:description', 'og:type', 'og:url', 'og:image', 'og:site_name', 'og:locale'].forEach((prop) => {
        removeMeta('property', prop);
      });
      ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'].forEach((name) => {
        removeMeta('name', name);
      });

      // Remove hreflang alternates
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

      // Remove extra meta
      if (extraMeta) {
        Object.keys(extraMeta).forEach((key) => {
          const attr = key.startsWith('og:') ? 'property' : 'name';
          removeMeta(attr, key);
        });
      }
    };
  }, [title, description, locale, localeInfo.dir, routePath, ogImage, ogType, t]);
}

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string) {
  const tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (tag) tag.remove();
}

function setLink(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

function setHreflang(lang: string, href: string) {
  let link = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'alternate';
    link.setAttribute('hreflang', lang);
    document.head.appendChild(link);
  }
  link.href = href;
}
