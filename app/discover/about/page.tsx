import type { Metadata } from "next";
import Image from "next/image";
import { ReactNode } from "react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import BrandStory from "@/components/discover/BrandStory";
import FeaturedNews from "@/components/home/FeaturedNews";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "About Lepas UAE | Official Brand by Al Ghurair Mobility",
  description: "Lepas UAE smart SUVs by Al Ghurair Mobility — the brand modelled after the leopard.",
};

/** Text beside media; `reverse` puts the media first on large screens. */
function TextMedia({
  id,
  title,
  paragraphs,
  media,
  reverse = false,
}: {
  id: string;
  title: string;
  paragraphs: string[];
  media: ReactNode;
  reverse?: boolean;
}) {
  return (
    <Section id={id} className="scroll-mt-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={reverse ? "lg:order-2" : ""}>
          <h2 className="heading-display text-3xl md:text-5xl">{title}</h2>
          <div className="mt-6 space-y-5 text-lg text-lepas-steel">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-lepas-fog">{media}</div>
      </div>
    </Section>
  );
}

export default function AboutPage() {
  const { dict } = getServerDictionary();
  const d = dict.discover;
  const a = dict.site.about;

  return (
    <>
      <PageHero
        eyebrow={d.aboutEyebrow}
        title={a.heroTitle}
        imageLabel={a.heroImageAlt}
        image="/design/assets/about/hero-landscape.webp"
        breadcrumb={[{ label: dict.testDriveFlow.home, href: "/" }, { label: dict.site.footer.aboutUs }]}
      />

      <TextMedia
        id="al-ghurair-mobility"
        title={a.alGhurairMobility}
        paragraphs={[d.alGhurairBody1, d.alGhurairBody2, d.alGhurairBody3]}
        media={
          <Image
            src="/design/assets/about/lepas-video-poster.webp"
            alt={a.videoAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        }
      />

      <TextMedia
        id="lepas"
        reverse
        title={a.aboutLepas}
        paragraphs={[d.aboutMheroBody]}
        media={
          <Image
            src="/design/assets/lifestyle/l8-drive.webp"
            alt="Lepas L8 on the road"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        }
      />

      <BrandStory
        id="brand-story"
        eyebrow={a.brandStory}
        title={a.brandStoryTitle}
        body={[d.aboutBody1, d.aboutBody2]}
        imageAlt={a.brandStoryImageAlt}
      />

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
    </>
  );
}
