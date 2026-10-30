"use client";

import { useEffect, useRef, useState } from "react";

/** Muted background loop layered over the poster image. Never mounts for
 *  visitors who prefer reduced motion, and offers a pause control (WCAG 2.2.2). */
export function HeroVideo({ sources, label }: { sources: { src: string; type: string }[]; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowed(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!allowed) return null;

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      <button
        type="button"
        onClick={toggle}
        className="label absolute bottom-3 right-3 min-h-11 bg-ink px-4 text-ivory"
        aria-pressed={!playing}
      >
        {playing ? "Pause video" : "Play video"}
      </button>
    </>
  );
}
