import { StatItem } from "@/lib/types";

export default function StatsBar({
  stats,
}: {
  eyebrow?: string;
  stats: StatItem[];
}) {
  return (
    <div className="border-b border-white/10 bg-lepas-black py-8 text-white">
      <div className="container-lepas">
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 md:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-xs uppercase tracking-widest2 text-white/60">
                {stat.label}
              </p>
              <p className="mt-2 flex items-center gap-2 text-lg font-bold text-white md:text-xl">
                <BoltIcon />
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BoltIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 text-lepas-amber">
      <path
        d="M7.5 1L2 8h4l-1 5 5.5-7H7l1-5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
    </svg>
  );
}
