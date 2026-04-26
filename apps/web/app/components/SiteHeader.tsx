import Link from "next/link";
import { siteConfig } from "@/app/siteConfig";

type Props = {
  variant?: "light" | "dark";
};

export function SiteHeader({ variant = "light" }: Props) {
  const isDark = variant === "dark";
  return (
    <header
      className={[
        "sticky top-0 z-50 border-b backdrop-blur",
        isDark
          ? "border-white/10 bg-black/40"
          : "border-zinc-200/70 bg-white/70",
      ].join(" ")}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div
            className={[
              "h-9 w-9 overflow-hidden rounded-xl ring-1",
              isDark ? "bg-white/10 ring-white/15" : "bg-zinc-50 ring-zinc-200",
            ].join(" ")}
          >
            <img src="/brand/avatar.svg" alt={siteConfig.name} className="h-full w-full object-cover" />
          </div>
          <div className="leading-tight">
            <div className={["text-sm font-semibold tracking-tight", isDark ? "text-white" : "text-zinc-950"].join(" ")}>
              {siteConfig.name}
            </div>
            <div className={["text-xs", isDark ? "text-white/60" : "text-zinc-500"].join(" ")}>
              {siteConfig.domain}
            </div>
          </div>
        </Link>

        <nav className={["hidden items-center gap-6 text-sm sm:flex", isDark ? "text-white/70" : "text-zinc-600"].join(" ")}>
          <Link href={siteConfig.links.whitepaper} className={isDark ? "hover:text-white" : "hover:text-zinc-950"}>
            Whitepaper
          </Link>
          <Link href={siteConfig.links.community} className={isDark ? "hover:text-white" : "hover:text-zinc-950"}>
            Community
          </Link>
          <Link href={siteConfig.links.dapp} className={isDark ? "hover:text-white" : "hover:text-zinc-950"}>
            DApp
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={siteConfig.socials.x}
            target="_blank"
            rel="noreferrer"
            className={[
              "hidden rounded-xl px-4 py-2 text-sm font-semibold ring-1 sm:inline-flex",
              isDark
                ? "bg-white/10 text-white ring-white/15 hover:bg-white/15"
                : "bg-white text-zinc-950 ring-zinc-200 hover:bg-zinc-50",
            ].join(" ")}
          >
            Follow
          </a>
          <Link
            href={siteConfig.links.dapp}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold",
              isDark
                ? "bg-emerald-500 text-black hover:bg-emerald-400"
                : "bg-zinc-950 text-white hover:bg-zinc-800",
            ].join(" ")}
          >
            Launch App
          </Link>
        </div>
      </div>
    </header>
  );
}

