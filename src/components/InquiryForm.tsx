"use client";

import { useRef, useState, type FormEvent } from "react";
import type { InquiryFormConfig } from "@/config/site";

type Field = {
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "email" | "textarea";
  autoComplete?: string;
  hint?: string;
  half?: boolean;
  rows?: number;
};

/** Field names are what appear in the Formspree inbox and notification emails. */
const fields: Field[] = [
  { name: "name", label: "Name", required: true, autoComplete: "name", half: true },
  { name: "email", label: "Email", required: true, type: "email", autoComplete: "email", half: true },
  { name: "instagram", label: "Instagram handle", hint: "Optional", autoComplete: "off", half: true },
  { name: "placement", label: "Placement", required: true, hint: "e.g. Outer forearm", half: true },
  { name: "size", label: "Approximate size", hint: "e.g. 4 × 6 in, or palm-sized", half: true },
  { name: "idea", label: "Your idea", required: true, type: "textarea", rows: 5, hint: "The subject, inspiration, or direction" },
  {
    name: "references",
    label: "Reference links",
    type: "textarea",
    rows: 3,
    hint: "Optional. Paste links to images, or send them on Instagram",
  },
];

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: FormData) {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const value = String(data.get(f.name) ?? "").trim();
    if (f.required && !value) errors[f.name] = `Enter your ${f.label.toLowerCase()}.`;
    else if (f.type === "email" && value && !EMAIL.test(value)) errors[f.name] = "Enter an email address like name@example.com.";
    else if (f.name === "idea" && value && value.length < 15) errors[f.name] = "Add a little more detail about your idea.";
  }
  return errors;
}

export function InquiryForm({ config, instagramUrl }: { config: InquiryFormConfig; instagramUrl: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  if (!config.endpoint) return null;
  const endpoint = config.endpoint;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return; // guard against double submits

    const form = e.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    // Honeypot filled in: pretend success, send nothing.
    if (String(data.get("_gotcha") ?? "")) {
      setStatus("success");
      return;
    }

    inFlight.current = true;
    setStatus("submitting");
    setServerMessage(null);
    try {
      const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (res.ok) {
        form.reset();
        setStatus("success");
        requestAnimationFrame(() => successRef.current?.focus());
      } else {
        // Formspree replies with `errors: [{ message }]` and/or `error: "..."`.
        const body = (await res.json().catch(() => null)) as {
          error?: string;
          errors?: { message?: string }[];
        } | null;
        const detail = body?.errors?.map((x) => x.message).filter(Boolean).join(" ") || body?.error || "";
        setServerMessage(`Formspree responded: ${detail || `HTTP ${res.status}`}.`);
        console.error("[InquiryForm] Formspree rejected the submission", res.status, body);
        setStatus("error");
        requestAnimationFrame(() => errorRef.current?.focus());
      }
    } catch (err) {
      console.error("[InquiryForm] Request to Formspree failed", err);
      setServerMessage(null);
      setStatus("error");
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border-t-2 border-oxblood pt-8 outline-none">
        <p className="font-display text-[clamp(2.75rem,8vw,4.5rem)] leading-[0.9]">{config.successHeading}</p>
        <p className="mt-5 max-w-[46ch] leading-relaxed text-ivory/85">{config.successBody}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="label mt-8 inline-flex min-h-11 items-center text-ivory underline decoration-oxblood decoration-2 underline-offset-[6px] hover:decoration-ivory"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";
  const inputBase =
    "mt-2 block w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-base text-ivory placeholder:text-gray/60 transition-colors focus:border-ivory focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory";

  return (
    <form
      ref={formRef}
      action={endpoint}
      method="POST"
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="inquiry-form-heading"
      aria-busy={submitting}
      className="border-t-2 border-oxblood pt-8"
    >
      <h3 id="inquiry-form-heading" className="text-lg font-semibold uppercase tracking-[0.06em]">
        {config.heading}
      </h3>
      <p className="mt-2 text-sm text-gray">{config.intro}</p>

      {status === "error" && (
        <div ref={errorRef} tabIndex={-1} role="alert" className="mt-6 border-l-2 border-oxblood-light py-1 pl-4 text-sm leading-relaxed text-oxblood-light outline-none">
          <p>{serverMessage ?? config.errorBody}</p>
          {serverMessage && <p className="mt-1">{config.errorBody}</p>}
        </div>
      )}

      <input type="hidden" name="_subject" value={config.subject} />
      {/* Honeypot: hidden from people and assistive tech, catches simple bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-8 grid gap-x-6 gap-y-7 sm:grid-cols-2">
        {fields.map((f) => {
          const id = `inq-${f.name}`;
          const error = errors[f.name];
          const describedBy = [f.hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
          const shared = {
            id,
            name: f.name,
            required: f.required,
            autoComplete: f.autoComplete,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": describedBy,
            disabled: submitting,
            className: `${inputBase} ${error ? "border-oxblood-light" : "rule-dark"}`,
            onChange: () =>
              error &&
              setErrors((prev) => {
                const next = { ...prev };
                delete next[f.name];
                return next;
              }),
          };
          return (
            <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
              <label htmlFor={id} className="label text-ivory/80">
                {f.label}
                {f.required && (
                  <span aria-hidden="true" className="text-oxblood-light">
                    {" "}*
                  </span>
                )}
              </label>
              {f.type === "textarea" ? (
                <textarea {...shared} rows={f.rows} className={`${shared.className} resize-y`} />
              ) : (
                <input {...shared} type={f.type ?? "text"} inputMode={f.type === "email" ? "email" : undefined} />
              )}
              {f.hint && (
                <p id={`${id}-hint`} className="mt-2 text-xs text-gray">
                  {f.hint}
                </p>
              )}
              {error && (
                <p id={`${id}-error`} className="mt-2 text-sm text-oxblood-light">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-12 items-center justify-center gap-3 border border-ivory bg-ivory px-6 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-oxblood hover:bg-oxblood hover:text-ivory disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? config.submitting : config.submit}
        </button>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center text-sm text-gray underline decoration-oxblood decoration-2 underline-offset-4 hover:text-ivory"
        >
          {config.instagramAlternative}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </form>
  );
}
