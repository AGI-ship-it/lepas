import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  light?: boolean;
  /** Vertical padding; defaults to the site-wide py-20 md:py-28. */
  pad?: string;
}

export default function Section({
  children,
  className = "",
  id,
  title,
  description,
  light = true,
  pad = "py-20 md:py-28",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${pad} ${light ? "bg-white text-lepas-black" : "bg-lepas-black text-white"} ${className}`}
    >
      <div className="container-lepas">
        {(title || description) && (
          <div className="mb-12 max-w-2xl text-start md:mb-16">
            {title && (
              <h2 className="heading-2 text-start">
                {title}
              </h2>
            )}
            {description && (
              <p
                className={`mt-4 text-base md:text-lg ${
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
