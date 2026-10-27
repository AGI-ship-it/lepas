"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { VehicleModel } from "@/lib/types";
import { Dictionary } from "@/lib/i18n";

// Stats are stored in a fixed order: engine, transmission, power/torque, wheelbase, combined range.
const statIcons = ["engine", "transmission", "power-torque", "wheelbase", "combined-range"];

/** Full-bleed model hero with the key specs and CTAs along the bottom, as on lepasuae.com. */
export default function ModelHero({
  model,
  dict,
  brochure,
}: {
  model: VehicleModel;
  dict: Dictionary;
  brochure?: string;
}) {
  const d = model.detailPage;

  return (
    <section className="relative flex h-[100svh] min-h-[640px] items-end overflow-hidden bg-lepas-black pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 h-full w-full"
      >
        {model.heroImage ? (
          <Image src={model.heroImage} alt={model.heroImageLabel} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <PlaceholderImage label={model.heroImageLabel} aspect="aspect-auto" className="h-full w-full" />
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

      <div className="container-lepas relative pb-10 text-white md:pb-14">
        <h1 className="sr-only">{d.heroHeadline}</h1>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className={`grid grid-cols-2 gap-x-6 gap-y-6 md:gap-x-8 ${d.stats.length > 4 ? "md:grid-cols-5" : "md:grid-cols-4"}`}
        >
          {d.stats.map((stat, i) => (
            <li key={stat.label} className="flex items-center gap-4 border-b border-white/60 pb-4">
              {statIcons[i] && (
                <Image
                  src={`/svg/model-spec/${statIcons[i]}.svg`}
                  alt=""
                  width={36}
                  height={36}
                  className="h-8 w-8 shrink-0 md:h-9 md:w-9"
                />
              )}
              <span className="flex flex-col border-s border-white/60 ps-4">
                <span className="text-[11px] leading-tight text-white/90 md:text-xs">{stat.label}</span>
                <span className="mt-1 text-sm font-bold uppercase md:text-base">{stat.value}</span>
              </span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link href={`/models/test-drive?model=${model.slug}`} className="btn-primary text-center">
            {dict.common.bookTestDrive}
          </Link>
          {brochure ? (
            <a href={brochure} target="_blank" rel="noopener noreferrer" className="btn-outline-light text-center">
              {dict.common.downloadBrochure}
            </a>
          ) : (
            <Link href={`/models/finance-calculator?model=${model.slug}`} className="btn-outline-light text-center">
              {dict.nav.calculateFinance}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
