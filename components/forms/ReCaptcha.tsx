"use client";

import { useEffect, useRef, useState } from "react";
import { FiCheck, FiRefreshCw } from "react-icons/fi";

/**
 * Google reCAPTCHA v2 ("I'm not a robot" checkbox).
 * Site key: NEXT_PUBLIC_RECAPTCHA_SITE_KEY. Until Lepas provides one, a look-alike placeholder is shown
 * (no Google script is loaded). The token must be verified server-side with the secret key before a
 * booking is accepted; this static site only gates the Submit button on it.
 */
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

type Grecaptcha = {
  ready: (cb: () => void) => void;
  render: (el: HTMLElement, opts: Record<string, unknown>) => number;
  reset: (id?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const SCRIPT_ID = "recaptcha-api";

/** Placeholder until the real site key exists: tick shows a short spinner, then a check. */
function PlaceholderCaptcha({ locale, onChange }: { locale: "en" | "ar"; onChange: (token: string) => void }) {
  const [state, setState] = useState<"idle" | "checking" | "done">("idle");
  useEffect(() => () => onChange(""), [onChange]);
  const tick = () => {
    if (state !== "idle") return;
    setState("checking");
    window.setTimeout(() => {
      setState("done");
      onChange("placeholder-token");
    }, 900);
  };
  return (
    <div
      dir="ltr"
      className="flex h-[78px] w-[304px] items-center justify-between rounded-[3px] border border-[#d3d3d3] bg-[#f9f9f9] pe-2 ps-3 shadow-[0_0_4px_1px_rgba(0,0,0,0.08)]"
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={state === "done"}
        onClick={tick}
        className="flex items-center gap-3 text-start"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-[2px] border-2 border-[#c1c1c1] bg-white">
          {state === "checking" && <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#4a90e2] border-t-transparent" />}
          {state === "done" && <FiCheck aria-hidden="true" className="h-6 w-6 text-[#009e55]" strokeWidth={3} />}
        </span>
        <span className="text-sm text-[#282828]">{locale === "ar" ? "أنا لست برنامج روبوت" : "I'm not a robot"}</span>
      </button>
      <span className="flex flex-col items-center text-[#555]">
        <FiRefreshCw aria-hidden="true" className="h-7 w-7 text-[#4a90e2]" />
        <span className="mt-1 text-[10px]">reCAPTCHA</span>
        <span className="text-[8px] text-[#999]">{locale === "ar" ? "عنصر نائب" : "Placeholder"}</span>
      </span>
    </div>
  );
}

export default function ReCaptcha({ locale, onChange }: { locale: "en" | "ar"; onChange: (token: string) => void }) {
  if (!RECAPTCHA_SITE_KEY) return <PlaceholderCaptcha locale={locale} onChange={onChange} />;
  return <GoogleReCaptcha locale={locale} onChange={onChange} />;
}

function GoogleReCaptcha({ locale, onChange }: { locale: "en" | "ar"; onChange: (token: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const cb = useRef(onChange);
  cb.current = onChange;

  useEffect(() => {
    let cancelled = false;
    let widget: number | undefined;

    const render = () => {
      const g = window.grecaptcha;
      if (!g || !box.current || cancelled) return;
      g.ready(() => {
        if (cancelled || !box.current || box.current.childElementCount) return;
        widget = g.render(box.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: (token: string) => cb.current(token),
          "expired-callback": () => cb.current(""),
          "error-callback": () => cb.current(""),
        });
      });
    };

    if (window.grecaptcha?.render) {
      render();
    } else {
      let s = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (!s) {
        s = document.createElement("script");
        s.id = SCRIPT_ID;
        s.src = `https://www.google.com/recaptcha/api.js?render=explicit&hl=${locale}`;
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", render);
      // The script may finish loading before the listener is attached.
      const poll = window.setInterval(() => {
        if (window.grecaptcha?.render) {
          window.clearInterval(poll);
          render();
        }
      }, 200);
      return () => {
        cancelled = true;
        window.clearInterval(poll);
        s?.removeEventListener("load", render);
        cb.current("");
      };
    }
    return () => {
      cancelled = true;
      if (widget !== undefined) window.grecaptcha?.reset(widget);
      cb.current("");
    };
  }, [locale]);

  return <div ref={box} className="min-h-[78px]" />;
}
