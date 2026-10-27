"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Locale, LOCALE_COOKIE, getDictionary, Dictionary } from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

// Set only in the GitHub Pages export, where each language is its own static copy
// (English at <root>/…, Arabic at <root>/ar/…), so switching means changing URL.
const staticLocale = process.env.NEXT_PUBLIC_STATIC_LOCALE as Locale | undefined;
const siteRoot = process.env.NEXT_PUBLIC_SITE_ROOT ?? "";

function staticUrlFor(next: Locale) {
  const { pathname, search, hash } = window.location;
  const currentBase = staticLocale === "ar" ? `${siteRoot}/ar` : siteRoot;
  const rest = pathname.startsWith(currentBase) ? pathname.slice(currentBase.length) : pathname;
  return `${next === "ar" ? `${siteRoot}/ar` : siteRoot}${rest || "/"}${search}${hash}`;
}

function storeLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000`;
}

export function LocaleProvider({
  locale: initialLocale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  // Static copies can't read the cookie at render time: send returning Arabic
  // visitors to the Arabic copy, and remember Arabic when it is opened directly.
  useEffect(() => {
    if (!staticLocale) return;
    if (staticLocale === "ar") storeLocale("ar");
    else if (document.cookie.includes(`${LOCALE_COOKIE}=ar`)) window.location.replace(staticUrlFor("ar"));
  }, []);

  const setLocale = (next: Locale) => {
    storeLocale(next);
    if (staticLocale) {
      if (next !== staticLocale) window.location.assign(staticUrlFor(next));
      return;
    }
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    setLocaleState(next);
    router.refresh();
  };

  return (
    <LocaleContext.Provider value={{ locale, dict: getDictionary(locale), setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
