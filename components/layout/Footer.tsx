"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import LepasLogo from "@/components/layout/LepasLogo";
import SocialIcons from "@/components/layout/SocialIcons";

export default function Footer() {
  const { dict } = useLocale();

  const f = dict.site.footer;

  const columns = [
    {
      title: f.models,
      links: [
        { label: "L8", href: "/models/l8" },
        { label: "L6", href: "/models/l6" },
        { label: "L4", href: "/models/l4" },
      ],
    },
    {
      title: f.aboutUs,
      links: [
        { label: f.alGhurairMobility, href: "/discover/about#al-ghurair-mobility" },
        { label: f.lepas, href: "/discover/about#lepas" },
      ],
    },
    {
      title: f.services,
      links: [
        { label: f.roadsideAssistance, href: "/after-sales#roadside-assistance" },
        { label: f.lepasWarranty, href: "/after-sales#warranty" },
      ],
    },
    {
      title: f.newsAndOffers,
      links: [
        { label: f.latestNews, href: "/discover/news" },
        { label: f.latestVideos, href: "/discover/blog" },
        { label: f.offers, href: "/offers" },
      ],
    },
    {
      title: f.contactUs,
      links: [
        { label: f.locations, href: "/contact#locations" },
        { label: f.faqs, href: "/faqs" },
      ],
    },
    {
      title: f.legal,
      links: [
        { label: f.privacyPolicy, href: "/privacy-policy" },
        { label: f.cookiePolicy, href: "/cookies-policy" },
        { label: f.sitemap, href: "/sitemap" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-lepas-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/design/assets/footerbg.png')] bg-cover bg-bottom opacity-60"
      />
      <div className="container-lepas relative py-16 md:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-[1fr_repeat(6,auto)] xl:gap-x-14">
          <div className="col-span-2 sm:col-span-3 lg:col-span-6 xl:col-span-1">
            <LepasLogo size="lg" showDistributor={false} />
            <p className="mt-4 max-w-[240px] text-base text-white/50">
              {dict.footer.tagline}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="lg:w-max">
              <h4 className="text-sm font-semibold uppercase tracking-widest2 text-white/60">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-4">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-underline text-sm text-white/70 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <div className="order-2 md:order-3">
            <SocialIcons />
          </div>

          <p className="order-3 whitespace-nowrap text-xs text-white/60 md:order-2">
            {f.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
