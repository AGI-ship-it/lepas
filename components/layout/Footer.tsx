"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import LepasLogo from "@/components/layout/LepasLogo";
import SocialIcons from "@/components/layout/SocialIcons";

type FooterLink = { label: string; href: string; external?: boolean };

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-sm font-medium uppercase tracking-[0.2em] text-lepas-amber after:mt-5 after:block after:h-px after:w-10 after:bg-lepas-amber">
      {children}
    </h4>
  );
}

function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <ul className="space-y-4">
      {links.map((link) => (
        <li key={link.href}>
          {link.external ? (
            <a href={link.href} className="text-base text-white/75 transition-colors hover:text-white" {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {link.label}
            </a>
          ) : (
            <Link href={link.href} className="text-base text-white/75 transition-colors hover:text-white">
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const { dict } = useLocale();
  const f = dict.site.footer;

  const models: FooterLink[] = [
    { label: dict.nav.modelsLinks.model1, href: "/models/l8" },
    { label: dict.nav.modelsLinks.model2, href: "/models/l6" },
    { label: dict.nav.modelsLinks.model2Terrain, href: "/models/l4" },
  ];

  const discoverPrimary: FooterLink[] = [
    { label: f.offers, href: "/offers" },
    { label: f.bookService, href: "/after-sales/book-service" },
    { label: f.services, href: "/after-sales" },
    { label: f.aboutUs, href: "/discover/about" },
    { label: f.financeCalculator, href: "/models/finance-calculator" },
  ];

  const discoverSecondary: FooterLink[] = [
    { label: f.compareModels, href: "/models/compare" },
    { label: f.latestNews, href: "/discover/news" },
    { label: f.latestVideos, href: "/discover/blog" },
    { label: f.faqs, href: "/faqs" },
    { label: f.alGhurairMobility, href: "/discover/about#al-ghurair-mobility" },
  ];

  const getInTouch: FooterLink[] = [
    { label: f.contactUs, href: "/contact" },
    { label: "6005LEPAS", href: "tel:600553727", external: true },
    { label: f.whatsappUs, href: "https://wa.me/971600553727", external: true },
  ];

  const legal: FooterLink[] = [
    { label: f.cookiePolicy, href: "/cookies-policy" },
    { label: f.privacyPolicy, href: "/privacy-policy" },
    { label: dict.footer.terms, href: "/terms" },
  ];

  return (
    <footer className="border-t border-white/10 bg-lepas-black text-white">
      <div className="container-lepas py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_auto_auto_auto] lg:gap-x-16 xl:gap-x-24">
          <div>
            <LepasLogo size="lg" />
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
              {dict.footer.tagline}
            </p>
            <SocialIcons className="mt-8" />
          </div>

          <div>
            <FooterHeading>{f.models}</FooterHeading>
            <div className="mt-8">
              <FooterLinks links={models} />
            </div>
          </div>

          <div>
            <FooterHeading>{f.discover}</FooterHeading>
            <div className="mt-8 grid grid-cols-2 gap-x-12">
              <FooterLinks links={discoverPrimary} />
              <FooterLinks links={discoverSecondary} />
            </div>
          </div>

          <div>
            <FooterHeading>{f.getInTouch}</FooterHeading>
            <div className="mt-8">
              <FooterLinks links={getInTouch} />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/60">{f.copyright}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
