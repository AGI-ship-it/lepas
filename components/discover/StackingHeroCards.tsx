"use client";

import Image from "next/image";

const CARDS = [
  { src: "/design/assets/inspired/aesthetics-car.webp", alt: "Aesthetics — modelled after the leopard" },
  { src: "/design/assets/inspired/technology-cockpit.webp", alt: "Technology — technology that feels intuitive" },
  { src: "/design/assets/inspired/space-cabin.webp", alt: "Space — a space that lets you breathe" },
  { src: "/design/assets/journey-3cars.webp", alt: "Choose the experience that drives your lifestyle" },
];

export default function StackingHeroCards() {
  return (
    <section className="relative bg-lepas-black">
      {CARDS.map((card, i) => (
        <div
          key={card.src}
          className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
          style={{ zIndex: i + 1 }}
        >
          <div className="relative aspect-video w-full">
            <Image
              src={card.src}
              alt={card.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
