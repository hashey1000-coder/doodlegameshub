/**
 * TriviaCard — "Did you know?" card with a share/copy button.
 * Copies the trivia fact + game URL to clipboard and shows a toast confirmation.
 */
import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { useTriviaT } from "@/data/triviaTranslations";
import { useT } from "@/contexts/LanguageContext";

interface TriviaCardProps {
  slug: string;
  title: string;
}

export default function TriviaCard({ slug, title }: TriviaCardProps) {
  const [copied, setCopied] = useState(false);
  const t = useT();
  const trivia = useTriviaT(slug);

  if (!trivia) return null;

  const handleShare = async () => {
    const text = `💡 ${t('trivia.didYouKnow')} ${trivia}\n\n${window.location.href}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${t('trivia.didYouKnow')} — ${title}`, text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // User cancelled or clipboard unavailable — try clipboard as fallback
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch { /* silent fail */ }
    }
  };

  return (
    <div className="mt-3 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/40 shadow-sm p-5">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-lg">
          💡
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300">{t('trivia.didYouKnow')}</h3>
            <button
              onClick={handleShare}
              title={copied ? t('trivia.copied') : t('trivia.shareFact')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 shrink-0 ${
                copied
                  ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                  : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900/60"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>{t('trivia.copied')}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('trivia.shareFact')}</span>
                  <Copy className="w-3 h-3 sm:hidden" />
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">{trivia}</p>
        </div>
      </div>
    </div>
  );
}
