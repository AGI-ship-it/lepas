"use client";

import { useState } from "react";
import Image from "next/image";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { CabinTab } from "@/lib/types";

export default function CabinTabs({ tabs }: { tabs: (CabinTab & { image?: string })[] }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr] md:items-start">
      {/* Vertical pill tabs */}
      <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            aria-current={i === active}
            className={`shrink-0 rounded-full px-5 py-3 text-start text-sm font-semibold transition-colors ${
              i === active
                ? "bg-lepas-amber text-white"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Image with overlaid caption */}
      <div className="relative overflow-hidden rounded-2xl">
        {tab.image ? (
          <div className="relative aspect-[16/9] w-full">
            <Image src={tab.image} alt={tab.imageLabel} fill sizes="(min-width: 768px) 70vw, 100vw" className="object-cover" />
          </div>
        ) : (
          <PlaceholderImage label={tab.imageLabel} aspect="aspect-[16/9]" showLabel={false} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <h3 className="text-xl font-bold text-white md:text-2xl">{tab.heading}</h3>
          <p className="mt-2 max-w-xl text-white/80">{tab.body}</p>
        </div>
      </div>
    </div>
  );
}
