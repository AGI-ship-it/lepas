"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { formatNewsDate, getNewsCategory, getNewsImage } from "@/components/discover/newsImages";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getNews } from "@/lib/i18n/data";

export default function FeaturedNews() {
  const { locale, dict } = useLocale();
  const news = getNews(locale).slice(0, 3);
  const t = dict.site.news;

  return (
    <section className="relative overflow-hidden bg-lepas-black py-24 text-white md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_10%,rgba(235,146,1,0.1),transparent_50%)]"
      />
      <div className="container-lepas relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span aria-hidden="true" className="block h-px w-14 bg-lepas-amber" />
            <h2 className="mt-6 text-4xl font-normal leading-[1.1] md:text-6xl">{t.title}</h2>
            <p className="mt-5 max-w-xl text-base text-white/60 md:text-lg">{t.sectionIntro}</p>
          </div>
          <Link
            href="/discover/news"
            className="btn-outline-light shrink-0 self-start px-8 py-3.5 uppercase tracking-[0.2em] md:self-auto"
          >
            {t.exploreMore}
          </Link>
        </div>

        <div className={`mt-14 grid gap-6 md:mt-20 md:grid-cols-2 ${news.length > 2 ? "lg:grid-cols-3" : ""}`}>
          {news.map((article, i) => {
            const image = getNewsImage(article.slug);
            return (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <Link
                  href={`/discover/news/${article.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10 transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(235,146,1,0.25)] hover:ring-2 hover:ring-lepas-amber"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-lepas-ink">
                    {image ? (
                      <Image
                        src={image}
                        alt={article.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                      />
                    ) : (
                      <PlaceholderImage label={article.imageLabel} aspect="h-full" tone="dark" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest2">
                      <span className="text-white/50">{formatNewsDate(article.date)}</span>
                      <span className="h-3 w-px bg-white/25" aria-hidden="true" />
                      <span className="text-lepas-amber">{t.categories[getNewsCategory(article.slug)]}</span>
                    </p>
                    <h3 className="mt-4 text-xl font-semibold leading-snug transition-colors duration-300 group-hover:text-lepas-amber md:text-2xl">
                      {article.title}
                    </h3>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-white/80">
                      {t.readMore}
                      <span className="inline-block text-lepas-amber transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
