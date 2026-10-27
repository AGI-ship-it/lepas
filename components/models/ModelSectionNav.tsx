"use client";

import { useEffect, useRef, useState } from "react";

/** In-page section menu that sticks under the site header, highlighting the section in view. */
export default function ModelSectionNav({
  label,
  links,
}: {
  label: string;
  links: { id: string; label: string }[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    // A section counts as current once its top passes the band just below the sticky bars.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [links]);

  // Keep the active link visible when the menu scrolls sideways on small screens.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[aria-current="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  return (
    <nav aria-label={label} className="sticky top-20 z-40 bg-lepas-black text-white">
      <ul ref={listRef} className="container-lepas no-scrollbar flex h-14 items-center gap-8 overflow-x-auto">
        {links.map((l) => {
          const on = l.id === active;
          return (
            <li key={l.id} className="shrink-0">
              <a
                href={`#${l.id}`}
                aria-current={on}
                className={`relative block py-2 text-sm transition-colors ${on ? "text-white" : "text-white/60 hover:text-white"}`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 bg-lepas-amber transition-opacity ${on ? "opacity-100" : "opacity-0"}`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
