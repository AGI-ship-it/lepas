import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  light?: boolean;
}

export default function Section({
  children,
  className = "",
  id,
  title,
  description,
  light = true,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-20 md:py-28 ${light ? "bg-white text-lepas-black" : "bg-lepas-black text-white"} ${className}`}
    >
      <div className="container-lepas">
        {(title || description) && (
          <div className="mb-12 max-w-2xl text-start md:mb-16">
            {title && (
              <h2 className="heading-display text-start text-3xl md:text-5xl">
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
