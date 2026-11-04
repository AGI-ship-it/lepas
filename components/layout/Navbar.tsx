"use client";

import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { AL_GHURAIR_MOBILITY_URL } from "@/lib/links";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBox from "@/components/layout/SearchBox";
import LanguageToggle from "@/components/layout/LanguageToggle";
import CallPopover from "@/components/layout/CallPopover";
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
  const [mobileDiscoverOpen, setMobileDiscoverOpen] = useState(false);
  const [mobileSupportOpen, setMobileSupportOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"models" | "discover" | null>(null);
  const modelsMenuOpen = openMenu === "models";
  const discoverMenuOpen = openMenu === "discover";
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const showMenu = (menu: "models" | "discover") => {
    clearCloseTimeout();
    setOpenMenu(menu);
  };

  const scheduleCloseMenu = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => setOpenMenu(null), 200);
  };

  const closeMenu = () => {
    clearCloseTimeout();
    setOpenMenu(null);
  };

  const openModelsMenu = () => showMenu("models");
  const scheduleCloseModelsMenu = scheduleCloseMenu;

  const modelsLinks = [
    { label: dict.nav.modelsLinks.model1, href: "/models/l8" },
    { label: dict.nav.modelsLinks.model2, href: "/models/l6" },
    { label: dict.nav.modelsLinks.model2Terrain, href: "/models/l4" },
  ];

  const topLevelLinks = [
    { label: dict.site.nav.services, href: "/after-sales" },
    { label: dict.site.nav.offers, href: "/offers" },
  ];

  /** Discover menu: About Us, news, videos, and Al Ghurair Mobility (external) last. */
  const discoverLinks = [
    { label: dict.nav.discoverLinks.about, href: "/discover/about" },
    { label: dict.nav.discoverLinks.news, href: "/discover/news" },
    { label: dict.nav.discoverLinks.blog, href: "/discover/blog" },
    { label: dict.nav.discoverLinks.alGhurairMobility, href: AL_GHURAIR_MOBILITY_URL, external: true },
  ];
  const discoverActive = isActive("/discover");

  const servicesLinks = [
    { label: dict.site.footer.roadsideAssistance, href: "/after-sales#roadside-assistance" },
    { label: dict.site.footer.lepasWarranty, href: "/after-sales#warranty" },
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
    if (!openMenu) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-nav-dropdown]")) {
        setOpenMenu(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

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
              onClick={() => setOpenMenu((m) => (m === "models" ? null : "models"))}
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
              onNavigate={closeMenu}
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

          <div
            className="group relative flex h-20 items-center"
            data-nav-dropdown
            onMouseEnter={() => showMenu("discover")}
            onMouseLeave={scheduleCloseMenu}
          >
            <button
              onClick={() => setOpenMenu((m) => (m === "discover" ? null : "discover"))}
              aria-expanded={discoverMenuOpen}
              aria-haspopup="true"
              aria-current={discoverActive ? "page" : undefined}
              className={`flex items-center gap-1.5 whitespace-nowrap text-[13px] uppercase transition-colors hover:text-white xl:text-sm 2xl:text-[15px] ${
                discoverActive ? "text-white" : "text-white/90"
              }`}
            >
              {dict.nav.discover}
              <ChevronDown open={discoverMenuOpen} />
            </button>
            <span
              className={`absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-0 bg-lepas-amber transition-transform duration-300 group-hover:scale-x-100 ${
                discoverActive ? "scale-x-100" : ""
              }`}
            />
            <div className="absolute start-1/2 top-full z-40 w-64 -translate-x-1/2 rtl:translate-x-1/2">
            <AnimatePresence>
              {discoverMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <ul className="border border-white/10 bg-lepas-ink py-2 shadow-2xl">
                    {discoverLinks.map((link) => (
                      <li key={link.href} className={link.external ? "mt-2 border-t border-white/10 pt-2" : ""}>
                        <NavLink
                          link={link}
                          onClick={closeMenu}
                          className="flex items-center gap-2 px-5 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                        />
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>

          <Link
            href="/contact"
            aria-current={isActive("/contact") ? "page" : undefined}
            className={`group relative flex h-20 items-center whitespace-nowrap text-[13px] uppercase hover:text-white xl:text-sm 2xl:text-[15px] ${
              isActive("/contact") ? "text-white" : "text-white/90"
            }`}
          >
            {dict.site.nav.contactUs}
            <span
              className={`absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-0 bg-lepas-amber transition-transform duration-300 group-hover:scale-x-100 ${
                isActive("/contact") ? "scale-x-100" : ""
              }`}
            />
          </Link>
        </nav>

        {/* Right cluster: search, language, book a test drive */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex xl:gap-4">
          <SearchBox />
          <LanguageToggle />
          <span className="h-6 w-px bg-white/20" aria-hidden="true" />
          <CallPopover />
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
                label={dict.site.footer.services}
                open={mobileServicesOpen}
                setOpen={setMobileServicesOpen}
                links={servicesLinks}
                onNavigate={() => setMobileOpen(false)}
              />
              <Link
                href="/offers"
                onClick={() => setMobileOpen(false)}
                className="border-b border-white/10 py-4 text-lg font-medium text-white"
              >
                {dict.site.nav.offers}
              </Link>
              <MobileAccordion
                label={dict.nav.discover}
                open={mobileDiscoverOpen}
                setOpen={setMobileDiscoverOpen}
                links={discoverLinks}
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
  links: NavItem[];
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
                <NavLink
                  key={link.href}
                  link={link}
                  onClick={onNavigate}
                  className="flex items-center gap-2 py-2 text-base text-white/70 hover:text-white"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type NavItem = { label: string; href: string; external?: boolean };

/** Internal links use next/link; external ones open in a new tab with an external-link icon. */
function NavLink({ link, onClick, className }: { link: NavItem; onClick: () => void; className: string }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {link.label}
        <FiExternalLink aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      </a>
    );
  }
  return (
    <Link href={link.href} onClick={onClick} className={className}>
      {link.label}
    </Link>
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
