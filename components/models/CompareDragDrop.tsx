"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { ModelSpecGroup, VehicleModel } from "@/lib/types";
import { formatCurrency } from "@/lib/financeMath";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

const modelImages: Record<string, string> = {
  l8: "/design/assets/model-l8-side.webp",
  l6: "/design/assets/model-l6-side.webp",
  l4: "/design/assets/model-l4-side.webp",
};

/** One comparable car: a model, or one of its powertrains (L8 ICE / L8 PHEV). */
interface CompareEntry {
  id: string;
  name: string;
  model: VehicleModel;
  specs: ModelSpecGroup[];
}

/**
 * Models with powertrains list one spec group per powertrain first, in powertrain order;
 * each becomes its own entry with that group as its "Powertrain" specs.
 */
function compareEntries(models: VehicleModel[], powertrainLabel: string): CompareEntry[] {
  return models.flatMap((model) => {
    const powertrains = model.detailPage.powertrains ?? [];
    if (powertrains.length < 2) return [{ id: model.slug, name: model.name, model, specs: model.specs }];
    const shared = model.specs.slice(powertrains.length);
    return powertrains.map((p, i) => ({
      id: `${model.slug}-${p.id}`,
      name: `${model.name} ${p.label}`,
      model,
      specs: [{ label: powertrainLabel, items: model.specs[i].items }, ...shared],
    }));
  });
}

function comparePrice(entry: CompareEntry): number {
  const variant = entry.model.variants.find((v) => entry.id === `${entry.model.slug}-${v.id}`);
  return entry.model.startingPrice + (variant?.priceDelta ?? 0);
}

type Slot = CompareEntry | null;

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
  const models = compareEntries(getModels(locale), dict.models.powertrain);
  const slotCount = Math.min(models.length, 3);
  // Tray categories: one per model, with its powertrain variants listed underneath.
  const categories = Array.from(new Set(models.map((m) => m.model.slug))).map((slug) => {
    const entries = models.filter((m) => m.model.slug === slug);
    return { slug, name: entries[0].model.name, entries };
  });

  const [slots, setSlots] = useState<Slot[]>(
    Array.from({ length: slotCount }, () => null)
  );
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  const placeInSlot = (model: CompareEntry, index: number) => {
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

  const handleCardClick = (model: CompareEntry) => {
    const filledIndex = slots.findIndex((s) => s?.id === model.id);
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

  const activeSlots = slots.filter((s) => s !== null) as CompareEntry[];

  const prices = activeSlots.map((m) => comparePrice(m));
  const lowestPrice = prices.length > 1 ? Math.min(...prices) : null;

  // Build spec groups: Pricing & Body (synthetic) + each spec group from data (assumed aligned across models)
  const groups: SpecGroup[] = [];

  groups.push({
    label: dict.models.pricingAndBody,
    rows: [
      {
        label: dict.common.startingFrom,
        values: slots.map((s) => (s ? formatCurrency(comparePrice(s), s.model.currency) : null)),
      },
      {
        label: dict.models.overview,
        values: slots.map((s) => s?.model.tagline ?? null),
      },
    ],
  });

  const groupCount = Math.max(...slots.map((s) => s?.specs.length ?? 0));
  for (let g = 0; g < groupCount; g++) {
    const groupLabel = slots.find((s) => s?.specs[g])?.specs[g]?.label ?? "";
    // Rows match by label, so a spec only some cars have (e.g. PHEV combined range) gets its own row.
    const itemLabels = Array.from(new Set(slots.flatMap((s) => s?.specs[g]?.items.map((it) => it.label) ?? [])));
    const rows: SpecRow[] = itemLabels.map((itemLabel) => ({
      label: itemLabel,
      values: slots.map((s) => (!s ? null : s.specs[g]?.items.find((it) => it.label === itemLabel)?.value ?? null)),
    }));
    groups.push({ label: groupLabel, rows });
  }

  // Warranty rows come from each model's own data; the PHEV battery warranty only applies to PHEV entries.
  const warrantySpecs = (s: CompareEntry) =>
    s.model.detailPage.utilitySpecs.filter(
      (spec) => !/seat|مقاعد/i.test(spec.label) && (!/phev|هجينة/i.test(spec.label) || s.id.endsWith("-phev"))
    );
  const warrantyLabels = Array.from(new Set(slots.flatMap((s) => (s ? warrantySpecs(s).map((w) => w.label) : []))));
  groups.push({
    label: locale === "ar" ? "الضمان والملكية" : "Warranty & Ownership",
    rows: warrantyLabels.map((label) => ({
      label,
      values: slots.map((s) => (s ? warrantySpecs(s).find((w) => w.label === label)?.value ?? "—" : null)),
    })),
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
          <div className="flex flex-col gap-5 lg:max-h-[520px] lg:overflow-y-auto lg:pe-1">
            {categories.map((cat) => (
              <div key={cat.slug} className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest2 text-lepas-black">{cat.name}</p>
                {cat.entries.map((model) => {
              const isPlaced = slots.some((s) => s?.id === model.id);
              return (
                <div
                  key={model.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", model.id);
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
                    <Image src={modelImages[model.model.slug]} alt={model.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{model.name}</p>
                    <p className="text-xs text-lepas-steel">
                      {dict.common.startingFrom} {formatCurrency(comparePrice(model), model.model.currency)}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-widest2 text-lepas-steel">
                      {isPlaced ? dict.models.inComparison : dict.models.dragOrTap}
                    </p>
                  </div>
                  {/* Tapping the card adds it; once placed, the plus turns into a remove cross. */}
                  <span
                    aria-hidden="true"
                    className={`ms-auto flex h-8 w-8 shrink-0 items-center justify-center text-3xl font-extralight leading-none ${
                      isPlaced ? "text-lepas-steel" : "text-lepas-amber"
                    }`}
                  >
                    <span className={`transition-transform ${isPlaced ? "rotate-45" : ""}`}>+</span>
                  </span>
                </div>
              );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Compare slots */}
        <div>
          <p className="eyebrow mb-1">{dict.models.compareUpTo.replace("{n}", String(slotCount))}</p>
          <p className="mb-4 text-xs text-lepas-steel">{dict.models.compareHint}</p>
          <div className={`grid gap-4 ${slotCount === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {slots.map((model, index) => (
              <DropSlot
                key={`${index}-${model?.id ?? "empty"}`}
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
                  const found = models.find((m) => m.id === slug);
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
            <table className="w-full min-w-[640px] table-fixed border-collapse text-sm text-lepas-black">
              <colgroup>
                <col className="w-[22%]" />
                {slots.map((_, i) => (
                  <col key={i} />
                ))}
              </colgroup>
              <thead>
                <tr className="border-b border-lepas-fog">
                  <th className="px-4 py-4 text-start align-bottom text-xs font-medium uppercase tracking-widest2 text-lepas-steel">
                    {dict.models.specification}
                  </th>
                  {slots.map((s, i) => (
                    <th key={i} className="px-4 py-4 text-start align-bottom">
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
                        className="bg-lepas-fog/50 px-4 py-2 text-start text-xs font-semibold uppercase tracking-widest2 text-lepas-steel"
                      >
                        {group.label}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={`${group.label}-${row.label}`} className="border-b border-lepas-fog">
                        <td className="px-4 py-4 align-top text-lepas-steel">{row.label}</td>
                        {row.values.map((v, i) => (
                          <td
                            key={i}
                            className={`px-4 py-4 align-top font-semibold text-lepas-black ${
                              lowestPrice !== null &&
                              row.label === dict.common.startingFrom &&
                              (slots[i] ? comparePrice(slots[i] as CompareEntry) : null) === lowestPrice
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
              : "Specifications are indicative and compiled for comparison only. Figures may vary by trim; please confirm final specifications with a sales representative."}{" "}
            *{dict.lepasUi.termsApply}.
          </p>

          <div className={`mt-8 grid gap-4 ${slotCount === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {slots.map((m, i) =>
              m ? (
                <div key={m.id} className="flex flex-col gap-2">
                  <Link href={`/models/${m.model.slug}`} className="btn-outline w-full">
                    {dict.common.exploreModel} — {m.name}
                  </Link>
                  <Link
                    href={`/models/finance-calculator?model=${m.model.slug}`}
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
  const { dict } = useLocale();
  const [colourIndex, setColourIndex] = useState<number | null>(null);
  const colour = model && colourIndex !== null ? model.model.colours[colourIndex] : undefined;
  const image = colour?.image ?? (model ? modelImages[model.model.slug] : "");

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
            <Image
              key={image}
              src={image}
              alt={colour ? `${model.name} — ${colour.name}` : model.name}
              fill
              sizes="(min-width: 1024px) 25vw, 100vw"
              className={colour ? "object-contain" : "object-cover"}
            />
          </div>
          <h3 className="mt-4 text-lg font-bold">{model.name}</h3>
          <p className="text-sm text-lepas-steel">{model.model.tagline}</p>

          {model.model.colours.length > 0 && (
            <div className="mt-3">
              <div role="radiogroup" aria-label={dict.models.availableColours} className="flex flex-wrap items-center gap-2">
                {model.model.colours.map((c, i) => {
                  const on = colourIndex === i;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-label={c.name}
                      title={c.name}
                      onClick={() => setColourIndex(i)}
                      className={`h-6 w-6 rounded-full border border-black/15 ring-offset-2 transition-shadow ${
                        on ? "ring-2 ring-lepas-amber" : "hover:ring-2 hover:ring-lepas-fog"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  );
                })}
              </div>
              {colour && <p className="mt-1.5 text-xs text-lepas-steel">{colour.name}</p>}
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            {bestPrice && (
              <span className="bg-lepas-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest2 text-white">
                {bestPriceLabel}
              </span>
            )}
            <p className="text-sm font-semibold">
              {dict.common.startingFrom} {formatCurrency(comparePrice(model), model.model.currency)}
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
