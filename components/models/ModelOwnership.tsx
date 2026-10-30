import Image from "next/image";
import { FiCheck } from "react-icons/fi";
import { VehicleModel } from "@/lib/types";
import { Dictionary } from "@/lib/i18n";
import { formatCurrency } from "@/lib/financeMath";

/** Key facts strip + warranty block, in the exeed-uae.com/en/models/rx "Warranty" pattern. */
export default function ModelOwnership({ model, dict }: { model: VehicleModel; dict: Dictionary }) {
  const t = dict.models;
  const d = model.detailPage;
  const powertrains = d.powertrains ?? [];

  const seats = model.specs.flatMap((g) => g.items).find((it) => it.label === t.seats)?.value;
  const warrantySpecs = d.utilitySpecs.filter((s) => s.label !== t.seats);
  const vehicleWarranty = warrantySpecs.find((s) => /vehicle|السيارة|المركبة/i.test(s.label)) ?? warrantySpecs[0];
  const prices = model.variants.map((v) => ({
    name: model.variants.length > 1 ? v.name : null,
    price: formatCurrency(model.startingPrice + v.priceDelta, model.currency),
  }));

  const facts = [
    {
      label: t.powertrain,
      value: powertrains.length > 1 ? powertrains.map((p) => p.label).join(" · ") : model.variants[0]?.name,
    },
    ...(seats ? [{ label: t.seats, value: seats }] : []),
    { label: vehicleWarranty?.label ?? t.warranty, value: vehicleWarranty?.value },
  ];

  return (
    <section id="ownership" className="scroll-mt-36 bg-lepas-cream py-16 text-lepas-ink md:py-24">
      <div className="container-lepas">
        <dl className="grid grid-cols-1 gap-6 border-y border-lepas-ink/10 py-8 sm:grid-cols-2 sm:gap-8 sm:py-10 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="min-w-0">
              <dt className="text-[11px] uppercase tracking-widest2 text-lepas-steel">{f.label}</dt>
              <dd className="mt-2 break-words text-base font-semibold sm:text-lg">{f.value}</dd>
            </div>
          ))}
          <div className="min-w-0">
            <dt className="text-[11px] uppercase tracking-widest2 text-lepas-steel">{dict.common.startingFrom}</dt>
            <dd>
              <ul className="mt-2 space-y-1">
                {prices.map((p) => (
                  <li key={p.name ?? "price"} className="break-words text-base font-semibold sm:text-lg">
                    {p.name && <span className="font-normal text-lepas-steel">{p.name} </span>}
                    {p.price}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <div className="mt-10 grid grid-cols-1 items-center gap-8 sm:mt-14 md:grid-cols-2 md:gap-12">
          <div className="relative h-[240px] overflow-hidden sm:h-[340px]">
            <Image
              src="/design/assets/warranty-roadside.webp"
              alt={d.utilityTitle}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">{t.warranty}</p>
            <h2 className="mt-3 text-2xl font-bold leading-tight md:text-4xl">{d.utilityTitle}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-lepas-steel md:text-base">{d.utilityIntro}</p>

            <dl className="mt-6 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
              {warrantySpecs.map((s) => (
                <div key={s.label} className="border-s-2 border-lepas-amber ps-3">
                  <dt className="text-xs uppercase tracking-widest2 text-lepas-steel">{s.label}</dt>
                  <dd className="mt-1 font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-6 grid max-w-lg grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {t.warrantyPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm leading-snug text-lepas-steel">
                  <FiCheck aria-hidden="true" className="mt-0.5 shrink-0 text-lepas-amber" />
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-lepas-steel">*{dict.lepasUi.termsApply}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
