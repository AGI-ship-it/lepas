import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group overflow-hidden border border-lepas-fog bg-white text-lepas-black shadow-sm transition-all duration-500 ease-premium hover:border-lepas-steel/40 hover:shadow-md hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}
