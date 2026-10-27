import { notFound } from "next/navigation";
import type { Metadata } from "next";
import modelsData from "@/data/models.json";
import { VehicleModel } from "@/lib/types";
import Image from "next/image";
import Section from "@/components/ui/Section";
import CallbackForm from "@/components/forms/CallbackForm";
import ModelHero from "@/components/models/ModelHero";
import HotspotFeature from "@/components/models/HotspotFeature";
import InteriorCarousel from "@/components/models/InteriorCarousel";
import FeatureShowcase from "@/components/models/FeatureShowcase";
import ModelSectionNav from "@/components/models/ModelSectionNav";
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

  const nav = dict.models.sectionNav;
  const hasExterior = !!d.terrainItems?.length;
  const hasPerformance = !!d.exteriorItems?.length;
  const navLinks = [
    { id: "shade", label: nav.shade },
    ...(hasExterior ? [{ id: "exterior", label: nav.exterior }] : []),
    { id: "interior", label: nav.interior },
    ...(hasPerformance ? [{ id: "performance", label: nav.performance }] : []),
    { id: "safety", label: nav.safety },
    ...(assets?.lifestyle ? [{ id: "drive", label: nav.drive }] : []),
    { id: "callback", label: nav.callback },
  ];

  // Section order follows lepasuae.com/l8; specs, warranty and accessories sit after Drive.
  return (
    <>
      <ModelHero model={model} dict={dict} brochure={assets?.brochure} />

      <ModelSectionNav label={nav.label} links={navLinks} />

      <ColourSwatches
        id="shade"
        title={dict.models.availableColours}
        colours={model.colours}
        modelName={model.name}
      />

      {hasExterior && (
        <FeatureShowcase
          id="exterior"
          title={d.terrainEyebrow ?? nav.exterior}
          items={d.terrainItems!}
          iconDir="/svg/exterior"
          variant="headline"
        />
      )}

      <InteriorCarousel title={d.cabinTitle} tabs={d.cabinTabs} />

      {hasPerformance && (
        <FeatureShowcase
          id="performance"
          title={d.exteriorEyebrow ?? nav.performance}
          items={d.exteriorItems!}
          iconDir="/svg/performance"
        />
      )}

      <HotspotFeature
        id="safety"
        title={d.highlightsTitle}
        image={assets?.safety}
        imageLabel={d.exteriorImageLabel}
        features={d.highlights}
      />

      {assets?.lifestyle && (
        <section id="drive" aria-label={nav.drive} className="relative aspect-[1728/811] w-full scroll-mt-36 bg-lepas-black">
          <Image src={assets.lifestyle} alt={d.chargingImageLabel} fill sizes="100vw" className="object-cover" />
        </section>
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

      {/* Ownership & warranty */}
      <Section light={false} eyebrow={dict.models.details} title={d.utilityTitle} description={d.utilityIntro}>
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

      <Section id="callback" light={false} title={dict.lepasUi.requestCallback} className="scroll-mt-36">
        <CallbackForm defaultModel={model.slug} />
      </Section>
    </>
  );
}
