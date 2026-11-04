"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ModelColour } from "@/lib/types";

/** "Select your shade": centred title, the car side-on, a pill of swatches and the shade name below it, as on lepasuae.com. */
export default function ColourSwatches({
  id,
  title,
  colours,
  modelName,
}: {
  id?: string;
  title: string;
  colours: ModelColour[];
  modelName: string;
}) {
  const [active, setActive] = useState(0);
  const colour = colours[active];

  return (
    <section id={id} className="scroll-mt-36 bg-[#f6f6f6] py-12 text-center text-lepas-black md:py-16">
      <div className="container-lepas">
        <h2 className="heading-2">{title}</h2>

        <div className="relative mx-auto mt-6 aspect-[16/7] w-full max-w-5xl">
          <AnimatePresence initial={false}>
            {colour.image && (
              <motion.img
                key={colour.image}
                src={colour.image}
                alt={`${modelName} in ${colour.name}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 h-full w-full object-contain"
                draggable={false}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Metallic paint chips, no container; the active one gets a ring with a small gap (Exeed style). */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {colours.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setActive(i)}
              aria-label={c.name}
              aria-pressed={i === active}
              className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors md:h-16 md:w-16 ${
                i === active ? "border-lepas-black" : "border-transparent hover:border-lepas-black/25"
              }`}
            >
              <span
                className="h-10 w-10 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] md:h-12 md:w-12"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0.28) 50%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.3) 100%), ${c.hex}`,
                }}
              />
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mt-4 text-base font-bold uppercase text-lepas-black/45">
          {colour.name}
        </p>
      </div>
    </section>
  );
}
