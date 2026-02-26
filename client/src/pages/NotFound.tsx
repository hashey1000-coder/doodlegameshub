import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useT } from "@/contexts/LanguageContext";
import { useHead } from '@/hooks/useHead';

export default function NotFound() {
  const [, setLocation] = useLocation();
  const t = useT();

  // SEO — localised page title + meta description
  useHead({
    title: t('seo.notFound.title' as any),
    description: t('notFound.desc' as any),
  });

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-lg mx-4 shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-red-500" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('notFound.code')}</h1>

          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
            {t('notFound.title')}
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            {t('notFound.desc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Home className="w-4 h-4 mr-2" />
              {t('notFound.backHome')}
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
