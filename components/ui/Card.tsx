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
      className={`group overflow-hidden border border-lepas-fog bg-white text-lepas-black shadow-sm card-hover ${className}`}
    >
      {children}
    </div>
  );
}
