import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { VehicleModel } from "@/lib/types";
import { Dictionary } from "@/lib/i18n";
import VariantPills from "@/components/models/VariantPills";

const modelImages: Record<string, string> = {
  l8: "/design/assets/model-l8-side.webp",
  l6: "/design/assets/model-l6-side.webp",
  l4: "/design/assets/model-l4-side.webp",
};

/** "Explore Other Models" cards at the foot of a model page. */
export default function OtherModels({ models, dict }: { models: VehicleModel[]; dict: Dictionary }) {
  if (models.length === 0) return null;

  return (
    <section className="bg-white py-16 text-lepas-ink md:py-24">
      <div className="container-lepas">
        <h2 className="heading-display text-3xl md:text-5xl">{dict.models.exploreOtherModels}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <Link
              key={m.slug}
              href={`/models/${m.slug}`}
              className="group flex flex-col overflow-hidden border border-lepas-ink/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-lepas-amber/50 hover:shadow-xl"
            >
              <div className="relative aspect-[16/9] bg-lepas-cream">
                <Image
                  src={modelImages[m.slug]}
                  alt={m.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain p-6 transition-transform duration-500 ease-premium group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold uppercase">{m.name}</h3>
                <p className="mt-1 flex-1 text-sm text-lepas-steel">{m.tagline}</p>
                <VariantPills powertrains={m.detailPage.powertrains} className="mt-4" />
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-lepas-amber transition-colors group-hover:text-lepas-ink">
                  {dict.models.viewModel}
                  <FiArrowRight aria-hidden="true" className="rtl:-scale-x-100" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
