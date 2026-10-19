"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/components/i18n/LocaleProvider";

// Layout data from lepasuae.com; copy lives in dict.site.home.inspired.
const TABS = [
  {
    bg: "#000000",
    image: "/design/assets/inspired/aesthetics-car.webp",
    cards: [
      { image: "/design/assets/inspired/full/A1.webp", x: 70.3, y: 45.1 },
      { image: "/design/assets/inspired/full/A2.webp", x: 81.7, y: 54.4 },
      { image: "/design/assets/inspired/full/A3.webp", x: 54.9, y: 42.4 },
    ],
  },
  {
    bg: "#000814",
    image: "/design/assets/inspired/technology-cockpit.webp",
    cards: [
      { image: "/design/assets/inspired/full/B1.webp", x: 35.8, y: 52.7 },
      { image: "/design/assets/inspired/full/B2.webp", x: 50, y: 39.8 },
    ],
  },
  {
    bg: "#cfe6ee",
    image: "/design/assets/inspired/space-cabin.webp",
    cards: [
      { image: "/design/assets/inspired/full/C1.webp", x: 36.2, y: 51.4 },
      { image: "/design/assets/inspired/full/C2.webp", x: 80.3, y: 61.6 },
    ],
  },
];

export default function InspiredSection() {
  const { dict } = useLocale();
  const copy = dict.site.home.inspired;
  const [tab, setTab] = useState(0);
  const [card, setCard] = useState(0);

  const layout = TABS[tab];
  const text = copy[tab];

  const selectTab = (i: number) => {
    setTab(i);
    setCard(0);
  };

  return (
    <section className="relative overflow-hidden text-white" style={{ backgroundColor: layout.bg }}>
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[21/9]">
        <AnimatePresence initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <Image src={layout.image} alt={text.headline} fill sizes="100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

        {layout.cards.map((c, i) => (
          <button
            key={c.image}
            type="button"
            onClick={() => setCard(i)}
            aria-pressed={card === i}
            aria-label={text.cards[i]}
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
            className="absolute flex h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          >
            <span
              className={`absolute inset-0 rounded-full border-2 transition-colors duration-300 ${
                card === i ? "border-lepas-amber bg-lepas-amber/30" : "border-white/80 bg-white/20"
              }`}
            />
            <span className={`relative h-2 w-2 rounded-full ${card === i ? "bg-lepas-amber" : "bg-white"}`} />
          </button>
        ))}

        <div className="container-lepas absolute inset-x-0 top-0 pt-10 md:pt-14">
          <div role="tablist" className="flex flex-wrap gap-6 md:gap-10">
            {copy.map((t, i) => (
              <button
                key={t.label}
                type="button"
                role="tab"
                aria-selected={tab === i}
                onClick={() => selectTab(i)}
                className={`border-b-2 pb-2 text-sm font-semibold uppercase tracking-widest2 transition-colors ${
                  tab === i ? "border-lepas-amber text-white" : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <h3 className="heading-display mt-6 max-w-xl text-3xl md:text-5xl">{text.headline}</h3>
        </div>

        <div className="container-lepas absolute inset-x-0 bottom-0 pb-8 md:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tab}-${card}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="flex max-w-md items-center gap-4 bg-black/55 p-3 backdrop-blur-md"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden">
                <Image src={layout.cards[card].image} alt="" fill sizes="112px" className="object-cover" />
              </div>
              <p className="text-base text-white">{text.cards[card]}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
