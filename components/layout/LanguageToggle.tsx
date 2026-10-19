"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { Locale } from "@/lib/i18n";

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex w-fit items-center border border-white/20 text-xs font-semibold uppercase tracking-widest2">
      {(["en", "ar"] as Locale[]).map((l, i) => (
        <div key={l} className="flex items-center">
          {i > 0 && <span className="h-4 w-px bg-white/20" aria-hidden="true" />}
          <button
            onClick={() => setLocale(l)}
            aria-pressed={locale === l}
            className={`px-3 py-1.5 transition-colors ${
              locale === l ? "bg-white text-lepas-black" : "text-white/70 hover:text-white"
            }`}
          >
            {l.toUpperCase()}
          </button>
        </div>
      ))}
    </div>
  );
}
