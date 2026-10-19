import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import LogoStoryHero from "@/components/discover/LogoStoryHero";
import AboutTabs from "@/components/discover/AboutTabs";
import StackingHeroCards from "@/components/discover/StackingHeroCards";
import FeaturedNews from "@/components/home/FeaturedNews";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "About Lepas UAE | Official Brand by Al Ghurair Mobility",
  description: "Lepas UAE smart SUVs by Al Ghurair Mobility — the brand modelled after the leopard.",
};

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
      />

      <Section id="al-ghurair-mobility" className="scroll-mt-20">
        <AboutTabs
          tabs={[
            { id: "about-lepas", label: a.aboutLepas, paragraphs: [d.aboutMheroBody] },
            {
              id: "about-agm",
              label: a.alGhurairMobility,
              paragraphs: [d.alGhurairBody1, d.alGhurairBody2, d.alGhurairBody3],
            },
          ]}
        />
        <div className="relative mt-12 aspect-[3/2] w-full overflow-hidden md:aspect-[21/9]">
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
        </div>
      </Section>

      <LogoStoryHero
        id="lepas"
        eyebrow={a.brandStory}
        headlineLine1={a.brandStoryTitle}
        headlineLine2=""
        body={[d.aboutBody1, d.aboutBody2]}
      />

      <StackingHeroCards />

      <FeaturedNews />
    </>
  );
}
