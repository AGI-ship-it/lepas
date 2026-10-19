"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function HeroesSlider() {
  const { dict } = useLocale();
  const items = dict.discover.heroesItems;
  const [index, setIndex] = useState(0);

  return (
    <Section light={false} title={dict.discover.heroesTitle}>
      <div className="rounded-2xl border border-white/10 bg-lepas-ink p-8 md:p-12">
        <h3 className="text-2xl font-bold uppercase tracking-tight md:text-3xl">
          {items[index].title}
        </h3>
        <p className="mt-4 max-w-2xl text-white/60">{items[index].body}</p>

        <div className="mt-8 flex items-center gap-3">
          {items.map((item, i) => (
            <button
              key={item.title}
              onClick={() => setIndex(i)}
              aria-label={`Show ${item.title}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-8 bg-white" : "w-4 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
