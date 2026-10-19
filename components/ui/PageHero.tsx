"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

export default function PageHero({
  title,
  description,
  imageLabel,
  image,
  backHref,
  backLabel,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  imageLabel: string;
  image?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <section className="relative flex h-[88vh] min-h-[500px] items-end overflow-hidden bg-lepas-black">
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 h-full w-full"
      >
        {image ? (
          <div className="relative h-full w-full bg-lepas-black">
            <Image src={image} alt={imageLabel} fill className="object-cover" priority />
          </div>
        ) : (
          <PlaceholderImage label={imageLabel} aspect="aspect-auto" className="h-full w-full" />
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

      <div className="container-lepas relative pb-20 text-white">
        {backHref && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={backHref}
              className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-white/70 hover:text-white"
            >
              <span aria-hidden="true" className="rtl:rotate-180">←</span>
              {backLabel}
            </Link>
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="heading-display max-w-2xl text-start text-3xl sm:text-4xl md:text-5xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            className="mt-4 max-w-xl text-white/70"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
