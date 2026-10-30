import Breadcrumb, { BreadcrumbItem } from "@/components/ui/Breadcrumb";
import HeroGlow from "@/components/ui/HeroGlow";

export default function SimpleHero({
  title,
  description,
  breadcrumb,
}: {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
}) {
  return (
    <section className="relative overflow-hidden bg-lepas-black pb-20 pt-40 text-white md:pb-24 md:pt-48">
      <HeroGlow />
      <div className="container-lepas relative">
        {breadcrumb && <Breadcrumb items={breadcrumb} className="mb-6" />}
        <h1 className="heading-display max-w-3xl text-3xl md:text-5xl">{title}</h1>
        {description && <p className="mt-5 max-w-xl text-base text-white/60 md:text-lg">{description}</p>}
      </div>
    </section>
  );
}
