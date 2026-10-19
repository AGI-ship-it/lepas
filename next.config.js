/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages build (see .github/workflows/pages.yml): static HTML under /<repo>.
  ...(isStaticExport && {
    output: "export",
    distDir: ".next-static",
    basePath: process.env.PAGES_BASE_PATH || "",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

module.exports = nextConfig;
