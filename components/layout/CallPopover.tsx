"use client";

import { useEffect, useRef, useState } from "react";
import { FiCheck, FiCopy, FiPhone } from "react-icons/fi";
import { useLocale } from "@/components/i18n/LocaleProvider";

const PHONE_TEL = "600553727";

// Opening hours in UAE time (24h). Index 0 is Sunday.
const HOURS: { open: number; close: number }[] = [
  { open: 10, close: 18 },
  { open: 9, close: 20 },
  { open: 9, close: 20 },
  { open: 9, close: 20 },
  { open: 9, close: 20 },
  { open: 9, close: 20 },
  { open: 9, close: 20 },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dubaiNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dubai",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: WEEKDAYS.indexOf(get("weekday")),
    hour: Number(get("hour")) + Number(get("minute")) / 60,
  };
}

type Status = { open: true; day: number } | { open: false; day: number; today: boolean };

function getStatus(): Status {
  const { day, hour } = dubaiNow();
  const h = HOURS[day];
  if (hour >= h.open && hour < h.close) return { open: true, day };
  if (hour < h.open) return { open: false, day, today: true };
  return { open: false, day: (day + 1) % 7, today: false };
}

export default function CallPopover() {
  const { dict } = useLocale();
  const t = dict.lepasUi.callPopover;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Status depends on the current time, so compute it on the client only.
  useEffect(() => {
    if (open) setStatus(getStatus());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(dict.lepasUi.phoneDisplay);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context); the number is still visible to copy manually.
    }
  };

  const openTime = (day: number) => (day === 0 ? t.sundayOpen : t.weekdaysOpen);
  const closeTime = (day: number) => (day === 0 ? t.sundayClose : t.weekdaysClose);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={dict.lepasUi.callLepas}
        className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-white/90 transition-colors hover:text-white"
      >
        <FiPhone className="h-5 w-5" aria-hidden="true" />
        <span className="hidden xl:inline" dir="ltr">
          {dict.lepasUi.phoneDisplay}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t.label}
          className="absolute end-0 top-full z-50 mt-4 w-80 rounded-2xl border border-lepas-fog bg-white p-5 text-lepas-ink shadow-xl shadow-black/20"
        >
          <p className="text-sm text-lepas-steel">{t.label}</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              aria-label={`${t.callNow} ${dict.lepasUi.phoneDisplay}`}
              className="text-2xl font-bold hover:text-lepas-amber"
              dir="ltr"
            >
              {dict.lepasUi.phoneDisplay}
            </a>
            <button
              type="button"
              onClick={copy}
              className="flex items-center gap-1.5 rounded-full bg-lepas-fog/60 px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-lepas-fog"
            >
              {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
              <span aria-live="polite">{copied ? t.copied : t.copy}</span>
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-lepas-fog/40 p-4 text-sm">
            {status && (
              <p
                className={`flex items-center gap-2 font-semibold ${
                  status.open ? "text-emerald-700" : "text-lepas-steel"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${status.open ? "bg-emerald-500" : "bg-lepas-ash"}`}
                  aria-hidden="true"
                />
                {status.open
                  ? t.openUntil.replace("{time}", closeTime(status.day))
                  : t.closedOpens
                      .replace("{day}", status.today ? t.today : t.tomorrow)
                      .replace("{time}", openTime(status.day))}
              </p>
            )}
            <dl className="mt-1 space-y-0.5 ps-4 text-lepas-steel">
              <div className="flex gap-1">
                <dt>{t.weekdays}:</dt>
                <dd>
                  {t.weekdaysOpen} – {t.weekdaysClose}
                </dd>
              </div>
              <div className="flex gap-1">
                <dt>{t.sunday}:</dt>
                <dd>
                  {t.sundayOpen} – {t.sundayClose}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
