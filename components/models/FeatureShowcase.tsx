"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SliderItem } from "@/lib/types";

const SLIDE_MS = 6000;

/**
 * Full-bleed feature section as on lepasuae.com (Exterior, Performance): the active
 * feature's photo fills the section, icon tabs with a progress line cycle through them.
 * "headline" shows only the feature name, large; "detail" adds the body copy.
 */
export default function FeatureShowcase({
  id,
  title,
  items,
  iconDir,
  variant = "detail",
}: {
  id?: string;
  title: string;
  items: SliderItem[];
  /** Folder under /public holding `<icon>-active.svg` / `<icon>-inactive.svg`. */
  iconDir: string;
  variant?: "headline" | "detail";
}) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const item = items[active];

  return (
    <section
      id={id}
      aria-label={title}
      className="relative flex min-h-[640px] scroll-mt-36 flex-col overflow-hidden bg-[#0e1025] text-white md:aspect-[1440/785] md:min-h-0"
    >
      {items.map((it, i) =>
        it.image ? (
          <Image
            key={it.image}
            src={it.image}
            alt={it.imageLabel ?? it.title}
            fill
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
          />
        ) : null,
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />

      <div className="container-lepas relative flex flex-1 flex-col pb-12 pt-6 md:pb-16">
        <h2 className="border-s-2 border-lepas-amber ps-3 text-xl font-bold uppercase leading-tight md:text-2xl">
          {title}
        </h2>

        <div className="mt-auto flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div aria-live="polite" className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                {variant === "headline" ? (
                  <h3 className="heading-display max-w-xs text-4xl md:text-5xl">{item.title}</h3>
                ) : (
                  <>
                    <h3 className="text-lg font-bold uppercase md:text-xl">{item.title}</h3>
                    <p className="mt-3 text-sm font-semibold text-white/90">{item.body}</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div role="tablist" aria-label={title} className="no-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 md:gap-5 lg:mx-0 lg:px-0">
            {items.map((it, i) => {
              const on = i === active;
              return (
                <button
                  key={it.title}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className="group flex w-[clamp(120px,11.5vw,166px)] shrink-0 flex-col items-start text-start"
                >
                  {it.icon && (
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-xl p-3 transition-colors md:h-16 md:w-16 ${
                        on ? "bg-white" : "bg-white/25 backdrop-blur-sm group-hover:bg-white/40"
                      }`}
                    >
                      <Image
                        src={`${iconDir}/${it.icon}-${on ? "active" : "inactive"}.svg`}
                        alt=""
                        width={40}
                        height={40}
                        className="h-full w-full"
                      />
                    </span>
                  )}
                  <span className="mt-4 min-h-[2.5em] text-xs leading-snug text-white">{it.title}</span>
                  <span className="relative mt-3 block h-px w-full bg-white/40">
                    {on && (
                      <motion.span
                        key={active}
                        className="absolute inset-y-0 start-0 block h-0.5 -translate-y-[0.5px] bg-white"
                        initial={{ width: reduceMotion ? "100%" : "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: reduceMotion ? 0 : SLIDE_MS / 1000, ease: "linear" }}
                        onAnimationComplete={() => {
                          if (!reduceMotion) setActive((a) => (a + 1) % items.length);
                        }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
