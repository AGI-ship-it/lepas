import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import blogData from "@/data/blog.json";
import { BlogPost } from "@/lib/types";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import ShareButtons from "@/components/discover/ShareButtons";
import { getServerDictionary } from "@/lib/i18n/server";
import { getBlog } from "@/lib/i18n/data";
import Breadcrumb from "@/components/ui/Breadcrumb";

const postsEn = blogData as BlogPost[];

function formatVideoDate(date: string) {
  const [y, m, d] = date.split("-");
  return `${d}.${m}.${y}`;
}

export function generateStaticParams() {
  return postsEn.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = postsEn.find((p) => p.slug === params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { locale, dict } = getServerDictionary();
  const posts = getBlog(locale);
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const isAr = locale === "ar";
  const more = posts.filter((p) => p.slug !== post.slug);

  return (
    <div className="pt-32">
      <Section>
        <div className="mx-auto max-w-4xl">
          <Breadcrumb
            className="mb-8"
            light
            items={[
              { label: dict.testDriveFlow.home, href: "/" },
              { label: dict.site.footer.latestVideos, href: "/discover/blog" },
              { label: post.title },
            ]}
          />
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-lepas-steel md:text-sm">
            {formatVideoDate(post.date)}
          </p>
          <h1 className="heading-display text-3xl text-lepas-black md:text-5xl">{post.title}</h1>
          {post.youtubeId ? (
            <div className="relative my-8 aspect-video w-full overflow-hidden bg-lepas-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${post.youtubeId}`}
                title={post.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <PlaceholderImage label={post.imageLabel} aspect="aspect-video" className="my-8" />
          )}
          <div className="space-y-5 text-lg text-lepas-steel">
            {post.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-10 border-t border-lepas-fog pt-6">
            <ShareButtons title={post.title} />
          </div>
        </div>
      </Section>

      {more.length > 0 && (
        <Section title={isAr ? "مزيد من الفيديوهات" : "More videos"} className="bg-lepas-sand">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <Link
                key={p.slug}
                href={`/discover/blog/${p.slug}`}
                className="group block overflow-hidden border border-lepas-fog bg-white"
              >
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.title}
                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest2 text-lepas-steel">
                    {formatVideoDate(p.date)}
                  </p>
                  <h3 className="mt-2 font-bold text-lepas-black">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
