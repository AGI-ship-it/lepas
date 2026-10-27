"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { HotspotFeature as HotspotFeatureType } from "@/lib/types";

/** Full-bleed cutaway with hotspots; the selected one's name and copy sit bottom-left, as on lepasuae.com. */
export default function HotspotFeature({
  id,
  title,
  image,
  imageLabel,
  features,
}: {
  id?: string;
  title: string;
  image?: string;
  imageLabel: string;
  features: HotspotFeatureType[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = features[activeIndex];

  return (
    <section
      id={id}
      aria-label={title}
      className="relative min-h-[520px] scroll-mt-36 overflow-hidden bg-lepas-ink text-white md:aspect-[1440/607] md:min-h-0"
    >
      {image ? (
        <Image src={image} alt={imageLabel} fill sizes="100vw" className="object-cover" />
      ) : (
        <PlaceholderImage label={imageLabel} aspect="aspect-auto h-full" className="absolute inset-0 h-full" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent rtl:bg-gradient-to-l" />

      {features.map((f, i) => {
        const on = i === activeIndex;
        return (
          <button
            key={f.title}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={f.title}
            aria-pressed={on}
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            className="group absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          >
            <span
              className={`absolute h-8 w-8 rounded-full border border-white/80 transition-shadow ${
                on ? "shadow-[0_0_18px_6px_rgba(235,146,1,0.45)]" : ""
              }`}
            />
            <span
              className={`relative h-3 w-3 rounded-full transition-all group-hover:scale-125 ${on ? "bg-lepas-amber" : "bg-white"}`}
            />
          </button>
        );
      })}

      <div className="container-lepas pointer-events-none absolute inset-x-0 bottom-0 pb-12 md:pb-24">
        <h2 className="sr-only">{title}</h2>
        <div aria-live="polite" className="max-w-xs">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <h3 className="text-lg font-bold uppercase leading-snug md:text-xl">{active.title}</h3>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
