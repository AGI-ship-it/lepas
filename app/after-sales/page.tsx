import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import FeaturedNews from "@/components/home/FeaturedNews";
import CtaBand from "@/components/ui/CtaBand";
import { getServerDictionary } from "@/lib/i18n/server";
import { getServices } from "@/lib/i18n/data";

export const metadata: Metadata = {
  title: "Services",
  description: "Lepas service and support in the UAE — roadside assistance, warranty and genuine parts.",
};

export default function AfterSalesPage() {
  const { locale, dict } = getServerDictionary();
  const services = getServices(locale);
  const t = dict.site.services;

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        imageLabel={t.heroImageAlt}
        image="/design/assets/services/hero.webp"
      />

      <Section id="roadside-assistance" className="scroll-mt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="heading-display mt-4 text-3xl md:text-5xl">{t.title}</h2>
            <p className="mt-6 text-lg text-lepas-steel">{t.intro}</p>
            <p className="mt-6 text-lg text-lepas-ink">
              {t.roadsidePrefix}{" "}
              <a href="tel:6005462005" className="font-semibold text-lepas-amber hover:underline" dir="ltr">
                {t.roadsideNumber}
              </a>
              .
            </p>
            <Link href="/after-sales/book-service" className="btn-primary mt-8">
              {t.bookYourService}
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/design/assets/warranty-roadside.webp"
              alt={t.heroImageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section id="warranty" light={false} title={t.warrantyTitle} className="scroll-mt-20">
        <dl className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
          {t.warranty.map((w) => (
            <div key={w.years} className="bg-lepas-black p-8">
              <dt className="heading-display text-4xl text-lepas-amber md:text-5xl">{w.years}</dt>
              <dd className="mt-3 text-white/80">{w.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.id}>
              <PlaceholderImage label={service.imageLabel} aspect="aspect-[4/3]" />
              <div className="p-6">
                <h3 className="text-base font-bold text-lepas-ink">{service.title}</h3>
                <p className="mt-2 text-sm text-lepas-steel">{service.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <CtaBand
        title={dict.afterSales.nextServiceTitle}
        description={dict.afterSales.nextServiceDescription}
        primary={{ label: dict.afterSales.bookService, href: "/after-sales/book-service" }}
      />

      <FeaturedNews />
    </>
  );
}
