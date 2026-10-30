import { site } from "@/config/site";
import { CtaLink } from "./CtaLink";
import { HeroMedia } from "./HeroMedia";

export function Hero() {
  const { hero } = site;

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="shell relative pb-16 pt-[calc(var(--header-h)+1.75rem)] lg:min-h-svh lg:pb-14 lg:pt-[calc(var(--header-h)+2.5rem)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto] lg:gap-x-6">
        {/* Eyebrow */}
        <p className="label flex items-center gap-3 text-gray lg:col-span-6 lg:col-start-1 lg:row-start-1">
          <span aria-hidden="true" className="block h-px w-8 bg-oxblood" />
          {hero.eyebrow}
        </p>

        {/* Headline — overlaps the photograph's dark edge on desktop */}
        <h1
          id="hero-heading"
          className="font-display relative z-10 mt-6 text-[clamp(4.25rem,19.5vw,7.5rem)] leading-[0.84] md:text-[clamp(7rem,17vw,10rem)] lg:col-span-9 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:self-center lg:text-[clamp(8rem,13.2vw,13.25rem)]"
        >
          <span className="headline-line">
            <span>{hero.headline[0]}</span>
          </span>
          <span className="headline-line lg:pl-[16.66%]" style={{ ["--line-delay" as string]: "120ms" }}>
            <span>
              {hero.headline[1].replace(/\.$/, "")}
              <span className="text-oxblood">.</span>
            </span>
          </span>
        </h1>

        {/* Supporting copy + actions */}
        <div className="mt-7 lg:col-span-5 lg:col-start-1 lg:row-start-3 lg:mt-0 lg:self-end">
          <p className="max-w-[26ch] text-lg leading-snug text-ivory/85 md:text-xl">{hero.supporting}</p>
          <div className="mt-7 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <CtaLink href={site.bookingUrl} external variant="ivory">
              {hero.primaryCta}
            </CtaLink>
            <CtaLink href="#work" variant="outline">
              {hero.secondaryCta}
            </CtaLink>
          </div>
        </div>

        {/* Photograph */}
        <figure className="mt-12 md:mx-auto md:w-[78%] lg:col-span-5 lg:col-start-7 lg:row-span-3 lg:row-start-1 lg:mt-0 lg:w-full">
          <p className="label mb-3 flex justify-between text-gray lg:hidden">
            <span>{hero.label}</span>
            <span aria-hidden="true">Cover</span>
          </p>
          <HeroMedia media={hero.media} />
          <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm text-gray">
            <span>
              <span className="label mr-3 text-ivory/70">Cover</span>
              {hero.caption}
            </span>
          </figcaption>
        </figure>

        {/* Vertical editorial label */}
        <p
          aria-hidden="true"
          className="label hidden text-gray [writing-mode:vertical-rl] lg:col-start-12 lg:row-span-3 lg:row-start-1 lg:block lg:justify-self-end"
        >
          {hero.label}
        </p>
      </div>
    </section>
  );
}
