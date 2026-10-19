"use client";

import Link from "next/link";
import { PreOwnedVehicle } from "@/lib/types";
import { formatCurrency } from "@/lib/financeMath";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { useLocale } from "@/components/i18n/LocaleProvider";

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-widest2 text-lepas-ash">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-lepas-black">{value}</dd>
    </div>
  );
}

export default function VehicleCard({ vehicle }: { vehicle: PreOwnedVehicle }) {
  const { dict } = useLocale();

  return (
    <Link
      href={`/pre-owned/${vehicle.id}`}
      className="block border border-lepas-fog bg-white transition-colors hover:border-lepas-black/30"
    >
      <PlaceholderImage label={vehicle.imageLabel} aspect="aspect-[4/3]" showLabel={false} />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-bold text-lepas-black">
            {dict.preOwned.certifiedPreOwned} {vehicle.model}
          </h3>
          <p className="shrink-0 whitespace-nowrap text-sm font-bold text-lepas-mist">
            {formatCurrency(vehicle.price)}
          </p>
        </div>
        <p className="mt-2 text-sm text-lepas-steel">{vehicle.description}</p>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-lepas-fog pt-5">
          <Spec label={dict.preOwned.modelYear} value={String(vehicle.year)} />
          <Spec label={dict.preOwned.kilometers} value={`${vehicle.km.toLocaleString()} km`} />
          <Spec label={dict.preOwned.colours} value={vehicle.colour} />
          <Spec label={dict.preOwned.engineSizes} value={vehicle.engineSize} />
        </dl>
      </div>
    </Link>
  );
}
