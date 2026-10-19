export interface OfferMeta {
  model: { en: string; ar: string };
  monthly: string;
  modelHref: string;
  modelShort: string;
}

export const offerMeta: Record<string, OfferMeta> = {
  l4: { model: { en: "Lepas L4", ar: "ليباس L4" }, monthly: "1,135", modelHref: "/models/l4", modelShort: "L4" },
  l8: { model: { en: "Lepas L8", ar: "ليباس L8" }, monthly: "1,533", modelHref: "/models/l8", modelShort: "L8" },
  "l8-super-hybrid": {
    model: { en: "Lepas L8 Super Hybrid", ar: "ليباس L8 سوبر هايبرد" },
    monthly: "1,886",
    modelHref: "/models/l8",
    modelShort: "L8 Super Hybrid",
  },
};
