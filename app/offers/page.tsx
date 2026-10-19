import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { offerMeta } from "@/components/forms/offerMeta";
import { getServerDictionary } from "@/lib/i18n/server";
import { getOffers } from "@/lib/i18n/data";

export const metadata: Metadata = {
  title: "Offers",
  description: "Monthly offers on the Lepas L4, L8 and L8 Super Hybrid, with free insurance, roadside assistance and the full Lepas warranty.",
};

export default function OffersPage() {
  const { locale, dict } = getServerDictionary();
  const offers = getOffers(locale);
  const t = dict.lepasUi;

  return (
    <>
      <section className="bg-lepas-black pb-16 pt-36 text-white md:pb-20 md:pt-44">
        <div className="container-lepas">
          <h1 className="heading-display text-4xl md:text-6xl">{dict.offers.title}</h1>
          <p className="mt-5 max-w-2xl text-base text-white/70 md:text-lg">{dict.offers.description}</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => {
            const meta = offerMeta[offer.slug];
            return (
              <Card key={offer.slug}>
                <Link href={`/offers/${offer.slug}`} className="block">
                  {offer.image ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={offer.image}
                        alt={offer.imageLabel}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <PlaceholderImage label={offer.imageLabel} aspect="aspect-[4/3]" tone="accent" />
                  )}
                </Link>
                <div className="p-6">
                  {meta && (
                    <p className="text-sm font-semibold text-lepas-ink">
                      {meta.model[locale]}{" "}
                      <span className="font-normal text-lepas-steel">
                        {t.from} AED <span className="font-bold text-lepas-amber">{meta.monthly}</span> {t.perMonth}
                      </span>
                    </p>
                  )}
                  <h2 className="heading-display mt-3 text-xl">
                    <Link href={`/offers/${offer.slug}`}>{offer.title}</Link>
                  </h2>
                  <p className="mt-2 text-sm text-lepas-steel">{offer.shortDescription}</p>
                  <Link href={`/offers/${offer.slug}`} className="btn-outline mt-6">
                    {t.viewOffer}
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
        <p className="mt-10 text-xs text-lepas-ash">{t.termsApply}</p>
      </Section>
    </>
  );
}
