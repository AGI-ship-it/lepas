"use client";

import { useState } from "react";

function slugify(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/**
 * Static colour/angle viewer. Renders whichever frame is passed in (the
 * selected colourway's photo) with an expand-to-fullscreen affordance.
 */
export default function Spin360Viewer({
  frames,
  alt,
  overlay,
}: {
  frames: string[];
  alt: string;
  overlay?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  const src = frames[0];
  const fallbackSrc = `https://picsum.photos/seed/${slugify(alt)}/1600/1000`;

  return (
    <div className="group relative aspect-[16/9] w-full select-none overflow-hidden rounded-2xl bg-lepas-fog">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || fallbackSrc}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain"
        draggable={false}
      />

      {/* Expand */}
      <button
        onClick={() => setExpanded(true)}
        aria-label="Expand viewer"
        className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-lepas-black/15 bg-white/80 text-lepas-black opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
      >
        <ExpandIcon />
      </button>

      {overlay && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-lepas-fog via-lepas-fog/90 to-transparent px-6 pb-5 pt-10">
          {overlay}
        </div>
      )}

      {expanded && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setExpanded(false)}
        >
          <button
            aria-label="Close"
            className="absolute end-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white hover:border-white"
          >
            ✕
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src || fallbackSrc}
              alt={alt}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
