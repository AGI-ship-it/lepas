"use client";

import { useState } from "react";

interface TabGroup {
  label: string;
  items: string[];
}

export default function FeatureTabs({ groups }: { groups: TabGroup[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-lepas-fog pb-4">
        {groups.map((g, i) => (
          <button
            key={g.label}
            onClick={() => setActive(i)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              i === active
                ? "bg-lepas-black text-white"
                : "bg-lepas-fog text-lepas-steel hover:bg-lepas-fog/70"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {groups[active].items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-xl border border-lepas-fog bg-white p-4 text-sm text-lepas-black shadow-sm"
          >
            <span className="mt-0.5 text-lepas-steel">●</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
