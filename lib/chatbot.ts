import { VehicleModel, Offer } from "@/lib/types";
import { Locale } from "@/lib/i18n";
import { formatCurrency } from "@/lib/financeMath";

export interface FaqItem {
  q: string;
  a: string;
}

export interface BotContext {
  locale: Locale;
  models: VehicleModel[];
  offers: Offer[];
  faqs: FaqItem[];
}

export interface BotReply {
  text: string;
  quickReplies: string[];
}

const DEFAULT_QUICK_REPLIES_EN = [
  "Lepas L8 specs",
  "Current offers",
  "Book a Test Drive",
  "Compare models",
];
const DEFAULT_QUICK_REPLIES_AR = [
  "مواصفات ليباس L8",
  "العروض الحالية",
  "احجز تجربة قيادة",
  "قارن الموديلات",
];

function findSpecValue(model: VehicleModel, labelPattern: RegExp): string | undefined {
  for (const group of model.specs) {
    for (const item of group.items) {
      if (labelPattern.test(item.label)) return item.value;
    }
  }
  return undefined;
}

function findModel(models: VehicleModel[], t: string): VehicleModel | undefined {
  if (/\bl\s?4\b/.test(t)) return models.find((m) => m.slug === "l4");
  if (/\bl\s?6\b/.test(t)) return models.find((m) => m.slug === "l6");
  if (/\bl\s?8\b|super hybrid|phev/.test(t)) return models.find((m) => m.slug === "l8");
  return undefined;
}

function scoreFaqMatch(question: string, t: string): number {
  const words = t.split(/\s+/).filter((w) => w.length > 3);
  const qLower = question.toLowerCase();
  let score = 0;
  for (const w of words) {
    if (qLower.includes(w)) score += 1;
  }
  return score;
}

function modelSummary(model: VehicleModel, locale: Locale): string {
  const engine = findSpecValue(model, /engine|^المحرك$/i);
  const power = findSpecValue(model, /power|^القوة \/ عزم/i);
  const price = formatCurrency(model.startingPrice, model.currency);
  if (locale === "ar") {
    return `${model.name} — ${model.tagline}. يبدأ السعر من ${price}${engine ? `، بمحرك ${engine}` : ""}${power ? `، وقوة/عزم ${power}` : ""}.`;
  }
  return `${model.name} — ${model.tagline}. Starting from ${price}${engine ? `, ${engine} engine` : ""}${power ? `, ${power}` : ""}.`;
}

export function getBotReply(rawText: string, ctx: BotContext): BotReply {
  const { locale, models, offers, faqs } = ctx;
  const t = rawText.trim().toLowerCase();
  const isAr = locale === "ar";
  const defaultQuick = isAr ? DEFAULT_QUICK_REPLIES_AR : DEFAULT_QUICK_REPLIES_EN;

  if (!t) {
    return {
      text: isAr ? "هل يمكنك كتابة سؤالك؟" : "Could you type your question?",
      quickReplies: defaultQuick,
    };
  }

  // Greeting
  if (/^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(t) || /(مرحبا|أهلا|السلام عليكم|صباح الخير|مساء الخير)/.test(rawText)) {
    return {
      text: isAr
        ? "أهلاً بك! يمكنني مساعدتك بمعلومات عن موديلات ليباس L4 وL6 وL8، العروض الحالية، المعارض، أو حجز تجربة قيادة. عن أي شيء تود أن تسأل؟"
        : "Hey there! I can help with the Lepas L4, L6 and L8, current offers, showroom locations, or booking a test drive. What would you like to know?",
      quickReplies: defaultQuick,
    };
  }

  // Thanks
  if (/^(thanks|thank you|thx|cheers)\b/.test(t) || /(شكرا|شكرًا)/.test(rawText)) {
    return {
      text: isAr ? "على الرحب والسعة! هل هناك شيء آخر يمكنني مساعدتك به؟" : "You're welcome! Anything else I can help with?",
      quickReplies: defaultQuick,
    };
  }

  const mentionedModel = findModel(models, t);

  // Price / cost
  if (/\b(price|cost|how much|starting from)\b/.test(t) || /(سعر|كم يبلغ|كم سعر|تكلفة)/.test(rawText)) {
    if (mentionedModel) {
      return {
        text: modelSummary(mentionedModel, locale),
        quickReplies: isAr
          ? ["احسب التمويل", "قارن الموديلات", "احجز تجربة قيادة"]
          : ["Calculate finance", "Compare models", "Book a Test Drive"],
      };
    }
    const lines = models
      .map((m) => `• ${m.name}: ${formatCurrency(m.startingPrice, m.currency)}`)
      .join("\n");
    return {
      text: isAr
        ? `إليك أسعار الفئة الكاملة:\n${lines}`
        : `Here's pricing across the range:\n${lines}`,
      quickReplies: defaultQuick,
    };
  }

  // Specs: engine / transmission / power / torque / wheelbase
  if (/\b(spec|specs|engine|transmission|power|horsepower|hp|torque|wheelbase)\b/.test(t) || /(مواصفات|محرك|ناقل|قوة|حصان|عزم)/.test(rawText)) {
    const model = mentionedModel ?? models[0];
    const engine = findSpecValue(model, /engine|^المحرك$/i);
    const transmission = findSpecValue(model, /^transmission$|^ناقل الحركة$/i);
    const power = findSpecValue(model, /power|torque|^القوة \/ عزم/i);
    const wheelbase = findSpecValue(model, /wheelbase|قاعدة العجلات/i);
    return {
      text: isAr
        ? `${model.name}: محرك ${engine ?? "-"}، ناقل حركة ${transmission ?? "-"}، القوة/العزم ${power ?? "-"}، قاعدة العجلات ${wheelbase ?? "-"}.`
        : `${model.name}: ${engine ?? "-"} engine, ${transmission ?? "-"} transmission, ${power ?? "-"} max. power/torque, ${wheelbase ?? "-"} wheelbase.`,
      quickReplies: isAr ? ["الضمان", "العروض الحالية", "قارن الموديلات"] : ["Warranty", "Current offers", "Compare models"],
    };
  }

  // Warranty / roadside assistance / battery
  if (/\b(warranty|roadside|rsa|battery|breakdown)\b/.test(t) || /(ضمان|المساعدة على الطريق|بطارية)/.test(rawText)) {
    return {
      text: isAr
        ? "ضمان المحرك 10 سنوات / 1,000,000 كم، وضمان السيارة 7 سنوات / 200,000 كم، وضمان بطارية الهجين القابل للشحن 8 سنوات / 160,000 كم. للمساعدة على الطريق اتصل على 600 5462005."
        : "Lepas comes with a 10-year / 1,000,000 km engine warranty, a 7-year / 200,000 km vehicle warranty and an 8-year / 160,000 km PHEV battery warranty. For roadside assistance, call 600 5462005.",
      quickReplies: defaultQuick,
    };
  }

  // Colours
  if (/\b(colou?r|colours?|paint)\b/.test(t) || /(لون|ألوان)/.test(rawText)) {
    const model = mentionedModel ?? models[0];
    const names = model.colours.map((c) => c.name).join(", ");
    return {
      text: isAr
        ? `الألوان المتاحة لـ ${model.name}: ${names}.`
        : `${model.name} is available in: ${names}.`,
      quickReplies: isAr ? ["اطلع على المواصفات", "احجز تجربة قيادة"] : ["See full specs", "Book a Test Drive"],
    };
  }

  // Test drive / booking
  if (/\b(test drive|book|appointment|schedule)\b/.test(t) || /(تجربة قيادة|احجز|موعد)/.test(rawText)) {
    return {
      text: isAr
        ? "يسعدنا حجز تجربة قيادة لك! توجه إلى صفحة \"احجز تجربة قيادة\" أو اتصل على 6005LEPAS، واختر الموديل والموقع والوقت المناسب، وسيتولى فريقنا الباقي."
        : "I'd be glad to help you book a test drive. Head to the \"Book a Test Drive\" page or call 6005LEPAS, choose your preferred model, location and time, and our team takes care of the rest.",
      quickReplies: isAr ? ["أين المعرض؟", "أسعار الموديلات"] : ["Where's the showroom?", "Model pricing"],
    };
  }

  // Finance
  if (/\b(finance|financing|loan|installment|monthly payment|0%|down ?payment)\b/.test(t) || /(تمويل|قسط|دفعة)/.test(rawText)) {
    return {
      text: isAr
        ? "يمكنك استخدام حاسبة التمويل لدينا لتقدير القسط الشهري. تبدأ عروضنا الشهرية من 1,135 درهم لسيارة L4، و1,533 درهم لسيارة L8، و1,886 درهم لسيارة L8 سوبر هايبرد."
        : "You can use our Finance Calculator to estimate monthly payments. Monthly offers start from AED 1,135 for the L4, AED 1,533 for the L8 and AED 1,886 for the L8 Super Hybrid.",
      quickReplies: isAr ? ["افتح حاسبة التمويل", "العروض الحالية"] : ["Open finance calculator", "Current offers"],
    };
  }

  // Offers / promotions
  if (/\b(offer|promo|promotion|discount|deal)\b/.test(t) || /(عرض|عروض|خصم)/.test(rawText)) {
    if (offers.length === 0) {
      return {
        text: isAr ? "لا توجد عروض نشطة حاليًا، تابعنا لمعرفة الجديد." : "No active offers right now — check back soon.",
        quickReplies: defaultQuick,
      };
    }
    const lines = offers.map((o) => `• ${o.title}`).join("\n");
    return {
      text: isAr ? `العروض الحالية:\n${lines}` : `Here are our current offers:\n${lines}`,
      quickReplies: isAr ? ["احسب التمويل", "احجز تجربة قيادة"] : ["Calculate finance", "Book a Test Drive"],
    };
  }

  // Compare
  if (/\bcompare\b/.test(t) || /(قارن|مقارنة)/.test(rawText)) {
    return {
      text: isAr
        ? "يمكنك مقارنة موديلات ليباس L4 وL6 وL8 جنبًا إلى جنب في صفحة \"قارن الموديلات\" ضمن قائمة الموديلات."
        : "You can compare the Lepas L4, L6 and L8 side by side on the \"Compare Models\" page under the Models menu.",
      quickReplies: defaultQuick,
    };
  }

  // FAQ keyword match (warranty, service, trade-in, etc. fall through to here)
  let bestFaq: FaqItem | null = null;
  let bestScore = 0;
  for (const faq of faqs) {
    const score = scoreFaqMatch(faq.q, t);
    if (score > bestScore) {
      bestScore = score;
      bestFaq = faq;
    }
  }
  if (bestFaq && bestScore >= 2) {
    return { text: bestFaq.a, quickReplies: defaultQuick };
  }

  // Contact / location
  if (/\b(contact|phone|number|location|address|showroom|where)\b/.test(t) || /(تواصل|هاتف|عنوان|موقع|معرض)/.test(rawText)) {
    return {
      text: isAr
        ? "اتصل بنا على 6005LEPAS (600553727)، أو راسلنا عبر واتساب على 971600553727+، أو عبر البريد lepas.uae@alghurair.com. معارضنا في ديرة (بورسعيد) والشارقة (الرقة الحمراء)، ومركز ما بعد البيع في القوز الصناعية 4. للمساعدة على الطريق: 600 5462005."
        : "Call us on 6005LEPAS (600553727), WhatsApp +971 600553727 or email lepas.uae@alghurair.com. Our showrooms are in Deira (Port Saeed) and Sharjah (Al Ruqa Al Hamra), with after-sales in Al Quoz Industrial Area 4. Roadside assistance: 600 5462005.",
      quickReplies: defaultQuick,
    };
  }

  return {
    text: isAr
      ? "لست متأكدًا من إجابة دقيقة لذلك، لكن يمكنني مساعدتك بمعلومات عن الموديلات، الأسعار، العروض، أو حجز تجربة قيادة. أو تواصل مع فريقنا مباشرة عبر صفحة اتصل بنا."
      : "I don't have a precise answer for that, but I can help with model info, pricing, offers, or booking a test drive — or reach our team directly via the Contact Us page.",
    quickReplies: defaultQuick,
  };
}
