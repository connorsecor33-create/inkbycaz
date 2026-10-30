"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { CtaLink } from "./CtaLink";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // While the menu is open: lock scroll, make the page behind inert,
  // move focus into the panel and close on Escape or desktop resize.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const behind = document.querySelectorAll<HTMLElement>("main, footer");
    root.style.overflow = "hidden";
    behind.forEach((el) => (el.inert = true));
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const mq = window.matchMedia("(min-width: 64rem)");
    const onMq = () => mq.matches && close(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      root.style.overflow = "";
      behind.forEach((el) => (el.inert = false));
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 bg-ink transition-[border-color] duration-300 border-b ${
        scrolled || open ? "rule-dark" : "border-transparent"
      }`}
    >
      <div className="shell flex h-(--header-h) items-center justify-between gap-6">
        <a
          href="#top"
          className="font-display -my-2 py-2 text-[1.375rem] leading-none tracking-[0.02em] lg:text-2xl"
          aria-label="Inkbycaz — back to top"
          onClick={() => open && close(false)}
        >
          {site.brand}
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {site.nav.map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group label inline-flex min-h-11 items-center gap-2 text-ivory/80 transition-colors hover:text-ivory"
                >
                  <span className="text-gray tabular-nums" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-oxblood">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <CtaLink href={site.bookingUrl} external variant="outline" className="min-h-11!">
              {site.hero.primaryCta}
            </CtaLink>
          </span>
          <button
            ref={toggleRef}
            type="button"
            className="label -mr-3 inline-flex min-h-11 min-w-11 items-center gap-3 px-3 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span aria-hidden="true" className="relative block h-2.5 w-5">
              <span
                className={`absolute left-0 h-px w-5 bg-ivory transition-transform duration-300 ${
                  open ? "top-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-ivory transition-transform duration-300 ${
                  open ? "top-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-(--header-h) overflow-y-auto bg-ink lg:hidden"
      >
        <nav aria-label="Mobile" className="shell flex min-h-full flex-col justify-between pb-10 pt-8">
          <ul className="border-t rule-dark">
            {site.nav.map((item, i) => (
              <li key={item.href} className="border-b rule-dark">
                <a
                  href={item.href}
                  onClick={() => close(false)}
                  className="font-display flex items-baseline justify-between py-5 text-[clamp(2.75rem,14vw,5rem)] leading-[0.9]"
                >
                  <span>{item.label}</span>
                  <span className="label text-gray tabular-nums" aria-hidden="true">
                    0{i + 1}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-5">
            <CtaLink href={site.bookingUrl} external variant="ivory" className="w-full">
              {site.hero.primaryCta}
            </CtaLink>
            <p className="label text-gray">
              {site.location} — {site.instagram.handle}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
