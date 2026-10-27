"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useLocale } from "@/components/i18n/LocaleProvider";

const SLIDE_DURATION = 6000;

// Same order as the first three hero slides, which hold each model's headline.
const models = [
  { slug: "l8", name: "L8", image: "/design/assets/L8-v2.webp" },
  { slug: "l6", name: "L6", image: "/design/assets/L6-v2.webp" },
  { slug: "l4", name: "L4", image: "/design/assets/L4-v2.webp" },
];

/** Full-screen model switcher as on lepasuae.com: name tabs top-left, headline and CTA bottom-left. */
export default function ModelsSection() {
  const { dict } = useLocale();
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

      <div className="container-lepas relative flex h-full flex-col pb-24 pt-28 md:pt-32">
        <div role="tablist" className="flex items-center">
          {models.map((m, i) => {
            const on = i === index;
            return (
              <button
                key={m.slug}
                role="tab"
                aria-selected={on}
                onClick={() => goTo(i)}
                className={`relative px-6 py-1 text-lg font-bold transition-colors first:ps-0 md:text-2xl ${
                  i > 0 ? "border-s border-white/40" : ""
                } ${on ? "text-white" : "text-white/50 hover:text-white/80"}`}
              >
                {m.name}
                <span
                  className={`absolute -bottom-2 h-0.5 bg-lepas-amber transition-opacity ${
                    i === 0 ? "start-0 end-6" : "inset-x-6"
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
            <h2 className="heading-display text-4xl sm:text-5xl md:text-6xl">{copy.title}</h2>
            <Link href={`/models/test-drive?model=${model.slug}`} className="btn-primary group mt-10">
              {dict.common.bookTestDrive}
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-8 flex justify-center gap-6">
        {models.map((m, i) => (
          <button
            key={m.slug}
            onClick={() => goTo(i)}
            aria-label={m.name}
            className="relative h-1 w-20 overflow-hidden bg-white md:w-32"
          >
            {i === index && (
              <span
                key={cycle}
                className="absolute inset-y-0 start-0 bg-lepas-amber animate-[model-progress_var(--d)_linear_forwards]"
                style={{ ["--d" as string]: `${SLIDE_DURATION}ms` }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
