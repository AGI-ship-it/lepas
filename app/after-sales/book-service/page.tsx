import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import ServiceBookingForm from "@/components/forms/ServiceBookingForm";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Book a Service",
  description: "Book a service appointment at the Lepas Al Quoz after-sales facility.",
};

export default function BookServicePage() {
  const { dict } = getServerDictionary();

  const stats = [
    { title: dict.afterSales.certifiedCentresTitle, body: dict.afterSales.certifiedCentresBody },
    { title: dict.afterSales.flexibleTimingTitle, body: dict.afterSales.flexibleTimingBody },
    { title: dict.afterSales.pickupDropoffTitle, body: dict.afterSales.pickupDropoffBody },
  ];

  return (
    <>
      <PageHero
        eyebrow={dict.afterSales.scheduleEyebrow}
        title={dict.afterSales.bookServiceTitle}
        description={dict.afterSales.bookServiceHeroDescription}
        imageLabel="Lepas service appointment"
        breadcrumb={[
          { label: dict.testDriveFlow.home, href: "/" },
          { label: dict.site.nav.services, href: "/after-sales" },
          { label: dict.afterSales.bookServiceTitle },
        ]}
      />

      <div className="border-b border-lepas-fog bg-white">
        <div className="container-lepas grid gap-8 py-12 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <div key={stat.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lepas-black text-xs font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-semibold text-lepas-black">{stat.title}</p>
                <p className="mt-1 text-sm text-lepas-steel">{stat.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Section
        light
        eyebrow={dict.afterSales.scheduleEyebrow}
        title={dict.afterSales.requestServiceSlot}
        description={dict.afterSales.requestServiceSlotDescription}
      >
        <div className="mx-auto max-w-4xl">
          <ServiceBookingForm />
        </div>
      </Section>
    </>
  );
}
