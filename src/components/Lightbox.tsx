"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { PortfolioItem } from "@/config/portfolio";
import imageLoader from "@/lib/image-loader";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Full-screen viewer built on the native modal <dialog>: the page behind is
 * inert (focus stays inside), Escape closes natively, and Gallery restores
 * focus to the originating image on close. Arrow keys and swipe navigate.
 */
export function Lightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: PortfolioItem[];
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const isOpen = index !== null;
  const count = items.length;

  // Open / close the native dialog in step with state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      closeRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
    if (!isOpen) document.documentElement.style.overflow = "";
  }, [isOpen]);

  // Preload neighbours so prev/next feel instant.
  useEffect(() => {
    if (index === null) return;
    [index - 1, index + 1].forEach((n) => {
      const item = items[(n + count) % count];
      const img = new window.Image();
      img.src = imageLoader({ src: item.src, width: 1200 });
    });
  }, [index, items, count]);

  const go = (delta: number) => {
    if (index === null) return;
    onIndexChange((index + delta + count) % count);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "Tab" && dialogRef.current) {
      // Keep Tab cycling within the viewer's own controls.
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const item = index !== null ? items[index] : null;

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-labelledby="lightbox-caption"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => isOpen && onClose()}
      onKeyDown={onKeyDown}
    >
      {item && index !== null && (
        <div className="flex h-full flex-col">
          <div className="shell flex h-16 shrink-0 items-center justify-between">
            <p className="label tabular-nums text-gray" aria-live="polite">
              <span className="text-ivory">{pad(index + 1)}</span> / {pad(count)}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="label -mr-3 inline-flex min-h-12 items-center gap-3 px-3 text-ivory hover:text-gray"
            >
              Close
              <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>

          <div
            className="relative min-h-0 flex-1 touch-pan-y"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            }}
          >
            <Image
              key={item.id}
              src={item.src}
              alt={item.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <div className="shell flex shrink-0 flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p id="lightbox-caption" className="text-sm text-ivory/90">
              <span className="label mr-3 text-gray">No. {pad(index + 1)}</span>
              {item.caption}
              {item.placement && <span className="text-gray"> — {item.placement}</span>}
            </p>
            <div className="flex gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex size-12 items-center justify-center border rule-dark transition-colors hover:border-ivory active:bg-ink-raised"
                aria-label="Previous image"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13.5 8h-11M7 3.5L2.5 8 7 12.5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex size-12 items-center justify-center border rule-dark transition-colors hover:border-ivory active:bg-ink-raised"
                aria-label="Next image"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2.5 8h11M9 3.5L13.5 8 9 12.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
