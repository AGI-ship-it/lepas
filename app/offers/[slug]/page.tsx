import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import offersData from "@/data/offers.json";
import { Offer } from "@/lib/types";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import CallbackForm from "@/components/forms/CallbackForm";
import { offerMeta } from "@/components/forms/offerMeta";
import { getServerDictionary } from "@/lib/i18n/server";
import { getOffers } from "@/lib/i18n/data";

const offersEn = offersData as Offer[];

export function generateStaticParams() {
  return offersEn.map((o) => ({ slug: o.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const offer = offersEn.find((o) => o.slug === params.slug);
  if (!offer) return {};
  const meta = offerMeta[offer.slug];
  return { title: meta ? `${meta.model.en} Offer` : offer.title, description: offer.shortDescription };
}

export default function OfferDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { locale, dict } = getServerDictionary();
  const offers = getOffers(locale);
  const offer = offers.find((o) => o.slug === params.slug);
  if (!offer) notFound();

  const t = dict.lepasUi;
  const meta = offerMeta[offer.slug];
  const others = offers.filter((o) => o.slug !== offer.slug);

  return (
    <>
      <section className="bg-lepas-black pb-16 pt-32 text-white md:pb-24 md:pt-40">
        <div className="container-lepas">
          <Link
            href="/offers"
            className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-white/70 hover:text-white"
          >
            <span aria-hidden="true" className="rtl:rotate-180">←</span>
            {t.allOffers}
          </Link>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              {offer.image ? (
                <Image src={offer.image} alt={offer.imageLabel} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              ) : (
                <PlaceholderImage label={offer.imageLabel} aspect="aspect-[4/3]" />
              )}
            </div>
            <div>
              {meta && (
                <p className="text-sm text-white/70">
                  <span className="font-semibold text-white">{meta.model[locale]}</span> {t.from} AED{" "}
                  <span className="font-bold text-lepas-amber">{meta.monthly}</span> {t.perMonth}
                </p>
              )}
              <h1 className="heading-display mt-4 text-3xl md:text-5xl">{offer.title}</h1>
              <p className="mt-5 text-white/70">{offer.description}</p>
              <ul className="mt-8 space-y-3">
                {offer.terms.map((term) => (
                  <li key={term} className="flex gap-3 text-sm text-white/80">
                    <span aria-hidden="true" className="text-lepas-amber">✓</span>
                    {term}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-white/50">{t.termsApply}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#callback" className="btn-primary">
                  {t.requestCallback}
                </a>
                {meta && (
                  <Link href={meta.modelHref} className="btn-outline-light">
                    {t.explore.replace("{model}", meta.modelShort)}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="callback" className="scroll-mt-24 bg-lepas-form-ink py-20 text-white md:py-28">
        <div className="container-lepas max-w-4xl">
          <h2 className="heading-display mb-10 text-3xl md:text-5xl">{t.requestCallback}</h2>
          <CallbackForm defaultModel={meta ? meta.modelHref.split("/").pop() : ""} />
        </div>
      </section>

      {others.length > 0 && (
        <Section title={t.moreOffers}>
          <div className="grid gap-8 md:grid-cols-2">
            {others.map((o) => {
              const m = offerMeta[o.slug];
              return (
                <Card key={o.slug}>
                  <Link href={`/offers/${o.slug}`} className="block">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      {o.image ? (
                        <Image src={o.image} alt={o.imageLabel} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                      ) : (
                        <PlaceholderImage label={o.imageLabel} aspect="aspect-[4/3]" />
                      )}
                    </div>
                  </Link>
                  <div className="p-6">
                    {m && (
                      <p className="text-sm font-semibold text-lepas-ink">
                        {m.model[locale]}{" "}
                        <span className="font-normal text-lepas-steel">
                          {t.from} AED <span className="font-bold text-lepas-amber">{m.monthly}</span> {t.perMonth}
                        </span>
                      </p>
                    )}
                    <h3 className="heading-display mt-3 text-xl">{o.title}</h3>
                    <p className="mt-2 text-sm text-lepas-steel">{o.shortDescription}</p>
                    <Link href={`/offers/${o.slug}`} className="btn-outline mt-6">
                      {t.viewOffer}
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </Section>
      )}
    </>
  );
}
