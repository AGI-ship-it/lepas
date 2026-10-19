// Static export for GitHub Pages is served from /<repo>/. Next prefixes its own
// routes and chunks with basePath, but not the hard-coded "/design/…" style public
// paths used in components and data, so rewrite those in the exported files.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [outDir, basePath] = process.argv.slice(2);
if (!outDir || !basePath) {
  console.error("usage: node scripts/prefix-static-assets.mjs <outDir> </basePath>");
  process.exit(1);
}

const PUBLIC_ROOTS = "design|svg|video|videos|brochures|images|lepas-logo\\.svg|favicon\\.ico";
// Matches a public path right after a quote, backtick, paren or escaped quote.
const pattern = new RegExp(`((?:\\\\)?["'\`(])/(${PUBLIC_ROOTS})(?=[/"'\`)?\\\\])`, "g");
const exts = new Set([".html", ".js", ".css", ".txt", ".json"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (exts.has(path.extname(entry.name))) yield full;
  }
}

let changed = 0;
for await (const file of walk(outDir)) {
  const src = await readFile(file, "utf8");
  const next = src.replace(pattern, (_, pre, root) => `${pre}${basePath}/${root}`);
  if (next !== src) {
    await writeFile(file, next);
    changed++;
  }
}
console.log(`prefixed public asset paths in ${changed} files`);
