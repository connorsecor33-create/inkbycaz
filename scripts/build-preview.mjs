/**
 * Builds a static, path-independent snapshot of the site in ./preview for
 * hosted previews (e.g. a sub-path or sandboxed host where the Next.js
 * runtime can't load from the domain root).
 *
 *   npm run preview:build
 *
 * It runs a static export, keeps the prerendered HTML + CSS + images, swaps
 * the React runtime for scripts/preview/preview.js (same behaviour), and
 * makes every URL relative. Not used for production — deploy the Next.js app.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const out = join(root, "out");
const dest = join(root, "preview");

execSync("npx next build", {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, STATIC_EXPORT: "1", NEXT_PUBLIC_ASSET_BASE: "." },
});

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

let html = readFileSync(join(out, "index.html"), "utf8");

// Keep only our own inline scripts (motion gate + copyright year).
html = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g, (tag, body) =>
  /prefers-reduced-motion|copyright-year/.test(body) && !/__next_f/.test(body) && !/src=/.test(tag) ? tag : "",
);
html = html.replace(/<link rel="preload" as="script"[^>]*>/g, "");

// Copy referenced /_next assets (CSS + font) into /assets (some hosts reserve
// names starting with "_") and make every URL relative.
const toAssets = (p) => p.replace(/^\/_next\//, "/assets/");
const refs = new Set(html.match(/\/_next\/[^"')\s\\]+\.(css|woff2)/g) ?? []);
for (const ref of refs) {
  const clean = ref.split("?")[0];
  mkdirSync(join(dest, toAssets(clean), ".."), { recursive: true });
  cpSync(join(out, clean), join(dest, toAssets(clean)));
  if (clean.endsWith(".css")) {
    const css = readFileSync(join(out, clean), "utf8");
    for (const m of css.matchAll(/url\((\.\.\/media\/[^)]+)\)/g)) {
      const media = join(clean, "..", m[1]);
      mkdirSync(join(dest, toAssets(media), ".."), { recursive: true });
      cpSync(join(out, media), join(dest, toAssets(media)));
    }
  }
}
html = html.replace(/(src|href)="\/_next\//g, '$1="/assets/');
html = html.replace(/(src|href)="\/(?!\/)/g, '$1="./');
html = html.replace("</body>", '<script src="./preview.js" defer></script></body>');

writeFileSync(join(dest, "index.html"), html);
cpSync(join(out, "images"), join(dest, "images"), { recursive: true });
for (const f of ["icon.png", "apple-icon.png", "opengraph-image.jpg"]) {
  if (existsSync(join(out, f))) cpSync(join(out, f), join(dest, f));
}
cpSync(join(root, "scripts/preview/preview.js"), join(dest, "preview.js"));
console.log(`Preview written to ${dest}`);
