"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { formatNewsDate, getNewsCategory, getNewsImage } from "@/components/discover/newsImages";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getNews } from "@/lib/i18n/data";

const CYCLE_MS = 5000;

/** Latest news as on lepasuae.com: headline list on the left, the highlighted story's image on the right. */
export default function FeaturedNews() {
  const { locale, dict } = useLocale();
  const news = getNews(locale).slice(0, 3);
  const t = dict.site.news;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || news.length < 2) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % news.length), CYCLE_MS);
    return () => clearInterval(timer);
  }, [paused, news.length]);

  const current = news[active];
  const currentImage = current ? getNewsImage(current.slug) : undefined;

  return (
    <section className="bg-white py-20 text-lepas-black md:py-28">
      <div className="container-lepas">
        <div className="flex justify-end">
          <Link href="/discover/news" className="btn-primary">
            {t.exploreMore}
          </Link>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="flex flex-col">
            <h2 className="heading-display text-3xl md:text-4xl">{t.title}</h2>
            <p className="mt-4 max-w-md text-base">{t.sectionIntro}</p>

            <ul
              className="mt-12 space-y-10 lg:mt-auto lg:pt-12"
              onMouseLeave={() => setPaused(false)}
            >
              {news.map((article, i) => {
                const on = i === active;
                return (
                  <li key={article.slug}>
                    <Link
                      href={`/discover/news/${article.slug}`}
                      onMouseEnter={() => {
                        setActive(i);
                        setPaused(true);
                      }}
                      onFocus={() => {
                        setActive(i);
                        setPaused(true);
                      }}
                      onBlur={() => setPaused(false)}
                      className={`group block transition-opacity duration-500 ${on ? "opacity-100" : "opacity-30 hover:opacity-60"}`}
                    >
                      <p className="flex items-center gap-4 text-sm">
                        <span>{formatNewsDate(article.date)}</span>
                        <span className="border border-lepas-amber px-2.5 py-0.5 text-xs">
                          {t.categories[getNewsCategory(article.slug)]}
                        </span>
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-6 border-s-2 border-lepas-amber ps-4">
                        <h3 className="text-lg font-bold uppercase leading-snug md:text-2xl">{article.title}</h3>
                        <ExternalIcon />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden bg-lepas-black lg:self-end">
            <AnimatePresence initial={false}>
              <motion.div
                key={current?.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                {currentImage ? (
                  <Image
                    src={currentImage}
                    alt={current.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  current && <PlaceholderImage label={current.imageLabel} aspect="h-full" tone="dark" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-7 w-7 shrink-0 text-lepas-amber transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100"
    >
      <path
        d="M13 4h7v7M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
