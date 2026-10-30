"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

// Offer photography has the banner text painted out so the slide can set its own copy.
const offerLinks = [
  { model: "l8", price: "1,533", image: "/design/assets/home/offer-l8-clean.webp", warranty: true },
  { model: "l4", price: "1,088", image: "/design/assets/home/offer-l4-clean.webp", warranty: false },
];

const slideLinks = [
  { primaryHref: "/models/l8", secondaryHref: "/models/test-drive", image: "/design/assets/L8-v2.webp" },
  { primaryHref: "/models/l6", secondaryHref: "/models/test-drive", image: "/design/assets/L6-v2.webp" },
  { primaryHref: "/models/l4", secondaryHref: "/models/test-drive", image: "/design/assets/L4-v2.webp" },
];

const SLIDE_DURATION = 6000;
const HERO_VIDEO_SRC = "/video/L8.mp4";

type OfferSlide = {
  kind: "offer";
  key: string;
  eyebrow: string;
  imageLabel: string;
  image: string;
  price: string;
  perks: { value: string; label: string }[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

type ModelSlide = {
  kind: "model";
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  imageLabel: string;
  image: string;
  video: boolean;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export default function HeroSlider() {
  const { dict } = useLocale();
  const offers = dict.home.heroOffers;
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  const slides: (OfferSlide | ModelSlide)[] = [
    ...offerLinks.map((o, i) => ({
      kind: "offer" as const,
      key: `offer-${o.model}`,
      eyebrow: offers.slides[i].eyebrow,
      imageLabel: offers.slides[i].imageLabel,
      image: o.image,
      perks: o.warranty ? [...offers.perks, ...offers.warrantyPerks] : offers.perks,
      price: o.price,
      primaryCta: { label: dict.site.home.bookAppointment, href: `/models/test-drive?model=${o.model}` },
      secondaryCta: { label: dict.common.viewOffer, href: `/offers/${o.model}` },
    })),
    ...slideLinks.map((link, i) => ({
      kind: "model" as const,
      key: `model-${i}`,
      ...dict.home.heroSlides[i],
      image: link.image,
      video: i === 0,
      primaryCta: { label: dict.common.learnMore, href: link.primaryHref },
      secondaryCta: { label: dict.site.home.bookAppointment, href: link.secondaryHref },
    })),
  ];

  const goTo = useCallback((next: number) => {
    setIndex(next);
    setCycle((c) => c + 1);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
    setCycle((c) => c + 1);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next, cycle]);

  const slide = slides[index];

  return (
    <section
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-lepas-black"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
    >
      {/* Per-slide photography; the L8 model slide plays the film */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.imageLabel}
            fill
            priority={index === 0}
            sizes="100vw"
            className={slide.kind === "offer" ? "object-cover object-[68%_center] md:object-center" : "object-cover"}
          />
          {slide.kind === "model" && slide.video && (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={HERO_VIDEO_SRC}
              poster={slide.image}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          )}
        </motion.div>
      </AnimatePresence>
      {slide.kind === "offer" ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent rtl:bg-gradient-to-l" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />
      )}

      <div className="container-lepas relative flex h-full flex-col justify-end pb-24 pt-32 md:justify-center md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="max-w-xl"
          >
            {slide.kind === "offer" ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="border border-lepas-amber px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest2 text-lepas-amber">
                    {offers.badge}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest2 text-white/80 md:text-sm">
                    {slide.eyebrow}
                  </span>
                </div>
                <h1 className="mt-6 text-white">
                  <span className="block text-sm uppercase tracking-[0.2em] text-white/70">{offers.startingFrom}</span>
                  <span className="mt-1 flex flex-wrap items-baseline gap-x-3">
                    <span className="heading-display text-5xl md:text-7xl">AED {slide.price}</span>
                    <span className="text-base text-white/70 md:text-lg">{offers.perMonth}</span>
                  </span>
                </h1>
                <p className="mt-4 text-base text-white/80 md:text-lg">{offers.firstCustomers}</p>
                <ul className="mt-6 grid max-w-lg grid-cols-2 gap-px border border-white/15 bg-white/15">
                  {slide.perks.map((perk) => (
                    <li key={perk.label} className="flex items-center gap-3 bg-black/55 px-4 py-3 backdrop-blur-md">
                      <span className="text-2xl font-bold leading-none text-lepas-amber">{perk.value}</span>
                      <span className="text-xs leading-snug text-white/80">{perk.label}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href={slide.primaryCta.href} className="btn-primary">
                    {slide.primaryCta.label}
                  </Link>
                  <Link href={slide.secondaryCta.href} className="btn-outline-light">
                    {slide.secondaryCta.label}
                  </Link>
                </div>
                <p className="mt-4 text-xs text-white/50">{offers.terms}</p>
              </>
            ) : (
              <>
                <p className="eyebrow">{slide.eyebrow}</p>
                <h1 className="heading-display mt-3 text-4xl text-white sm:text-5xl md:text-6xl">
                  {slide.title}
                </h1>
                <p className="mt-5 text-base text-white/70 md:text-lg">
                  {slide.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href={slide.primaryCta.href} className="btn-outline-light">
                    {slide.primaryCta.label}
                  </Link>
                  <Link href={slide.secondaryCta.href} className="btn-primary">
                    {slide.secondaryCta.label}
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Circular loading indicators only — no arrows */}
      <div className="container-lepas absolute inset-x-0 bottom-8 flex items-center justify-start">
        <div className="flex items-center gap-4">
          {slides.map((s, i) => (
            <button
              key={s.key}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}: ${s.eyebrow}`}
              aria-current={i === index}
              className="relative flex h-6 w-6 items-center justify-center"
            >
              <span className="absolute h-2 w-2 rounded-full bg-white/30" />
              {i === index && (
                <svg viewBox="0 0 24 24" className="absolute h-6 w-6 -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="2"
                  />
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
