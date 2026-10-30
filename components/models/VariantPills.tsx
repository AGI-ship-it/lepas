import { LuFuel, LuZap } from "react-icons/lu";
import { ModelPowertrain } from "@/lib/types";

/** Powertrain variants (ICE / PHEV) as small outlined pills on model cards. Hidden for single-powertrain models. */
export default function VariantPills({
  powertrains = [],
  className = "",
}: {
  powertrains?: ModelPowertrain[];
  className?: string;
}) {
  if (powertrains.length < 2) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {powertrains.map((p) => {
        const Icon = p.id === "phev" ? LuZap : LuFuel;
        return (
          <li
            key={p.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-lepas-amber/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest2 text-lepas-amber"
          >
            <Icon aria-hidden="true" className="h-3.5 w-3.5" />
            {p.label}
          </li>
        );
      })}
    </ul>
  );
}
