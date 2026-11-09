import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import offersData from "@/data/offers.json";
import { Offer } from "@/lib/types";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Breadcrumb from "@/components/ui/Breadcrumb";
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
      <header className="container-lepas pt-28 md:pt-32">
        <Breadcrumb
          light
          className="mb-6"
          items={[
            { label: dict.testDriveFlow.home, href: "/" },
            { label: dict.offers.title, href: "/offers" },
            { label: meta?.model[locale] ?? offer.title },
          ]}
        />
        <div className="mt-8 overflow-hidden rounded-[17px] bg-lepas-black">
          {offer.image ? (
            <Image
              src={offer.image}
              alt={offer.imageLabel}
              width={1728}
              height={970}
              priority
              sizes="(min-width: 1536px) 1488px, 100vw"
              className="aspect-[1728/970] w-full object-cover"
            />
          ) : (
            <PlaceholderImage label={offer.imageLabel} aspect="aspect-[1728/970]" tone="accent" />
          )}
        </div>
      </header>

      <section className="container-lepas pb-16 text-lepas-black md:pb-24">
        {meta && (
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="border border-lepas-amber px-2.5 py-1.5 text-xs leading-none">{meta.model[locale]}</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-sm font-medium uppercase leading-none">{t.from}</span>
              <span className="sr-only">AED</span>
              <span
                aria-hidden="true"
                className="inline-block size-[17px] shrink-0 bg-lepas-black"
                style={{
                  maskImage: "url('/svg/package-aed-symbol.svg')",
                  WebkitMaskImage: "url('/svg/package-aed-symbol.svg')",
                  maskSize: "100% 100%",
                  WebkitMaskSize: "100% 100%",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                }}
              />
              <span className="text-[22px] font-bold leading-none">{meta.monthly}</span>
              <span className="text-sm leading-none">{t.perMonth}</span>
            </span>
          </div>
        )}
        <h1 className="heading-1 mt-6 max-w-[980px]">{offer.title}</h1>
        <p className="mt-2 max-w-4xl text-lg leading-[1.45]">{offer.description}</p>
        <ul className="mt-8 grid max-w-[980px] gap-x-10 gap-y-4 sm:grid-cols-2">
          {offer.terms.map((term) => (
            <li key={term} className="flex items-start gap-3.5 text-base leading-[1.51]">
              <span aria-hidden="true" className="mt-[11px] h-0.5 w-3.5 shrink-0 bg-lepas-amber" />
              {term}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href="#callback" className="btn-primary">
            {t.requestCallback}
          </a>
          {meta && (
            <Link
              href={meta.modelHref}
              className="btn-outline"
            >
              {t.explore.replace("{model}", meta.modelShort)}
            </Link>
          )}
        </div>
      </section>

      <section id="callback" className="scroll-mt-24 bg-lepas-form-ink py-16 text-white md:py-24">
        <div className="container-lepas max-w-4xl">
          <h2 className="heading-2 mb-8 md:mb-10">{t.callbackHeading}</h2>
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
                          {t.from} AED <span className="font-bold text-lepas-black">{m.monthly}</span> {t.perMonth}
                        </span>
                      </p>
                    )}
                    <h3 className="heading-3 mt-3">{o.title}</h3>
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
