import Image from "next/image";
import { portfolio } from "@/config/portfolio";
import { site } from "@/config/site";
import { CtaLink } from "./CtaLink";
import { Gallery } from "./Gallery";

function SectionLabel({ n, children, light = false }: { n: string; children: string; light?: boolean }) {
  return (
    <p className={`label flex items-center gap-3 ${light ? "text-gray-ink" : "text-gray"}`}>
      <span className="tabular-nums">({n})</span>
      <span aria-hidden="true" className="block h-px w-8 bg-oxblood" />
      <span>{children}</span>
    </p>
  );
}

/** Splits a trailing "." or "?" so it can carry the accent colour. */
function Punctuated({ text }: { text: string }) {
  const m = text.match(/^(.*?)([.?!])$/);
  if (!m) return <>{text}</>;
  return (
    <>
      {m[1]}
      <span className="text-oxblood">{m[2]}</span>
    </>
  );
}

export function Work() {
  const { work } = site;
  return (
    <section id="work" aria-labelledby="work-heading" className="shell border-t rule-dark py-20 md:py-28 lg:py-36">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-7">
          <SectionLabel n="01">{work.label}</SectionLabel>
          <h2 id="work-heading" className="font-display mt-6 text-[clamp(4rem,16vw,11rem)] leading-[0.84]">
            <span className="block">{work.heading[0]}</span>
            <span className="block md:pl-[12%]">
              <Punctuated text={work.heading[1]} />
            </span>
          </h2>
        </div>
        <div className="flex flex-col justify-end gap-6 lg:col-span-4 lg:col-start-9">
          <p className="max-w-[38ch] text-base leading-relaxed text-ivory/80 md:text-lg">{work.intro}</p>
          <p className="label tabular-nums text-gray">
            {String(portfolio.length).padStart(2, "0")} pieces shown
          </p>
        </div>
      </div>

      <div className="mt-16 md:mt-24">
        <Gallery
          items={portfolio}
          moreLabel={work.moreLabel}
          moreHref={site.instagram.url}
          moreHandle={site.instagram.handle}
        />
      </div>
    </section>
  );
}

export function Artist() {
  const { artist } = site;
  return (
    <section id="artist" aria-labelledby="artist-heading" className="on-light bg-ivory text-ink [color-scheme:light]">
      <div className="shell grid gap-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-x-6 lg:py-36">
        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
          <SectionLabel n="02" light>
            {artist.label}
          </SectionLabel>
          <h2
            id="artist-heading"
            className="font-display mt-6 text-[clamp(3.5rem,13vw,8.5rem)] leading-[0.86] lg:text-[clamp(5rem,7.6vw,8.5rem)]"
          >
            <Punctuated text={artist.heading} />
          </h2>
        </div>

        <figure className="reveal md:w-[72%] lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:w-full">
          <Image
            src={artist.portrait.src}
            width={artist.portrait.width}
            height={artist.portrait.height}
            alt={artist.portrait.alt}
            sizes="(min-width:64rem) 38vw, (min-width:48rem) 70vw, 100vw"
            loading="lazy"
            className="block h-auto w-full bg-ink/10"
          />
          <figcaption className="label mt-3 flex justify-between border-t rule-light pt-3 text-gray-ink">
            <span>{site.brand}</span>
            <span>{site.instagram.handle}</span>
          </figcaption>
        </figure>

        <div className="lg:col-span-5 lg:col-start-7 lg:row-start-2 lg:self-end">
          <p className="max-w-[40ch] text-lg leading-relaxed md:text-xl">{artist.body}</p>

          <dl className="mt-10 border-t rule-light">
            {artist.facts.map((f) => (
              <div key={f.term} className="grid grid-cols-[minmax(0,9rem)_1fr] gap-4 border-b rule-light py-3.5 text-sm">
                <dt className="label self-center text-gray-ink">{f.term}</dt>
                <dd>{f.detail}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <CtaLink href={site.instagram.url} external variant="text-ink">
              {site.instagram.handle}
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Inquire() {
  const { inquire } = site;
  return (
    <section id="inquire" aria-labelledby="inquire-heading" className="shell py-20 md:py-28 lg:py-36">
      <SectionLabel n="03">{inquire.label}</SectionLabel>
      <h2 id="inquire-heading" className="font-display mt-6 max-w-[11ch] text-[clamp(3.5rem,13vw,9.5rem)] leading-[0.86]">
        <Punctuated text={inquire.heading} />
      </h2>

      <ol className="mt-14 grid gap-px md:mt-20 md:grid-cols-3 md:gap-6">
        {inquire.steps.map((step, i) => (
          <li key={step.title} className="reveal border-t-2 border-oxblood pb-8 pt-6 md:pb-0" style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
            <span aria-hidden="true" className="font-display block text-[4.5rem] leading-none text-ivory/90 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-6 text-lg font-semibold uppercase tracking-[0.06em]">{step.title}</h3>
            <p className="mt-2 max-w-[30ch] leading-relaxed text-gray">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-14 grid gap-8 border-t rule-dark pt-10 md:mt-20 lg:grid-cols-12 lg:gap-x-6">
        <p className="max-w-[44ch] text-lg leading-relaxed text-ivory/90 md:text-xl lg:col-span-6">{inquire.supporting}</p>
        <div className="flex flex-col items-start gap-4 lg:col-span-5 lg:col-start-8 lg:items-end lg:text-right">
          <CtaLink href={site.bookingUrl} external variant="ivory">
            {inquire.cta}
          </CtaLink>
          <p className="max-w-[40ch] text-sm leading-relaxed text-gray">{inquire.note}</p>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  const { finalCta } = site;
  return (
    <section aria-labelledby="final-heading" className="on-light bg-ivory text-ink [color-scheme:light]">
      <div className="shell py-20 md:py-28 lg:py-32">
        <h2 id="final-heading" className="font-display text-[clamp(3.75rem,15.5vw,14.5rem)] leading-[0.84]">
          <span className="block">{finalCta.lines[0]}</span>
          <span className="block lg:pl-[8%]">
            <Punctuated text={finalCta.lines[1]} />
          </span>
        </h2>
        <div className="mt-12 flex flex-col gap-5 border-t rule-light pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-gray-ink">
            {site.location} — {site.instagram.handle}
          </p>
          <CtaLink href={site.bookingUrl} external variant="oxblood">
            {finalCta.cta}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  // Rendered at build time; the inline script refreshes it if the build is older.
  const year = new Date().getFullYear();
  const { footer } = site;
  return (
    <footer className="bg-ink">
      <div className="shell flex flex-col gap-6 py-10 text-sm md:flex-row md:items-center md:justify-between">
        <p className="font-display text-2xl leading-none tracking-[0.02em]">{site.brand}</p>
        <ul className="flex flex-col gap-1 text-gray md:flex-row md:items-center md:gap-8">
          <li>{site.location}</li>
          <li>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-ivory underline decoration-oxblood decoration-2 underline-offset-4 hover:decoration-ivory"
            >
              Instagram<span className="sr-only"> {site.instagram.handle} (opens in a new tab)</span>
            </a>
          </li>
          <li>
            © <span id="copyright-year" suppressHydrationWarning>{year}</span> Inkbycaz
            <script
              dangerouslySetInnerHTML={{
                __html: `document.getElementById("copyright-year").textContent=new Date().getFullYear()`,
              }}
            />
          </li>
          {footer.showAgencyCredit && footer.agencyUrl && (
            <li>
              Site by{" "}
              <a href={footer.agencyUrl} target="_blank" rel="noopener noreferrer" className="text-ivory">
                {footer.agencyName}
              </a>
            </li>
          )}
        </ul>
      </div>
    </footer>
  );
}
