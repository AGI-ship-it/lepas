"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { DesignGallerySlide } from "@/lib/types";

export default function DesignGallery({ slides }: { slides: DesignGallerySlide[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  return (
    <div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <PlaceholderImage label={slide.imageLabel} aspect="aspect-[16/9]" className="h-full" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 flex w-full justify-center gap-2 end-0">
          {slides.map((s, i) => (
            <button
              key={s.imageLabel}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}: ${s.heading}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-8 bg-white" : "w-4 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 max-w-2xl">
        <h3 className="text-lg font-bold text-lepas-black">{slide.heading}</h3>
        <p className="mt-2 text-sm text-lepas-steel">{slide.body}</p>
      </div>
    </div>
  );
}
