import Link from "next/link";

type CtaAction = { label: string; href: string };

export default function CtaBand({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description?: string;
  primary: CtaAction;
  secondary?: CtaAction;
}) {
  return (
    <section className="relative overflow-hidden bg-lepas-black py-24 text-white md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(235,146,1,0.12),transparent_55%)]"
      />
      <div className="container-lepas relative flex flex-col items-center text-center">
        <h2 className="heading-display !text-center max-w-3xl text-3xl md:text-5xl">{title}</h2>
        {description && <p className="mt-6 max-w-xl text-base text-white/60 md:text-lg">{description}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href={primary.href} className="btn-primary px-10 py-4 uppercase tracking-[0.2em]">
            {primary.label}
          </Link>
          {secondary && (
            <Link href={secondary.href} className="btn-outline-light px-10 py-4 uppercase tracking-[0.2em]">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
