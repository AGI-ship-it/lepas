import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  /** Omit on the last item: it is the current page. */
  href?: string;
}

/** Trail shown at the top of page banners, e.g. Home / Offers / Lepas L8. */
export default function Breadcrumb({
  items,
  light = false,
  className = "",
}: {
  items: BreadcrumbItem[];
  /** Dark text, for light backgrounds. */
  light?: boolean;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={`flex flex-wrap items-center gap-2 text-sm ${light ? "text-lepas-steel" : "text-white/70"}`}>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-lepas-amber">
                /
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-lepas-amber">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={light ? "text-lepas-black" : "text-white"}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
