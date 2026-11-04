import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import PageHero from "@/components/ui/PageHero";
import FeaturedNews from "@/components/home/FeaturedNews";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "About Lepas UAE | Official Brand by Al Ghurair Mobility",
  description: "Lepas UAE smart SUVs by Al Ghurair Mobility — the brand modelled after the leopard.",
};

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="mt-6 space-y-5 text-base leading-relaxed text-lepas-steel md:text-lg">
      {items.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/**
 * Two-column row of image and text. Rows alternate image–text / text–image on large screens;
 * on small screens the image always comes first.
 */
function SplitSection({
  id,
  image,
  imageAlt,
  textFirst = false,
  children,
}: {
  id: string;
  image: string;
  imageAlt: string;
  textFirst?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 bg-white py-14 text-lepas-black md:py-20">
      <div className="container-lepas grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-lepas-fog">
          <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className={textFirst ? "lg:order-first" : ""}>{children}</div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const { dict } = getServerDictionary();
  const d = dict.discover;
  const a = dict.site.about;

  const pillars = [
    { title: d.technologyParkTitle, body: d.technologyParkBody },
    { title: d.visionTitle, body: d.visionBody },
    { title: d.missionTitle, body: d.missionBody },
  ];

  return (
    <>
      <PageHero
        title={a.heroTitle}
        imageLabel={a.heroImageAlt}
        image="/design/assets/about/hero-landscape.webp"
        breadcrumb={[{ label: dict.testDriveFlow.home, href: "/" }, { label: dict.site.footer.aboutUs }]}
      />

      {/* Image–text */}
      <SplitSection id="lepas" image="/design/assets/lifestyle/l8-drive.webp" imageAlt={a.discoverWorldImageAlt}>
        <h2 className="heading-2">{a.discoverWorldTitle}</h2>
        <Paragraphs items={[d.aboutMheroBody, d.aboutBody1]} />
      </SplitSection>

      {/* Brand story: full-bleed leopard image, combined title on the start side, copy on the end side. */}
      <section
        id="brand-story"
        className="relative flex min-h-[clamp(560px,50vw,1000px)] scroll-mt-24 overflow-hidden bg-white text-lepas-black"
      >
        <Image
          src="/design/assets/about/brand-story-bg.webp"
          alt={a.brandStoryImageAlt}
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
        {/* Soft white wash at the top so the text stays readable over the mist */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-transparent" />
        <div className="container-lepas relative grid w-full content-start gap-8 pt-16 md:pt-24 lg:grid-cols-2 lg:gap-16">
          <h2 className="heading-2 max-w-xl">{a.brandStoryCombinedTitle}</h2>
          <div className="max-w-xl space-y-5 text-base leading-relaxed text-lepas-ink md:text-lg">
            <p>{d.legacyBody}</p>
            <p>{d.aboutBody2}</p>
          </div>
        </div>
      </section>

      {/* Image–text */}
      <SplitSection
        id="al-ghurair-mobility"
        image="/design/assets/about/lepas-video-poster.webp"
        imageAlt={a.videoAlt}
      >
        <h2 className="heading-2">{a.alGhurairMobility}</h2>
        <Paragraphs items={[d.alGhurairBody1, d.alGhurairBody2, d.alGhurairBody3]} />
      </SplitSection>

      {/* Text–image: expandable brand pillars */}
      <SplitSection
        id="designed-around-you"
        textFirst
        image="/design/assets/interior/l8/twotone-a.webp"
        imageAlt={a.designedImageAlt}
      >
        <h2 className="heading-2">{a.designedTitle}</h2>
        <div className="mt-8 border-t border-lepas-black/15">
          {pillars.map((p, i) => (
            <details key={p.title} open={i === 0} className="group border-b border-lepas-black/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <h3 className="heading-3">{p.title}</h3>
                <span
                  aria-hidden="true"
                  className="text-2xl font-light leading-none transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-6 text-base leading-relaxed text-lepas-steel">{p.body}</p>
            </details>
          ))}
        </div>
      </SplitSection>

      {/* Full-bleed L8 demo film, as on lepasuae.com/about. */}
      <section className="relative h-[clamp(420px,56.31vw,973px)] w-full overflow-hidden bg-lepas-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/about-l8-model.mp4"
          poster="/design/assets/about/lepas-video-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          aria-label={a.videoAlt}
        />
      </section>

      <FeaturedNews />

      <section className="bg-lepas-black py-16 text-white md:py-24">
        <div className="container-lepas flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="heading-2">{a.ctaTitle}</h2>
            <p className="mt-5 text-base text-white/70 md:text-lg">{a.ctaBody}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/models/test-drive" className="btn-primary">
              {dict.nav.bookTestDrive}
            </Link>
            <Link href="/contact" className="btn-outline-light">
              {dict.site.footer.contactUs}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
