"use client";

import { useCallback, useEffect, useState } from "react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

const SLIDE_DURATION = 5000;

export default function StatementSection({
  headline,
  body,
  images,
}: {
  headline: string;
  body: string;
  images: string[];
}) {
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  const goTo = useCallback((next: number) => {
    setIndex(next);
    setCycle((c) => c + 1);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
    setCycle((c) => c + 1);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next, cycle]);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-lepas">
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-lepas-black md:text-5xl">
          {headline}
        </h2>
        <p className="mt-6 max-w-2xl text-base text-lepas-steel md:text-lg">{body}</p>
      </div>

      <div className="relative mt-12 h-[70vh] min-h-[420px] w-full overflow-hidden">
        {images.map((label, i) => (
          <div
            key={label}
            className="absolute inset-0 transition-opacity duration-1000 ease-premium"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <PlaceholderImage label={label} aspect="aspect-auto h-full" className="h-full" />
          </div>
        ))}

        {/* Circular loading indicators only — no arrows */}
        <div className="container-lepas absolute inset-x-0 bottom-8 flex items-center justify-start">
          <div className="flex items-center gap-4">
            {images.map((label, i) => (
              <button
                key={label}
                onClick={() => goTo(i)}
                aria-label={`Show image ${i + 1}: ${label}`}
                aria-current={i === index}
                className="relative flex h-6 w-6 items-center justify-center"
              >
                <span className="absolute h-2 w-2 rounded-full bg-white/30" />
                {i === index && (
                  <svg viewBox="0 0 24 24" className="absolute h-6 w-6 -rotate-90">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                    <circle
                      key={cycle}
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={62.8}
                      strokeDashoffset={62.8}
                      className="animate-[hero-ring_var(--hero-duration)_linear_forwards]"
                      style={{ ["--hero-duration" as string]: `${SLIDE_DURATION}ms` }}
                    />
                  </svg>
                )}
                {i === index && <span className="absolute h-2 w-2 rounded-full bg-white" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
