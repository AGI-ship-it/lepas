"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function AlGhurairSection() {
  const { dict } = useLocale();
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative flex min-h-[85svh] items-center overflow-hidden bg-lepas-black py-24 text-white">
      <motion.div className="absolute inset-x-0 -inset-y-[10%]" style={{ y: imageY }}>
        <Image
          src="/design/assets/about/hero-landscape.webp"
          alt="Lepas SUV parked at a modern villa at sunset"
          fill
          sizes="100vw"
          className="object-cover object-[30%_center]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/55 to-black/10 rtl:bg-gradient-to-r" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-lepas-black to-transparent" />

      <div className="container-lepas relative flex justify-end">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <span aria-hidden="true" className="block h-px w-14 bg-lepas-amber" />
          <h2 className="heading-display mt-6 text-3xl md:text-5xl">{dict.discover.alGhurairTitle}</h2>
          <div className="mt-6 space-y-5 text-base text-white/70 md:text-lg">
            <p>{dict.discover.alGhurairBody1}</p>
            <p>{dict.discover.alGhurairBody2}</p>
          </div>
          <Link
            href="/discover/about#al-ghurair-mobility"
            className="btn-outline-light mt-10 px-10 py-4 uppercase tracking-[0.2em]"
          >
            {dict.common.learnMore}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
