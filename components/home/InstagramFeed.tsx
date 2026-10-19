"use client";

import Image from "next/image";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";

const tiles = [
  { src: "/design/assets/lifestyle/l8-drive.webp", alt: "Lepas L8 on the road" },
  { src: "/design/assets/inspired/aesthetics-car.webp", alt: "Lepas leopard-inspired headlights" },
  { src: "/design/assets/lifestyle/l6.webp", alt: "Lepas L6 lifestyle" },
  { src: "/design/assets/inspired/space-cabin.webp", alt: "Lepas cabin space" },
  { src: "/design/assets/lifestyle/l4-drive.webp", alt: "Lepas L4 on the road" },
  { src: "/design/assets/inspired/technology-cockpit.webp", alt: "Lepas cockpit technology" },
];

export default function InstagramFeed() {
  const { dict } = useLocale();

  return (
    <Section
      eyebrow={dict.home.instagramEyebrow}
      title={dict.home.instagramTitle}
      description={dict.home.instagramDescription}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {tiles.map((tile) => (
          <a
            key={tile.src}
            href="https://www.instagram.com/lepas.uae/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              sizes="(min-width: 768px) 16vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-110"
            />
          </a>
        ))}
      </div>
    </Section>
  );
}
