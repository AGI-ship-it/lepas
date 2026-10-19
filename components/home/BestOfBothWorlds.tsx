"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";

const carImages: Record<string, string> = {
  l8: "/design/assets/L8-v2.webp",
  l6: "/design/assets/L6-v2.webp",
  l4: "/design/assets/L4-v2.webp",
};

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`border px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "border-lepas-amber bg-lepas-amber text-white"
          : "border-white/20 text-white hover:border-white/60"
      }`}
    >
      {children}
    </button>
  );
}

export default function BestOfBothWorlds() {
  const { dict } = useLocale();
  const wheelbase = dict.home.bestOfBoth.combinedRange;
  const [carIndex, setCarIndex] = useState(0);
  const [specIndex, setSpecIndex] = useState(0);

  const cars = [
    {
      slug: "l8",
      name: "L8",
      alt: "Teal Lepas L8 SUV driving along a wet beach at sunset.",
      specs: [
        { label: dict.home.bestOfBoth.maxPower, value: "184 HP" },
        { label: dict.home.bestOfBoth.torque, value: "290 NM" },
        { label: wheelbase, value: "2,800 MM" },
      ],
    },
    {
      slug: "l6",
      name: "L6",
      alt: "Orange Lepas L6 SUV parked in a modern city plaza.",
      specs: [
        { label: dict.home.bestOfBoth.maxPower, value: "145 HP" },
        { label: dict.home.bestOfBoth.torque, value: "225 NM" },
        { label: wheelbase, value: "2,700 MM" },
      ],
    },
    {
      slug: "l4",
      name: "L4",
      alt: "Red Lepas L4 compact SUV driving on a city road at sunset.",
      specs: [
        { label: dict.home.bestOfBoth.maxPower, value: "145 HP" },
        { label: dict.home.bestOfBoth.torque, value: "225 NM" },
        { label: wheelbase, value: "2,700 MM" },
      ],
    },
  ];

  const car = cars[carIndex];
  const spec = car.specs[specIndex];

  return (
    <Section
      light={false}
      eyebrow={dict.home.rangeEyebrow}
      title={dict.home.bestOfBothTitle}
      className="!py-8 md:!py-10"
    >
      {/* Car select */}
      <div className="flex justify-center gap-2">
        {cars.map((c, i) => (
          <TabButton
            key={c.slug}
            active={i === carIndex}
            onClick={() => {
              setCarIndex(i);
              setSpecIndex(0);
            }}
          >
            {c.name}
          </TabButton>
        ))}
      </div>

      {/* Car image with highlighted spec callout */}
      <Link
        href={`/models/${car.slug}`}
        className="group relative mt-6 block overflow-hidden rounded-2xl"
      >
        <div className="relative aspect-[24/9] w-full overflow-hidden bg-lepas-ink">
          <AnimatePresence mode="wait">
            <motion.div
              key={car.slug}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={carImages[car.slug]}
                alt={car.alt}
                fill
                className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/0 to-black/10" />
          <div className="absolute inset-x-0 top-6 flex justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${car.slug}-${spec.label}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-widest2 text-white/70">
                  {spec.label}
                </p>
                <p className="mt-1 text-2xl font-extrabold text-white md:text-3xl">
                  {spec.value}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Link>

      {/* Spec select */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {car.specs.map((s, i) => (
          <TabButton key={s.label} active={i === specIndex} onClick={() => setSpecIndex(i)}>
            {s.label}
          </TabButton>
        ))}
      </div>
    </Section>
  );
}
