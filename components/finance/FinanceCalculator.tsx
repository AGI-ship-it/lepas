"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VehicleModel } from "@/lib/types";
import { calculateLoan, formatCurrency } from "@/lib/financeMath";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

const modelImages: Record<string, string> = {
  l8: "/design/assets/model-l8-side.webp",
  l6: "/design/assets/model-l6-side.webp",
  l4: "/design/assets/model-l4-side.webp",
};

interface Selection {
  key: string;
  name: string;
  model: VehicleModel;
  variant: VehicleModel["variants"][number];
}

/** One option per variant, so the L8 shows as L8 ICE and L8 PHEV. */
function financeOptions(models: VehicleModel[]): Selection[] {
  return models.flatMap((model) => {
    const powertrains = model.detailPage.powertrains ?? [];
    if (model.variants.length < 2) {
      return [{ key: model.slug, name: model.name, model, variant: model.variants[0] }];
    }
    return model.variants.map((variant) => ({
      key: `${model.slug}-${variant.id}`,
      name: `${model.name} ${powertrains.find((p) => p.id === variant.id)?.label ?? variant.name}`,
      model,
      variant,
    }));
  });
}

/** Paints the slider track amber up to the thumb. */
function fill(value: number, min: number, max: number) {
  return { "--fill": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties;
}

export default function FinanceCalculator() {
  const { locale, dict } = useLocale();
  const initialSlug = useSearchParams().get("model") ?? undefined;
  const models = getModels(locale);

  const options: Selection[] = useMemo(
    () => financeOptions(models),
    [models]
  );

  const initialOption =
    options.find((o) => o.model.slug === initialSlug) ?? options[0];

  const [selectedKey, setSelectedKey] = useState(initialOption.key);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [durationMonths, setDurationMonths] = useState(60);

  const selected =
    options.find((o) => o.key === selectedKey) ?? initialOption;

  const vehiclePrice = selected.model.startingPrice + selected.variant.priceDelta;
  const downPayment = Math.round(vehiclePrice * (downPaymentPct / 100));

  const result = useMemo(
    () =>
      calculateLoan({
        vehiclePrice,
        downPayment,
        annualInterestRate: 3.5,
        durationMonths,
      }),
    [vehiclePrice, downPayment, durationMonths]
  );

  const lowestPrice = Math.min(...options.map((o) => o.model.startingPrice + o.variant.priceDelta));

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      {/* Left: select vehicle */}
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-xl font-bold">{dict.finance.selectVehicleHeading}</h3>
          <p className="text-sm text-lepas-steel">
            {dict.common.startingFrom} <span className="font-semibold text-lepas-black">{formatCurrency(lowestPrice, selected.model.currency)}</span>
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {options.map((o) => {
            const price = o.model.startingPrice + o.variant.priceDelta;
            const isActive = o.key === selectedKey;
            return (
              <button
                key={o.key}
                onClick={() => setSelectedKey(o.key)}
                aria-pressed={isActive}
                className={`overflow-hidden border text-start transition-colors ${
                  isActive ? "border-lepas-amber" : "border-lepas-fog hover:border-lepas-black/30"
                }`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-lepas-fog">
                  <Image
                    src={modelImages[o.model.slug]}
                    alt={o.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-contain p-3"
                  />
                  {isActive && (
                    <span className="absolute end-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-lepas-amber text-white">
                      ✓
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-lepas-black">{o.name}</p>
                  <p className="mt-1 text-xs text-lepas-steel">
                    {dict.common.startingFrom} {formatCurrency(price, o.model.currency)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected vehicle showcase */}
        <div className="relative mt-6 overflow-hidden bg-lepas-black">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={modelImages[selected.model.slug]}
              alt={selected.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain p-8"
            />
          </div>
          <div className="relative bg-lepas-black p-6 text-white">
            <p className="text-lg font-bold">{selected.name}</p>
            <p className="mt-1 text-sm text-white/80">
              {dict.common.startingFrom} {formatCurrency(vehiclePrice, selected.model.currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Right: configure plan + summary */}
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-lepas-fog bg-white p-8 shadow-sm">
          <h3 className="text-xl font-bold text-lepas-black">{dict.finance.configurePlan}</h3>
          <p className="mt-1 text-sm text-lepas-steel">{dict.finance.configurePlanDescription}</p>

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <label htmlFor="finance-down-payment" className="text-sm font-medium text-lepas-black">{dict.finance.downPayment}</label>
              <div className="text-end">
                <p className="text-lg font-bold text-lepas-black">{downPaymentPct}%</p>
                <p className="text-xs text-lepas-steel">{formatCurrency(downPayment, selected.model.currency)}</p>
              </div>
            </div>
            <input
              id="finance-down-payment"
              type="range"
              min={20}
              max={80}
              step={5}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              style={fill(downPaymentPct, 20, 80)}
              aria-valuetext={`${downPaymentPct}%`}
              className="range-field-light mt-4"
            />
            <div className="mt-2 flex justify-between text-xs text-lepas-steel">
              <span>20%</span>
              <span>80%</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <label htmlFor="finance-term" className="text-sm font-medium text-lepas-black">{dict.finance.financeTerm}</label>
              <div className="text-end">
                <p className="text-lg font-bold text-lepas-black">{durationMonths}</p>
                <p className="text-xs text-lepas-steel">{dict.finance.months}</p>
              </div>
            </div>
            <input
              id="finance-term"
              type="range"
              min={12}
              max={60}
              step={6}
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
              style={fill(durationMonths, 12, 60)}
              aria-valuetext={`${durationMonths} ${dict.finance.months}`}
              className="range-field-light mt-4"
            />
            <div className="mt-2 flex justify-between text-xs text-lepas-steel">
              <span>12 {dict.finance.monthsAbbrev}</span>
              <span>60 {dict.finance.monthsAbbrev}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-lepas-black p-8 text-white">
          <p className="eyebrow mb-2">{dict.finance.estimatedMonthlyPayment}</p>
          <p className="text-4xl font-extrabold text-white">
            {formatCurrency(result.monthlyPayment, selected.model.currency)}
          </p>
          <p className="mt-1 text-sm text-white/75">
            {dict.finance.perMonthDuration.replace("{n}", String(durationMonths))}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-sm">
            <div>
              <p className="text-xs uppercase tracking-widest2 text-white/75">{dict.finance.vehiclePrice}</p>
              <p className="mt-1 font-semibold">{formatCurrency(vehiclePrice, selected.model.currency)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest2 text-white/75">{dict.finance.downPayment}</p>
              <p className="mt-1 font-semibold">{formatCurrency(downPayment, selected.model.currency)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest2 text-white/75">{dict.finance.amountFinanced}</p>
              <p className="mt-1 font-semibold">{formatCurrency(result.loanAmount, selected.model.currency)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest2 text-white">
              {dict.finance.includedOffer}
            </p>
            <p className="mt-2 text-sm text-white/75">{dict.finance.includedOfferBody}</p>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-white/75">{dict.finance.disclaimer}</p>

          <Link href={`/models/${selected.model.slug}`} className="btn-outline-light mt-6 w-full">
            {dict.common.exploreModel} {selected.model.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
