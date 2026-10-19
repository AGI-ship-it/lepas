"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBox from "@/components/layout/SearchBox";
import LanguageToggle from "@/components/layout/LanguageToggle";
import ModelsMegaMenu from "@/components/layout/ModelsMegaMenu";
import LepasLogo from "@/components/layout/LepasLogo";
import SocialIcons from "@/components/layout/SocialIcons";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function Navbar() {
  const { dict } = useLocale();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileModelsOpen, setMobileModelsOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [mobileDiscoverOpen, setMobileDiscoverOpen] = useState(false);
  const [mobileSupportOpen, setMobileSupportOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [modelsMenuOpen, setModelsMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openModelsMenu = () => {
    clearCloseTimeout();
    setModelsMenuOpen(true);
  };

  const scheduleCloseModelsMenu = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => setModelsMenuOpen(false), 200);
  };

  const modelsLinks = [
    { label: dict.nav.modelsLinks.model1, href: "/models/l8" },
    { label: dict.nav.modelsLinks.model2, href: "/models/l6" },
    { label: dict.nav.modelsLinks.model2Terrain, href: "/models/l4" },
  ];

  const topLevelLinks = [
    { label: dict.site.nav.services, href: "/after-sales" },
    { label: dict.site.nav.offers, href: "/offers" },
    { label: dict.site.nav.about, href: "/discover/about" },
    { label: dict.site.nav.locations, href: "/contact#locations" },
    { label: dict.site.nav.contactUs, href: "/contact" },
  ];

  const aboutLinks = [
    { label: dict.site.footer.alGhurairMobility, href: "/discover/about#al-ghurair-mobility" },
    { label: dict.site.footer.lepas, href: "/discover/about#lepas" },
  ];

  const servicesLinks = [
    { label: dict.site.footer.roadsideAssistance, href: "/after-sales#roadside-assistance" },
    { label: dict.site.footer.lepasWarranty, href: "/after-sales#warranty" },
  ];

  const newsOffersLinks = [
    { label: dict.site.footer.latestNews, href: "/discover/news" },
    { label: dict.site.footer.latestVideos, href: "/discover/blog" },
    { label: dict.site.footer.offers, href: "/offers" },
  ];

  const supportLinks = [
    { label: dict.site.footer.contactUs, href: "/contact" },
    { label: dict.site.footer.locations, href: "/contact#locations" },
    { label: dict.site.footer.faqs, href: "/faqs" },
  ];

  const legalLinks = [
    { label: dict.footer.privacyPolicy, href: "/privacy-policy" },
    { label: dict.site.footer.cookiePolicy, href: "/cookies-policy" },
    { label: dict.site.footer.sitemap, href: "/sitemap" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => clearCloseTimeout, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!modelsMenuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-nav-dropdown]")) {
        setModelsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [modelsMenuOpen]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-lepas-black/95 backdrop-blur-md transition-shadow duration-500 ease-premium ${
        scrolled ? "shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="container-lepas flex h-20 items-center justify-between">
        {/* Logo top-left */}
        <Link href="/" className="shrink-0" aria-label="Lepas UAE home">
          <LepasLogo />
        </Link>

        {/* Nav links (right) */}
        <nav className="hidden items-center gap-4 lg:flex xl:gap-6 2xl:gap-8" aria-label="Primary">
          <div
            className="group relative flex h-20 items-center"
            data-nav-dropdown
            onMouseEnter={openModelsMenu}
            onMouseLeave={scheduleCloseModelsMenu}
          >
            <button
              onClick={() => setModelsMenuOpen((v) => !v)}
              aria-expanded={modelsMenuOpen}
              aria-current={isActive("/models") ? "page" : undefined}
              className={`flex items-center gap-1.5 whitespace-nowrap text-[13px] uppercase transition-colors hover:text-white xl:text-sm 2xl:text-[15px] ${
                isActive("/models") ? "text-white" : "text-white/90"
              }`}
            >
              {dict.site.nav.ourModels}
              <ChevronDown open={modelsMenuOpen} />
            </button>
            <span
              className={`absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-0 bg-lepas-amber transition-transform duration-300 group-hover:scale-x-100 ${
                isActive("/models") ? "scale-x-100" : ""
              }`}
            />
            <ModelsMegaMenu
              open={modelsMenuOpen}
              onNavigate={() => setModelsMenuOpen(false)}
              onMouseEnter={openModelsMenu}
              onMouseLeave={scheduleCloseModelsMenu}
            />
          </div>

          {topLevelLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`group relative flex h-20 items-center whitespace-nowrap text-[13px] uppercase hover:text-white xl:text-sm 2xl:text-[15px] ${
                isActive(link.href) ? "text-white" : "text-white/90"
              }`}
            >
              {link.label}
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-0 bg-lepas-amber transition-transform duration-300 group-hover:scale-x-100 ${
                  isActive(link.href) ? "scale-x-100" : ""
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Right cluster: search, language, book a test drive */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex xl:gap-4">
          <SearchBox />
          <LanguageToggle />
          <a href="tel:600553727" className="hidden whitespace-nowrap text-[15px] text-white/90 hover:text-lepas-amber 2xl:inline">
            6005LEPAS
          </a>
          <Link href="/models/test-drive" className="btn-primary whitespace-nowrap lg:px-4 2xl:px-7">
            {dict.nav.bookTestDrive}
          </Link>
        </div>

        {/* Mobile menu button (right on mobile) */}
        <div className="flex shrink-0 items-center gap-1 lg:hidden">
          <SearchBox />
          <Link
            href="/models/test-drive"
            className="btn-primary whitespace-nowrap px-2.5 py-1.5 text-xs tracking-normal sm:px-4 sm:py-2"
          >
            {dict.nav.bookTestDrive}
          </Link>
          <button
            className="flex items-center gap-2 p-1.5 text-white sm:p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="hidden text-sm font-semibold uppercase tracking-widest2 sm:inline">
              {dict.nav.menu}
            </span>
            <BurgerIcon />
          </button>
        </div>
      </div>
    </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] overflow-y-auto bg-lepas-black lg:hidden"
          >
            <div className="container-lepas flex h-20 items-center justify-between">
              <LepasLogo />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-sm font-semibold uppercase tracking-widest2 text-white"
              >
                {dict.nav.close} ✕
              </button>
            </div>
            <nav className="container-lepas flex flex-col gap-2 pb-10 pt-4">
              <MobileAccordion
                label={dict.site.footer.models}
                open={mobileModelsOpen}
                setOpen={setMobileModelsOpen}
                links={modelsLinks}
                onNavigate={() => setMobileOpen(false)}
              />
              <MobileAccordion
                label={dict.site.footer.aboutUs}
                open={mobileExploreOpen}
                setOpen={setMobileExploreOpen}
                links={aboutLinks}
                onNavigate={() => setMobileOpen(false)}
              />
              <MobileAccordion
                label={dict.site.footer.services}
                open={mobileServicesOpen}
                setOpen={setMobileServicesOpen}
                links={servicesLinks}
                onNavigate={() => setMobileOpen(false)}
              />
              <MobileAccordion
                label={dict.site.footer.newsAndOffers}
                open={mobileDiscoverOpen}
                setOpen={setMobileDiscoverOpen}
                links={newsOffersLinks}
                onNavigate={() => setMobileOpen(false)}
              />
              <MobileAccordion
                label={dict.site.footer.contactUs}
                open={mobileSupportOpen}
                setOpen={setMobileSupportOpen}
                links={supportLinks}
                onNavigate={() => setMobileOpen(false)}
              />

              <div className="mt-6 flex flex-col gap-4">
                <Link
                  href="/models/test-drive"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-center"
                >
                  {dict.nav.bookTestDrive}
                </Link>
                <a href="tel:600553727" className="btn-outline-light text-center">
                  6005LEPAS
                </a>
                <LanguageToggle />
              </div>

              <div className="mt-8 flex flex-nowrap items-center justify-center gap-x-3 border-t border-white/10 pt-6">
                {legalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="link-underline whitespace-nowrap text-xs text-white/60 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex flex-col items-center gap-4">
                <SocialIcons />
                <p className="text-xs text-white/60">
                  {dict.site.footer.copyright}
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileAccordion({
  label,
  open,
  setOpen,
  links,
  onNavigate,
}: {
  label: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  links: { label: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-lg font-medium text-white"
      >
        {label}
        <span
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <ChevronDown />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 pb-4 ps-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className="py-2 text-base text-white/70 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronDown({ open = false }: { open?: boolean }) {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M1 1.5L6 6.5L11 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
      <path d="M0 1H22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M0 13H22" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
