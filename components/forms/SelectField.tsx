"use client";

import { forwardRef, useEffect, useId, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

function SelectChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-lepas-amber transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Site-styled dropdown used in place of the native <select>, whose open list can't be styled. */
const SelectField = forwardRef<
  HTMLButtonElement,
  {
    value: string | undefined;
    onChange: (value: string) => void;
    onBlur?: () => void;
    options: SelectOption[];
    placeholder: string;
    light?: boolean;
    name?: string;
    className?: string;
  }
>(function SelectField({ value = "", onChange, onBlur, options, placeholder, light = true, name, className = "" }, ref) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value);
  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (i: number) => {
    const o = options[i];
    if (!o || o.disabled) return;
    onChange(o.value);
    setOpen(false);
  };

  const move = (step: 1 | -1) => {
    if (!enabled.length) return;
    const pos = enabled.indexOf(active);
    const next = pos < 0 ? (step === 1 ? 0 : enabled.length - 1) : (pos + step + enabled.length) % enabled.length;
    setActive(enabled[next]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) openList();
      else move(e.key === "ArrowDown" ? 1 : -1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) choose(active);
      else openList();
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
    }
  };

  const tone = light
    ? {
        field: "input-field-light bg-white",
        value: "text-lepas-black",
        placeholder: "text-lepas-ash",
        list: "border-lepas-fog bg-white shadow-lg",
        option: "text-lepas-black",
        hover: "bg-lepas-amber/15",
        muted: "text-lepas-ash",
      }
    : {
        field: "input-field",
        value: "text-white",
        placeholder: "text-white/40",
        list: "border-white/15 bg-lepas-form-ink shadow-2xl shadow-black/50",
        option: "text-white",
        hover: "bg-white/10",
        muted: "text-white/40",
      };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={ref}
        type="button"
        name={name}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={`${tone.field} flex w-full items-center justify-between gap-3 text-start`}
      >
        <span className={`truncate ${selected?.value ? tone.value : tone.placeholder}`}>
          {selected?.value ? selected.label : placeholder}
        </span>
        <SelectChevron open={open} />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className={`absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-y-auto border ${tone.list}`}
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={o.disabled}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-start justify-between gap-3 px-4 py-3 text-sm transition-colors ${
                  o.disabled
                    ? `cursor-not-allowed ${tone.muted}`
                    : isSelected
                    ? "bg-lepas-amber text-white"
                    : `${tone.option} ${i === active ? tone.hover : ""}`
                }`}
              >
                <span>
                  <span className="block">{o.label}</span>
                  {o.description && (
                    <span className={`mt-0.5 block text-xs ${isSelected && !o.disabled ? "text-white/80" : tone.muted}`}>
                      {o.description}
                    </span>
                  )}
                </span>
                {o.badge && (
                  <span className="shrink-0 rounded-full bg-lepas-amber px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    {o.badge}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});

export default SelectField;
