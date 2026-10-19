import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import CompareDragDrop from "@/components/models/CompareDragDrop";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Compare Models",
  description: "Compare the Lepas L8, L6 and L4 smart SUVs side by side.",
};

export default function ComparePage() {
  const { dict } = getServerDictionary();

  return (
    <>
      <PageHero
        eyebrow={dict.models.eyebrow}
        title={dict.models.compareTitle}
        description={dict.models.compareDescription}
        imageLabel="The Lepas smart SUV range lined up side by side in a studio"
        image="/design/assets/journey-3cars.webp"
        backHref="/models"
        backLabel={dict.common.backToModels}
      />
      <Section>
        <CompareDragDrop />
      </Section>
    </>
  );
}
