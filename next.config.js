/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === "1";
// Each language is exported as its own copy: English at /<repo>, Arabic at /<repo>/ar.
const staticLocale = process.env.STATIC_LOCALE === "ar" ? "ar" : "en";
const siteRoot = process.env.PAGES_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages build (see .github/workflows/pages.yml): static HTML under /<repo>.
  ...(isStaticExport && {
    output: "export",
    distDir: ".next-static",
    basePath: staticLocale === "ar" ? `${siteRoot}/ar` : siteRoot,
    trailingSlash: true,
    images: { unoptimized: true },
    env: { NEXT_PUBLIC_STATIC_LOCALE: staticLocale, NEXT_PUBLIC_SITE_ROOT: siteRoot },
  }),
};

module.exports = nextConfig;
