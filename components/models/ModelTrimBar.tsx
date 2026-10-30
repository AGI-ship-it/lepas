"use client";

import Image from "next/image";
import { VehicleModel } from "@/lib/types";
import { Dictionary } from "@/lib/i18n";
import { formatCurrency } from "@/lib/financeMath";
import { usePowertrain } from "@/components/models/Powertrain";

// Stats are stored in a fixed order: engine, transmission, power/torque, wheelbase, combined range.
const statIcons = ["engine", "transmission", "power-torque", "wheelbase", "combined-range"];

/**
 * Trim tabs + key figures along the bottom of the hero (first fold), as on exeed-uae.com/en/models/rx.
 * With two powertrains the tabs switch ICE / PHEV for the whole page.
 */
export default function ModelTrimBar({ model, dict }: { model: VehicleModel; dict: Dictionary }) {
  const t = dict.models;
  const { powertrains, active, setActive } = usePowertrain();
  const stats = active?.stats ?? model.detailPage.stats;
  const variant = model.variants.find((v) => v.id === active?.id) ?? model.variants[0];
  const price = formatCurrency(model.startingPrice + (variant?.priceDelta ?? 0), model.currency);

  const tabs =
    powertrains.length > 1
      ? powertrains.map((p) => ({ id: p.id, label: model.variants.find((v) => v.id === p.id)?.name ?? p.label }))
      : [{ id: variant?.id ?? model.slug, label: variant?.name ?? model.name }];

  return (
    <div id="trim" className="scroll-mt-36 text-white">
      <div className="container-lepas">
        <div role="tablist" aria-label={t.trim} className="flex flex-wrap gap-6 border-b border-white/15 sm:gap-10">
          {tabs.map((tab) => {
            const on = tabs.length === 1 || tab.id === active?.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={on}
                disabled={tabs.length === 1}
                onClick={() => setActive(tab.id)}
                className={`-mb-px border-b-2 pb-3 text-xs font-semibold uppercase tracking-widest2 transition-colors focus:outline-none focus-visible:text-lepas-amber disabled:cursor-default ${
                  on ? "border-lepas-amber text-white" : "border-transparent text-white/60 hover:text-white/85"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <dl
          className={`grid grid-cols-2 gap-x-6 gap-y-5 py-6 sm:gap-x-8 md:py-8 ${
            stats.length + 1 > 5 ? "lg:grid-cols-6" : "lg:grid-cols-5"
          }`}
        >
          {stats.map((stat, i) => {
            const icon = stat.icon ?? statIcons[i];
            return (
              <div key={stat.label} className="min-w-0">
                <dt className="text-[11px] uppercase leading-snug tracking-widest2 text-white/70 sm:min-h-[2.7em]">
                  {stat.label}
                </dt>
                <dd className="mt-2 flex items-center gap-2.5 break-words text-base font-semibold uppercase sm:text-lg">
                  {icon && <Image src={`/svg/model-spec/${icon}.svg`} alt="" width={24} height={24} className="h-6 w-6 shrink-0" />}
                  {stat.value}
                </dd>
              </div>
            );
          })}
          <div className="min-w-0">
            <dt className="text-[11px] uppercase leading-snug tracking-widest2 text-white/70 sm:min-h-[2.7em]">{t.price}</dt>
            <dd className="mt-2 text-base font-semibold sm:text-lg">
              {t.startingFromPrice.replace("{price}", price)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
