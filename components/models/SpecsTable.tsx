import { ModelSpecGroup } from "@/lib/types";

export default function SpecsTable({ groups }: { groups: ModelSpecGroup[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {groups.map((group) => (
        <div key={group.label} className="rounded-2xl border border-lepas-fog bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest2 text-lepas-black">
            {group.label}
          </h3>
          <dl className="mt-4 space-y-3">
            {group.items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-lepas-fog pb-2 text-sm"
              >
                <dt className="text-lepas-steel">{item.label}</dt>
                <dd className="font-semibold text-lepas-black">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
