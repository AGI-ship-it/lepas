"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { FaInstagram, FaPlay } from "react-icons/fa";
import { useLocale } from "@/components/i18n/LocaleProvider";

const INSTAGRAM_URL = "https://www.instagram.com/lepas.uae/";

type Tile =
  | { kind: "image"; src: string; alt: string; aspect: string }
  | { kind: "reel"; src: string; poster: string; alt: string; aspect: string };

// Four staggered columns; each drifts at its own speed for depth.
const COLUMNS: { tiles: Tile[]; drift: [number, number]; className: string }[] = [
  {
    drift: [30, -30],
    className: "",
    tiles: [
      { kind: "image", src: "/design/assets/L8-v2.webp", alt: "Lepas L8 on the beach at sunset", aspect: "aspect-[4/5]" },
      { kind: "image", src: "/design/assets/inspired/full/A1.webp", alt: "Lepas leopard-eye headlight", aspect: "aspect-square" },
    ],
  },
  {
    drift: [80, -50],
    className: "md:pt-16",
    tiles: [
      {
        kind: "reel",
        src: "/video/life-tech-seats.mp4",
        poster: "/design/assets/life-tech-seats.webp",
        alt: "Inside the Lepas cabin",
        aspect: "aspect-[4/5]",
      },
      { kind: "image", src: "/design/assets/inspired/full/B1.webp", alt: "Lepas cockpit controls", aspect: "aspect-square" },
    ],
  },
  {
    drift: [20, -60],
    className: "hidden md:flex",
    tiles: [
      { kind: "image", src: "/design/assets/inspired/full/A3.webp", alt: "Lepas front design", aspect: "aspect-square" },
      { kind: "image", src: "/design/assets/hero-l4.webp", alt: "Lepas L4 on the road", aspect: "aspect-[4/5]" },
    ],
  },
  {
    drift: [90, -30],
    className: "hidden md:flex md:pt-24",
    tiles: [
      { kind: "image", src: "/design/assets/L6-v2.webp", alt: "Lepas L6 in the city", aspect: "aspect-[4/5]" },
      { kind: "image", src: "/design/assets/inspired/technology-cockpit.webp", alt: "Lepas cockpit technology", aspect: "aspect-square" },
    ],
  },
];

function GalleryColumn({
  progress,
  drift,
  className,
  children,
}: {
  progress: MotionValue<number>;
  drift: [number, number];
  className: string;
  children: React.ReactNode;
}) {
  const y = useTransform(progress, [0, 1], drift);
  return (
    <motion.div style={{ y }} className={`flex flex-col gap-4 md:gap-6 ${className}`}>
      {children}
    </motion.div>
  );
}

function TileCard({ tile, reelLabel }: { tile: Tile; reelLabel: string }) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tile.alt}
      className={`group relative block overflow-hidden bg-lepas-ink ring-1 ring-white/10 transition-shadow duration-500 hover:ring-2 hover:ring-lepas-amber hover:shadow-[0_0_40px_rgba(235,146,1,0.25)] ${tile.aspect}`}
    >
      {tile.kind === "reel" ? (
        <video
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
          src={tile.src}
          poster={tile.poster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      ) : (
        <Image
          src={tile.src}
          alt={tile.alt}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <FaInstagram
        aria-hidden="true"
        className="absolute bottom-4 start-4 h-5 w-5 translate-y-2 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
      />
      {tile.kind === "reel" && (
        <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest2 text-white backdrop-blur-md">
          <FaPlay className="h-2 w-2 text-lepas-amber" aria-hidden="true" />
          {reelLabel}
        </span>
      )}
    </a>
  );
}

export default function InstagramFeed() {
  const { dict } = useLocale();
  const t = dict.home;
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const still = useTransform(progress, () => 0);
  const columnProgress = reduceMotion ? still : progress;
  const handleX = useTransform(columnProgress, [0, 1], ["5%", "-45%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-lepas-black pb-16 pt-24 text-white md:pb-20 md:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(235,146,1,0.12),transparent_50%)]"
      />

      <div className="container-lepas relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-semibold tracking-widest2 text-lepas-amber">
              <FaInstagram className="h-4 w-4" aria-hidden="true" />
              {t.instagramEyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-normal leading-[1.1] md:text-6xl">{t.instagramTitle}</h2>
            <p className="mt-5 max-w-xl text-base text-white/60 md:text-lg">{t.instagramDescription}</p>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary shrink-0 self-start px-8 py-3.5 uppercase tracking-[0.2em] md:self-auto"
          >
            <FaInstagram className="h-4 w-4" aria-hidden="true" />
            {t.instagramFollow}
          </a>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-4 md:gap-6">
          {COLUMNS.map((col, i) => (
            <GalleryColumn key={i} progress={columnProgress} drift={col.drift} className={col.className}>
              {col.tiles.map((tile) => (
                <TileCard key={tile.src} tile={tile} reelLabel={t.instagramReel} />
              ))}
            </GalleryColumn>
          ))}
        </div>
      </div>

      {/* Oversized outline handle sliding sideways as the section scrolls */}
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.instagramFollow}
        className="relative mt-8 block overflow-hidden md:mt-10"
        dir="ltr"
      >
        <motion.span
          aria-hidden="true"
          style={{ x: handleX, WebkitTextStroke: "1.5px rgba(235,146,1,0.6)" }}
          className="block whitespace-nowrap text-[20vw] font-bold leading-[0.9] text-transparent transition-colors duration-500 hover:text-lepas-amber/15"
        >
          @lepas.uae · @lepas.uae
        </motion.span>
      </a>
    </section>
  );
}
