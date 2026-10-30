import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { formatNewsDate, getNewsCategory, getNewsImage } from "@/components/discover/newsImages";
import PageHero from "@/components/ui/PageHero";
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
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero
        eyebrow={dict.discover.newsEyebrow}
        title={t.title}
        description={t.listIntro}
        imageLabel="Lepas newsroom"
        image={getNewsImage(sorted[0]?.slug ?? "")}
        breadcrumb={[{ label: dict.testDriveFlow.home, href: "/" }, { label: dict.site.footer.latestNews }]}
      />
      <section className="bg-lepas-cream py-16 md:py-24">
        <div className="container-lepas">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
            {sorted.map((article) => (
              <Link
                key={article.slug}
                href={`/discover/news/${article.slug}`}
                className="group flex h-full flex-col overflow-hidden border border-lepas-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-lepas-amber/50 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <PlaceholderImage
                    label={article.title}
                    src={getNewsImage(article.slug)}
                    aspect="aspect-[16/10]"
                    className="transition-transform duration-500 ease-premium group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider">
                    <time dateTime={article.date} className="text-lepas-amber">
                      {formatNewsDate(article.date)}
                    </time>
                    <span className="text-lepas-ash">{t.categories[getNewsCategory(article.slug)]}</span>
                  </p>
                  <h2 className="mt-2 text-base font-bold leading-snug text-lepas-ink sm:text-lg">{article.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-lepas-steel">{article.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-lepas-amber transition-colors group-hover:text-lepas-ink">
                    {t.readMore} <span aria-hidden="true" className="rtl:rotate-180">&gt;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
