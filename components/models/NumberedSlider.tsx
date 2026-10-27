"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { SliderItem } from "@/lib/types";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d={direction === "left" ? "M14 6l-6 6 6 6" : "M10 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NumberedSlider({
  eyebrow,
  items,
}: {
  badge?: string;
  eyebrow: string;
  items: readonly (SliderItem & { image?: string })[];
}) {
  const [index, setIndex] = useState(0);
  const total = items.length;
  const active = items[index];
  const headingId = useId();

  const goTo = (next: number) => setIndex((next + total) % total);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={eyebrow}
      className="overflow-hidden border border-white/10 bg-lepas-ink"
    >
      <div className="grid gap-0 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden bg-lepas-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {active.image ? (
                <Image
                  src={active.image}
                  alt={active.imageLabel ?? active.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <PlaceholderImage
                  label={active.imageLabel ?? active.title}
                  aspect="aspect-square"
                  fit="cover"
                  showLabel={false}
                  className="h-full w-full"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className="flex flex-col justify-center p-8 md:p-12"
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${total}`}
        >
          <h2 className="heading-display text-3xl text-white md:text-5xl">{eyebrow}</h2>
          <p className="mt-4 text-sm font-semibold tabular-nums text-white" aria-hidden="true">
            {index + 1}/{total}
          </p>
          <div aria-live="polite" className="min-h-[14rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3 id={headingId} className="mt-3 text-xl font-bold tracking-tight text-white md:text-2xl">
                  {active.title}
                </h3>
                <p className="mt-4 max-w-md text-white/70">{active.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous slide"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white hover:bg-white hover:text-lepas-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next slide"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white hover:bg-white hover:text-lepas-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
