"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

export interface Filters {
  models: string[];
  colours: string[];
  engineSizes: string[];
  maxPrice: number;
  minYear: number;
  maxKm: number;
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  models: string[];
  colours: string[];
  engineSizes: string[];
  priceBounds: [number, number];
  yearBounds: [number, number];
  kmBounds: [number, number];
  counts: (key: keyof Filters, value: string) => number;
  onReset: () => void;
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function FilterGroup({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-b border-lepas-fog px-5 py-4 open:pb-5" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-lepas-black">
        {title}
        <span className="text-lepas-steel transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="mt-4 space-y-2.5">{children}</div>
    </details>
  );
}

function CheckboxRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-lepas-steel hover:text-lepas-black">
      <span className="flex items-center gap-2">
        <input type="checkbox" className="checkbox-field" checked={checked} onChange={onChange} />
        {label}
      </span>
      {count !== undefined && <span className="text-xs text-lepas-ash">({count})</span>}
    </label>
  );
}

export default function FilterSidebar({
  filters,
  onChange,
  models,
  colours,
  engineSizes,
  priceBounds,
  yearBounds,
  kmBounds,
  counts,
  onReset,
}: FilterSidebarProps) {
  const { dict } = useLocale();
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <aside className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto">
      <div className="border border-lepas-fog bg-white">
        <FilterGroup title={dict.preOwned.model} defaultOpen>
          <CheckboxRow
            label={dict.preOwned.all}
            count={models.reduce((sum, m) => sum + counts("models", m), 0)}
            checked={filters.models.length === 0}
            onChange={() => update({ models: [] })}
          />
          {models.map((m) => (
            <CheckboxRow
              key={m}
              label={m}
              count={counts("models", m)}
              checked={filters.models.includes(m)}
              onChange={() => update({ models: toggleValue(filters.models, m) })}
            />
          ))}
        </FilterGroup>

        <FilterGroup title={dict.preOwned.priceRange}>
          <p className="text-xs text-lepas-steel">
            {dict.preOwned.maxPrice} — {filters.maxPrice.toLocaleString()} AED
          </p>
          <input
            type="range"
            min={priceBounds[0]}
            max={priceBounds[1]}
            step={1000}
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: Number(e.target.value) })}
            className="range-field-light"
          />
        </FilterGroup>

        <FilterGroup title={dict.preOwned.modelYear}>
          <p className="text-xs text-lepas-steel">
            {dict.preOwned.minModelYear} — {filters.minYear}
          </p>
          <input
            type="range"
            min={yearBounds[0]}
            max={yearBounds[1]}
            step={1}
            value={filters.minYear}
            onChange={(e) => update({ minYear: Number(e.target.value) })}
            className="range-field-light"
          />
        </FilterGroup>

        <FilterGroup title={dict.preOwned.kilometers}>
          <p className="text-xs text-lepas-steel">
            {dict.preOwned.maxKilometers} — {filters.maxKm.toLocaleString()} km
          </p>
          <input
            type="range"
            min={kmBounds[0]}
            max={kmBounds[1]}
            step={1000}
            value={filters.maxKm}
            onChange={(e) => update({ maxKm: Number(e.target.value) })}
            className="range-field-light"
          />
        </FilterGroup>

        <FilterGroup title={dict.preOwned.colours}>
          {colours.map((c) => (
            <CheckboxRow
              key={c}
              label={c}
              count={counts("colours", c)}
              checked={filters.colours.includes(c)}
              onChange={() => update({ colours: toggleValue(filters.colours, c) })}
            />
          ))}
        </FilterGroup>

        <FilterGroup title={dict.preOwned.engineSizes}>
          {engineSizes.map((e) => (
            <CheckboxRow
              key={e}
              label={e}
              count={counts("engineSizes", e)}
              checked={filters.engineSizes.includes(e)}
              onChange={() => update({ engineSizes: toggleValue(filters.engineSizes, e) })}
            />
          ))}
        </FilterGroup>
      </div>

      <button onClick={onReset} className="btn-outline mt-4 w-full">
        {dict.preOwned.reset}
      </button>
    </aside>
  );
}
