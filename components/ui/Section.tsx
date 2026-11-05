import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  light?: boolean;
  /** Vertical padding; defaults to the site-wide py-16 md:py-24 (64px / 96px). */
  pad?: string;
}

export default function Section({
  children,
  className = "",
  id,
  title,
  description,
  light = true,
  pad = "py-16 md:py-24",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${pad} ${light ? "bg-white text-lepas-black" : "bg-lepas-black text-white"} ${className}`}
    >
      <div className="container-lepas">
        {(title || description) && (
          <div className="mb-8 max-w-4xl text-start md:mb-10">
            {title && (
              <h2 className="heading-2 text-start">
                {title}
              </h2>
            )}
            {description && (
              <p
                className={`mt-2 text-lg ${
                  light ? "text-lepas-steel" : "text-white/60"
                }`}
              >
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
