"use client";

import { useState } from "react";

interface AccessoriesGridProps {
  accessories: string[];
  accessoriesTabLabel?: string;
  factoryOptionalEquipment?: string[];
  factoryOptionalEquipmentTabLabel?: string;
}

export default function AccessoriesGrid({
  accessories,
  accessoriesTabLabel = "Accessories",
  factoryOptionalEquipment,
  factoryOptionalEquipmentTabLabel = "Factory Optional Equipment",
}: AccessoriesGridProps) {
  const hasTabs = !!factoryOptionalEquipment && factoryOptionalEquipment.length > 0;
  const [active, setActive] = useState<"accessories" | "factory">("accessories");

  const items = active === "accessories" ? accessories : factoryOptionalEquipment ?? [];

  return (
    <div>
      {hasTabs && (
        <div className="mb-8 flex gap-8 border-b border-lepas-fog">
          <button
            onClick={() => setActive("accessories")}
            aria-current={active === "accessories"}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
              active === "accessories"
                ? "border-lepas-amber text-lepas-black"
                : "border-transparent text-lepas-steel hover:text-lepas-black"
            }`}
          >
            {accessoriesTabLabel}
          </button>
          <button
            onClick={() => setActive("factory")}
            aria-current={active === "factory"}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
              active === "factory"
                ? "border-lepas-amber text-lepas-black"
                : "border-transparent text-lepas-steel hover:text-lepas-black"
            }`}
          >
            {factoryOptionalEquipmentTabLabel}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items.map((name) => (
          <div
            key={name}
            className="flex items-start gap-3 rounded-2xl border border-lepas-fog bg-white p-5 shadow-sm transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-md"
          >
            <CheckIcon />
            <p className="text-sm font-medium text-lepas-black">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="mt-px shrink-0 text-lepas-amber">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 10.2l2.6 2.6L14 7.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
