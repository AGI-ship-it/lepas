import type { ReactNode } from "react";
import Image from "next/image";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import type { Offer } from "@/lib/types";
import type { OfferMeta } from "@/components/forms/offerMeta";

interface OfferBannerProps {
  offer: Offer;
  meta?: OfferMeta;
  modelName?: string;
  labels: { badge: string; startingFrom: string; perMonth: string; terms: string };
  priority?: boolean;
  /** CTAs rendered under the highlights. */
  actions?: ReactNode;
  /** Rendered above the badge, e.g. a back link. */
  before?: ReactNode;
  /** Fill the viewport like the home hero instead of keeping the photo's aspect ratio. */
  fullHeight?: boolean;
}

// Offer banner set as live copy over the clean photography, matching the home hero offer slides.
export default function OfferBanner({ offer, meta, modelName, labels, priority, actions, before, fullHeight }: OfferBannerProps) {
  const image = offer.bannerImage ?? offer.image;
  const highlights = offer.highlights ?? [];

  return (
    <div
      className={`relative flex w-full overflow-hidden bg-lepas-black ${
        fullHeight ? "h-[100svh] min-h-[640px]" : "min-h-[640px] md:min-h-0 md:aspect-[1728/970]"
      }`}
    >
      {image ? (
        <Image
          src={image}
          alt={offer.imageLabel}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-[72%_center] md:object-center"
        />
      ) : (
        <PlaceholderImage label={offer.imageLabel} aspect="aspect-auto h-full" className="absolute inset-0 h-full" tone="accent" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent rtl:bg-gradient-to-l" />

      <div
        className={`container-lepas relative flex w-full flex-col justify-end pb-20 md:justify-center ${
          fullHeight ? "pt-32 md:pb-0" : "pt-24 md:py-16"
        }`}
      >
        <div className="max-w-xl">
          {before}
          <div className="flex items-center gap-3">
            <span className="border border-lepas-amber px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest2 text-lepas-amber">
              {labels.badge}
            </span>
            {modelName && (
              <span className="text-xs font-semibold uppercase tracking-widest2 text-white/80 md:text-sm">{modelName}</span>
            )}
          </div>
          {meta && (
            <p className="mt-6 text-white">
              <span className="block text-sm uppercase tracking-[0.2em] text-white/70">{labels.startingFrom}</span>
              <span className="mt-1 flex flex-wrap items-baseline gap-x-3">
                <span className="heading-display text-5xl md:text-7xl">AED {meta.monthly}</span>
                <span className="text-base text-white/70 md:text-lg">{labels.perMonth}</span>
              </span>
            </p>
          )}
          {highlights.length > 0 && (
            <ul className="mt-6 grid max-w-lg grid-cols-2 gap-px border border-white/15 bg-white/15">
              {highlights.map((h, i) => (
                <li
                  key={h.label}
                  className={`flex flex-col justify-center gap-1 bg-black/55 px-4 py-3 backdrop-blur-md ${
                    highlights.length % 2 === 1 && i === highlights.length - 1 ? "col-span-2" : ""
                  }`}
                >
                  <span className="text-base font-bold uppercase leading-tight text-lepas-amber md:text-lg">{h.value}</span>
                  <span className="text-xs leading-snug text-white/80">{h.label}</span>
                </li>
              ))}
            </ul>
          )}
          {actions && <div className="mt-8 flex flex-wrap gap-4">{actions}</div>}
          <p className="mt-4 text-xs text-white/50">{labels.terms}</p>
        </div>
      </div>
    </div>
  );
}
