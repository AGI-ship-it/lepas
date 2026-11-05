"use client";

import { useEffect, useRef } from "react";

/**
 * Google reCAPTCHA v2 ("I'm not a robot" checkbox).
 * Site key: NEXT_PUBLIC_RECAPTCHA_SITE_KEY. Without it, Google's public test key is used, which always
 * passes and shows a "for testing purposes only" note. The token must be verified server-side with the
 * secret key before a booking is accepted; this static site only gates the Submit button on it.
 */
const TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHjXd16Ue4Hqtn5UQs1V4";
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || TEST_SITE_KEY;

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

export default function ReCaptcha({ locale, onChange }: { locale: "en" | "ar"; onChange: (token: string) => void }) {
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
