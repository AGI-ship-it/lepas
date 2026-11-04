"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { formatNewsDate, getNewsCategory, getNewsImage } from "@/components/discover/newsImages";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getNews } from "@/lib/i18n/data";

/** Latest news as a card grid (heading + "View all news" above three story cards), like exeed-uae.com. */
export default function FeaturedNews() {
  const { locale, dict } = useLocale();
  const news = getNews(locale).slice(0, 3);
  const t = dict.site.news;

  return (
    <section className="bg-lepas-sand py-20 text-lepas-black md:py-28">
      <div className="container-lepas">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="heading-2">{t.title}</h2>
            <p className="mt-4 max-w-md text-base text-lepas-steel">{t.sectionIntro}</p>
          </div>
          <Link href="/discover/news" className="btn-outline w-full uppercase sm:w-auto">
            {t.viewAllNews}
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
          {news.map((article) => {
            const image = getNewsImage(article.slug);
            return (
              <li key={article.slug} className="h-full">
                <Link
                  href={`/discover/news/${article.slug}`}
                  className="group flex h-full flex-col overflow-hidden border border-lepas-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-lepas-amber/50 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-lepas-black">
                    {image ? (
                      <Image
                        src={image}
                        alt={article.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
                      />
                    ) : (
                      <PlaceholderImage label={article.imageLabel} aspect="h-full" tone="dark" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider">
                      <time dateTime={article.date} className="text-lepas-amber">
                        {formatNewsDate(article.date)}
                      </time>
                      <span className="border border-lepas-amber/60 px-2 py-0.5 text-[10px] text-lepas-steel">
                        {t.categories[getNewsCategory(article.slug)]}
                      </span>
                    </p>
                    <h3 className="heading-3 mt-3">{article.title}</h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-lepas-steel">{article.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-lepas-amber transition-colors group-hover:text-lepas-black">
                      {t.readMore}
                      <FiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
