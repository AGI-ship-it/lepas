import type { Locale } from "@/lib/i18n";

export const NO_PREFERENCE = "no-preference";

export interface LepasLocation {
  id: string;
  name: { en: string; ar: string };
  address: { en: string; ar: string };
  comingSoon?: boolean;
}

// Same four locations as the contact page (lepasuae.com/contact#locations).
export const LEPAS_LOCATIONS: LepasLocation[] = [
  {
    id: "deira",
    name: { en: "Lepas Deira Showroom", ar: "صالة عرض ليباس ديرة" },
    address: { en: "Port Saeed, Deira, Dubai", ar: "بور سعيد، ديرة، دبي" },
  },
  {
    id: "sharjah",
    name: { en: "Lepas Sharjah Showroom", ar: "صالة عرض ليباس الشارقة" },
    address: { en: "Al Ruqa Al Hamra, Sharjah", ar: "الرقة الحمراء، الشارقة" },
  },
  {
    id: "al-quoz",
    name: { en: "Lepas Al Quoz After-Sales Facility", ar: "مركز ليباس لخدمات ما بعد البيع في القوز" },
    address: { en: "Al Quoz Industrial Area 4, Dubai", ar: "منطقة القوز الصناعية 4، دبي" },
  },
  {
    id: "abu-dhabi",
    name: { en: "Lepas Abu Dhabi Showroom", ar: "صالة عرض ليباس أبوظبي" },
    address: { en: "Abu Dhabi, UAE (opening soon)", ar: "أبوظبي، الإمارات (قريبًا)" },
    comingSoon: true,
  },
];

export function locationOptions(locale: Locale, noPreferenceLabel: string, comingSoonLabel: string) {
  return [
    ...LEPAS_LOCATIONS.map((l) => ({
      value: l.id,
      label: l.name[locale],
      description: l.address[locale],
      badge: l.comingSoon ? comingSoonLabel : undefined,
      disabled: l.comingSoon,
    })),
    { value: NO_PREFERENCE, label: noPreferenceLabel },
  ];
}
