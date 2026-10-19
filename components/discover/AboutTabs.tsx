"use client";

import { useState } from "react";

export default function AboutTabs({
  tabs,
}: {
  tabs: { id: string; label: string; paragraphs: string[] }[];
}) {
  const [active, setActive] = useState(tabs.length - 1);

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-8 border-b border-lepas-fog">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`-mb-px border-b-2 pb-3 text-sm font-semibold uppercase tracking-widest2 transition-colors ${
              active === i ? "border-lepas-amber text-lepas-ink" : "border-transparent text-lepas-ash hover:text-lepas-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-8 max-w-4xl space-y-5 text-lg text-lepas-steel">
        {tabs[active].paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  );
}
