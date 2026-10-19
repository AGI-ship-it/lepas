"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels, getOffers, getNews, getBlog } from "@/lib/i18n/data";

interface SearchResult {
  title: string;
  href: string;
  type: string;
}

export default function SearchBox() {
  const { locale, dict } = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const searchIndex: SearchResult[] = useMemo(() => {
    const t = dict.nav.searchTypes;
    return [
      ...getModels(locale).map((m) => ({
        title: m.name,
        href: `/models/${m.slug}`,
        type: t.model,
      })),
      ...getOffers(locale).map((o) => ({
        title: o.title,
        href: `/offers/${o.slug}`,
        type: t.offer,
      })),
      ...getNews(locale).map((n) => ({
        title: n.title,
        href: `/discover/news/${n.slug}`,
        type: t.news,
      })),
      ...getBlog(locale).map((b) => ({
        title: b.title,
        href: `/discover/blog/${b.slug}`,
        type: t.blog,
      })),
    ];
  }, [locale, dict]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchIndex.filter((r) => r.title.toLowerCase().includes(q)).slice(0, 8);
  }, [query, searchIndex]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        aria-label={open ? "Close search" : "Open search"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:text-white"
      >
        <SearchIcon />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80]">
          <div className="absolute inset-0 bg-black/70" onClick={close} />
          <div className="relative border-b border-white/10 bg-lepas-ink shadow-2xl">
            <div className="container-lepas py-10">
              <div className="flex items-center gap-4 border-b border-white/15 pb-4">
                <SearchIcon className="shrink-0 text-white/50" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={dict.nav.searchPlaceholder}
                  className="w-full bg-transparent text-xl font-medium text-white placeholder:text-white/60 outline-none md:text-2xl"
                />
                <button
                  onClick={close}
                  aria-label="Close search"
                  className="shrink-0 text-sm font-semibold uppercase tracking-widest2 text-white/50 hover:text-white"
                >
                  {dict.nav.close}
                </button>
              </div>

              {results.length > 0 && (
                <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((r) => (
                    <Link
                      key={r.href}
                      href={r.href}
                      onClick={close}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <span>{r.title}</span>
                      <span className="text-xs uppercase tracking-widest2 text-white/60">
                        {r.type}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
              {query.trim() && results.length === 0 && (
                <p className="mt-6 px-1 text-sm text-white/60">
                  {dict.nav.noResults} &ldquo;{query}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
