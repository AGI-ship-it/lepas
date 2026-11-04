import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/forms/ContactForm";
import LocationsGrid from "@/components/contact/LocationsGrid";
import { getServerDictionary } from "@/lib/i18n/server";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: { absolute: "Contact Lepas UAE | We're Here to Help" },
  description: "Book a test drive or get in touch with Lepas UAE. Call 6005LEPAS or visit our showrooms in Deira and Sharjah.",
};

export default function ContactPage() {
  const { dict } = getServerDictionary();
  const t = dict.lepasUi;

  // Contact details as label/value rows, as in the left column of exeed-uae.com/en/contact.
  const channels = [
    { label: `${t.support247} · ${t.roadsideAssistance}`, value: t.phoneDisplay, href: "tel:600553727" },
    { label: t.whatsapp, value: t.phoneDisplay, href: "https://wa.me/971600553727", external: true },
    { label: dict.contact.emailLabel, value: t.email, href: `mailto:${t.email}` },
    { label: dict.contact.warranty, value: dict.contact.warrantyValue },
  ];

  return (
    <>
      {/* Hero: breadcrumb and title only */}
      <section className="relative flex min-h-[48svh] items-end overflow-hidden bg-lepas-black sm:min-h-[56vh] md:min-h-[420px]">
        <Image
          src="/design/assets/contact-hero-cover-l8-colors11.webp"
          alt="Lepas SUV — book a test drive or enquiry with Lepas UAE"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="container-lepas relative pb-14 pt-32 text-white md:pb-16">
          <Breadcrumb className="mb-6" items={[{ label: dict.testDriveFlow.home, href: "/" }, { label: dict.site.nav.contactUs }]} />
          <h1 className="heading-1 max-w-2xl">{dict.contact.heroTitle}</h1>
        </div>
      </section>

      {/* Contact details (left) and message form (right) */}
      <section id="contact-form" className="scroll-mt-20 bg-lepas-sand py-16 text-lepas-black md:py-24">
        <div className="container-lepas grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <h2 className="heading-2">{t.enquiriesTitle}</h2>
            <p className="mt-4 max-w-md text-base text-lepas-steel">{t.getInTouchIntro}</p>
            <ul className="mt-10 divide-y divide-lepas-black/10 border-y border-lepas-black/10">
              {channels.map((c) => (
                <li key={c.label} className="py-5">
                  <p className="text-xs uppercase tracking-widest2 text-lepas-steel">{c.label}</p>
                  {c.href ? (
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="mt-1 block break-words text-lg font-semibold text-lepas-ink transition-colors hover:text-lepas-amber"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="mt-1 break-words text-lg font-semibold text-lepas-ink">{c.value}</p>
                  )}
                </li>
              ))}
            </ul>
            <a
              href="#locations"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-lepas-amber hover:text-lepas-amber-hover"
            >
              {t.viewLocations} <span aria-hidden="true" className="rtl:rotate-180">→</span>
            </a>
          </div>
          <div>
            <ContactForm />
            <p className="mt-5 text-xs leading-relaxed text-lepas-steel">
              {t.responseNote}{" "}
              <a href="tel:600553727" className="font-semibold text-lepas-ink hover:text-lepas-amber">
                {t.phoneDisplay}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Locations: title, intro, filter chips, cards */}
      <section id="locations" className="scroll-mt-20 bg-lepas-black py-16 text-white md:py-24">
        <div className="container-lepas">
          <h2 className="heading-2 max-w-2xl">{t.locationsTitle}</h2>
          <p className="mt-4 max-w-2xl text-base text-white/60">{t.locationsIntro}</p>
          <div className="mt-10">
            <LocationsGrid />
          </div>
        </div>
      </section>
    </>
  );
}
