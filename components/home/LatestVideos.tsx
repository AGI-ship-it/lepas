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
    <section className="bg-white py-16 text-lepas-black md:py-24">
      <div className="container-lepas">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="heading-2">{dict.discover.blogTitle}</h2>
            <p className="mt-2 max-w-4xl text-lg text-lepas-steel">{dict.discover.videosIntro}</p>
          </div>
          <Link href="/discover/blog" className="btn-primary">
            {dict.site.news.exploreMore}
          </Link>
        </div>

        <ul
          className="no-scrollbar -mx-5 -mb-6 mt-5 flex snap-x pb-6 pt-3 md:mt-7 snap-mandatory gap-6 overflow-x-auto px-5 md:mx-0 md:px-0"
        >
          {videos.map((video) => (
            <li key={video.slug} className="group w-[80%] shrink-0 snap-start overflow-hidden border border-lepas-black/10 bg-white card-hover sm:w-[38%] lg:w-[27%]">
              <div className="relative aspect-video overflow-hidden bg-lepas-black">
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
                    className="absolute inset-0"
                  >
                    {video.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={video.image} alt="" className="h-full w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-105" loading="lazy" />
                    ) : (
                      <PlaceholderImage label={video.imageLabel} aspect="h-full" tone="dark" />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/45">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lepas-amber text-lepas-black transition-transform duration-300 group-hover:scale-110">
                        <svg viewBox="0 0 24 24" className="ms-1 h-6 w-6" fill="currentColor" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </button>
                )}
              </div>
              <h3 className="heading-3 p-5 sm:p-6">
                {video.title}
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
