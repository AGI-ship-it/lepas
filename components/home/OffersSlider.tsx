"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getOffers } from "@/lib/i18n/data";
import { offerMeta } from "@/components/forms/offerMeta";

const SLIDE_DURATION = 6000;

export default function OffersSlider() {
  const { locale, dict } = useLocale();
  const offers = getOffers(locale);
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  const goTo = useCallback((next: number) => {
    setIndex(next);
    setCycle((c) => c + 1);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % offers.length);
    setCycle((c) => c + 1);
  }, [offers.length]);

  useEffect(() => {
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next, cycle]);

  const offer = offers[index];
  const meta = offerMeta[offer.slug];

  return (
    <section
      className="relative w-full overflow-hidden bg-lepas-black"
      aria-roledescription="carousel"
      aria-label="Current offers"
    >
      {/* Offer banners carry their own price and warranty copy, so show them uncropped. */}
      <div className="relative mx-auto aspect-[1728/970] w-full max-w-[1728px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {offer.image ? (
            <div className="relative h-full w-full bg-lepas-black">
              <Image src={offer.image} alt={offer.imageLabel} fill sizes="100vw" className="object-cover" priority />
            </div>
          ) : (
            <PlaceholderImage
              label={offer.imageLabel}
              aspect="aspect-auto h-full"
              className="h-full"
              tone="accent"
            />
          )}
        </motion.div>
      </AnimatePresence>
      </div>

      <div className="container-lepas relative flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="max-w-2xl"
          >
            {meta && (
              <p className="eyebrow">
                {meta.model[locale]} {dict.lepasUi.from} AED {meta.monthly} {dict.lepasUi.perMonth}
              </p>
            )}
            <h2 className="heading-display mt-3 text-2xl text-white sm:text-3xl md:text-4xl">
              {offer.title}
            </h2>
            <p className="mt-3 text-base text-white/70">
              {offer.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href={`/offers/${offer.slug}`} className="btn-outline-light">
                {dict.lepasUi.viewOffer}
              </Link>
              <Link href={`/offers/${offer.slug}#callback`} className="btn-primary">
                {dict.lepasUi.requestCallback}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Circular loading indicators only — no arrows */}
        <div className="flex shrink-0 items-center gap-4">
          {offers.map((o, i) => (
            <button
              key={o.slug}
              onClick={() => goTo(i)}
              aria-label={`Go to offer ${i + 1}: ${o.title}`}
              aria-current={i === index}
              className="relative flex h-6 w-6 items-center justify-center"
            >
              <span className="absolute h-2 w-2 rounded-full bg-white/30" />
              {i === index && (
                <svg viewBox="0 0 24 24" className="absolute h-6 w-6 -rotate-90">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                  <circle
                    key={cycle}
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={62.8}
                    strokeDashoffset={62.8}
                    className="animate-[hero-ring_var(--hero-duration)_linear_forwards]"
                    style={{ ["--hero-duration" as string]: `${SLIDE_DURATION}ms` }}
                  />
                </svg>
              )}
              {i === index && <span className="absolute h-2 w-2 rounded-full bg-white" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
