import { StatItem } from "@/lib/types";

export default function UtilitySpecs({ specs }: { specs: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8 sm:grid-cols-4">
      {specs.map((spec) => (
        <div key={spec.label}>
          <p className="text-xs uppercase tracking-widest2 text-white/60">{spec.label}</p>
          <p className="mt-2 text-lg font-bold md:text-xl">{spec.value}</p>
        </div>
      ))}
    </div>
  );
}
