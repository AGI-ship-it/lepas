"use client";

import { useEffect, useRef, useState } from "react";

function toIso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-lepas-amber">
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="rtl:rotate-180">
      <path
        d={dir === "prev" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DatePicker({
  value,
  onChange,
  min,
  max,
  locale,
  placeholder,
  todayLabel,
  closeLabel,
  invalid,
}: {
  value: string;
  onChange: (iso: string) => void;
  min: string;
  max: string;
  locale: "en" | "ar";
  placeholder: string;
  todayLabel: string;
  closeLabel: string;
  invalid?: boolean;
}) {
  const intlLocale = locale === "ar" ? "ar-AE" : "en-GB";
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const base = value ? fromIso(value) : fromIso(min);
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const minDate = fromIso(min);
  const maxDate = fromIso(max);
  const firstOfMin = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const firstOfMax = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  const canPrev = view > firstOfMin;
  const canNext = view < firstOfMax;

  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const leading = view.getDay();
  const cells: (Date | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1)),
  ];

  // Sunday-first weekday headers, as in the reference design.
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(intlLocale, { weekday: "short" }).format(new Date(2026, 1, 1 + i))
  );

  const display = value
    ? new Intl.DateTimeFormat(intlLocale, { weekday: "short", day: "numeric", month: "long", year: "numeric" }).format(
        fromIso(value)
      )
    : "";

  const pick = (d: Date) => {
    onChange(toIso(d));
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`input-field-light flex items-center justify-between bg-lepas-sand/60 text-start ${
          open ? "border-lepas-amber" : invalid ? "border-lepas-error" : ""
        }`}
      >
        <span className={value ? "text-lepas-ink" : "text-lepas-ash"}>{display || placeholder}</span>
        <CalendarIcon />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={new Intl.DateTimeFormat(intlLocale, { month: "long", year: "numeric" }).format(view)}
          className="absolute start-0 top-full z-30 mt-2 w-[300px] rounded-xl border border-lepas-fog bg-white p-4 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              disabled={!canPrev}
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
              className="flex h-9 w-9 items-center justify-center border border-lepas-fog text-lepas-ink transition-colors hover:border-lepas-amber disabled:cursor-not-allowed disabled:text-lepas-mist disabled:hover:border-lepas-fog"
            >
              <Chevron dir="prev" />
            </button>
            <p className="text-base text-lepas-ink">
              {new Intl.DateTimeFormat(intlLocale, { month: "long", year: "numeric" }).format(view)}
            </p>
            <button
              type="button"
              aria-label="Next month"
              disabled={!canNext}
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
              className="flex h-9 w-9 items-center justify-center border border-lepas-fog text-lepas-ink transition-colors hover:border-lepas-amber disabled:cursor-not-allowed disabled:text-lepas-mist disabled:hover:border-lepas-fog"
            >
              <Chevron dir="next" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 text-center text-[10px] font-medium uppercase tracking-[0.15em] text-lepas-steel">
            {weekdays.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-y-1 text-center">
            {cells.map((d, i) => {
              if (!d) return <span key={`blank-${i}`} />;
              const iso = toIso(d);
              const disabled = d < minDate || d > maxDate;
              const selected = iso === value;
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => pick(d)}
                  aria-pressed={selected}
                  className={`mx-auto flex h-9 w-9 items-center justify-center text-sm transition-colors ${
                    selected
                      ? "bg-lepas-amber text-white ring-2 ring-lepas-amber/40 ring-offset-2"
                      : disabled
                      ? "cursor-not-allowed text-lepas-mist"
                      : "text-lepas-ink hover:bg-lepas-amber/15"
                  }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-lepas-fog pt-3 text-sm">
            <button
              type="button"
              onClick={() => {
                setView(new Date(minDate.getFullYear(), minDate.getMonth(), 1));
                pick(minDate);
              }}
              className="text-lepas-amber hover:underline"
            >
              {todayLabel}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-lepas-steel hover:text-lepas-ink">
              {closeLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
