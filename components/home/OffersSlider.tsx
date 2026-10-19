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
      className="relative h-[85vh] min-h-[520px] w-full overflow-hidden bg-lepas-black"
      aria-roledescription="carousel"
      aria-label="Current offers"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />

      <div className="container-lepas relative flex h-full flex-col justify-end pb-24 pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="max-w-xl"
          >
            {meta && (
              <p className="eyebrow">
                {meta.model[locale]} {dict.lepasUi.from} AED {meta.monthly} {dict.lepasUi.perMonth}
              </p>
            )}
            <h2 className="heading-display mt-4 text-3xl text-white sm:text-4xl md:text-5xl">
              {offer.title}
            </h2>
            <p className="mt-5 text-base text-white/70 md:text-lg">
              {offer.shortDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={`/offers/${offer.slug}`} className="btn-outline-light">
                {dict.lepasUi.viewOffer}
              </Link>
              <Link href={`/offers/${offer.slug}#callback`} className="btn-primary">
                {dict.lepasUi.requestCallback}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Circular loading indicators only — no arrows */}
      <div className="container-lepas absolute inset-x-0 bottom-8 flex items-center justify-start">
        <div className="flex items-center gap-4">
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
