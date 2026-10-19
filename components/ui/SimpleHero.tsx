import Link from "next/link";

export default function SimpleHero({
  homeLabel,
  title,
  description,
}: {
  homeLabel: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-lepas-black pb-20 pt-40 text-white md:pb-24 md:pt-48">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,rgba(235,146,1,0.08),transparent_60%)]"
      />
      <div className="container-lepas relative">
        <nav aria-label="Breadcrumb" className="text-sm">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="text-lepas-amber hover:underline">
                {homeLabel}
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/40">&gt;</li>
            <li aria-current="page" className="text-white/90">{title}</li>
          </ol>
        </nav>
        <h1 className="mt-5 max-w-3xl text-4xl font-normal leading-[1.1] md:text-6xl">{title}</h1>
        {description && <p className="mt-5 max-w-xl text-base text-white/60 md:text-lg">{description}</p>}
      </div>
    </section>
  );
}
