"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

const MODEL_ORDER = ["l8", "l6", "l4"];

const modelImages: Record<string, string> = {
  l8: "/design/assets/model-l8-side-light.webp",
  l6: "/design/assets/model-l6-side-light.webp",
  l4: "/design/assets/model-l4-side-light.webp",
};

export default function ModelsMegaMenu({
  open,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
}: {
  open: boolean;
  onNavigate: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const { locale, dict } = useLocale();
  const models = getModels(locale);
  const lineup = MODEL_ORDER.map((slug) => models.find((m) => m.slug === slug)).filter(
    (m): m is NonNullable<typeof m> => Boolean(m)
  );

  const ctas = [
    { label: dict.nav.compareModels, href: "/models/compare", primary: false },
    { label: dict.nav.financeCalculator, href: "/models/finance-calculator", primary: false },
    { label: dict.nav.bookTestDrive, href: "/models/test-drive", primary: true },
  ];

  if (!open) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed inset-0 top-20 z-40"
    >
      {/* Scrim separating the menu from page content behind it */}
      <div className="absolute inset-0 bg-black/70" onClick={onMouseLeave} />

      <div className="relative border-t border-white/10 bg-lepas-ink text-white shadow-2xl">
        <div className="container-lepas grid grid-cols-12 gap-8 py-8">
          {/* Left rail */}
          <div className="col-span-3 flex flex-col border-e border-white/10 pe-8">
            <p className="eyebrow mb-3">{dict.nav.modelsRange}</p>
            <h3 className="text-xl font-bold leading-tight text-white">
              {dict.nav.exploreEveryModel}
            </h3>
            <p className="mt-3 text-sm text-white/50">
              {dict.nav.exploreEveryModelDesc}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              {ctas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  onClick={onNavigate}
                  className={
                    cta.primary
                      ? "btn-primary w-full justify-between"
                      : "flex w-full items-center justify-between rounded-none border border-white/15 px-6 py-3.5 text-sm font-semibold text-white/90 transition-colors hover:border-white hover:text-white"
                  }
                >
                  {cta.label}
                  <ArrowRight />
                </Link>
              ))}
            </div>
          </div>

          {/* Model cards */}
          <div className="col-span-9 grid grid-cols-3 gap-4">
            {lineup.map((model) => (
              <Link
                key={model.slug}
                href={`/models/${model.slug}`}
                onClick={onNavigate}
                className="group/card overflow-hidden border border-white/10 bg-lepas-ink transition-colors hover:border-lepas-amber/60"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={modelImages[model.slug]}
                    alt={model.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 100vw"
                    className="object-contain p-4 transition-transform duration-700 ease-premium group-hover/card:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-base font-bold uppercase">{model.name}</h4>
                  <p className="mt-1 text-xs text-white/50">{model.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true" className="rtl:rotate-180">
      <path
        d="M9.5 1L15 6M15 6L9.5 11M15 6H1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
