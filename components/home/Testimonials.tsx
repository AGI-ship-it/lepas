"use client";

import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getTestimonials } from "@/lib/i18n/data";

export default function Testimonials() {
  const { locale, dict } = useLocale();
  const testimonials = getTestimonials(locale);

  return (
    <Section
      eyebrow={dict.home.testimonialsEyebrow}
      title={dict.home.testimonialsTitle}
      description={dict.home.testimonialsDescription}
    >
      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-2xl border border-white/10 bg-lepas-ink p-8 text-white">
            <div className="flex gap-1 text-lepas-amber" aria-hidden="true">
              {Array.from({ length: t.rating }).map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <p className="mt-4 text-white/80">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-white/60">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0.6l2.05 4.6 4.95.55-3.72 3.5.95 5.2L8 11.9l-4.23 2.55.95-5.2L1 6.75l4.95-.55L8 0.6z" />
    </svg>
  );
}
