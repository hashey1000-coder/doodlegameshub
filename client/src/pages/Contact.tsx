/**
 * Contact page — /contact (or /:lang/contact)
 * Design: Brutalist-editorial, dark navy background, yellow accents.
 * Provides a contact form (client-side only — no backend) with validation,
 * plus contact info cards and a FAQ-style quick answers section.
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { useT } from '@/contexts/LanguageContext';
import { useHead } from '@/hooks/useHead';
import { Mail, MessageSquare, Bug, Lightbulb, CheckCircle2, ArrowLeft, ExternalLink } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const SUBJECT_OPTIONS = [
  { value: 'broken-game', labelKey: 'contact.subject.broken', icon: Bug },
  { value: 'suggestion', labelKey: 'contact.subject.suggestion', icon: Lightbulb },
  { value: 'general', labelKey: 'contact.subject.general', icon: MessageSquare },
  { value: 'other', labelKey: 'contact.subject.other', icon: Mail },
];

export default function Contact() {
  const t = useT();

  // SEO — localised page title + meta description
  useHead({
    title: t('seo.contact.title' as any),
    description: t('contact.subtitle' as any),
    routePath: '/contact/',
  });

  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = t('contact.required');
    if (!form.email.trim()) errs.email = t('contact.required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('contact.invalidEmail');
    if (!form.subject) errs.subject = t('contact.required');
    if (!form.message.trim()) errs.message = t('contact.required');
    else if (form.message.trim().length < 10) errs.message = t('contact.messageMinLength');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Open mailto link with form data as a real action
    const subject = encodeURIComponent(`[DoodleGamesHub] ${form.subject}: ${form.name}`);
    const body = encodeURIComponent(`From: ${form.name} <${form.email}>\nSubject: ${form.subject}\n\n${form.message}`);
    window.location.href = `mailto:hello@doodlegameshub.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-12">
        <div className="mb-2">
          <span className="inline-block bg-violet-100 text-violet-600 dark:bg-yellow-400/20 dark:text-yellow-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-violet-200 dark:border-yellow-400/30">
            {t('contact.getInTouch')}
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mt-4 mb-4">
          {t('contact.title')}
        </h1>
        <p className="text-slate-500 dark:text-white/60 text-lg max-w-xl leading-relaxed">
          {t('contact.subtitle')}
        </p>
      </div>

      {/* ── Main grid ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pb-24 grid grid-cols-1 lg:grid-cols-5 gap-10">

        {/* ── Left: Contact cards ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 mb-6">{t('contact.whatHelp')}</h2>

          {SUBJECT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleChange('subject', opt.value)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${
                form.subject === opt.value
                  ? 'bg-violet-50 border-violet-300 text-violet-700 dark:bg-yellow-400/10 dark:border-yellow-400/60 dark:text-yellow-300'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:border-slate-300 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <opt.icon className={`w-5 h-5 shrink-0 ${form.subject === opt.value ? 'text-violet-500 dark:text-yellow-400' : 'text-slate-400 group-hover:text-slate-500 dark:text-white/40 dark:group-hover:text-white/60'}`} />
                <span className="font-medium text-sm">{t(opt.labelKey as any)}</span>
              </div>
            </button>
          ))}

          {/* Quick links */}
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 mb-4">{t('contact.quickAnswers')}</h2>
            <div className="space-y-3 text-sm text-slate-500 dark:text-white/50">
              <p>
                <span className="text-slate-700 dark:text-white/80 font-medium">{t('contact.gameNotLoading')}</span>{' '}
                {t('contact.gameNotLoadingAnswer' as any)}
              </p>
              <p>
                <span className="text-slate-700 dark:text-white/80 font-medium">{t('contact.missingGame')}</span>{' '}
                {t('contact.missingGameAnswer' as any)}
              </p>
              <p>
                <span className="text-slate-700 dark:text-white/80 font-medium">{t('contact.affiliatedGoogle')}</span>{' '}
                {t('contact.affiliatedGoogleAnswer' as any)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: Form ─────────────────────────────────────── */}
        <div className="lg:col-span-3">
          {submitted ? (
            /* ── Success state ── */
            <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-black mb-3">{t('contact.success')}</h2>
              <p className="text-slate-500 dark:text-white/60 mb-8 leading-relaxed">{t('contact.successDesc')}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl font-semibold text-sm transition-colors"
                >
                  {t('contact.sendAnother')}
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-700 dark:bg-yellow-400 dark:hover:bg-yellow-300 text-white dark:text-black rounded-xl font-bold text-sm transition-colors text-center"
                >
                  {t('contact.backToGames')}
                </Link>
              </div>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} noValidate className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-2">
                    {t('contact.name')} <span className="text-violet-500 dark:text-yellow-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder={t('contact.namePlaceholder')}
                    className={`w-full bg-slate-50 dark:bg-white/5 border rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.name ? 'border-red-500/60 focus:ring-red-500/30' : 'border-slate-300 dark:border-white/15 focus:ring-violet-400/40 dark:focus:ring-yellow-400/40 focus:border-violet-400/60 dark:focus:border-yellow-400/60'
                    }`}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-2">
                    {t('contact.email')} <span className="text-violet-500 dark:text-yellow-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder={t('contact.emailPlaceholder')}
                    className={`w-full bg-slate-50 dark:bg-white/5 border rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.email ? 'border-red-500/60 focus:ring-red-500/30' : 'border-slate-300 dark:border-white/15 focus:ring-violet-400/40 dark:focus:ring-yellow-400/40 focus:border-violet-400/60 dark:focus:border-yellow-400/60'
                    }`}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                </div>
              </div>

              {/* Subject (hidden — selected via cards on left, but also shown as text) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-2">
                  {t('contact.subject')} <span className="text-violet-500 dark:text-yellow-400">*</span>
                </label>
                <select
                  value={form.subject}
                  onChange={e => handleChange('subject', e.target.value)}
                  className={`w-full bg-slate-50 dark:bg-[#1a1a35] border rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                    errors.subject ? 'border-red-500/60 focus:ring-red-500/30' : 'border-slate-300 dark:border-white/15 focus:ring-violet-400/40 dark:focus:ring-yellow-400/40 focus:border-violet-400/60 dark:focus:border-yellow-400/60'
                  } ${!form.subject ? 'text-slate-400 dark:text-white/30' : ''}`}
                >
                  <option value="" disabled className="text-slate-400 dark:text-white/30">{t('contact.subjectPlaceholder')}</option>
                  {SUBJECT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} className="text-slate-900 dark:text-white bg-white dark:bg-[#1a1a35]">{t(opt.labelKey as any)}</option>
                  ))}
                </select>
                {errors.subject && <p className="mt-1.5 text-xs text-red-400">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-2">
                  {t('contact.message')} <span className="text-violet-500 dark:text-yellow-400">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={e => handleChange('message', e.target.value)}
                  placeholder={t('contact.messagePlaceholder')}
                  rows={6}
                  maxLength={500}
                  className={`w-full bg-slate-50 dark:bg-white/5 border rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.message ? 'border-red-500/60 focus:ring-red-500/30' : 'border-slate-300 dark:border-white/15 focus:ring-violet-400/40 dark:focus:ring-yellow-400/40 focus:border-violet-400/60 dark:focus:border-yellow-400/60'
                  }`}
                />
                <div className="flex justify-between mt-1.5">
                  {errors.message ? (
                    <p className="text-xs text-red-400">{errors.message}</p>
                  ) : (
                    <span />
                  )}
                  <span className={`text-xs ${form.message.length > 500 ? 'text-red-400' : 'text-slate-400 dark:text-white/30'}`}>
                    {form.message.length}/500
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-violet-600 hover:bg-violet-700 dark:bg-yellow-400 dark:hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed text-white dark:text-black font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-200/20 dark:shadow-yellow-400/20"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('contact.sending')}
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    {t('contact.send')}
                  </>
                )}
              </button>

              <p className="text-xs text-slate-400 dark:text-white/30 text-center">
                {t('contact.responseTime')}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
