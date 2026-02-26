/**
 * Privacy Policy page — /privacy (or /:lang/privacy)
 * Design: Brutalist-editorial, dark navy background, yellow accents.
 * Comprehensive privacy policy for a static fan site with no user accounts.
 */

import { Link } from 'wouter';
import { useT } from '@/contexts/LanguageContext';
import { useHead } from '@/hooks/useHead';
import { ArrowLeft, Shield, Eye, Cookie, Share2, Lock, Mail, RefreshCw } from 'lucide-react';

const LAST_UPDATED = 'February 21, 2026';

interface Section {
  id: string;
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}

export default function Privacy() {
  const t = useT();

  // SEO — localised page title + meta description
  useHead({
    title: t('seo.privacy.title'),
    description: t('privacy.subtitle'),
    routePath: '/privacy/',
  });

  const sections: Section[] = [
    {
      id: 'overview',
      icon: Shield,
      title: t('privacy.section.overview'),
      content: (
        <div className="space-y-3 text-slate-600 dark:text-white/70 leading-relaxed">
          <p>{t('privacy.overview.p1')}</p>
          <p>{t('privacy.overview.p2')}</p>
        </div>
      ),
    },
    {
      id: 'data-collected',
      icon: Eye,
      title: t('privacy.section.dataCollected'),
      content: (
        <div className="space-y-4 text-slate-600 dark:text-white/70 leading-relaxed">
          <p>{t('privacy.dataCollected.intro')}</p>
          <div className="space-y-3">
            <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/10">
              <h4 className="text-slate-900 dark:text-white font-semibold mb-1">{t('privacy.dataCollected.localStorageTitle')}</h4>
              <p className="text-sm">{t('privacy.dataCollected.localStorageDesc')}</p>
            </div>
            <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/10">
              <h4 className="text-slate-900 dark:text-white font-semibold mb-1">{t('privacy.dataCollected.analyticsTitle')}</h4>
              <p className="text-sm">{t('privacy.dataCollected.analyticsDesc')}</p>
            </div>
            <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/10">
              <h4 className="text-slate-900 dark:text-white font-semibold mb-1">{t('privacy.dataCollected.contactFormTitle')}</h4>
              <p className="text-sm">{t('privacy.dataCollected.contactFormDesc')}</p>
            </div>
          </div>
          <p className="text-sm">{t('privacy.dataCollected.noCollect')}</p>
        </div>
      ),
    },
    {
      id: 'cookies',
      icon: Cookie,
      title: t('privacy.section.cookies'),
      content: (
        <div className="space-y-3 text-slate-600 dark:text-white/70 leading-relaxed">
          <p>{t('privacy.cookies.p1')}</p>
          <p>{t('privacy.cookies.p2')}</p>
          <p>{t('privacy.cookies.p3')}</p>
          <p>{t('privacy.cookies.p4')}</p>
        </div>
      ),
    },
    {
      id: 'third-parties',
      icon: Share2,
      title: t('privacy.section.thirdParties'),
      content: (
        <div className="space-y-4 text-slate-600 dark:text-white/70 leading-relaxed">
          <p>{t('privacy.thirdParties.intro')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <th className="text-left py-2 pr-4 text-slate-500 dark:text-white/50 font-medium">{t('privacy.thirdParties.service')}</th>
                  <th className="text-left py-2 pr-4 text-slate-500 dark:text-white/50 font-medium">{t('privacy.thirdParties.purpose')}</th>
                  <th className="text-left py-2 text-slate-500 dark:text-white/50 font-medium">{t('privacy.thirdParties.privacyPolicy')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                <tr>
                  <td className="py-3 pr-4 text-slate-900 dark:text-white font-medium">Google LLC</td>
                  <td className="py-3 pr-4">{t('privacy.thirdParties.googlePurpose')}</td>
                  <td className="py-3"><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-yellow-400 hover:underline">policies.google.com</a></td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-slate-900 dark:text-white font-medium">glov3.me</td>
                  <td className="py-3 pr-4">{t('privacy.thirdParties.glovPurpose')}</td>
                  <td className="py-3"><span className="text-slate-400 dark:text-white/40">{t('privacy.thirdParties.seeTheirSite')}</span></td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-slate-900 dark:text-white font-medium">Google Fonts</td>
                  <td className="py-3 pr-4">{t('privacy.thirdParties.fontsPurpose')}</td>
                  <td className="py-3"><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-yellow-400 hover:underline">policies.google.com</a></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm">{t('privacy.thirdParties.noSell')}</p>
        </div>
      ),
    },
    {
      id: 'data-security',
      icon: Lock,
      title: t('privacy.section.dataSecurity'),
      content: (
        <div className="space-y-3 text-slate-600 dark:text-white/70 leading-relaxed">
          <p>{t('privacy.dataSecurity.p1')}</p>
          <p>{t('privacy.dataSecurity.p2')}</p>
        </div>
      ),
    },
    {
      id: 'your-rights',
      icon: Shield,
      title: t('privacy.section.yourRights'),
      content: (
        <div className="space-y-3 text-slate-600 dark:text-white/70 leading-relaxed">
          <p>{t('privacy.yourRights.intro')}</p>
          <ul className="space-y-2 list-none">
            {([
              [t('privacy.yourRights.access'), t('privacy.yourRights.accessDesc')],
              [t('privacy.yourRights.erasure'), t('privacy.yourRights.erasureDesc')],
              [t('privacy.yourRights.rectification'), t('privacy.yourRights.rectificationDesc')],
              [t('privacy.yourRights.object'), t('privacy.yourRights.objectDesc')],
              [t('privacy.yourRights.portability'), t('privacy.yourRights.portabilityDesc')],
            ] as [string, string][]).map(([right, desc]) => (
              <li key={right} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-yellow-400 mt-2 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">{right}:</strong> {desc}</span>
              </li>
            ))}
          </ul>
          <p>
            {t('privacy.yourRights.exerciseRights')}{' '}
            <Link href="/contact/" className="text-violet-600 dark:text-yellow-400 hover:underline">{t('privacy.yourRights.contactPage')}</Link>.
          </p>
        </div>
      ),
    },
    {
      id: 'childrens-privacy',
      icon: Shield,
      title: t('privacy.section.childrensPrivacy'),
      content: (
        <div className="space-y-3 text-slate-600 dark:text-white/70 leading-relaxed">
          <p>{t('privacy.childrensPrivacy.p1')}</p>
          <p>{t('privacy.childrensPrivacy.p2')}</p>
        </div>
      ),
    },
    {
      id: 'changes',
      icon: RefreshCw,
      title: t('privacy.section.changes'),
      content: (
        <div className="space-y-3 text-slate-600 dark:text-white/70 leading-relaxed">
          <p>{t('privacy.changes.p1')}</p>
        </div>
      ),
    },
    {
      id: 'contact',
      icon: Mail,
      title: t('privacy.section.contact'),
      content: (
        <div className="space-y-3 text-slate-600 dark:text-white/70 leading-relaxed">
          <p>
            {t('privacy.contact.p1')}{' '}
            <Link href="/contact/" className="text-violet-600 dark:text-yellow-400 hover:underline">{t('privacy.yourRights.contactPage')}</Link>.
          </p>
          <p>{t('privacy.contact.p2')}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-12">
        <div className="mb-2">
          <span className="inline-block bg-violet-100 text-violet-600 dark:bg-yellow-400/20 dark:text-yellow-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-violet-200 dark:border-yellow-400/30">
            {t('privacy.legal')}
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mt-4 mb-4">
          {t('privacy.title')}
        </h1>
        <p className="text-slate-500 dark:text-white/60 text-lg max-w-xl leading-relaxed mb-4">
          {t('privacy.subtitle')}
        </p>
        <p className="text-slate-400 dark:text-white/40 text-sm">
          {t('privacy.lastUpdated')}: <span className="text-slate-600 dark:text-white/60">{LAST_UPDATED}</span>
        </p>
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pb-24 grid grid-cols-1 lg:grid-cols-4 gap-10">

        {/* ── Sticky TOC ──────────────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 mb-4">{t('privacy.contents')}</h2>
            <nav className="space-y-1">
              {sections.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-slate-500 dark:text-white/50 hover:text-violet-600 dark:hover:text-yellow-400 py-1.5 transition-colors"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Sections ────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-10">
          {sections.map(s => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-yellow-400/15 border border-violet-200 dark:border-yellow-400/30 flex items-center justify-center shrink-0">
                  <s.icon className="w-4 h-4 text-violet-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-xl font-black">{s.title}</h2>
              </div>
              <div className="pl-11">
                {s.content}
              </div>
            </section>
          ))}

          {/* ── Disclaimer box ── */}
          <div className="bg-violet-50 dark:bg-yellow-400/10 border border-violet-200 dark:border-yellow-400/30 rounded-2xl p-6">
            <h3 className="text-violet-700 dark:text-yellow-400 font-black text-lg mb-3">{t('privacy.disclaimer')}</h3>
            <p className="text-slate-600 dark:text-white/70 text-sm leading-relaxed">
              {t('privacy.disclaimerText')} <Link href="/contact/" className="text-violet-600 dark:text-yellow-400 hover:underline">{t('privacy.disclaimerContact')}</Link> {t('privacy.disclaimerEnd')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
