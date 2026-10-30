import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import VariantPills from "@/components/models/VariantPills";
import { getServerDictionary } from "@/lib/i18n/server";
import { getModels } from "@/lib/i18n/data";
import { monthlyFromLabel } from "@/components/models/pricing";

export const metadata: Metadata = {
  title: "Models",
  description: "Explore the Lepas L8, L6 and L4 smart SUVs in the UAE.",
};

export default function ModelsOverviewPage() {
  const { locale, dict } = getServerDictionary();
  const models = getModels(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.models.eyebrow}
        title={dict.models.listingTitle}
        imageLabel="The Lepas L6, L8 and L4 smart SUVs lined up at sunset"
        image="/design/assets/home/hero-lineup.webp"
        breadcrumb={[{ label: dict.testDriveFlow.home, href: "/" }, { label: dict.site.nav.ourModels }]}
      />
      <Section
        light={false}
        eyebrow={dict.home.rangeEyebrow}
        title={dict.home.rangeTitle}
        description={dict.home.rangeDescription}
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <Link
              key={model.slug}
              href={`/models/${model.slug}`}
              className="group relative block aspect-square overflow-hidden border border-white/10"
            >
              {model.heroImage ? (
                <Image
                  src={model.heroImage}
                  alt={model.heroImageLabel}
                  fill
                  className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                />
              ) : (
                <PlaceholderImage
                  label={model.heroImageLabel}
                  aspect="aspect-square"
                  className="transition-transform duration-700 ease-premium group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="heading-display text-xl text-white">{model.name}</h3>
                <p className="mt-1 text-sm text-white/70">{model.tagline}</p>
                <VariantPills powertrains={model.detailPage.powertrains} className="mt-3" />
                {monthlyFromLabel(model.slug, model.currency, dict) && (
                  <p className="mt-2 text-sm text-white/70">
                    {dict.common.startingFrom}{" "}
                    <span className="font-semibold text-lepas-amber">
                      {monthlyFromLabel(model.slug, model.currency, dict)}
                    </span>
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
