import Image from "next/image";

/** "Modelled after the leopard" — dark copy set in the misty sky above the leopard, as on lepasuae.com. */
export default function BrandStory({
  id,
  eyebrow,
  title,
  body,
  imageAlt,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  body: string[];
  imageAlt: string;
}) {
  return (
    <section
      id={id}
      className="relative scroll-mt-24 overflow-hidden bg-white text-lepas-black lg:min-h-[clamp(560px,56vw,973px)]"
    >
      <Image
        src="/design/assets/about/brand-story-bg.webp"
        alt={imageAlt}
        fill
        sizes="100vw"
        className="hidden object-cover object-top lg:block"
      />

      <div className="container-lepas relative pt-16 lg:pt-12">
        <p className="heading-display text-lg md:text-2xl">{eyebrow}</p>
        <div className="mt-8 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-16">
          <h2 className="heading-display text-3xl md:text-5xl">{title}</h2>
          <div className="space-y-4 text-sm leading-relaxed text-lepas-black/90 md:text-base">
            {body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Below lg the copy sits above the image instead of over it. */}
      <div className="relative mt-10 aspect-[1440/973] w-full lg:hidden">
        <Image src="/design/assets/about/brand-story-bg.webp" alt="" fill sizes="100vw" className="object-cover" />
      </div>
    </section>
  );
}
