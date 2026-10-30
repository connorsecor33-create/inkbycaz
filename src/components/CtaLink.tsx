import type { ReactNode } from "react";

type Variant = "ivory" | "outline" | "oxblood" | "outline-ink" | "text" | "text-ink";

const base =
  "group inline-flex min-h-12 items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.12em] transition-[background-color,color,border-color] duration-200 ease-out select-none";

const variants: Record<Variant, string> = {
  ivory: "border border-ivory bg-ivory px-6 text-ink hover:border-oxblood hover:bg-oxblood hover:text-ivory active:bg-oxblood-deep",
  outline: "border rule-dark px-6 text-ivory hover:border-ivory active:bg-ink-raised",
  oxblood: "border border-oxblood bg-oxblood px-6 text-ivory hover:border-ink hover:bg-ink active:bg-ink-raised",
  "outline-ink": "border border-ink/70 px-6 text-ink hover:bg-ink hover:text-ivory",
  text: "min-h-11 text-ivory underline decoration-oxblood decoration-2 underline-offset-[6px] hover:decoration-ivory",
  "text-ink": "min-h-11 text-ink underline decoration-oxblood decoration-2 underline-offset-[6px] hover:decoration-ink",
};

export function Arrow({ external = false }: { external?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-3.5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-px motion-reduce:transform-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {external ? <path d="M4.5 11.5l7-7M5.5 4.5h6v6" /> : <path d="M2.5 8h11M9 3.5L13.5 8 9 12.5" />}
    </svg>
  );
}

export function CtaLink({
  href,
  children,
  variant = "ivory",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      <Arrow external={external} />
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
