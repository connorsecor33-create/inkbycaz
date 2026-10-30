import Image from "next/image";
import type { HeroMedia as HeroMediaConfig } from "@/config/site";
import { HeroVideo } from "./HeroVideo";

const sizes = "(min-width: 64rem) 40vw, (min-width: 48rem) 70vw, 100vw";

/**
 * Hero media slot. Uses a still photograph today; switch `site.hero.media`
 * to `{ type: "video", sources, poster }` to run a muted loop instead.
 * The poster stays as the LCP image and is all reduced-motion visitors see.
 */
export function HeroMedia({ media }: { media: HeroMediaConfig }) {
  const still = media.type === "image" ? media.image : media.poster;

  return (
    <div className="hero-media relative aspect-[3/4] w-full overflow-hidden bg-ink-raised">
      <Image
        src={still.src}
        width={still.width}
        height={still.height}
        alt={still.alt}
        sizes={sizes}
        preload
        className="absolute inset-0 h-full w-full object-cover"
      />
      {media.type === "video" && <HeroVideo sources={media.sources} label={still.alt} />}
    </div>
  );
}
