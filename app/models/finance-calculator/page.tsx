import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import FinanceCalculator from "@/components/finance/FinanceCalculator";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Finance Calculator",
  description: "Estimate your monthly payments for any Lepas model.",
};

export default function FinanceCalculatorPage() {
  const { dict } = getServerDictionary();

  return (
    <>
      <PageHero
        eyebrow={dict.finance.eyebrow}
        title={dict.finance.title}
        description={dict.finance.description}
        imageLabel="Lepas finance"
        backHref="/models"
        backLabel={dict.common.backToModels}
      />
      <Section>
        <Suspense>
          <FinanceCalculator />
        </Suspense>
      </Section>
    </>
  );
}
