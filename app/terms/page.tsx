import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import TabbedPolicy from "@/components/legal/TabbedPolicy";
import { PolicySection } from "@/data/privacy-policy";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using the Lepas UAE website.",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function TermsPage() {
  const { locale, dict } = getServerDictionary();

  const sections: PolicySection[] = [
    ...dict.legal.termsSections.map((s) => ({
      id: slugify(s.heading),
      title: s.heading,
      blocks: [{ type: "p" as const, text: s.body }],
    })),
    {
      id: "privacy-and-cookies",
      title: locale === "ar" ? "الخصوصية وملفات تعريف الارتباط" : "Privacy & Cookies",
      blocks: [
        {
          type: "p",
          text:
            locale === "ar"
              ? "تخضع معالجة بياناتك الشخصية لـ[سياسة الخصوصية](/privacy-policy) و[سياسة ملفات تعريف الارتباط](/cookies-policy) الصادرتين عن شركة الغرير للاستثمار ذ.م.م."
              : "Your personal data is handled under the Al Ghurair Investment LLC [Privacy Policy](/privacy-policy) and [Cookie Policy](/cookies-policy).",
        },
      ],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={dict.legal.eyebrow}
        title={dict.legal.terms}
        imageLabel="Lepas legal"
        breadcrumb={[{ label: dict.testDriveFlow.home, href: "/" }, { label: dict.legal.terms }]}
      />
      <Section>
        <TabbedPolicy
          introTitle={locale === "ar" ? "مقدمة" : "Introduction"}
          introBlocks={[{ type: "p", text: dict.legal.termsIntro }]}
          sections={sections}
          contentsLabel={locale === "ar" ? "المحتويات" : "Table of Contents"}
        />
      </Section>
    </>
  );
}
