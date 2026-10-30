import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import TabbedPolicy from "@/components/legal/TabbedPolicy";
import { privacyPolicy } from "@/data/privacy-policy";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Al Ghurair collects, uses and protects your personal data on Lepas UAE.",
};

export default function PrivacyPolicyPage() {
  const { locale, dict } = getServerDictionary();
  const policy = privacyPolicy[locale];

  return (
    <>
      <PageHero
        eyebrow={dict.legal.eyebrow}
        title={dict.legal.privacy}
        imageLabel="Lepas legal"
        breadcrumb={[{ label: dict.testDriveFlow.home, href: "/" }, { label: dict.legal.privacy }]}
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
