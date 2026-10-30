import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // `STATIC_EXPORT=1 npm run build` writes a fully static site to /out.
  ...(isStaticExport ? { output: "export" as const } : {}),
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Must line up with the derivative widths in scripts/optimize-images.py.
    deviceSizes: [480, 800, 1200],
    imageSizes: [320],
    qualities: [80],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
