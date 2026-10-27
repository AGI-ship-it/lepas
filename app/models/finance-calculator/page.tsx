import type { Metadata } from "next";
import { Suspense } from "react";
import SimpleHero from "@/components/ui/SimpleHero";
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
      <SimpleHero
        title={dict.finance.heroTitle}
        description={dict.finance.heroDescription}
        breadcrumb={[
          { label: dict.testDriveFlow.home, href: "/" },
          { label: dict.site.nav.ourModels, href: "/models" },
          { label: dict.nav.financeCalculator },
        ]}
      />
      <Section>
        <Suspense>
          <FinanceCalculator />
        </Suspense>
      </Section>
    </>
  );
}
