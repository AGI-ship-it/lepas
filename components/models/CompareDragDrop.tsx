"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { VehicleModel } from "@/lib/types";
import { formatCurrency } from "@/lib/financeMath";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

const modelImages: Record<string, string> = {
  l8: "/design/assets/model-l8-side.webp",
  l6: "/design/assets/model-l6-side.webp",
  l4: "/design/assets/model-l4-side.webp",
};

function comparePrice(model: VehicleModel): number {
  return model.startingPrice;
}

type Slot = VehicleModel | null;

interface SpecRow {
  label: string;
  values: (string | null)[];
}

interface SpecGroup {
  label: string;
  rows: SpecRow[];
}

export default function CompareDragDrop() {
  const { locale, dict } = useLocale();
  const models = getModels(locale);
  const slotCount = Math.min(models.length, 3);

  const [slots, setSlots] = useState<Slot[]>(
    Array.from({ length: slotCount }, () => null)
  );
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  const placeInSlot = (model: VehicleModel, index: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = model;
      return next;
    });
  };

  const clearSlot = (index: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleCardClick = (model: VehicleModel) => {
    const filledIndex = slots.findIndex((s) => s?.slug === model.slug);
    if (filledIndex !== -1) {
      clearSlot(filledIndex);
      return;
    }
    const emptyIndex = slots.findIndex((s) => s === null);
    if (emptyIndex !== -1) {
      placeInSlot(model, emptyIndex);
    } else {
      placeInSlot(model, slots.length - 1);
    }
  };

  const activeSlots = slots.filter((s) => s !== null) as VehicleModel[];

  const prices = activeSlots.map((m) => comparePrice(m));
  const lowestPrice = prices.length > 1 ? Math.min(...prices) : null;

  // Build spec groups: Pricing & Body (synthetic) + each spec group from data (assumed aligned across models)
  const groups: SpecGroup[] = [];

  groups.push({
    label: dict.models.pricingAndBody,
    rows: [
      {
        label: dict.common.startingFrom,
        values: slots.map((s) => (s ? formatCurrency(comparePrice(s), s.currency) : null)),
      },
      {
        label: dict.models.overview,
        values: slots.map((s) => s?.tagline ?? null),
      },
    ],
  });

  const groupCount = Math.max(...slots.map((s) => s?.specs.length ?? 0));
  for (let g = 0; g < groupCount; g++) {
    const groupLabel = slots.find((s) => s?.specs[g])?.specs[g]?.label ?? "";
    const itemCount = Math.max(...slots.map((s) => s?.specs[g]?.items.length ?? 0));
    const rows: SpecRow[] = [];
    for (let i = 0; i < itemCount; i++) {
      const itemLabel = slots.find((s) => s?.specs[g]?.items[i])?.specs[g]?.items[i]?.label ?? "";
      rows.push({
        label: itemLabel,
        values: slots.map((s) => (!s ? null : s?.specs[g]?.items[i]?.value ?? null)),
      });
    }
    groups.push({ label: groupLabel, rows });
  }

  groups.push({
    label: locale === "ar" ? "الملكية" : "Ownership",
    rows: [
      {
        label: locale === "ar" ? "الضمان" : "Warranty",
        values: slots.map((s) => (s ? (locale === "ar" ? "10 سنوات / بدون حد للكيلومترات" : "10 years / Unlimited km") : null)),
      },
      {
        label: locale === "ar" ? "المساعدة على الطريق" : "Roadside Assistance",
        values: slots.map((s) => (s ? (locale === "ar" ? "5 سنوات" : "5 years") : null)),
      },
      {
        label: locale === "ar" ? "عقد الصيانة" : "Service Maintenance Contract",
        values: slots.map((s) => (s ? (locale === "ar" ? "سنة واحدة" : "1 year") : null)),
      },
    ],
  });

  function rowHasDifferences(row: SpecRow): boolean {
    const present = row.values.filter((v) => v !== null);
    return new Set(present).size > 1;
  }

  let visibleGroups: SpecGroup[] = groups;
  if (showDifferencesOnly) {
    visibleGroups = [];
    for (const g of groups) {
      const filteredRows = g.rows.filter(rowHasDifferences);
      if (filteredRows.length > 0) {
        visibleGroups.push({ label: g.label, rows: filteredRows });
      }
    }
  }

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* All models tray */}
        <div>
          <p className="eyebrow mb-1">{dict.models.allModels}</p>
          <p className="mb-4 text-xs text-lepas-steel">{dict.models.allModelsHint}</p>
          <div className="flex flex-col gap-3 lg:max-h-[420px] lg:overflow-y-auto lg:pe-1">
            {models.map((model) => {
              const isPlaced = slots.some((s) => s?.slug === model.slug);
              return (
                <div
                  key={model.slug}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", model.slug);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onClick={() => handleCardClick(model)}
                  className={`flex cursor-grab select-none items-center gap-3 border p-3 text-lepas-black transition-all active:cursor-grabbing ${
                    isPlaced
                      ? "border-lepas-fog bg-lepas-fog/40 opacity-50"
                      : "border-lepas-fog bg-white hover:border-lepas-black/40"
                  }`}
                >
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden">
                    <Image src={modelImages[model.slug]} alt={model.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{model.name}</p>
                    <p className="text-xs text-lepas-steel">
                      {dict.common.startingFrom} {formatCurrency(comparePrice(model), model.currency)}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-widest2 text-lepas-steel">
                      {isPlaced ? dict.models.inComparison : dict.models.dragOrTap}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compare slots */}
        <div>
          <p className="eyebrow mb-1">{dict.models.compareUpTo.replace("{n}", String(slotCount))}</p>
          <p className="mb-4 text-xs text-lepas-steel">{dict.models.compareHint}</p>
          <div className={`grid gap-4 ${slotCount === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {slots.map((model, index) => (
              <DropSlot
                key={index}
                index={index}
                model={model}
                isDragOver={dragOverSlot === index}
                label={index === 0 ? dict.models.yourModel : dict.models.compareWith.replace("{n}", String(index))}
                dropLabel={dict.models.dropCarHere.replace("{n}", String(index + 1))}
                bestPrice={lowestPrice !== null && model !== null && comparePrice(model) === lowestPrice}
                bestPriceLabel={dict.models.bestPrice}
                removeLabel={dict.models.remove}
                onDragOver={() => setDragOverSlot(index)}
                onDragLeave={() => setDragOverSlot(null)}
                onDrop={(slug) => {
                  const found = models.find((m) => m.slug === slug);
                  if (found) placeInSlot(found, index);
                  setDragOverSlot(null);
                }}
                onClear={() => clearSlot(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Comparison table */}
      {activeSlots.length > 0 && (
        <div className="mt-14">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-lepas-fog pb-4">
            <h3 className="text-xl font-bold text-lepas-black md:text-2xl">{dict.models.specComparison}</h3>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-lepas-steel">
              {dict.models.showDifferencesOnly}
              <span
                onClick={() => setShowDifferencesOnly((v) => !v)}
                role="switch"
                aria-checked={showDifferencesOnly}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  showDifferencesOnly ? "bg-lepas-black" : "bg-lepas-fog"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showDifferencesOnly ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </span>
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-start text-sm text-lepas-black">
              <thead>
                <tr className="border-b border-lepas-fog">
                  <th className="w-40 py-4 text-xs font-medium uppercase tracking-widest2 text-lepas-steel">
                    {dict.models.specification}
                  </th>
                  {slots.map((s, i) => (
                    <th key={i} className="py-4 align-bottom">
                      {s ? (
                        <span className="font-semibold">{s.name}</span>
                      ) : (
                        <span className="text-lepas-steel">—</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleGroups.map((group) => (
                  <Fragment key={group.label}>
                    <tr>
                      <td
                        colSpan={slots.length + 1}
                        className="bg-lepas-fog/50 py-2 text-xs font-semibold uppercase tracking-widest2 text-lepas-steel"
                      >
                        {group.label}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={`${group.label}-${row.label}`} className="border-b border-lepas-fog">
                        <td className="py-4 text-lepas-steel">{row.label}</td>
                        {row.values.map((v, i) => (
                          <td
                            key={i}
                            className={`py-4 font-semibold text-lepas-black ${
                              lowestPrice !== null &&
                              row.label === dict.common.startingFrom &&
                              (slots[i] ? comparePrice(slots[i] as VehicleModel) : null) === lowestPrice
                                ? "underline decoration-2 underline-offset-4"
                                : ""
                            }`}
                          >
                            {v ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-3xl text-xs text-lepas-steel">
            {locale === "ar"
              ? "المواصفات إرشادية وتم تجميعها لأغراض المقارنة فقط. قد تختلف الأرقام حسب الفئة؛ يرجى تأكيد المواصفات النهائية مع ممثل المبيعات."
              : "Specifications are indicative and compiled for comparison only. Figures may vary by trim; please confirm final specifications with a sales representative."}
          </p>

          <div className={`mt-8 grid gap-4 ${slotCount === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {slots.map((m, i) =>
              m ? (
                <div key={m.slug} className="flex flex-col gap-2">
                  <Link href={`/models/${m.slug}`} className="btn-outline w-full">
                    {dict.common.exploreModel} — {m.name}
                  </Link>
                  <Link
                    href={`/models/finance-calculator?model=${m.slug}`}
                    className="link-underline text-center text-sm font-semibold text-lepas-black"
                  >
                    {dict.nav.calculateFinance} <span className="inline-block rtl:rotate-180">→</span>
                  </Link>
                </div>
              ) : (
                <div key={i} />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DropSlot({
  index,
  model,
  isDragOver,
  label,
  dropLabel,
  bestPrice,
  bestPriceLabel,
  removeLabel,
  onDragOver,
  onDragLeave,
  onDrop,
  onClear,
}: {
  index: number;
  model: Slot;
  isDragOver: boolean;
  label: string;
  dropLabel: string;
  bestPrice: boolean;
  bestPriceLabel: string;
  removeLabel: string;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (slug: string) => void;
  onClear: () => void;
}) {
  const { locale, dict } = useLocale();

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e.dataTransfer.getData("text/plain"));
      }}
      className={`relative flex min-h-[260px] w-full flex-col border p-4 text-start transition-colors ${
        isDragOver ? "border-lepas-black bg-lepas-fog" : "border-lepas-fog bg-white"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest2 text-lepas-steel">
          {index === 0 ? `1 · ${label}` : `${index + 1} · ${label}`}
        </p>
        {model && (
          <button
            onClick={onClear}
            aria-label={`${removeLabel} ${model.name}`}
            className="flex h-7 w-7 items-center justify-center border border-lepas-fog text-lepas-steel hover:border-lepas-black hover:text-lepas-black"
          >
            ✕
          </button>
        )}
      </div>

      {model ? (
        <div className="flex flex-1 flex-col text-lepas-black">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image src={modelImages[model.slug]} alt={model.name} fill className="object-cover" />
          </div>
          <h3 className="mt-4 text-lg font-bold">{model.name}</h3>
          <p className="text-sm text-lepas-steel">{model.tagline}</p>

          {model.colours.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              {model.colours.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="h-4 w-4 rounded-full border border-lepas-fog"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            {bestPrice && (
              <span className="bg-lepas-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest2 text-white">
                {bestPriceLabel}
              </span>
            )}
            <p className="text-sm font-semibold">
              {dict.common.startingFrom} {formatCurrency(comparePrice(model), model.currency)}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-center">
          <p className="text-sm font-medium uppercase tracking-widest2 text-lepas-steel">{dropLabel}</p>
        </div>
      )}
    </div>
  );
}
