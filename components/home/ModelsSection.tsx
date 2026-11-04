"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useLocale } from "@/components/i18n/LocaleProvider";
import VariantPills from "@/components/models/VariantPills";
import { getModels } from "@/lib/i18n/data";

const SLIDE_DURATION = 6000;

// Same order as the first three hero slides, which hold each model's headline.
const models = [
  { slug: "l8", name: "Lepas L8", image: "/design/assets/L8-v2.webp", wordmark: "/design/assets/model-l8-wordmark.svg" },
  { slug: "l6", name: "Lepas L6", image: "/design/assets/L6-v2.webp", wordmark: "/design/assets/model-l6-wordmark.svg" },
  { slug: "l4", name: "Lepas L4", image: "/design/assets/L4-v2.webp", wordmark: "/design/assets/model-l4-wordmark.svg" },
];

/** Full-screen model switcher as on lepasuae.com: name tabs top-left, headline and CTA bottom-left. */
export default function ModelsSection() {
  const { locale, dict } = useLocale();
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  const goTo = useCallback((i: number) => {
    setIndex(i);
    setCycle((c) => c + 1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => goTo((index + 1) % models.length), SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [index, cycle, goTo]);

  const model = models[index];
  const copy = dict.home.heroSlides[index];
  // L8 comes in two powertrains; show them as pills under the headline.
  const powertrains = getModels(locale).find((m) => m.slug === model.slug)?.detailPage.powertrains;

  return (
    <section
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-lepas-black text-white"
      aria-roledescription="carousel"
      aria-label={dict.home.rangeEyebrow}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={model.slug}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image src={model.image} alt={copy.imageLabel} fill sizes="100vw" className="object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />

      <div className="container-lepas relative flex h-full flex-col pb-24 pt-24 md:pt-24">
        {/* Compact script "Lepas L8 / L6 / L4" wordmark tabs in the top-start corner, split by thin vertical rules. */}
        <div role="tablist" className="flex items-stretch self-start">
          {models.map((m, i) => {
            const on = i === index;
            return (
              <button
                key={m.slug}
                role="tab"
                aria-selected={on}
                aria-label={m.name}
                onClick={() => goTo(i)}
                className={`relative flex items-center px-3 py-2 transition-opacity first:ps-0 md:px-4 ${
                  i > 0 ? "border-s border-white/25" : ""
                } ${on ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.wordmark} alt="" aria-hidden="true" className="h-3 w-auto md:h-4" />
                <span
                  className={`absolute bottom-0 h-0.5 bg-lepas-amber transition-opacity ${
                    i === 0 ? "start-0 end-3 md:end-4" : "inset-x-3 md:inset-x-4"
                  } ${on ? "opacity-100" : "opacity-0"}`}
                />
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={model.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="mt-auto max-w-3xl"
          >
            <h2 className="heading-2">{copy.title}</h2>
            <VariantPills powertrains={powertrains} className="mt-5" />
            <Link href={`/models/test-drive?model=${model.slug}`} className="btn-primary group mt-10">
              {dict.common.bookTestDrive}
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Circular indicators, same as the hero slider: the active ring fills over the slide's duration. */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center gap-4">
        {models.map((m, i) => (
          <button
            key={m.slug}
            onClick={() => goTo(i)}
            aria-label={m.name}
            aria-current={i === index}
            className="relative flex h-6 w-6 items-center justify-center"
          >
            <span className="absolute h-2 w-2 rounded-full bg-white/30" />
            {i === index && (
              <svg viewBox="0 0 24 24" className="absolute h-6 w-6 -rotate-90" aria-hidden="true">
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
                  className="animate-[hero-ring_var(--d)_linear_forwards]"
                  style={{ ["--d" as string]: `${SLIDE_DURATION}ms` }}
                />
              </svg>
            )}
            {i === index && <span className="absolute h-2 w-2 rounded-full bg-white" />}
          </button>
        ))}
      </div>
    </section>
  );
}
