"use client";

import { useState } from "react";
import Link from "next/link";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function FaqsPage() {
  const { dict } = useLocale();
  const t = dict.lepasUi;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <section className="bg-lepas-black pb-16 pt-36 text-white md:pb-20 md:pt-44">
        <div className="container-lepas">
          <p className="eyebrow">{dict.faqs.eyebrow}</p>
          <h1 className="heading-display mt-4 text-4xl md:text-6xl">{t.faqHeading}</h1>
          <p className="mt-5 max-w-2xl text-base text-white/70 md:text-lg">{t.faqIntro}</p>
        </div>
      </section>
      <Section>
        <div className="mx-auto max-w-3xl divide-y divide-lepas-fog border-y border-lepas-fog">
          {dict.faqs.items.map((faq, i) => (
            <div key={faq.q}>
              <h3>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-6 py-6 text-start"
                >
                  <span className="font-semibold text-lepas-ink">{faq.q}</span>
                  <span
                    aria-hidden="true"
                    className={`text-xl text-lepas-amber transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
              </h3>
              <div hidden={open !== i}>
                <p className="pb-6 text-lepas-steel">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section light={false} className="text-center">
        <h2 className="heading-display !text-center text-3xl md:text-5xl">{t.stillHaveQuestions}</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/70">{t.stillHaveQuestionsBody}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="tel:600553727" className="btn-primary">
            {t.callLepas}
          </a>
          <Link href="/contact" className="btn-outline-light">
            {t.contactUs}
          </Link>
        </div>
      </Section>
    </>
  );
}
