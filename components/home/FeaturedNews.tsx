"use client";

import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { formatNewsDate, getNewsCategory, getNewsImage } from "@/components/discover/newsImages";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getNews } from "@/lib/i18n/data";

export default function FeaturedNews({ light = true }: { light?: boolean }) {
  const { locale, dict } = useLocale();
  const news = getNews(locale).slice(0, 3);
  const t = dict.site.news;

  return (
    <Section title={t.title} description={t.sectionIntro} light={light}>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {news.map((article) => {
          const image = getNewsImage(article.slug);
          return (
            <Card key={article.slug}>
              <Link href={`/discover/news/${article.slug}`} className="block">
                {image ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={image}
                      alt={article.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <PlaceholderImage label={article.imageLabel} aspect="aspect-[4/3]" tone="light" />
                )}
              </Link>
              <div className="p-6">
                <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest2">
                  <span className="text-lepas-ash">{formatNewsDate(article.date)}</span>
                  <span className="text-lepas-amber">{t.categories[getNewsCategory(article.slug)]}</span>
                </p>
                <h3 className="mt-3 text-lg font-bold text-lepas-ink">
                  <Link href={`/discover/news/${article.slug}`} className="hover:text-lepas-amber">
                    {article.title}
                  </Link>
                </h3>
                <Link
                  href={`/discover/news/${article.slug}`}
                  className="link-underline mt-5 inline-block text-sm font-semibold text-lepas-ink"
                >
                  {t.readMore} <span className="inline-block rtl:rotate-180">→</span>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="mt-10">
        <Link href="/discover/news" className={light ? "btn-outline" : "btn-outline-light"}>
          {t.exploreMore}
        </Link>
      </div>
    </Section>
  );
}
