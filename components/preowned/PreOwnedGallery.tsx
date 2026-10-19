"use client";

import { useState } from "react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function PreOwnedGallery({ label }: { label: string }) {
  const { locale } = useLocale();
  const [active, setActive] = useState(0);

  const angles =
    locale === "ar"
      ? ["أمامي", "جانبي", "خلفي", "داخلي"]
      : ["Front", "Side", "Rear", "Interior"];

  const slides = angles.map((angle) => `${label} — ${angle}`);

  return (
    <div>
      <PlaceholderImage
        label={slides[active]}
        aspect="aspect-[16/10]"
        className="rounded-2xl"
      />
      <div className="mt-4 grid grid-cols-4 gap-3">
        {slides.map((slide, i) => (
          <button
            key={slide}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show image: ${angles[i]}`}
            aria-current={i === active}
            className={`overflow-hidden rounded-lg border transition-colors ${
              i === active ? "border-lepas-black" : "border-lepas-fog hover:border-lepas-steel/50"
            }`}
          >
            <PlaceholderImage label={slide} aspect="aspect-square" showLabel={false} />
          </button>
        ))}
      </div>
    </div>
  );
}
