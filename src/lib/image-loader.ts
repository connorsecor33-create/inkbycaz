/**
 * Static image loader. Photos are pre-optimized into WebP derivatives by
 * scripts/optimize-images.py, so no runtime image service is needed and the
 * site works on Vercel, any static host, or as a static export.
 *
 * `src` is a path prefix without width/extension, e.g. "/images/koi-forearm".
 */
export const IMAGE_WIDTHS = [480, 800, 1200] as const;

const base = process.env.NEXT_PUBLIC_ASSET_BASE ?? "";

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const w = IMAGE_WIDTHS.find((size) => size >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
  return `${base}${src}-${w}.webp`;
}
