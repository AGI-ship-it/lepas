"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { HotspotFeature as HotspotFeatureType } from "@/lib/types";
import FeaturePanel, { PanelItem } from "@/components/models/FeaturePanel";

/** Extra feature with a photo but no hotspot position; reachable from the side panel's prev/next. */
export type PanelExtra = { title: string; body: string; image?: string; imageLabel: string };


/**
 * Full-bleed cutaway with hotspots. Clicking a hotspot opens a side panel (as on exeed-uae.com/en/models/mx)
 * with a photo, "02 / 05" counter, title, copy and prev/next. Extra features without a hotspot
 * are appended to the panel sequence so nothing needs a separate section.
 */
export default function HotspotFeature({
  id,
  title,
  image,
  imageLabel,
  features,
  extras = [],
}: {
  id?: string;
  title: string;
  image?: string;
  imageLabel: string;
  features: HotspotFeatureType[];
  extras?: PanelExtra[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Hotspots first, then extras whose title isn't already a hotspot. Hotspots borrow a matching extra's photo.
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9؀-ۿ]/g, "");
  const byTitle = new Map(extras.map((e) => [norm(e.title), e]));
  const items: PanelItem[] = [
    ...features.map((f) => {
      const match = byTitle.get(norm(f.title));
      return { title: f.title, body: f.body, image: match?.image ?? image, imageLabel: match?.imageLabel ?? f.imageLabel };
    }),
    ...extras.filter((e) => !features.some((f) => norm(f.title) === norm(e.title))),
  ];
  const item = items[activeIndex];

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <section
      id={id}
      aria-label={title}
      className="relative min-h-[520px] scroll-mt-[8.5rem] overflow-hidden bg-lepas-ink text-white md:aspect-[1440/607] md:min-h-0"
    >
      {image ? (
        <Image src={image} alt={imageLabel} fill sizes="100vw" className="object-cover" />
      ) : (
        <PlaceholderImage label={imageLabel} aspect="aspect-auto h-full" className="absolute inset-0 h-full" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent rtl:bg-gradient-to-l" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />

      <div className="container-lepas pointer-events-none relative pt-6">
        <h2 className="heading-2">{title}</h2>
      </div>

      {features.map((f, i) => {
        const on = i === activeIndex;
        return (
          <button
            key={f.title}
            type="button"
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setActiveIndex(i);
              setOpen(true);
            }}
            aria-label={f.title}
            aria-haspopup="dialog"
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
        <div className="max-w-xs">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-lg font-bold uppercase leading-snug md:text-xl">{item.title}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <FeaturePanel
        idPrefix={id ?? "hotspot"}
        items={items}
        index={activeIndex}
        open={open}
        onIndexChange={setActiveIndex}
        onClose={close}
      />
    </section>
  );
}
