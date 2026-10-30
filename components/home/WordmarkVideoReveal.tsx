"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLocale } from "@/components/i18n/LocaleProvider";

const VIDEO_SRC = "/video/L8.mp4";
const POSTER = "/design/assets/hero-car-from-figma.webp";
const SHEET = "#111111";

// Path from public/svg/lepas-wordmark-mask.svg, inlined so the overlay can cut it out as a hole.
const WORDMARK_VIEWBOX = "0 0 640.524 114.055";
const WORDMARK_PATH = "M 149.302 0 C 74.681 24.635 27.381 62.073 47.105 71.061 C 56.093 75.162 61.151 73.405 143.599 67.498 C 142.995 63.364 144.375 59 148.126 54.866 C 164.99 37.512 200.466 32.904 222.224 33.288 C 242.389 33.648 268.551 45.519 252.832 55.888 C 248.509 58.682 214.274 65.741 172.482 72.711 C 194.804 79.738 234.766 71.715 259.735 67.196 L 259.719 67.204 C 286.233 62.416 305.768 57.832 331.579 51.786 C 303.358 77.793 287.319 93.604 260.577 114.055 L 234.186 114.055 C 250.07 101.954 274.271 83.096 291.699 69.852 C 251.516 78.856 210.998 90.694 168.429 85.212 C 159.818 83.782 153.249 80.767 148.992 76.919 C 105.99 84.567 20.437 103.073 3.605 81.74 C -16.11 56.738 48.6 20.827 111.113 0 L 149.302 0 Z M 289.966 49.425 C 358.142 30.624 406.16 27.381 411.144 44.474 C 414.583 56.256 375.07 73.945 336.056 80.653 C 351.678 81.789 384.925 76.192 405.972 71.191 C 415.295 54.556 456.973 28.41 533.711 34.946 C 527.754 38.737 503.839 60.725 507.099 69.026 C 508.244 71.943 531.677 63.135 544.177 56.754 C 533.188 50.185 558.614 30.918 640.524 37.038 L 632.959 43.052 C 597.482 40.045 546.8 49.589 573.566 55.831 C 585.593 58.634 602.491 56.599 620.523 59.173 L 620.539 59.173 C 634.935 61.232 634.69 66.117 634.6 68.274 C 633.955 83.701 582.244 87.835 532.077 83.235 L 538.115 78.586 C 558.615 80.547 608.119 78.071 609.403 68.708 C 610.473 60.864 564.114 66.967 554.431 63.119 C 481.967 106.064 479.948 76.805 486.779 62.653 C 439.496 91.389 406.528 89.567 404.118 78.831 C 378.217 86.634 347.095 89.984 313.874 87.427 C 310.834 87.19 309.192 82.32 312.044 81.65 C 356.279 71.282 382.784 55.422 382.179 49.694 C 381.109 39.636 355.87 45.813 287.564 56.002 L 289.966 49.425 Z M 496.829 43.354 C 450.077 42.48 424.601 66.567 429.462 73.61 C 434.113 80.342 476.174 61.558 496.829 43.354 Z M 236.474 48.828 C 231.351 38.337 186.217 45.715 174.149 56.427 C 171.118 59.107 169.614 62.564 169.312 64.5 C 201.079 59.728 225.983 54.45 236.474 48.828 Z M 610.653 61.199 C 610.718 61.232 610.767 61.239 610.76 61.199 L 610.653 61.199 Z";

// Thickest point of the wordmark near its centre (inside the "a"); zooming from here
// flies the camera through the letter instead of past it.
const ZOOM_ORIGIN = "61.5% 41.2%";
const MAX_ZOOM = 90;

const EASE_DRAW = [0.65, 0, 0.35, 1] as const;

// The white outline draws the wordmark, the letters fill with the L8 film, then
// scrolling flies through the "a" into a full-bleed parallax shot.
export default function WordmarkVideoReveal() {
  const { dict } = useLocale();
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.35 });

  // Exponential zoom reads as a constant camera speed.
  const zoom = useTransform(progress, [0.08, 0.62], [0, 1], { clamp: true });
  const sheetScale = useTransform(zoom, (t) => Math.pow(MAX_ZOOM, t));
  const outlineWidth = useTransform(sheetScale, (z) => 1.6 / z);
  const outlineOpacity = useTransform(zoom, [0.55, 0.85], [1, 0]);
  const sheetOpacity = useTransform(progress, [0.6, 0.66], [1, 0]);
  const glowOpacity = useTransform(zoom, [0, 0.4], [1, 0]);
  const videoScale = useTransform(progress, [0, 1], [1.35, 1]);
  const videoY = useTransform(progress, [0, 1], ["-8%", "4%"]);
  const titleOpacity = useTransform(progress, [0.64, 0.8], [0, 1]);
  const titleY = useTransform(progress, [0.64, 0.8], [48, 0]);
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  const [lead, ...rest] = dict.home.rangeTitle.split(" with ");
  const title = (
    <h2 className="!text-center flex flex-col items-center px-6 text-white">
      {rest.length > 0 ? (
        <>
          <span className="text-sm font-normal uppercase tracking-[0.2em] md:text-2xl">{lead}</span>
          <span className="mt-2 text-2xl font-bold uppercase md:text-5xl">with {rest.join(" with ")}</span>
        </>
      ) : (
        <span className="text-2xl font-bold md:text-5xl">{lead}</span>
      )}
    </h2>
  );

  const video = (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      src={VIDEO_SRC}
      poster={POSTER}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
    />
  );

  if (reduceMotion) {
    return (
      <section className="relative flex h-[90vh] min-h-[560px] items-center justify-center overflow-hidden bg-lepas-black">
        {video}
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative">{title}</div>
      </section>
    );
  }

  return (
    <section ref={ref} data-screen-label="Wordmark reveal" className="relative h-[320vh] bg-lepas-graphite">
      <div ref={stageRef} className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-lepas-black">
        <motion.div className="absolute inset-0 will-change-transform" style={{ scale: videoScale, y: videoY }}>
          {video}
        </motion.div>
        <motion.div className="absolute inset-0 bg-black/35" style={{ opacity: titleOpacity }} />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ opacity: sheetOpacity }}
        >
          {/* Warm halo behind the letters while they sit on the sheet */}
          <motion.div
            className="absolute h-[40vw] w-[70vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(235,146,1,0.16),transparent_65%)]"
            style={{ opacity: glowOpacity }}
          />
          <motion.svg
            viewBox={WORDMARK_VIEWBOX}
            overflow="visible"
            className="relative w-[88vw] max-w-[1100px] md:w-[56vw]"
            style={{ scale: sheetScale, transformOrigin: ZOOM_ORIGIN }}
          >
            <defs>
              <mask id="lepas-wordmark-hole" maskUnits="userSpaceOnUse" x="-20000" y="-20000" width="40000" height="40000">
                <rect x="-20000" y="-20000" width="40000" height="40000" fill="#fff" />
                <path d={WORDMARK_PATH} fill="#000" />
              </mask>
            </defs>
            <rect x="-20000" y="-20000" width="40000" height="40000" fill={SHEET} mask="url(#lepas-wordmark-hole)" />
            {/* Letters start solid and dissolve into the film once the outline has drawn */}
            <motion.path
              d={WORDMARK_PATH}
              fill={SHEET}
              initial={{ opacity: 1 }}
              animate={{ opacity: inView ? 0 : 1 }}
              transition={{ duration: 1.4, delay: 1.5, ease: "easeOut" }}
            />
            <motion.path
              d={WORDMARK_PATH}
              fill="none"
              stroke="#ffffff"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: inView ? 1 : 0 }}
              transition={{ duration: 2.2, ease: EASE_DRAW }}
              style={{
                strokeWidth: outlineWidth,
                opacity: outlineOpacity,
                filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))",
              }}
            />
          </motion.svg>
        </motion.div>

        <motion.span
          aria-hidden="true"
          className="absolute bottom-10 left-1/2 h-12 w-px -translate-x-1/2 overflow-hidden bg-white/15"
          style={{ opacity: hintOpacity }}
        >
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-hint_1.6s_ease-in-out_infinite] bg-lepas-amber" />
        </motion.span>

        <motion.div className="relative" style={{ opacity: titleOpacity, y: titleY }}>
          {title}
        </motion.div>
      </div>
    </section>
  );
}
