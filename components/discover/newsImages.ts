const NEWS_IMAGES: Record<string, string> = {
  "a-new-home-for-lepas-deira-showroom-now-open": "/design/assets/news/deira-showroom-now-open.jpg",
  "nine-radio-stations-one-showroom-one-unforgettable-lepas-celebration":
    "/design/assets/news/arn-radio-activation.jpg",
};

export function getNewsImage(slug: string): string | undefined {
  return NEWS_IMAGES[slug];
}

const NEWS_CATEGORIES: Record<string, "events" | "brandNews"> = {
  "a-new-home-for-lepas-deira-showroom-now-open": "brandNews",
  "nine-radio-stations-one-showroom-one-unforgettable-lepas-celebration": "events",
};

export function getNewsCategory(slug: string): "events" | "brandNews" {
  return NEWS_CATEGORIES[slug] ?? "brandNews";
}

// lepasuae.com shows dates as DD.MM.YYYY
export function formatNewsDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${d}.${m}.${y}`;
}
