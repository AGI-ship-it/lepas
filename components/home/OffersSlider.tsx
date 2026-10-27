"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import OfferBanner from "@/components/offers/OfferBanner";
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
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <OfferBanner
            offer={offer}
            meta={meta}
            modelName={meta?.model[locale]}
            labels={dict.home.heroOffers}
            priority
            actions={
              <>
                <Link href={`/offers/${offer.slug}`} className="btn-primary">
                  {dict.lepasUi.viewOffer}
                </Link>
                <Link href={`/offers/${offer.slug}#callback`} className="btn-outline-light">
                  {dict.lepasUi.requestCallback}
                </Link>
              </>
            }
          />
        </motion.div>
      </AnimatePresence>

      <div className="container-lepas absolute inset-x-0 bottom-8">
        {/* Circular loading indicators only — no arrows */}
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
                    stroke="#eb9201"
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
