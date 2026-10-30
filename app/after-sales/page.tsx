import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
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
        image="/design/assets/services/hero-clean.webp"
        breadcrumb={[{ label: dict.testDriveFlow.home, href: "/" }, { label: dict.site.nav.services }]}
        aside={
          <a
            href="tel:6005462005"
            className="group block border-s-2 border-lepas-amber bg-black/50 px-5 py-4 backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            <span className="block text-sm text-white/85 md:text-base">{t.roadsidePrefix}</span>
            <span className="mt-1 block text-2xl font-bold text-lepas-amber md:text-3xl" dir="ltr">
              {t.roadsideNumber}
            </span>
          </a>
        }
      />

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

      <Section id="roadside-assistance" className="scroll-mt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="heading-display !text-center text-3xl md:text-5xl">{t.title}</h2>
          <p className="mt-6 text-lg text-lepas-steel">{t.intro}</p>
          <p className="mt-6 text-lepas-ink">
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
      </Section>

      <section
        id="warranty"
        className="relative flex min-h-[520px] scroll-mt-20 flex-col overflow-hidden bg-lepas-black text-white md:min-h-[clamp(560px,40vw,720px)]"
      >
        <Image
          src="/design/assets/warranty-roadside.webp"
          alt={t.heroImageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="container-lepas relative flex flex-1 flex-col pb-14 pt-16 md:pb-24 md:pt-24">
          <h2 className="heading-display text-3xl md:text-5xl">{t.warrantyTitle}</h2>
          <dl className="mt-auto grid grid-cols-2 gap-x-6 gap-y-8 text-center md:flex md:flex-wrap md:items-end md:justify-center md:gap-x-16">
            {t.warranty.map((w) => (
              <div key={w.years} className="flex flex-col items-center gap-1 md:gap-4">
                <dt className="heading-display text-3xl md:text-5xl">{w.years}</dt>
                <dd className="text-sm text-white/80 md:text-2xl">{w.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand
        title={dict.afterSales.nextServiceTitle}
        description={dict.afterSales.nextServiceDescription}
        primary={{ label: dict.afterSales.bookService, href: "/after-sales/book-service" }}
      />

    </>
  );
}
