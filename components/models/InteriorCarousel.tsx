"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { CabinTab } from "@/lib/types";

function ArrowButton({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-lepas-amber text-lepas-amber transition-colors hover:bg-lepas-amber hover:text-lepas-black disabled:pointer-events-none disabled:opacity-40"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 rtl:rotate-180" aria-hidden="true">
        <path
          d={direction === "prev" ? "M19 12H5m0 0l6-6m-6 6l6 6" : "M5 12h14m0 0l-6-6m6 6l-6 6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function InteriorCarousel({ title, tabs }: { title: string; tabs: CabinTab[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Track which slide sits at the start edge as the user swipes or scrolls.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const rtl = getComputedStyle(track).direction === "rtl";
      const box = track.getBoundingClientRect();
      let best = 0;
      let bestDist = Infinity;
      slideRefs.current.forEach((slide, i) => {
        if (!slide) return;
        const r = slide.getBoundingClientRect();
        const dist = Math.abs(rtl ? box.right - r.right : r.left - box.left);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      // At the end of the track the last slide can't reach the start edge.
      const atEnd = Math.abs(track.scrollLeft) + track.clientWidth >= track.scrollWidth - 2;
      setActive(atEnd ? tabs.length - 1 : best);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [tabs.length]);

  const goTo = (i: number) => {
    const slide = slideRefs.current[Math.max(0, Math.min(tabs.length - 1, i))];
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <section id="interior" className="scroll-mt-36 bg-white py-20 text-lepas-black md:py-28">
      <div className="container-lepas">
        <div className="mb-10 flex items-center justify-between gap-6 md:mb-14">
          <h2 className="heading-display text-3xl md:text-5xl">{title}</h2>
          <div className="flex shrink-0 gap-4">
            <ArrowButton direction="prev" label="Previous" disabled={active === 0} onClick={() => goTo(active - 1)} />
            <ArrowButton
              direction="next"
              label="Next"
              disabled={active === tabs.length - 1}
              onClick={() => goTo(active + 1)}
            />
          </div>
        </div>

        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto"
        >
          {tabs.map((tab, i) => {
            const views = [tab.image, tab.image2].filter(Boolean) as string[];
            const paired = views.length > 1;
            return (
              <div
                key={tab.heading}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${tabs.length}`}
                className={`shrink-0 snap-start ${paired ? "w-[88%] md:w-[85%]" : "w-[88%] md:w-[42%]"}`}
              >
                <div className={`grid gap-5 ${paired ? "md:grid-cols-2" : ""}`}>
                  {views.length > 0 ? (
                    views.map((src, v) => (
                      <div
                        key={src}
                        className={`relative aspect-[595/567] w-full overflow-hidden bg-lepas-fog ${v > 0 ? "hidden md:block" : ""}`}
                      >
                        <Image
                          src={src}
                          alt={paired ? `${tab.imageLabel}, view ${v + 1}` : tab.imageLabel}
                          fill
                          sizes="(min-width: 768px) 42vw, 88vw"
                          className="object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <PlaceholderImage label={tab.imageLabel} aspect="aspect-[595/567]" showLabel={false} />
                  )}
                </div>
                <h3 className="mt-6 text-lg font-bold uppercase md:text-2xl">{tab.heading}</h3>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          {tabs.map((tab, i) => (
            <button
              key={tab.heading}
              type="button"
              onClick={() => goTo(i)}
              aria-label={tab.heading}
              aria-current={i === active}
              className={`h-1 w-12 transition-colors ${i === active ? "bg-lepas-amber" : "bg-lepas-fog"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
