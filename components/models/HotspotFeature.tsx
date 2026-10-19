"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { HotspotFeature as HotspotFeatureType } from "@/lib/types";

export default function HotspotFeature({
  image,
  imageLabel,
  features,
}: {
  image?: string;
  imageLabel: string;
  features: HotspotFeatureType[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;
  const active = activeIndex !== null ? features[activeIndex] : null;

  const go = (delta: number) => {
    setActiveIndex((i) => {
      if (i === null) return 0;
      return (i + delta + features.length) % features.length;
    });
  };

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-lepas-ink md:aspect-[21/9]">
      {image ? (
        <Image src={image} alt={imageLabel} fill className="object-cover" priority />
      ) : (
        <PlaceholderImage label={imageLabel} aspect="aspect-auto h-full" className="h-full" />
      )}

      {features.map((f, i) => (
        <button
          key={f.title}
          onClick={() => setActiveIndex(i)}
          aria-label={f.title}
          style={{ left: `${f.x}%`, top: `${f.y}%` }}
          className="group absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        >
          <span className="absolute h-14 w-14 animate-ping rounded-full bg-white/40" />
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-lepas-black shadow-lg transition-transform group-hover:scale-110">
            <PlusIcon />
          </span>
        </button>
      ))}

      <AnimatePresence>
        {isOpen && active && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/70"
              onClick={() => setActiveIndex(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col bg-lepas-black text-white md:max-w-lg"
            >
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-lepas-ink">
                {image ? (
                  <Image
                    src={image}
                    alt={active.imageLabel}
                    fill
                    className="scale-150 object-cover transition-all duration-500"
                    style={{ objectPosition: `${active.x}% ${active.y}%` }}
                  />
                ) : (
                  <PlaceholderImage
                    label={active.imageLabel}
                    aspect="aspect-auto h-full"
                    className="h-full"
                  />
                )}
                <button
                  onClick={() => setActiveIndex(null)}
                  aria-label="Close"
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm hover:border-white"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-1 flex-col justify-between overflow-y-auto p-8">
                <div className="text-start">
                  <p className="text-xs font-semibold uppercase tracking-widest2 text-white">
                    {String(activeIndex! + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-3xl font-bold">{active.title}</h3>
                  <p className="mt-4 text-white/60">{active.body}</p>
                </div>

                <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                  <button
                    onClick={() => go(-1)}
                    aria-label="Previous feature"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/20"
                  >
                    ‹
                  </button>
                  <p className="text-xs font-medium uppercase tracking-widest2 text-white/60">
                    {features[(activeIndex! + 1) % features.length].title}
                  </p>
                  <button
                    onClick={() => go(1)}
                    aria-label="Next feature"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/20"
                  >
                    ›
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
