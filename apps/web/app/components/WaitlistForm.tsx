"use client";

import { useMemo, useState } from "react";

type Props = {
  toEmail: string;
  className?: string;
};

function extractEmail(mailto: string) {
  const value = mailto.trim();
  if (value.toLowerCase().startsWith("mailto:")) return value.slice("mailto:".length);
  return value;
}

export function WaitlistForm({ toEmail, className }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const emailTo = useMemo(() => extractEmail(toEmail), [toEmail]);

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const normalized = email.trim();
        if (!normalized.includes("@") || normalized.length < 6) {
          setError("Enter a valid email.");
          return;
        }
        setError(null);
        const subject = "KryptaFlow — Waitlist";
        const body = `Please add me to KryptaFlow updates.\n\nEmail: ${normalized}\n`;
        window.location.href = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="waitlist-email">
          Email
        </label>
        <input
          id="waitlist-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email for launch updates"
          className="h-11 w-full rounded-xl bg-black/40 px-4 text-sm text-white ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          inputMode="email"
          autoComplete="email"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-black hover:bg-emerald-400"
        >
          Get updates
        </button>
      </div>
      {error ? <div className="mt-2 text-xs text-rose-300">{error}</div> : null}
      <div className="mt-2 text-[11px] text-white/55">
        No spam. You can unsubscribe anytime.
      </div>
    </form>
  );
}

