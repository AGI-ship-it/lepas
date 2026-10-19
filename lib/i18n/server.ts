import { cookies } from "next/headers";
import { LOCALE_COOKIE, Locale, getDictionary } from "./index";

export function getServerLocale(): Locale {
  const stored = cookies().get(LOCALE_COOKIE)?.value;
  return stored === "ar" ? "ar" : "en";
}

export function getServerDictionary() {
  const locale = getServerLocale();
  return { locale, dict: getDictionary(locale) };
}
