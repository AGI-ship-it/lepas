import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Section from "@/components/ui/Section";
import ContactForm from "@/components/forms/ContactForm";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: { absolute: "Contact Lepas UAE | Book a Test Drive or Enquiry in UAE" },
  description: "Book a test drive or get in touch with Lepas UAE. Call 6005LEPAS or visit our showrooms in Deira and Sharjah.",
};

export default function ContactPage() {
  const { dict } = getServerDictionary();
  const t = dict.lepasUi;

  const channels = [
    { eyebrow: t.support247, label: t.roadsideAssistance, value: t.phoneDisplay, href: "tel:600553727" },
    { eyebrow: t.whatsapp, label: t.whatsapp, value: t.phoneDisplay, href: "https://wa.me/971600553727", external: true },
    { eyebrow: dict.contact.emailLabel, label: dict.contact.emailLabel, value: t.email, href: `mailto:${t.email}` },
  ];

  return (
    <>
      <section className="relative flex min-h-[560px] items-end overflow-hidden bg-lepas-black md:h-[80vh]">
        <Image
          src="/design/assets/contact-hero-cover-l8-colors11.webp"
          alt="Lepas SUV — book a test drive or enquiry with Lepas UAE"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="container-lepas relative pb-16 pt-40 text-white md:pb-20">
          <h1 className="heading-display max-w-2xl text-4xl md:text-6xl">{dict.contact.heroTitle}</h1>
          <p className="mt-5 max-w-xl text-white/80">
            {t.contactHeroIntro1}
            <br />
            {t.contactHeroIntro2}
          </p>
          <Link href="/models/test-drive" className="btn-primary mt-8">
            {dict.common.bookTestDrive}
          </Link>
        </div>
      </section>

      <Section id="contact-form" className="scroll-mt-20" title={t.getInTouch} description={t.getInTouchIntro}>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {channels.map((c) => (
              <a
                key={c.href}
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="block border border-lepas-fog p-6 transition-colors hover:border-lepas-amber"
              >
                <p className="text-xs font-semibold uppercase tracking-widest2 text-lepas-ash">
                  {c.eyebrow === c.label ? c.eyebrow : `${c.eyebrow} · ${c.label}`}
                </p>
                <p className="mt-2 text-xl font-bold text-lepas-ink">{c.value}</p>
              </a>
            ))}
            <a
              href="#locations"
              className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-lepas-amber hover:text-lepas-amber-hover"
            >
              {t.viewLocations} <span aria-hidden="true" className="rtl:rotate-180">→</span>
            </a>
          </div>
          <ContactForm />
        </div>
      </Section>

      <Section id="locations" light={false} className="scroll-mt-20" title={t.locationsTitle} description={t.locationsIntro}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.locations.map((loc) => {
            const open = loc.status === "open";
            return (
              <div key={loc.name} className="flex flex-col border border-white/10 p-6">
                <span
                  className={`self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    open ? "bg-lepas-amber text-white" : "border border-white/30 text-white/70"
                  }`}
                >
                  {open ? t.nowOpen : t.comingSoon}
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">{loc.name}</h3>
                <p className="mt-2 flex-1 text-sm text-white/70">{loc.address}</p>
                {open && loc.href ? (
                  <a
                    href={loc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-lepas-amber hover:text-white"
                  >
                    {t.getDirections} <span aria-hidden="true" className="rtl:rotate-180">→</span>
                  </a>
                ) : (
                  <p className="mt-6 text-sm text-white/50">{t.detailsTba}</p>
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
