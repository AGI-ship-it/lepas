import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import TestDriveForm from "@/components/forms/TestDriveForm";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Book a Test Drive",
  description: "Book a test drive for the Lepas L8, L6 or L4 at a Lepas showroom in Dubai or Sharjah.",
};

export default function TestDrivePage() {
  const { dict } = getServerDictionary();
  const t = dict.testDriveFlow;

  const steps = [
    { title: dict.testDrive.privateSessionTitle, body: dict.testDrive.privateSessionBody },
    { title: dict.testDrive.preferredModelTitle, body: dict.testDrive.preferredModelBody },
    { title: dict.testDrive.showroomTitle, body: dict.testDrive.showroomBody },
  ];

  return (
    <>
      <section className="relative flex min-h-[460px] items-end overflow-hidden bg-lepas-black pt-24 text-white md:min-h-[520px]">
        <Image
          src="/design/assets/contact-hero-cover-l8-colors11.webp"
          alt="Lepas L8 ready for a private test drive"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        <div className="container-lepas relative pb-14">
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.1] md:text-6xl">{t.heroTitle}</h1>
          <p className="mt-5 max-w-xl text-white/75">{t.heroDescription}</p>
          <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/55">
            <li>{t.warrantyMeta}</li>
            <li aria-hidden="true">|</li>
            <li>
              <Link href="/contact" className="hover:text-white">{dict.footer.contactUs}</Link>
            </li>
            <li aria-hidden="true">|</li>
            <li>
              <Link href="/contact#locations" className="hover:text-white">{t.findShowroom}</Link>
            </li>
          </ul>
        </div>
      </section>

      <div className="border-b border-lepas-fog bg-white">
        <div className="container-lepas grid gap-8 py-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lepas-black text-[10px] font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-semibold text-lepas-ink">{step.title}</p>
                <p className="mt-1 text-sm text-lepas-steel">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-lepas-sand py-16 md:py-24">
        <div className="container-lepas">
          <h2 className="text-3xl font-semibold text-lepas-ink md:text-4xl">{dict.testDrive.requestPrivateDrive}</h2>
          <p className="mt-3 text-sm text-lepas-steel md:text-base">{dict.testDrive.requestPrivateDriveDescription}</p>
          <div className="mx-auto mt-10 max-w-5xl">
            <Suspense>
              <TestDriveForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
