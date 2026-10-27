import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import newsData from "@/data/news.json";
import { NewsArticle } from "@/lib/types";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { formatNewsDate, getNewsCategory, getNewsImage } from "@/components/discover/newsImages";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import ShareButtons from "@/components/discover/ShareButtons";
import { getServerDictionary } from "@/lib/i18n/server";
import { getNews } from "@/lib/i18n/data";
import Breadcrumb from "@/components/ui/Breadcrumb";

const newsEn = newsData as NewsArticle[];

export function generateStaticParams() {
  return newsEn.map((n) => ({ slug: n.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = newsEn.find((n) => n.slug === params.slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { locale, dict } = getServerDictionary();
  const article = getNews(locale).find((n) => n.slug === params.slug);
  if (!article) notFound();
  const t = dict.site.news;
  const related = getNews(locale).filter((n) => n.slug !== article.slug);

  return (
    <div className="pt-32">
      <Section>
        <div className="mx-auto max-w-3xl">
          <Breadcrumb
            className="mb-8"
            light
            items={[
              { label: dict.testDriveFlow.home, href: "/" },
              { label: dict.site.footer.latestNews, href: "/discover/news" },
              { label: article.title },
            ]}
          />
          <p className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-widest2 md:text-sm">
            <span className="text-lepas-ash">{formatNewsDate(article.date)}</span>
            <span className="text-lepas-amber">{t.categories[getNewsCategory(article.slug)]}</span>
          </p>
          <h1 className="heading-display text-3xl text-lepas-ink md:text-5xl">
            {article.title}
          </h1>
          <PlaceholderImage
            label={article.title}
            src={getNewsImage(article.slug)}
            aspect="aspect-[16/9]"
            className="my-8"
          />
          <div className="space-y-5 text-lg text-lepas-steel">
            {article.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-10 border-t border-lepas-fog pt-6">
            <ShareButtons title={article.title} />
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section title={t.relatedNews}>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {related.map((n) => (
              <Card key={n.slug}>
                <Link href={`/discover/news/${n.slug}`} className="block">
                  <PlaceholderImage label={n.title} src={getNewsImage(n.slug)} aspect="aspect-[4/3]" />
                </Link>
                <div className="p-6">
                  <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest2">
                    <span className="text-lepas-ash">{formatNewsDate(n.date)}</span>
                    <span className="text-lepas-amber">{t.categories[getNewsCategory(n.slug)]}</span>
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-lepas-ink">
                    <Link href={`/discover/news/${n.slug}`} className="hover:text-lepas-amber">
                      {n.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-lepas-steel">{n.excerpt}</p>
                  <Link
                    href={`/discover/news/${n.slug}`}
                    className="link-underline mt-5 inline-block text-sm font-semibold text-lepas-ink"
                  >
                    {t.readMore} <span className="inline-block rtl:rotate-180">→</span>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
