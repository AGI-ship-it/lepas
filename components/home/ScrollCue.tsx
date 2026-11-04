"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * "SCROLL" prompt pinned bottom-centre on the home page. It stays visible while scrolling and fades out
 * once the visitor reaches the bottom of the page. Clicking it moves down one screen.
 */
export default function ScrollCue() {
  const { dict } = useLocale();
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const check = () => {
      const remaining = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      setAtBottom(remaining < 120);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" })}
      aria-label={dict.home.scroll}
      aria-hidden={atBottom}
      tabIndex={atBottom ? -1 : 0}
      className={`fixed bottom-6 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-4 text-lepas-amber transition-opacity duration-500 hover:text-lepas-amber md:flex ${
        atBottom ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <span className="ps-[0.4em] text-xs font-medium uppercase tracking-[0.4em]">{dict.home.scroll}</span>
      <span className="relative block h-10 w-px overflow-hidden bg-lepas-amber/20">
        <span className="scroll-cue-line absolute inset-0 block bg-lepas-amber animate-[scroll-cue_2s_ease-in-out_infinite]" />
      </span>
    </button>
  );
}
