"use client";

import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";

const VIDEOS = [
  { src: "/video/life-tech-technology.mp4", poster: "/design/assets/life-tech-poster.webp" },
  { src: "/video/life-tech-seats.mp4", poster: "/design/assets/life-tech-seats.webp" },
  { src: "/video/life-tech-cockpit.mp4", poster: "/design/assets/life-tech-cockpit.webp" },
];

export default function LifeTechSection() {
  const { dict } = useLocale();
  const t = dict.site.home;

  return (
    <Section light={false} title={t.lifeTechTitle} description={t.lifeTechBody}>
      <div className="grid gap-4 md:grid-cols-3">
        {VIDEOS.map((v, i) => (
          <div key={v.src} className="relative aspect-[3/4] overflow-hidden bg-lepas-ink">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={v.src}
              poster={v.poster}
              autoPlay
              muted
              loop
              playsInline
              aria-label={t.lifeTechVideos[i]}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
