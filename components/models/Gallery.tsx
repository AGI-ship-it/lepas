"use client";

import { useState } from "react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

export default function Gallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <PlaceholderImage
        label={images[active]}
        aspect="aspect-[16/9]"

      />
      <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-6">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => setActive(i)}
            aria-label={`Show image: ${img}`}
            aria-current={i === active}
            className={`overflow-hidden border transition-colors ${
              i === active ? "border-lepas-black" : "border-lepas-fog hover:border-lepas-steel/50"
            }`}
          >
            <PlaceholderImage label={img} aspect="aspect-square" />
          </button>
        ))}
      </div>
    </div>
  );
}
