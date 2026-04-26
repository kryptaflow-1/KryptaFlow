"use client";

import { useState } from "react";

export function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // noop
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center justify-center rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15 hover:bg-white/15"
      title={value}
    >
      {copied ? "Copied" : label ?? "Copy"}
    </button>
  );
}

