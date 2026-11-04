"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { HotspotFeature as HotspotFeatureType } from "@/lib/types";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Extra feature with a photo but no hotspot position; reachable from the side panel's prev/next. */
export type PanelExtra = { title: string; body: string; image?: string; imageLabel: string };

type PanelItem = { title: string; body: string; image?: string; imageLabel: string };

const pad = (n: number) => String(n).padStart(2, "0");

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
  const { locale, dict } = useLocale();
  const offscreen = locale === "ar" ? "-100%" : "100%";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
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
  const total = items.length;
  const item = items[activeIndex];
  const nextItem = items[(activeIndex + 1) % total];

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);
  const step = (delta: number) => setActiveIndex((i) => (i + delta + total) % total);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

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
        <h2 className="sr-only">{title}</h2>
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

      {/* Side panel, portalled to <body> so no ancestor clips or transforms it */}
      {mounted && createPortal(
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${id ?? "hotspot"}-panel-title`}
              initial={{ x: offscreen }}
              animate={{ x: 0 }}
              exit={{ x: offscreen }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 end-0 z-[71] flex w-full flex-col overflow-y-auto bg-[#1b1c1e] text-white sm:w-[480px] md:w-[560px]"
            >
              <div className="relative aspect-[2/1] w-full shrink-0 bg-lepas-black">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={item.image ?? item.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0"
                  >
                    {item.image ? (
                      <Image src={item.image} alt={item.imageLabel} fill sizes="560px" className="object-cover" />
                    ) : (
                      <PlaceholderImage label={item.imageLabel} aspect="aspect-auto h-full" className="h-full" />
                    )}
                  </motion.div>
                </AnimatePresence>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label={dict.nav.close}
                  className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black"
                >
                  <FiX aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col p-8 md:p-10">
                <div aria-live="polite" className="flex-1">
                  <p className="text-sm tabular-nums tracking-[0.25em] text-lepas-amber">
                    {pad(activeIndex + 1)} / {pad(total)}
                  </p>
                  <h3 id={`${id ?? "hotspot"}-panel-title`} className="mt-5 text-2xl font-semibold leading-tight md:text-[2rem]">
                    {item.title}
                  </h3>
                  <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">{item.body}</p>
                </div>

                {total > 1 && (
                  <div className="mt-10 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label={dict.common.previous}
                      className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/30 transition-colors hover:border-white"
                    >
                      <FiChevronLeft aria-hidden="true" className="h-5 w-5 rtl:rotate-180" />
                    </button>
                    <p className="truncate text-center text-xs uppercase tracking-[0.25em] text-white/55">{nextItem.title}</p>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label={`${dict.common.next}: ${nextItem.title}`}
                      className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/30 transition-colors hover:border-white"
                    >
                      <FiChevronRight aria-hidden="true" className="h-5 w-5 rtl:rotate-180" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </section>
  );
}
