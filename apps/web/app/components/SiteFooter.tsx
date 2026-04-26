import Link from "next/link";
import { siteConfig } from "@/app/siteConfig";

type Props = {
  variant?: "light" | "dark";
};

export function SiteFooter({ variant = "dark" }: Props) {
  const isDark = variant === "dark";
  return (
    <footer className={["border-t", isDark ? "border-white/10 bg-black" : "border-zinc-200/70 bg-white"].join(" ")}>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={[
                "h-10 w-10 overflow-hidden rounded-2xl ring-1",
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
                Official: {siteConfig.domain}
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="grid gap-2 text-sm">
              <div className={["text-xs font-semibold uppercase tracking-wide", isDark ? "text-white/50" : "text-zinc-500"].join(" ")}>
                Product
              </div>
              <Link className={isDark ? "text-white/75 hover:text-white" : "text-zinc-700 hover:text-zinc-950"} href={siteConfig.links.dapp}>
                Demo DApp
              </Link>
              <a className={isDark ? "text-white/75 hover:text-white" : "text-zinc-700 hover:text-zinc-950"} href={siteConfig.links.explorer} target="_blank" rel="noreferrer">
                Explorer
              </a>
              <Link className={isDark ? "text-white/75 hover:text-white" : "text-zinc-700 hover:text-zinc-950"} href={siteConfig.links.whitepaper}>
                Whitepaper
              </Link>
            </div>

            <div className="grid gap-2 text-sm">
              <div className={["text-xs font-semibold uppercase tracking-wide", isDark ? "text-white/50" : "text-zinc-500"].join(" ")}>
                Community
              </div>
              <a className={isDark ? "text-white/75 hover:text-white" : "text-zinc-700 hover:text-zinc-950"} href={siteConfig.socials.telegram} target="_blank" rel="noreferrer">
                Telegram
              </a>
              <a className={isDark ? "text-white/75 hover:text-white" : "text-zinc-700 hover:text-zinc-950"} href={siteConfig.socials.discord} target="_blank" rel="noreferrer">
                Discord
              </a>
              <a className={isDark ? "text-white/75 hover:text-white" : "text-zinc-700 hover:text-zinc-950"} href={siteConfig.socials.x} target="_blank" rel="noreferrer">
                X (Twitter)
              </a>
              <Link className={isDark ? "text-white/75 hover:text-white" : "text-zinc-700 hover:text-zinc-950"} href={siteConfig.links.community}>
                All links
              </Link>
            </div>

            <div className="grid gap-2 text-sm">
              <div className={["text-xs font-semibold uppercase tracking-wide", isDark ? "text-white/50" : "text-zinc-500"].join(" ")}>
                Contact
              </div>
              <a className={isDark ? "text-white/75 hover:text-white" : "text-zinc-700 hover:text-zinc-950"} href={siteConfig.socials.email}>
                Email
              </a>
              <a className={isDark ? "text-white/75 hover:text-white" : "text-zinc-700 hover:text-zinc-950"} href={siteConfig.socials.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className={isDark ? "text-white/75 hover:text-white" : "text-zinc-700 hover:text-zinc-950"} href={siteConfig.socials.youtube} target="_blank" rel="noreferrer">
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div
          className={[
            "mt-10 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between",
            isDark ? "border-white/10 text-white/55" : "border-zinc-200/70 text-zinc-500",
          ].join(" ")}
        >
          <div>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</div>
          <div>Crypto is risky. No guaranteed returns.</div>
        </div>
      </div>
    </footer>
  );
}

