"use client";

import { useState } from "react";
import { ModelColour } from "@/lib/types";
import Spin360Viewer from "@/components/models/Spin360Viewer";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function ColourSwatches({
  exteriorColours,
  interiorColours,
  modelName,
}: {
  exteriorColours: ModelColour[];
  interiorColours: ModelColour[];
  modelName: string;
}) {
  const { dict } = useLocale();
  const [tab, setTab] = useState<"exterior" | "interior">("exterior");
  const [active, setActive] = useState(0);

  const colours = tab === "exterior" ? exteriorColours : interiorColours;
  const colour = colours[active];

  const selectTab = (next: "exterior" | "interior") => {
    setTab(next);
    setActive(0);
  };

  return (
    <div>
      <div className="mb-8 flex gap-8 border-b border-lepas-fog">
        <button
          type="button"
          onClick={() => selectTab("exterior")}
          aria-current={tab === "exterior"}
          className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
            tab === "exterior"
              ? "border-lepas-amber text-lepas-black"
              : "border-transparent text-lepas-steel hover:text-lepas-black"
          }`}
        >
          {dict.models.exterior}
        </button>
        <button
          type="button"
          onClick={() => selectTab("interior")}
          aria-current={tab === "interior"}
          className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
            tab === "interior"
              ? "border-lepas-amber text-lepas-black"
              : "border-transparent text-lepas-steel hover:text-lepas-black"
          }`}
        >
          {dict.models.interior}
        </button>
      </div>

      <Spin360Viewer
        frames={colour.image ? [colour.image] : []}
        alt={`${modelName} in ${colour.name}`}
        overlay={
          <div className="flex flex-wrap justify-center gap-4">
            {colours.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setActive(i)}
                className="flex flex-col items-center gap-2"
                aria-label={`Select colour ${c.name}`}
                aria-current={i === active}
              >
                <span
                  className={`h-10 w-10 rounded-full border-2 transition-all ${
                    i === active ? "border-lepas-amber scale-110" : "border-white/60"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs font-medium text-lepas-black">{c.name}</span>
              </button>
            ))}
          </div>
        }
      />
    </div>
  );
}
