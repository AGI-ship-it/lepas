"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function LogoStoryHero({
  id,
  eyebrow,
  headlineLine1,
  headlineLine2,
  body,
}: {
  id?: string;
  eyebrow?: string;
  headlineLine1: string;
  headlineLine2: string;
  body: string | string[];
}) {
  const paragraphs = Array.isArray(body) ? body : [body];

  return (
    <section id={id} className="relative flex min-h-[85vh] items-center overflow-hidden bg-lepas-black text-white">
      <div className="absolute inset-0">
        <Image
          src="/design/assets/about/brand-story-bg.webp"
          alt="Snow leopard gazing upward through mist, with the Lepas wing emblem"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />

      <div className="container-lepas relative flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="flex items-center"
        >
          <Logo className="h-8 w-auto text-white md:h-12" />
        </motion.div>

        {eyebrow && (
          <p className="eyebrow mt-10">{eyebrow}</p>
        )}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className={`${eyebrow ? "mt-4" : "mt-10"} !text-center text-3xl font-bold leading-tight tracking-tight md:text-5xl`}
        >
          <span className="block font-extrabold uppercase">{headlineLine1}</span>
          <span className="block font-normal uppercase">{headlineLine2}</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mx-auto mt-8 max-w-2xl space-y-5 text-base text-white/80 md:text-lg"
        >
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
