import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import BrandStory from "@/components/discover/BrandStory";
import FeaturedNews from "@/components/home/FeaturedNews";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "About Lepas UAE | Official Brand by Al Ghurair Mobility",
  description: "Lepas UAE smart SUVs by Al Ghurair Mobility — the brand modelled after the leopard.",
};

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="space-y-5 text-base leading-relaxed text-lepas-steel md:text-lg">
      {items.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/**
 * Single-column editorial flow: image, heading, copy, stacked down the page.
 * `imageFirst` puts the image above the copy; otherwise it follows it.
 */
function StorySection({
  id,
  title,
  paragraphs,
  image,
  imageAlt,
  imageFirst = false,
}: {
  id: string;
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  imageFirst?: boolean;
}) {
  const media = (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-lepas-fog">
      <Image src={image} alt={imageAlt} fill sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
    </div>
  );

  return (
    <section id={id} className="scroll-mt-24 bg-white py-16 text-lepas-black md:py-24">
      <div className="container-lepas flex flex-col gap-10 md:gap-14">
        {imageFirst && media}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-16">
          <h2 className="heading-display text-3xl md:text-5xl lg:col-span-5">{title}</h2>
          <div className="lg:col-span-7">
            <Paragraphs items={paragraphs} />
          </div>
        </div>
        {!imageFirst && media}
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
        eyebrow={d.aboutEyebrow}
        title={a.heroTitle}
        imageLabel={a.heroImageAlt}
        image="/design/assets/about/hero-landscape.webp"
        breadcrumb={[{ label: dict.testDriveFlow.home, href: "/" }, { label: dict.site.footer.aboutUs }]}
      />

      <StorySection
        id="lepas"
        imageFirst
        title={a.discoverWorldTitle}
        paragraphs={[d.aboutMheroBody, d.aboutBody1]}
        image="/design/assets/lifestyle/l8-drive.webp"
        imageAlt={a.discoverWorldImageAlt}
      />

      <BrandStory
        id="brand-story"
        title={a.brandStoryTitle}
        body={[d.legacyBody, d.aboutBody2]}
        imageAlt={a.brandStoryImageAlt}
      />

      <StorySection
        id="al-ghurair-mobility"
        title={a.alGhurairMobility}
        paragraphs={[d.alGhurairBody1, d.alGhurairBody2, d.alGhurairBody3]}
        image="/design/assets/about/lepas-video-poster.webp"
        imageAlt={a.videoAlt}
      />

      {/* Expandable brand pillars beside a cabin image. */}
      <section id="designed-around-you" className="scroll-mt-24 bg-lepas-fog py-16 text-lepas-black md:py-24">
        <div className="container-lepas grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="heading-display text-3xl md:text-5xl">{a.designedTitle}</h2>
            <div className="mt-8 border-t border-lepas-black/15">
              {pillars.map((p, i) => (
                <details key={p.title} open={i === 0} className="group border-b border-lepas-black/15">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold uppercase md:text-xl [&::-webkit-details-marker]:hidden">
                    {p.title}
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
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
            <Image
              src="/design/assets/interior/l8/twotone-a.webp"
              alt={a.designedImageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

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
            <h2 className="heading-display text-3xl md:text-5xl">{a.ctaTitle}</h2>
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
