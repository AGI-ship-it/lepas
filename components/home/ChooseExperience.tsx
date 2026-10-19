"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

const MODELS = [
  { name: "L4", href: "/models/l4" },
  { name: "L8", href: "/models/l8" },
  { name: "L6", href: "/models/l6" },
];

export default function ChooseExperience() {
  const { dict } = useLocale();
  const t = dict.site.home;

  return (
    <section className="relative overflow-hidden bg-lepas-black text-white">
      <div className="relative aspect-[3/4] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        <Image
          src="/design/assets/allmodels-mobile.webp"
          alt={t.chooseImageAlt}
          fill
          sizes="100vw"
          className="object-cover sm:hidden"
        />
        <Image
          src="/design/assets/journey-3cars.webp"
          alt={t.chooseImageAlt}
          fill
          sizes="100vw"
          className="hidden object-cover sm:block"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/70" />

        <div className="container-lepas absolute inset-x-0 top-0 flex flex-col items-center pt-12 text-center md:pt-16">
          <h2 className="heading-display max-w-3xl !text-center text-3xl md:text-5xl">{t.chooseTitle}</h2>
          <Link href="/models/test-drive" className="btn-primary mt-8">
            {t.bookTestDrive}
          </Link>
        </div>

        <div className="container-lepas absolute inset-x-0 bottom-0 pb-8 md:pb-12">
          <ul className="grid grid-cols-3 gap-2 text-center">
            {MODELS.map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className="inline-flex items-center text-sm font-semibold uppercase tracking-widest2 text-white transition-colors hover:text-lepas-amber md:text-base"
                >
                  {`${m.name} | ${t.discover}`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
