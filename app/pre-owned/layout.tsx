import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pre-Owned",
  description: "Browse certified pre-owned Lepas vehicles with detailed filtering.",
};

export default function PreOwnedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
