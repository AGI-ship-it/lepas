"use client";

import Image from "next/image";
import Logo from "@/components/ui/Logo";
import { useLocale } from "@/components/i18n/LocaleProvider";

const distributorLogos = {
  en: { src: "/design/assets/alghurair.svg", width: 167, height: 63, alt: "Al Ghurair Mobility — official Lepas UAE distributor" },
  ar: { src: "/design/assets/alghurair-ar.svg", width: 291, height: 140, alt: "الغرير للتنقل — الموزع الرسمي لليباس في الإمارات" },
};

// Lepas wordmark + Al Ghurair Mobility distributor lockup, as on lepasuae.com.
export default function LepasLogo({
  size = "md",
  showDistributor = true,
}: {
  size?: "md" | "lg";
  showDistributor?: boolean;
}) {
  const { locale } = useLocale();
  const distributorLogo = distributorLogos[locale];
  const wordmark = size === "lg" ? "h-9 w-auto text-white sm:h-11" : "h-5 w-auto text-white sm:h-7";
  const distributor = size === "lg" ? "h-12 w-auto" : "hidden h-8 w-auto sm:block sm:h-9 lg:hidden xl:block";

  return (
    <span className="flex items-center gap-3 sm:gap-4">
      <Logo className={wordmark} />
      {showDistributor && (
        <>
          <span aria-hidden="true" className="hidden h-6 w-px bg-white/40 sm:block sm:h-8 lg:hidden xl:block" />
          <Image
            src={distributorLogo.src}
            alt={distributorLogo.alt}
            width={distributorLogo.width}
            height={distributorLogo.height}
            className={distributor}
          />
        </>
      )}
    </span>
  );
}
