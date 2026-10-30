"use client";

import { useState } from "react";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getBlog } from "@/lib/i18n/data";

/** Latest videos as on lepasuae.com/videos: a swipeable row of YouTube guides that play in place. */
export default function LatestVideos() {
  const { locale, dict } = useLocale();
  const videos = getBlog(locale).filter((v) => v.youtubeId);
  const [playing, setPlaying] = useState<string | null>(null);

  if (videos.length === 0) return null;

  return (
    <section className="bg-lepas-black py-20 text-white md:py-28">
      <div className="container-lepas">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="heading-display text-3xl md:text-5xl">{dict.discover.blogTitle}</h2>
            <p className="mt-4 max-w-md text-base text-white/70">{dict.discover.videosIntro}</p>
          </div>
          <Link href="/discover/blog" className="btn-primary">
            {dict.site.news.exploreMore}
          </Link>
        </div>

        <ul className="-mx-5 mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0">
          {videos.map((video) => (
            <li key={video.slug} className="w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]">
              <div className="relative aspect-video overflow-hidden bg-white/5">
                {playing === video.youtubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                    title={video.title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlaying(video.youtubeId!)}
                    aria-label={dict.discover.playVideo.replace("{title}", video.title)}
                    className="group absolute inset-0"
                  >
                    {video.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={video.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <PlaceholderImage label={video.imageLabel} aspect="h-full" tone="dark" />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/45">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lepas-amber text-white transition-transform duration-300 group-hover:scale-110">
                        <svg viewBox="0 0 24 24" className="ms-1 h-6 w-6" fill="currentColor" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </button>
                )}
              </div>
              <h3 className="mt-5 border-s-2 border-lepas-amber ps-4 text-lg font-bold leading-snug">
                {video.title}
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
