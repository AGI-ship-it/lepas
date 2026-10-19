import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import preownedData from "@/data/preowned.json";
import { PreOwnedVehicle } from "@/lib/types";
import { formatCurrency } from "@/lib/financeMath";
import Section from "@/components/ui/Section";
import EnquiryForm from "@/components/forms/EnquiryForm";
import PreOwnedGallery from "@/components/preowned/PreOwnedGallery";
import { getServerDictionary } from "@/lib/i18n/server";
import { getPreOwned } from "@/lib/i18n/data";

const vehiclesEn = preownedData as PreOwnedVehicle[];

export function generateStaticParams() {
  return vehiclesEn.map((v) => ({ id: v.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const vehicle = vehiclesEn.find((v) => v.id === params.id);
  if (!vehicle) return {};
  return {
    title: `${vehicle.model} (${vehicle.year})`,
    description: vehicle.description,
  };
}

export default function PreOwnedDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { locale, dict } = getServerDictionary();
  const vehicle = getPreOwned(locale).find((v) => v.id === params.id);
  if (!vehicle) notFound();

  const details = [
    { label: dict.preOwned.model, value: vehicle.model },
    { label: dict.preOwned.year, value: String(vehicle.year) },
    { label: dict.preOwned.kilometers, value: `${vehicle.km.toLocaleString()} km` },
    { label: dict.preOwned.colour, value: vehicle.colour },
    { label: dict.preOwned.engineSize, value: vehicle.engineSize },
    { label: dict.preOwned.price, value: formatCurrency(vehicle.price) },
  ];

  return (
    <div className="pt-32">
      <Section>
        <Link href="/pre-owned" className="text-sm text-lepas-steel hover:text-lepas-black">
          {locale === "ar" ? "→" : "←"} {dict.preOwned.backToPreOwned}
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <PreOwnedGallery label={vehicle.imageLabel} />
            <h1 className="mt-8 text-3xl font-bold tracking-tight text-lepas-black md:text-5xl">
              {vehicle.model} ({vehicle.year})
            </h1>
            <p className="mt-4 text-lepas-steel">{vehicle.description}</p>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {details.map((d) => (
                <div key={d.label} className="rounded-xl border border-lepas-fog p-4">
                  <dt className="text-xs text-lepas-steel">{d.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-lepas-black">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="h-fit rounded-2xl border border-white/10 bg-lepas-ink p-8 text-white lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm text-white/70">{dict.preOwned.price}</p>
            <p className="mt-1 text-3xl font-extrabold">{formatCurrency(vehicle.price)}</p>
            <div className="mt-6 flex flex-col gap-4">
              <Link href="/models/test-drive" className="btn-primary w-full">
                {dict.common.bookTestDrive}
              </Link>
              <EnquiryForm subject={`${vehicle.model} (${vehicle.year})`} />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
