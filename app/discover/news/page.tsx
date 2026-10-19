import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { formatNewsDate, getNewsCategory, getNewsImage } from "@/components/discover/newsImages";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { getServerDictionary } from "@/lib/i18n/server";
import { getNews } from "@/lib/i18n/data";

export const metadata: Metadata = {
  title: "Latest News",
  description: "The latest news, events and stories from Lepas UAE.",
};

export default function NewsListPage() {
  const { locale, dict } = getServerDictionary();
  const news = getNews(locale);

  const t = dict.site.news;
  const [featured, ...rest] = [...news].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero
        eyebrow={dict.discover.newsEyebrow}
        title={t.title}
        description={t.listIntro}
        imageLabel="Lepas newsroom"
        image={getNewsImage(featured?.slug ?? "")}
      />
      {featured && (
        <Section>
          <article className="grid items-center gap-10 md:grid-cols-2">
            <Link href={`/discover/news/${featured.slug}`} className="block overflow-hidden rounded-2xl">
              <PlaceholderImage
                label={featured.title}
                src={getNewsImage(featured.slug)}
                aspect="aspect-[4/3]"
                className="transition-transform duration-700 ease-premium hover:scale-105"
              />
            </Link>
            <div>
              <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest2">
                <span className="text-lepas-ash">{formatNewsDate(featured.date)}</span>
                <span className="text-lepas-amber">{t.categories[getNewsCategory(featured.slug)]}</span>
              </p>
              <h2 className="heading-display mt-4 text-2xl md:text-4xl">
                <Link href={`/discover/news/${featured.slug}`} className="hover:text-lepas-amber">
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-4 text-lepas-steel">{featured.excerpt}</p>
              <Link href={`/discover/news/${featured.slug}`} className="btn-primary mt-8">
                {t.readMore}
              </Link>
            </div>
          </article>
        </Section>
      )}
      <Section className="pt-0 md:pt-0">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[featured, ...rest].filter(Boolean).map((article) => (
            <Card key={article.slug}>
              <Link href={`/discover/news/${article.slug}`} className="block">
                <PlaceholderImage
                  label={article.title}
                  src={getNewsImage(article.slug)}
                  aspect="aspect-[4/3]"
                />
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
                <p className="mt-2 text-sm text-lepas-steel">{article.excerpt}</p>
                <Link
                  href={`/discover/news/${article.slug}`}
                  className="link-underline mt-5 inline-block text-sm font-semibold text-lepas-ink"
                >
                  {t.readMore} <span className="inline-block rtl:rotate-180">→</span>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
