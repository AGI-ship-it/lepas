import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import offersData from "@/data/offers.json";
import { Offer } from "@/lib/types";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import OfferBanner from "@/components/offers/OfferBanner";
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
      <OfferBanner
        offer={offer}
        meta={meta}
        modelName={meta?.model[locale]}
        labels={dict.home.heroOffers}
        priority
        fullHeight
        before={
          <Link
            href="/offers"
            className="mb-8 inline-flex items-center gap-3 text-sm text-white/80 hover:text-lepas-amber"
          >
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-lepas-amber text-xs text-lepas-amber rtl:rotate-180"
            >
              ←
            </span>
            {t.allOffers}
          </Link>
        }
        actions={
          <>
            <a href="#callback" className="btn-primary">
              {t.requestCallback}
            </a>
            {meta && (
              <Link href={meta.modelHref} className="btn-outline-light">
                {t.explore.replace("{model}", meta.modelShort)}
              </Link>
            )}
          </>
        }
      />

      <section className="bg-white py-16 text-lepas-black md:py-24">
        <div className="container-lepas">
          <h1 className="heading-display text-3xl md:text-5xl">{offer.title}</h1>
          <p className="mt-6 max-w-3xl text-lg">{offer.description}</p>
          <ul className="mt-10 grid max-w-4xl gap-x-12 gap-y-4 sm:grid-cols-2">
            {offer.terms.map((term) => (
              <li key={term} className="flex gap-4 text-base">
                <span aria-hidden="true" className="mt-3 h-0.5 w-4 shrink-0 bg-lepas-amber" />
                {term}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-lepas-steel">{t.termsApply}</p>
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => {
              const m = offerMeta[o.slug];
              return (
                <Card key={o.slug} className="flex flex-col">
                  <Link href={`/offers/${o.slug}`} className="block">
                    <div className="relative aspect-[1728/970] w-full overflow-hidden">
                      {o.image ? (
                        <Image src={o.image} alt={o.imageLabel} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                      ) : (
                        <PlaceholderImage label={o.imageLabel} aspect="aspect-[1728/970]" />
                      )}
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col items-start p-6">
                    {m && (
                      <p className="text-sm font-semibold text-lepas-ink">
                        {m.model[locale]}{" "}
                        <span className="font-normal text-lepas-steel">
                          {t.from} AED <span className="font-bold text-lepas-amber">{m.monthly}</span> {t.perMonth}
                        </span>
                      </p>
                    )}
                    <h3 className="heading-display mt-3 text-xl">{o.title}</h3>
                    <p className="mb-6 mt-2 text-sm text-lepas-steel">{o.shortDescription}</p>
                    <Link href={`/offers/${o.slug}`} className="btn-outline mt-auto">
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
