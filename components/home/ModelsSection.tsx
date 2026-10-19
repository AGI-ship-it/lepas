"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/financeMath";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

const cardImages: Record<string, string> = {
  l8: "/design/assets/lifestyle/l8-drive.webp",
  l6: "/design/assets/lifestyle/l6.webp",
  l4: "/design/assets/lifestyle/l4-drive.webp",
};

export default function ModelsSection() {
  const { locale, dict } = useLocale();
  const allModels = getModels(locale);
  const models = ["l8", "l6", "l4"]
    .map((slug) => allModels.find((m) => m.slug === slug))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <Section
      light={false}
      eyebrow={dict.home.rangeEyebrow}
      title={dict.home.rangeTitle}
      description={dict.home.rangeDescription}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <Link
            key={model.slug}
            href={`/models/${model.slug}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <Image
              src={cardImages[model.slug] ?? model.heroImage ?? "/design/assets/journey-3cars.webp"}
              alt={model.heroImageLabel}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-xl font-bold uppercase text-white">{model.name}</h3>
              <p className="mt-1 text-sm text-white/70">{model.tagline}</p>
              {model.startingPrice > 0 && (
                <p className="mt-2 text-sm text-white/70">
                  {dict.common.startingFrom}{" "}
                  <span className="font-semibold text-white">
                    {formatCurrency(model.startingPrice, model.currency)}
                  </span>
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
