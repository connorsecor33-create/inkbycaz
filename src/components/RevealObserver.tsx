"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

/** Adds `.is-in` to `.reveal` elements as they enter the viewport.
 *  Does nothing unless the layout script enabled motion. */
export function RevealObserver() {
  useEffect(() => {
    window.__revealReady = true;
    if (!document.documentElement.classList.contains("motion")) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
