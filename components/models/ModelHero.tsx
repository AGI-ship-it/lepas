"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiDownload } from "react-icons/fi";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { VehicleModel } from "@/lib/types";
import { Dictionary } from "@/lib/i18n";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { usePowertrain } from "@/components/models/Powertrain";
import ModelTrimBar from "@/components/models/ModelTrimBar";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Full-bleed model hero in the exeed-uae.com/en/models/rx pattern: breadcrumb, name, tagline and CTAs,
 * plus a Super Hybrid chip that switches the whole page to the PHEV (and back).
 */
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
  const t = dict.models;
  const { powertrains, active, setActive } = usePowertrain();
  const heroImage = active?.heroImage ?? model.heroImage;
  // Every powertrain's photo stays mounted so switching crossfades instead of flashing while loading.
  const heroImages = Array.from(new Set([model.heroImage, ...powertrains.map((p) => p.heroImage)].filter(Boolean))) as string[];
  const brochureHref = active?.brochure ?? brochure;

  const phev = powertrains.find((p) => p.id === "phev");
  const isPhev = active?.id === "phev";
  const other = powertrains.find((p) => p.id !== active?.id);

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-lepas-black pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
        className="absolute inset-0 h-full w-full"
      >
        {heroImage ? (
          heroImages.map((src) => (
            <Image
              key={src}
              src={src}
              alt={src === heroImage ? model.heroImageLabel : ""}
              fill
              priority={src === heroImage}
              sizes="100vw"
              className={`object-cover transition-opacity duration-700 ${src === heroImage ? "opacity-100" : "opacity-0"}`}
            />
          ))
        ) : (
          <PlaceholderImage label={model.heroImageLabel} aspect="aspect-auto" className="h-full w-full" />
        )}
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.55)_0%,rgba(10,10,10,0.2)_30%,rgba(10,10,10,0.5)_60%,rgba(10,10,10,0.95)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent rtl:bg-gradient-to-l" />

      <div className="container-lepas relative flex flex-1 items-center py-10 text-white md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="max-w-3xl"
        >
          <Breadcrumb
            items={[
              { label: dict.testDriveFlow.home, href: "/" },
              { label: dict.site.nav.ourModels, href: "/models" },
              { label: model.name },
            ]}
          />
          <h1 className="mt-5 text-5xl font-light uppercase leading-none tracking-wide md:text-7xl">
            {model.name}
            {isPhev && <span className="text-lepas-amber"> {phev?.label}</span>}
            <span className="sr-only"> — {d.heroHeadline}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/85 md:text-xl">{model.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={`/models/test-drive?model=${model.slug}`} className="btn-primary text-center">
              {dict.common.bookTestDrive}
            </Link>
            <Link href={`/models/finance-calculator?model=${model.slug}`} className="btn-outline-light text-center">
              {dict.nav.calculateFinance}
            </Link>
            <Link href="/models/compare" className="btn-outline-light text-center">
              {dict.nav.compareModels}
            </Link>
          </div>

          {/* Super Hybrid chip: switches every powertrain-aware section to the PHEV, and back to ICE. */}
          {phev && other && (
            <button
              type="button"
              onClick={() => setActive(other.id)}
              className="group mt-6 inline-flex items-center gap-3 border border-white/25 bg-white/[0.06] py-2 pe-5 ps-2 text-start backdrop-blur-sm transition-colors hover:border-lepas-amber/60 hover:bg-lepas-amber/10"
            >
              <span className="bg-lepas-amber px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest2 text-lepas-black">
                {isPhev ? other.label : t.superHybridBadge}
              </span>
              <span className="text-sm font-semibold text-white">
                {(isPhev ? t.backToIce : t.discoverPhev).replace("{model}", model.name)}
              </span>
              <FiArrowRight
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
              />
            </button>
          )}

          {brochureHref && (
            <a
              href={brochureHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-fit items-center gap-2 text-sm font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              <FiDownload aria-hidden="true" />
              {dict.common.downloadBrochure}
            </a>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
        className="relative"
      >
        <ModelTrimBar model={model} dict={dict} />
      </motion.div>
    </section>
  );
}
