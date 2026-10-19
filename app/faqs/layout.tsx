import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Everything you need to know about Lepas UAE: our smart SUVs, pricing, test drives and support.",
};

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
