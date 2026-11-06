import { formatNewsDate } from "@/components/discover/newsImages";
import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { getServerDictionary } from "@/lib/i18n/server";
import { getBlog } from "@/lib/i18n/data";

export const metadata: Metadata = {
  title: "Latest Videos",
  description: "Explore recent updates, events, and stories from across the brand.",
};

export default function BlogListPage() {
  const { locale, dict } = getServerDictionary();
  const posts = getBlog(locale);
  const isAr = locale === "ar";

  return (
    <>
      <PageHero
        eyebrow={dict.discover.blogEyebrow}
        title={dict.discover.blogTitle}
        description={
          isAr
            ? "اكتشف أحدث المستجدات والفعاليات والقصص من عالم العلامة."
            : "Explore recent updates, events, and stories from across the brand."
        }
        imageLabel="Lepas stories"
        breadcrumb={[{ label: dict.testDriveFlow.home, href: "/" }, { label: dict.site.footer.latestVideos }]}
      />
      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug}>
              <Link href={`/discover/blog/${post.slug}`} className="relative block overflow-hidden">
                {post.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image}
                    alt={post.title}
                    className="aspect-video w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <PlaceholderImage label={post.imageLabel} aspect="aspect-video" />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lepas-amber text-lepas-black transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 24 24" className="ms-1 h-6 w-6" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </Link>
              <div className="p-6">
                <p className="text-xs uppercase font-semibold tracking-wider text-lepas-steel">
                  <time dateTime={post.date}>{formatNewsDate(post.date)}</time>
                </p>
                <h3 className="mt-3 text-lg font-bold text-lepas-black">{post.title}</h3>
                <Link href={`/discover/blog/${post.slug}`} className="btn-primary mt-5">
                  {isAr ? "شاهد" : "Watch"}
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
