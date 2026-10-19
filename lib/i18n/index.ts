import en from "./en";
import ar from "./ar";
import type { Dictionary } from "./en";

export type Locale = "en" | "ar";
export const LOCALE_COOKIE = "lepas-locale";
export const locales: Locale[] = ["en", "ar"];

const dictionaries: Record<Locale, Dictionary> = { en: en as unknown as Dictionary, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

export type { Dictionary };
