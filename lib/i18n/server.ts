import { cookies } from "next/headers";
import { LOCALE_COOKIE, Locale, getDictionary } from "./index";

export function getServerLocale(): Locale {
  // Static export has no request cookies; each language is pre-rendered as its own copy.
  if (process.env.STATIC_EXPORT === "1") return process.env.STATIC_LOCALE === "ar" ? "ar" : "en";
  const stored = cookies().get(LOCALE_COOKIE)?.value;
  return stored === "ar" ? "ar" : "en";
}

export function getServerDictionary() {
  const locale = getServerLocale();
  return { locale, dict: getDictionary(locale) };
}
