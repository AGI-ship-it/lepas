import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import TabbedPolicy from "@/components/legal/TabbedPolicy";
import { cookiePolicy } from "@/data/cookie-policy";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Al Ghurair uses cookies across the Lepas UAE website.",
};

export default function CookiesPolicyPage() {
  const { locale, dict } = getServerDictionary();
  const policy = cookiePolicy[locale];

  return (
    <>
      <PageHero
        eyebrow={dict.legal.eyebrow}
        title={dict.legal.cookies}
        imageLabel="Lepas legal"
        breadcrumb={[{ label: dict.testDriveFlow.home, href: "/" }, { label: dict.legal.cookies }]}
      />
      <Section>
        <TabbedPolicy
          introTitle={policy.introTitle}
          introBlocks={policy.intro}
          sections={policy.sections}
          contentsLabel={locale === "ar" ? "المحتويات" : "Table of Contents"}
        />
      </Section>
    </>
  );
}
