import type { Metadata } from "next";
import { Source_Sans_3, Almarai } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getServerLocale } from "@/lib/i18n/server";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const almarai = Almarai({
  subsets: ["arabic"],
  variable: "--font-almarai",
  display: "swap",
  weight: ["300", "400", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lepasuae.com"),
  title: {
    default: "Lepas UAE | Smart SUVs by Al Ghurair Mobility",
    template: "%s | Lepas UAE",
  },
  description:
    "Discover the Lepas L4, L6 and L8 smart SUVs in the UAE, brought to you by Al Ghurair Mobility. Book a test drive today.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Lepas UAE",
    description:
      "Discover the Lepas L4, L6 and L8 smart SUVs in the UAE, brought to you by Al Ghurair Mobility.",
    siteName: "Lepas UAE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getServerLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${sourceSans.variable} ${almarai.variable}`}>
      <body className={locale === "ar" ? "font-arabic" : "font-sans"}>
        <LocaleProvider locale={locale}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lepas-amber focus:px-5 focus:py-3 focus:text-white"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <FloatingActions />
        </LocaleProvider>
      </body>
    </html>
  );
}
