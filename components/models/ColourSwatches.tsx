"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ModelColour } from "@/lib/types";

/** "Select your shade": centred title, the shade name, the car side-on and a pill of swatches, as on lepasuae.com. */
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
        <h2 className="heading-display text-3xl md:text-4xl">{title}</h2>
        <p aria-live="polite" className="mt-3 text-base font-bold uppercase text-lepas-black/45">
          {colour.name}
        </p>

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

        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-black/5 bg-white px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] md:gap-6 md:px-8">
          {colours.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setActive(i)}
              aria-label={c.name}
              aria-pressed={i === active}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors md:h-14 md:w-14 ${
                i === active ? "border-lepas-black/40" : "border-transparent hover:border-lepas-black/15"
              }`}
            >
              <span
                className="h-9 w-9 rounded-full border border-black/10 md:h-11 md:w-11"
                style={{ background: `radial-gradient(circle at 50% 25%, rgba(255,255,255,0.45), transparent 60%), ${c.hex}` }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
