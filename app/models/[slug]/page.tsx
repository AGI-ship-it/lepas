import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import modelsData from "@/data/models.json";
import { VehicleModel } from "@/lib/types";
import Image from "next/image";
import Section from "@/components/ui/Section";
import CallbackForm from "@/components/forms/CallbackForm";
import ModelHero from "@/components/models/ModelHero";
import StatsBar from "@/components/models/StatsBar";
import HotspotFeature from "@/components/models/HotspotFeature";
import CabinTabs from "@/components/models/CabinTabs";
import UtilitySpecs from "@/components/models/UtilitySpecs";
import SpecsTable from "@/components/models/SpecsTable";
import ColourSwatches from "@/components/models/ColourSwatches";
import AccessoriesGrid from "@/components/models/AccessoriesGrid";
import NumberedSlider from "@/components/models/NumberedSlider";
import { getServerDictionary } from "@/lib/i18n/server";
import { getModels } from "@/lib/i18n/data";

const modelsEn = modelsData as VehicleModel[];

const modelAssets: Record<string, { safety: string; lifestyle: string; brochure?: string }> = {
  l8: {
    safety: "/design/assets/safety/l8/cutaway.webp",
    lifestyle: "/design/assets/lifestyle/l8-drive.webp",
    brochure: "https://www.lepasuae.com/brochures/lepas-l8-ice.pdf",
  },
  l6: {
    safety: "/design/assets/safety/l6/topdown.webp",
    lifestyle: "/design/assets/lifestyle/l6.webp",
  },
  l4: {
    safety: "/design/assets/safety/l4/cutaway.webp",
    lifestyle: "/design/assets/lifestyle/l4-drive.webp",
    brochure: "/brochures/lepas-l4.pdf",
  },
};

const seoTitles: Record<string, string> = {
  l8: "Lepas L8 | Premium Smart SUV with Refined Space",
  l6: "Lepas L6 | Dynamic Smart SUV with Turbo Power",
  l4: "Lepas L4 | Compact Smart SUV for City Drives in UAE",
};

export function generateStaticParams() {
  return modelsEn.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const model = modelsEn.find((m) => m.slug === params.slug);
  if (!model) return {};
  return {
    title: { absolute: seoTitles[model.slug] ?? `${model.name} | Lepas UAE` },
    description: model.shortDescription,
  };
}

export default function ModelDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { locale, dict } = getServerDictionary();
  const model = getModels(locale).find((m) => m.slug === params.slug);
  if (!model) notFound();

  const d = model.detailPage;
  const assets = modelAssets[model.slug];

  return (
    <>
      {/* Hero */}
      <ModelHero model={model} dict={dict} />

      {/* Colours */}
      <Section eyebrow={dict.models.customize} title={dict.models.availableColours}>
        <ColourSwatches
          exteriorColours={model.colours}
          interiorColours={model.interiorColours}
          modelName={model.name}
        />
      </Section>

      {/* Stats */}
      <StatsBar eyebrow={d.statsEyebrow} stats={d.stats} />

      {/* Interactive exterior highlights */}
      <div className="container-lepas flex flex-wrap items-end justify-between gap-6 pt-16">
        <div>
          <h2 className="heading-display text-3xl md:text-5xl">{d.highlightsTitle}</h2>
        </div>
        {assets?.brochure && (
          <a href={assets.brochure} target="_blank" rel="noopener noreferrer" className="btn-outline shrink-0">
            {dict.common.downloadBrochure}
          </a>
        )}
      </div>
      <div className="mt-8">
        <HotspotFeature
          image={assets?.safety}
          imageLabel={d.exteriorImageLabel}
          features={d.highlights}
        />
      </div>

      {/* Exterior features */}
      {d.terrainItems && d.terrainItems.length > 0 && (
        <Section>
          <NumberedSlider eyebrow={d.terrainEyebrow ?? ""} items={d.terrainItems} />
        </Section>
      )}

      {/* Additional safety highlights */}
      {d.designGallery.length > 0 && (
        <Section>
          <NumberedSlider
            badge={d.designEyebrow}
            eyebrow={d.designTitle}
            items={d.designGallery.map((slide) => ({
              title: slide.heading,
              body: slide.body,
              imageLabel: slide.imageLabel,
              image: (slide as typeof slide & { image?: string }).image,
            }))}
          />
        </Section>
      )}

      {/* Performance */}
      {d.exteriorItems && d.exteriorItems.length > 0 && (
        <Section>
          <NumberedSlider eyebrow={d.exteriorEyebrow ?? ""} items={d.exteriorItems} />
        </Section>
      )}

      {/* Interior highlights */}
      {d.interiorItems && d.interiorItems.length > 0 && (
        <Section>
          <NumberedSlider eyebrow={d.interiorEyebrow ?? ""} items={d.interiorItems} />
        </Section>
      )}

      {/* Cabin */}
      <Section
        light={false}
        eyebrow={d.cabinEyebrow}
        title={d.cabinTitle}
        description={d.cabinIntro}
      >
        <CabinTabs tabs={d.cabinTabs} />
      </Section>

      {/* Ownership & warranty */}
      <Section light={false} eyebrow={dict.models.details} title={d.utilityTitle} description={d.utilityIntro} className="pt-0">
        <UtilitySpecs specs={d.utilitySpecs} />
      </Section>

      {/* Full specifications (The Numbers) */}
      <Section id="specifications" eyebrow={dict.models.specifications} title={dict.models.theNumbers}>
        <SpecsTable groups={model.specs} />
      </Section>

      {/* Accessories */}
      <Section eyebrow={dict.models.details} title={d.accessoriesTitle}>
        <AccessoriesGrid
          accessories={d.accessories}
          accessoriesTabLabel={dict.models.features}
          factoryOptionalEquipment={d.factoryOptionalEquipment}
          factoryOptionalEquipmentTabLabel={d.factoryOptionalEquipmentTitle}
        />
      </Section>

      <Section id="callback" light={false} title={dict.lepasUi.requestCallback}>
        <CallbackForm defaultModel={model.slug} />
      </Section>

      {/* Final CTA over the lifestyle image */}
      <section className="relative overflow-hidden bg-lepas-black py-28 text-center text-white md:py-40">
        {assets?.lifestyle && (
          <Image src={assets.lifestyle} alt={d.chargingImageLabel} fill sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="container-lepas relative">
          <h2 className="heading-display !text-center text-3xl md:text-5xl">{d.chargingLabel}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">
            {locale === "ar" ? `جاهز لتجربة ${model.name}؟` : `Ready to experience the ${model.name}?`}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="#callback" className="btn-primary">
              {dict.common.bookTestDrive}
            </Link>
            <Link
              href={`/models/finance-calculator?model=${model.slug}`}
              className="btn-outline-light"
            >
              {dict.nav.calculateFinance}
            </Link>
            <Link href="/models/compare" className="btn-outline-light">
              {dict.nav.compareModels}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
