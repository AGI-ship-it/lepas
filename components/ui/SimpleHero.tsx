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
        <h1 className="heading-1 max-w-3xl">{title}</h1>
        {description && <p className="mt-5 max-w-xl text-base text-white/60 md:text-lg">{description}</p>}
      </div>
    </section>
  );
}
