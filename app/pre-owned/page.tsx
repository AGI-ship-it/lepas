"use client";

import { useMemo, useState } from "react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import VehicleCard from "@/components/pre-owned/VehicleCard";
import FilterSidebar, { Filters } from "@/components/pre-owned/FilterSidebar";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getPreOwned } from "@/lib/i18n/data";
import { PreOwnedVehicle } from "@/lib/types";

export default function PreOwnedPage() {
  const { locale, dict } = useLocale();
  const vehicles = getPreOwned(locale);

  const models = Array.from(new Set(vehicles.map((v) => v.model)));
  const colours = Array.from(new Set(vehicles.map((v) => v.colour)));
  const engineSizes = Array.from(new Set(vehicles.map((v) => v.engineSize)));

  const priceBounds: [number, number] = [
    Math.min(...vehicles.map((v) => v.price)),
    Math.max(...vehicles.map((v) => v.price)),
  ];
  const yearBounds: [number, number] = [
    Math.min(...vehicles.map((v) => v.year)),
    Math.max(...vehicles.map((v) => v.year)),
  ];
  const kmBounds: [number, number] = [
    Math.min(...vehicles.map((v) => v.km)),
    Math.max(...vehicles.map((v) => v.km)),
  ];

  const defaultFilters: Filters = {
    models: [],
    maxPrice: priceBounds[1],
    minYear: yearBounds[0],
    maxKm: kmBounds[1],
    colours: [],
    engineSizes: [],
  };

  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      if (filters.models.length > 0 && !filters.models.includes(v.model)) return false;
      if (v.price > filters.maxPrice) return false;
      if (v.year < filters.minYear) return false;
      if (v.km > filters.maxKm) return false;
      if (filters.colours.length > 0 && !filters.colours.includes(v.colour)) return false;
      if (filters.engineSizes.length > 0 && !filters.engineSizes.includes(v.engineSize)) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, locale]);

  const counts = (key: keyof Filters, value: string): number => {
    const fieldMap: Record<string, keyof PreOwnedVehicle> = {
      models: "model",
      colours: "colour",
      engineSizes: "engineSize",
    };
    const field = fieldMap[key];
    if (!field) return 0;
    return vehicles.filter((v) => v[field] === value).length;
  };

  return (
    <>
      <PageHero
        eyebrow={dict.preOwned.eyebrow}
        title={dict.preOwned.title}
        description={dict.preOwned.description}
        imageLabel="Lepas pre-owned"
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
            models={models}
            colours={colours}
            engineSizes={engineSizes}
            priceBounds={priceBounds}
            yearBounds={yearBounds}
            kmBounds={kmBounds}
            counts={counts}
          />

          <div>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="heading-display text-3xl text-lepas-black md:text-5xl">
                {dict.preOwned.availableNow}
              </h2>
              <p className="text-sm text-lepas-steel">
                {filtered.length} {filtered.length === 1 ? dict.preOwned.vehicleFound : dict.preOwned.vehiclesFound}
              </p>
            </div>
            {filtered.length === 0 ? (
              <div className="border border-dashed border-lepas-fog p-12 text-center text-lepas-steel">
                {dict.preOwned.noVehiclesMatch}
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2">
                {filtered.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
