import { useEffect } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * A lightweight redirect page.
 * On the client it navigates immediately via wouter.
 * In SSR it renders a meta-refresh + JS redirect so crawlers and
 * users without JS are also redirected.
 */
export default function Redirect({ to }: { to: string }) {
  const { locale } = useLanguage();
  const [, navigate] = useLocation();
  const prefix = locale === "en" ? "" : `/${locale}`;
  const fullTarget = `${prefix}${to}`;

  useEffect(() => {
    navigate(to, { replace: true });
  }, [to, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <meta httpEquiv="refresh" content={`0;url=${fullTarget}`} />
      <p className="text-slate-500">
        Redirecting to{" "}
        <a href={fullTarget} className="text-violet-600 underline">
          {fullTarget}
        </a>
        …
      </p>
    </div>
  );
}
