import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { siteConfig } from "@/app/siteConfig";

function getHandleFromUrl(url: string, kind: "x" | "instagram" | "tiktok" | "youtube" | "github" | "telegram" | "reddit" | "discord" | "email") {
  if (kind === "email") {
    const cleaned = url.replace(/^mailto:/i, "");
    return cleaned ? cleaned : url;
  }

  const cleaned = url.replace(/^https?:\/\//i, "").replace(/\/+$/g, "");

  if (kind === "telegram") {
    const m = cleaned.match(/^(?:t\.me|telegram\.me|telegram\.dog)\/([^/?#]+)/i);
    return m?.[1] ? `@${m[1]}` : cleaned;
  }

  if (kind === "reddit") {
    const m = cleaned.match(/^www\.reddit\.com\/(?:user|u)\/([^/?#]+)/i);
    return m?.[1] ? `u/${m[1]}` : cleaned;
  }

  if (kind === "discord") {
    const m = cleaned.match(/^(?:discord\.gg|discord\.com\/invite)\/([^/?#]+)/i);
    return m?.[1] ? `invite/${m[1]}` : cleaned;
  }

  if (kind === "youtube") {
    const m = cleaned.match(/^www\.youtube\.com\/@([^/?#]+)/i);
    return m?.[1] ? `@${m[1]}` : cleaned;
  }

  if (kind === "tiktok") {
    const m = cleaned.match(/^www\.tiktok\.com\/@([^/?#]+)/i);
    return m?.[1] ? `@${m[1]}` : cleaned;
  }

  if (kind === "github") {
    const m = cleaned.match(/^github\.com\/([^/?#]+)/i);
    return m?.[1] ? m[1] : cleaned;
  }

  const m = cleaned.match(/^[^/]+\/([^/?#]+)/i);
  return m?.[1] ? `@${m[1]}` : cleaned;
}

function Icon({
  name,
}: {
  name:
    | "x"
    | "telegram"
    | "instagram"
    | "tiktok"
    | "youtube"
    | "github"
    | "reddit"
    | "discord"
    | "email";
}) {
  const common = "h-5 w-5";
  switch (name) {
    case "x":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M18.9 2H22l-6.8 7.78L23 22h-6.8l-5.3-6.86L4.9 22H2l7.3-8.36L1 2h6.9l4.8 6.18L18.9 2Zm-1.2 18h1.7L7.1 3.9H5.3L17.7 20Z" />
        </svg>
      );
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M9.6 15.6 9.3 20c.5 0 .7-.2.9-.4l2.1-2 4.3 3.2c.8.4 1.3.2 1.5-.7L22 4.7c.2-1-.3-1.4-1.1-1.1L2.3 10.8c-1 .4-1 1-.2 1.3l4.8 1.5L18 6.8c.6-.4 1.1-.2.7.2" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none">
          <path
            d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" stroke="currentColor" strokeWidth="2" />
          <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M14 2h2.2c.3 2 1.6 3.7 3.5 4.4V9c-1.7-.1-3.2-.7-4.6-1.8v7.7A6.2 6.2 0 1 1 8.9 8.7v2.6a3.7 3.7 0 1 0 3.6 3.7V2Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2 31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15.3V8.7L16 12l-6 3.3Z" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M12 .6a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.1-1.6-1.1-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.6.7 1.6.7.9 1.6 2.5 1.1 3.1.8.1-.7.4-1.1.7-1.4-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 5 18 5.3 18 5.3c.6 1.6.2 2.8.1 3.1.7.8 1.2 1.9 1.2 3.2 0 4.6-2.7 5.6-5.3 5.9.4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .6Z" />
        </svg>
      );
    case "reddit":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M14.6 2.6 13 10.1c.9.1 1.8.3 2.6.6.3-.3 1-.5 1.6-.5a2.3 2.3 0 1 1-1.9 3.6c.1.4.1.8.1 1.2 0 2.7-2.9 4.9-6.5 4.9S2.4 17.7 2.4 15c0-.4 0-.8.1-1.2A2.3 2.3 0 1 1 4.6 10c.7 0 1.3.2 1.7.6a9 9 0 0 1 3.8-.8l1.7-7.7c.1-.5.6-.8 1.1-.7l1.8.4c.3-.6.9-1 1.6-1A1.9 1.9 0 1 1 14.6 2.6ZM7.8 14.4a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Zm6.6 0a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Zm-6 2.8c.8.7 1.9 1.1 3.2 1.1 1.3 0 2.4-.4 3.2-1.1.3-.3.3-.7 0-1a.7.7 0 0 0-1 0c-.5.4-1.3.7-2.2.7-.9 0-1.7-.3-2.2-.7a.7.7 0 0 0-1 0c-.3.3-.3.7 0 1Z" />
        </svg>
      );
    case "discord":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M19.5 5.2a14 14 0 0 0-3.5-1.1l-.2.4c1.3.3 1.9.7 2.8 1.3a12.7 12.7 0 0 0-4.8-1.5 13.2 13.2 0 0 0-3.6 0 12.7 12.7 0 0 0-4.8 1.5c.9-.6 1.6-1 2.9-1.3l-.2-.4c-1.2.2-2.4.6-3.5 1.1C2.7 9.1 2 13 2.2 16.9c1.7 1.3 3.4 2 5.1 2.4l.6-.8a9.2 9.2 0 0 1-2.5-1.2l.5-.4c1.6.7 3.9 1.5 6.1 1.5s4.5-.8 6.1-1.5l.5.4c-.8.5-1.6.9-2.5 1.2l.6.8c1.7-.4 3.4-1.1 5.1-2.4.3-4-.3-7.8-2.3-11.7ZM8.8 14.7c-.7 0-1.3-.6-1.3-1.4 0-.8.6-1.4 1.3-1.4.7 0 1.3.6 1.3 1.4 0 .8-.6 1.4-1.3 1.4Zm6.4 0c-.7 0-1.3-.6-1.3-1.4 0-.8.6-1.4 1.3-1.4.7 0 1.3.6 1.3 1.4 0 .8-.6 1.4-1.3 1.4Z" />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none">
          <path
            d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="m4 8 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

function SocialCard({
  name,
  title,
  subtitle,
  href,
}: {
  name: Parameters<typeof Icon>[0]["name"];
  title: string;
  subtitle: string;
  href: string;
}) {
  const handle = getHandleFromUrl(href, name);
  const iconStyle =
    name === "telegram"
      ? { color: "#229ED9" }
      : name === "youtube"
        ? { color: "#FF0000" }
        : name === "reddit"
          ? { color: "#FF4500" }
          : name === "discord"
            ? { color: "#5865F2" }
            : name === "tiktok"
              ? { color: "#25F4EE" }
              : name === "github"
                ? { color: "#E5E7EB" }
                : name === "x"
                  ? { color: "#FFFFFF" }
                  : name === "email"
                    ? { color: "#34D399" }
                    : undefined;
  const instagramRing =
    name === "instagram"
      ? {
          background:
            "conic-gradient(from 210deg, #f9ce34, #ee2a7b, #6228d7, #ee2a7b, #f9ce34)",
        }
      : undefined;

  return (
    <a
      className="group rounded-2xl bg-black/40 p-6 ring-1 ring-white/10 hover:bg-black/30"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15" style={instagramRing}>
            <div style={iconStyle}>
              <Icon name={name} />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white/60">{title}</div>
            <div className="mt-0.5 text-lg font-semibold">{subtitle}</div>
          </div>
        </div>
        <div className="hidden text-xs text-white/50 sm:block">Official</div>
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <div className="text-sm font-mono text-white/85">{handle}</div>
        <div className="text-xs text-white/55 break-all">{href}</div>
      </div>
    </a>
  );
}

export default function CommunityPage() {
  return (
    <div className="min-h-dvh bg-black text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-72 left-10 h-[640px] w-[640px] rounded-full bg-indigo-500/22 blur-3xl" />
        <div className="absolute -bottom-80 right-10 h-[640px] w-[640px] rounded-full bg-fuchsia-500/18 blur-3xl" />
      </div>

      <SiteHeader variant="dark" />

      <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-20 pt-12">
        <section className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
          <h1 className="text-3xl font-semibold tracking-tight">Join KryptaFlow</h1>
          <p className="mt-3 max-w-3xl text-sm text-white/70">
            This page is where investors and users should go first. Add your official links here so nobody gets scammed
            by fake accounts.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <SocialCard name="x" title="X (Twitter)" subtitle="Follow announcements" href={siteConfig.socials.x} />
            <SocialCard name="telegram" title="Telegram" subtitle="Community chat" href={siteConfig.socials.telegram} />
            <SocialCard name="instagram" title="Instagram" subtitle="Brand & visuals" href={siteConfig.socials.instagram} />
            <SocialCard name="tiktok" title="TikTok" subtitle="Short-form updates" href={siteConfig.socials.tiktok} />
            <SocialCard name="youtube" title="YouTube" subtitle="Demos & announcements" href={siteConfig.socials.youtube} />
            <SocialCard name="github" title="GitHub" subtitle="Code & releases" href={siteConfig.socials.github} />
            <SocialCard name="reddit" title="Reddit" subtitle="Community posts" href={siteConfig.socials.reddit} />
            <SocialCard name="discord" title="Discord" subtitle="Builders & support" href={siteConfig.socials.discord} />
            <SocialCard name="email" title="Email" subtitle="Partnerships" href={siteConfig.socials.email} />
          </div>
        </section>

        <section className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
          <h2 className="text-xl font-semibold">Anti-scam notice</h2>
          <p className="mt-3 text-sm text-white/70">
            Only trust links on this domain. If you change handles, update them here immediately.
          </p>
        </section>
      </main>

      <SiteFooter variant="dark" />
    </div>
  );
}

