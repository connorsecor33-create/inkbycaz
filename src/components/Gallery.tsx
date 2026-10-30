"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { PortfolioItem } from "@/config/portfolio";
import { Lightbox } from "./Lightbox";

/**
 * Hand-set layout slots: base = 2 columns, md = 6, lg = 12.
 * Every photo keeps its native 3:4 ratio (no cropping); rhythm comes from
 * width, column offset and vertical staggering instead.
 */
const slots = [
  { cls: "col-span-2 md:col-span-4 lg:col-span-5 lg:col-start-1", sizes: "(min-width:64rem) 38vw, (min-width:48rem) 62vw, 100vw" },
  { cls: "col-span-1 md:col-span-2 md:self-end lg:col-span-4 lg:col-start-7", sizes: "(min-width:64rem) 30vw, (min-width:48rem) 30vw, 50vw" },
  { cls: "col-span-1 mt-14 md:col-span-2 md:mt-0 lg:col-span-3 lg:col-start-2", sizes: "(min-width:64rem) 22vw, (min-width:48rem) 30vw, 50vw" },
  { cls: "col-span-2 md:col-span-4 lg:col-span-5 lg:col-start-6 lg:mt-28", sizes: "(min-width:64rem) 38vw, (min-width:48rem) 62vw, 100vw" },
  { cls: "col-span-1 md:col-span-3 lg:col-span-4 lg:col-start-1", sizes: "(min-width:64rem) 30vw, 50vw" },
  { cls: "col-span-1 mt-14 md:col-span-3 md:mt-24 lg:col-span-3 lg:col-start-6 lg:mt-40", sizes: "(min-width:64rem) 22vw, 50vw" },
  { cls: "col-span-1 md:col-span-2 md:col-start-2 lg:col-span-3 lg:col-start-10 lg:mt-12", sizes: "(min-width:64rem) 22vw, (min-width:48rem) 30vw, 50vw" },
  { cls: "col-span-1 mt-14 md:col-span-3 md:mt-0 lg:col-span-5 lg:col-start-3", sizes: "(min-width:64rem) 38vw, (min-width:48rem) 46vw, 50vw" },
];

const pad = (n: number) => String(n).padStart(2, "0");

export function Gallery({
  items,
  moreLabel,
  moreHref,
  moreHandle,
}: {
  items: PortfolioItem[];
  moreLabel: string;
  moreHref: string;
  moreHandle: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback(() => {
    setIndex((current) => {
      if (current !== null) {
        // Restore focus to the image that was opened (or navigated to).
        requestAnimationFrame(() => triggers.current[current]?.focus());
      }
      return null;
    });
  }, []);

  return (
    <>
      <ol className="grid grid-cols-2 items-start gap-x-4 gap-y-12 md:grid-cols-6 md:gap-x-6 md:gap-y-16 lg:grid-cols-12 lg:gap-y-24">
        {items.map((item, i) => {
          const slot = slots[i % slots.length];
          return (
            <li key={item.id} className={`reveal ${slot.cls}`} style={{ ["--reveal-delay" as string]: `${(i % 2) * 90}ms` }}>
              <figure>
                <button
                  ref={(el) => {
                    triggers.current[i] = el;
                  }}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-haspopup="dialog"
                  className="group relative block w-full cursor-zoom-in overflow-hidden bg-ink-raised"
                >
                  <Image
                    src={item.src}
                    width={item.width}
                    height={item.height}
                    alt={item.alt}
                    sizes={slot.sizes}
                    loading="lazy"
                    className="block h-auto w-full transition-transform duration-700 ease-editorial [@media(hover:hover)]:group-hover:scale-[1.025] motion-reduce:transition-none"
                  />
                  <span className="sr-only">
                    , open full image {i + 1} of {items.length}
                  </span>
                  <span
                    aria-hidden="true"
                    className="label pointer-events-none absolute bottom-0 right-0 bg-ink px-3 py-2.5 text-ivory opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    View
                  </span>
                </button>
                <figcaption className="mt-3 flex flex-col gap-1 border-t rule-dark pt-3 sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="label shrink-0 tabular-nums text-gray">No. {pad(i + 1)}</span>
                  <span className="text-sm leading-snug text-ivory/90">
                    {item.caption}
                    {item.placement && <span className="text-gray"> — {item.placement}</span>}
                  </span>
                </figcaption>
              </figure>
            </li>
          );
        })}

        <li className="reveal col-span-2 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:self-end">
          <a
            href={moreHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group block border-y rule-dark py-8 transition-colors hover:border-ivory"
          >
            <span className="label text-gray">Continue</span>
            <span className="font-display mt-4 flex items-end justify-between gap-6 text-[clamp(2.5rem,7vw,4rem)] leading-[0.9]">
              <span>{moreLabel}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="mb-2 size-7 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transform-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
              >
                <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
              </svg>
            </span>
            <span className="mt-4 block text-sm text-gray">
              {moreHandle}
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
          </a>
        </li>
      </ol>

      <Lightbox items={items} index={index} onIndexChange={setIndex} onClose={close} />
    </>
  );
}
