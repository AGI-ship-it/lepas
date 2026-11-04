"use client";

import { useState } from "react";
import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
import Logo from "@/components/ui/Logo";
import { useLocale } from "@/components/i18n/LocaleProvider";

type Filter = "all" | "showroom" | "service";

/** Location cards with All / Showrooms / Service Centres filter chips (structure as on exeed-uae.com/en/contact). */
export default function LocationsGrid() {
  const { dict } = useLocale();
  const t = dict.lepasUi;
  const [filter, setFilter] = useState<Filter>("all");

  const filters: Filter[] = ["all", "showroom", "service"];
  const visible = t.locations.filter((loc) => filter === "all" || loc.type === filter);

  return (
    <>
      <div role="group" aria-label={t.locationsTitle} className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const on = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f)}
              className={`border px-5 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                on
                  ? "border-lepas-amber bg-lepas-amber text-lepas-black"
                  : "border-white/20 text-white/80 hover:border-white hover:text-white"
              }`}
            >
              {t.locationFilters[f]}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((loc) => {
          const open = loc.status === "open";
          return (
            <div key={loc.name} className="flex flex-col overflow-hidden border border-white/10 bg-lepas-ink text-white shadow-lg shadow-black/40">
              <div className="relative aspect-[16/10] bg-lepas-black">
                {loc.embed ? (
                  <iframe
                    src={loc.embed}
                    title={`${loc.name} map`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    // Embeds can't be themed without an API key; invert + hue-rotate gives a dark map that keeps pin colours.
                    className="absolute inset-0 h-full w-full border-0 [filter:invert(90%)_hue-rotate(180deg)_brightness(0.95)_contrast(0.9)]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#2a2418,#0a0a0a_75%)]">
                    <Logo className="h-8 w-auto text-white/80" />
                  </div>
                )}
                <span
                  className={`pointer-events-none absolute end-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    open ? "bg-lepas-success text-white" : "bg-lepas-amber text-lepas-black"
                  }`}
                >
                  {open ? t.nowOpen : t.comingSoon}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="heading-3">{loc.name}</h3>
                <p className="mt-3 flex flex-1 items-start gap-2 text-sm text-white/75">
                  <FiMapPin aria-hidden="true" className="mt-0.5 shrink-0 text-lepas-amber" />
                  {loc.address}
                </p>
                {open && loc.href ? (
                  <a
                    href={loc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-lepas-amber hover:text-white"
                  >
                    {t.getDirections} <FiArrowUpRight aria-hidden="true" className="rtl:-scale-x-100" />
                  </a>
                ) : (
                  <p className="mt-6 text-sm uppercase tracking-wide text-white/50">{t.detailsTba}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
