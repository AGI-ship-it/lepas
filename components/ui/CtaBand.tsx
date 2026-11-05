import Link from "next/link";

type CtaAction = { label: string; href: string };

export default function CtaBand({
  title,
  description,
  primary,
  secondary,
  pad = "py-16 md:py-24",
}: {
  title: string;
  description?: string;
  primary: CtaAction;
  secondary?: CtaAction;
  pad?: string;
}) {
  return (
    <section className={`relative overflow-hidden bg-lepas-black text-white ${pad}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(235,146,1,0.12),transparent_55%)]"
      />
      <div className="container-lepas relative flex flex-col items-center text-center">
        <h2 className="heading-2 !text-center max-w-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-4xl text-lg text-white/60">{description}</p>}
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
