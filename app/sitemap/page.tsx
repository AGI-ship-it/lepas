import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/ui/Section";
import { getServerDictionary } from "@/lib/i18n/server";
import { getNews, getOffers } from "@/lib/i18n/data";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "All pages on Lepas UAE.",
};

export default function SitemapPage() {
  const { locale, dict } = getServerDictionary();
  const t = dict.lepasUi;
  const g = t.sitemapGroups;

  const groups: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: g.models,
      links: [
        { label: dict.models.listingTitle, href: "/models" },
        { label: dict.nav.modelsLinks.model1, href: "/models/l8" },
        { label: dict.nav.modelsLinks.model2, href: "/models/l6" },
        { label: dict.nav.modelsLinks.model2Terrain, href: "/models/l4" },
        { label: dict.nav.compareModels, href: "/models/compare" },
        { label: dict.nav.financeCalculator, href: "/models/finance-calculator" },
        { label: dict.common.bookTestDrive, href: "/models/test-drive" },
        { label: dict.preOwned.certifiedPreOwned, href: "/pre-owned" },
      ],
    },
    {
      title: g.about,
      links: [
        { label: dict.discover.alGhurairTitle, href: "/discover/about#al-ghurair-mobility" },
        { label: dict.discover.aboutTitle, href: "/discover/about#lepas" },
      ],
    },
    {
      title: g.services,
      links: [
        { label: dict.afterSales.title, href: "/after-sales" },
        { label: dict.afterSales.bookService, href: "/after-sales/book-service" },
      ],
    },
    {
      title: g.newsOffers,
      links: [
        { label: dict.discover.newsTitle, href: "/discover/news" },
        ...getNews(locale).map((n) => ({ label: n.title, href: `/discover/news/${n.slug}` })),
        { label: dict.discover.blogTitle, href: "/discover/blog" },
        { label: dict.offers.title, href: "/offers" },
        ...getOffers(locale).map((o) => ({ label: o.title, href: `/offers/${o.slug}` })),
      ],
    },
    {
      title: g.contact,
      links: [
        { label: dict.footer.contactUs, href: "/contact" },
        { label: t.locationsTitle, href: "/contact#locations" },
        { label: dict.footer.faqs, href: "/faqs" },
      ],
    },
    {
      title: g.legal,
      links: [
        { label: dict.footer.privacyPolicy, href: "/privacy-policy" },
        { label: dict.footer.cookiesPolicy, href: "/cookies-policy" },
        { label: dict.footer.terms, href: "/terms" },
        { label: t.sitemapTitle, href: "/sitemap" },
      ],
    },
  ];

  return (
    <>
      <section className="bg-lepas-black pb-16 pt-36 text-white md:pb-20 md:pt-44">
        <div className="container-lepas">
          <h1 className="heading-display text-4xl md:text-6xl">{t.sitemapTitle}</h1>
        </div>
      </section>
      <Section>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="border-b border-lepas-fog pb-3 text-sm font-semibold uppercase tracking-widest2 text-lepas-amber">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-underline text-sm text-lepas-ink hover:text-lepas-amber">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
