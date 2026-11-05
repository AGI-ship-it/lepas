"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { useLocale } from "@/components/i18n/LocaleProvider";

export type PanelItem = { title: string; body: string; image?: string; imageLabel: string };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Exeed-style feature side panel: photo, "02 / 05" counter, title, copy and prev/next with the next
 * feature's name. Slides in from the end edge over a dimmed page; Esc, ✕ or the backdrop close it.
 */
export default function FeaturePanel({
  idPrefix,
  items,
  index,
  open,
  onIndexChange,
  onClose,
}: {
  idPrefix: string;
  items: PanelItem[];
  index: number;
  open: boolean;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const { locale, dict } = useLocale();
  const offscreen = locale === "ar" ? "-100%" : "100%";
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => setMounted(true), []);

  const total = items.length;
  const item = items[index];
  const nextItem = items[(index + 1) % total];
  const step = (delta: number) => onIndexChange((index + delta + total) % total);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !item) return null;

  // Portalled to <body> so no ancestor clips or transforms it.
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${idPrefix}-panel-title`}
            initial={{ x: offscreen }}
            animate={{ x: 0 }}
            exit={{ x: offscreen }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 end-0 z-[71] flex w-full flex-col overflow-y-auto bg-[#1b1c1e] text-white sm:w-[480px] md:w-[560px]"
          >
            <div className="relative aspect-[2/1] w-full shrink-0 bg-lepas-black">
              <AnimatePresence initial={false}>
                <motion.div
                  key={`${index}-${item.image ?? item.title}`}
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
                onClick={onClose}
                aria-label={dict.nav.close}
                className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black"
              >
                <FiX aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col p-8 md:p-10">
              <div aria-live="polite" className="flex-1">
                <p className="text-sm tabular-nums tracking-[0.25em] text-lepas-amber">
                  {pad(index + 1)} / {pad(total)}
                </p>
                <h3 id={`${idPrefix}-panel-title`} className="mt-5 text-2xl font-semibold leading-tight md:text-[2rem]">
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
  );
}
