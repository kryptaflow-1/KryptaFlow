import Link from "next/link";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { siteConfig } from "@/app/siteConfig";
import { WaitlistForm } from "@/app/components/WaitlistForm";

const EXPLORER_URL = siteConfig.links.explorer;

export default function Home() {
  return (
    <div className="min-h-dvh bg-black text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute -bottom-72 left-6 h-[640px] w-[640px] rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute -bottom-80 right-10 h-[640px] w-[640px] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_70%_65%,rgba(255,255,255,0.10),transparent_50%)]" />
      </div>

      <SiteHeader variant="dark" />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-20 pt-14">
        <section className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/15">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Pre‑launch • {siteConfig.launch.network} • {siteConfig.launch.pair}
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              A Revolut‑style launch experience for your EVM ecosystem.
            </h1>
            <p className="max-w-xl text-base text-white/70">
              KryptaFlow is building a clean, investor‑ready launch for KFL—designed for transparency, simple tokenomics,
              and a community‑first rollout.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={siteConfig.links.dapp}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black hover:bg-emerald-400"
              >
                Launch Demo DApp
              </Link>
              <a
                href={EXPLORER_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
              >
                Open Explorer
              </a>
              <Link
                href={siteConfig.links.whitepaper}
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
              >
                Read Whitepaper
              </Link>
            </div>

            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold text-white/60">Launch status</div>
                  <div className="mt-1 text-lg font-semibold">KFL is coming soon on {siteConfig.launch.network}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/70">
                    <span className="rounded-full bg-black/40 px-3 py-1 ring-1 ring-white/10">Tax: {siteConfig.launch.tax}</span>
                    <span className="rounded-full bg-black/40 px-3 py-1 ring-1 ring-white/10">LP lock: {siteConfig.tokenomics.lpLock.months} months</span>
                    <span className="rounded-full bg-black/40 px-3 py-1 ring-1 ring-white/10">
                      Start liquidity: ${siteConfig.launch.startingLiquidity.usdt} + {siteConfig.launch.startingLiquidity.kfl.toLocaleString()} KFL
                    </span>
                    <span className="rounded-full bg-black/40 px-3 py-1 ring-1 ring-white/10">
                      Price: {siteConfig.launch.launchPriceUsdt} USDT
                    </span>
                  </div>
                </div>
                <a
                  href={siteConfig.socials.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
                >
                  Join Telegram
                </a>
              </div>
              <div className="mt-4">
                <WaitlistForm toEmail={siteConfig.socials.email} />
              </div>
              <div className="mt-3 text-xs text-white/60">
                Contract address: <span className="font-mono text-white/75">{siteConfig.launch.contractAddress ?? "TBA"}</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs font-semibold text-white/60">Max supply</div>
                <div className="mt-1 text-xl font-semibold">1B KFL</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs font-semibold text-white/60">Standard</div>
                <div className="mt-1 text-xl font-semibold">ERC‑20</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs font-semibold text-white/60">Explorer</div>
                <div className="mt-1 text-xl font-semibold">Blockscout</div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(52,211,153,0.25),transparent_55%),radial-gradient(circle_at_90%_60%,rgba(217,70,239,0.18),transparent_55%)]" />
            <div className="relative">
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10 kf-float">
                  <div className="text-xs font-semibold text-white/60">Wallet UX</div>
                  <div className="mt-1 text-lg font-semibold">MetaMask-ready</div>
                  <div className="mt-1 text-sm text-white/70">0x addresses, approvals, transfers — familiar flow.</div>
                </div>
                <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
                  <div className="text-xs font-semibold text-white/60">Proof</div>
                  <div className="mt-1 text-lg font-semibold">Explorer-first</div>
                  <div className="mt-1 text-sm text-white/70">Investors verify transactions and contracts instantly.</div>
                </div>
                <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
                  <div className="text-xs font-semibold text-white/60">Onboarding</div>
                  <div className="mt-1 text-lg font-semibold">1‑click faucet</div>
                  <div className="mt-1 text-sm text-white/70">Users test in seconds—no support tickets.</div>
                </div>
                <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10 kf-float">
                  <div className="text-xs font-semibold text-white/60">Launch plan</div>
                  <div className="mt-1 text-lg font-semibold">Community → Mainnet</div>
                  <div className="mt-1 text-sm text-white/70">Clear milestones, no hype—just shipping.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="text-sm font-semibold">Official links</div>
              <div className="mt-1 text-xs text-white/60">Keep users safe from fake accounts. Only trust these.</div>
            </div>
            <Link className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15" href={siteConfig.links.community}>
              View all socials
            </Link>
          </div>
          <div className="kf-mask-fade mt-5 overflow-hidden">
            <div className="kf-marquee flex items-center gap-3 text-sm text-white/80">
              {[
                "kryptaflow.com",
                "x.com/kryptaflow",
                "t.me/kryptaflow",
                "discord.gg/V967c7qsU",
                "instagram.com/kryptaflow1",
                "tiktok.com/@kryptaflow.com",
                "youtube.com/@KryptaFlow",
                "github.com/kryptaflow-1",
              ]
                .concat([
                  "kryptaflow.com",
                  "x.com/kryptaflow",
                  "t.me/kryptaflow",
                  "discord.gg/V967c7qsU",
                  "instagram.com/kryptaflow1",
                  "tiktok.com/@kryptaflow.com",
                  "youtube.com/@KryptaFlow",
                  "github.com/kryptaflow-1",
                ])
                .map((t, i) => (
                  <span key={i} className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">
                    {t}
                  </span>
                ))}
            </div>
          </div>
        </section>

        <section id="tokenomics" className="grid gap-6 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">KFL Tokenomics</h2>
            <p className="text-sm text-white/70">Clear, simple, and verifiable.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="text-xs font-semibold text-white/60">Max supply</div>
              <div className="mt-1 text-2xl font-semibold">1,000,000,000</div>
              <div className="mt-1 text-sm text-white/70">Hard-capped at 1B KFL.</div>
            </div>
            <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="text-xs font-semibold text-white/60">Standard</div>
              <div className="mt-1 text-2xl font-semibold">ERC‑20</div>
              <div className="mt-1 text-sm text-white/70">Wallets + exchanges + dApps compatible.</div>
            </div>
            <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="text-xs font-semibold text-white/60">Utility</div>
              <div className="mt-1 text-2xl font-semibold">Payments & rewards</div>
              <div className="mt-1 text-sm text-white/70">Use in apps, staking, governance, and incentives.</div>
            </div>
          </div>
          <div className="text-xs text-white/60">
            Note: This is a starter/demo. Before public launch: audits, multi-node infra, and a real distribution plan.
          </div>

          <div className="mt-2 rounded-2xl bg-black/40 p-6 ring-1 ring-white/10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold text-white/60">Distribution</div>
                <div className="mt-1 text-lg font-semibold">
                  {siteConfig.tokenomics.maxSupply.toLocaleString()} {siteConfig.tokenomics.symbol} total supply
                </div>
              </div>
              <div className="text-xs text-white/60">LP lock: {siteConfig.tokenomics.lpLock.months} months</div>
            </div>

            <div className="mt-5 grid gap-3">
              {siteConfig.tokenomics.distribution.map((item) => (
                <div key={item.label} className="grid gap-2">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-white/60">
                      {item.percent}% • {item.amount.toLocaleString()} {siteConfig.tokenomics.symbol}
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-indigo-400 to-fuchsia-400"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-white/60">{siteConfig.tokenomics.lpLock.note}</div>
          </div>
        </section>

        <section id="roadmap" className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold">Roadmap</h2>
            <p className="mt-2 text-sm text-white/70">
              A clean path from demo → testnet → mainnet that builds investor confidence.
            </p>
          </div>
          <div className="grid gap-4 lg:col-span-2 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,0.18),transparent_55%)]" />
              <div className="relative">
                <div className="text-xs font-semibold text-white/60">Phase 1</div>
              <div className="mt-1 font-semibold">Demo & community</div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/70">
                <li>Explorer + faucet + token</li>
                <li>Landing page & docs</li>
                <li>Early partners</li>
              </ul>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.18),transparent_55%)]" />
              <div className="relative">
                <div className="text-xs font-semibold text-white/60">Phase 2</div>
              <div className="mt-1 font-semibold">Public testnet</div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/70">
                <li>Public RPC + bootnodes</li>
                <li>Multi-validator setup</li>
                <li>Bug bounty</li>
              </ul>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-[radial-gradient(circle_at_60%_70%,rgba(217,70,239,0.16),transparent_55%)]" />
              <div className="relative">
                <div className="text-xs font-semibold text-white/60">Phase 3</div>
              <div className="mt-1 font-semibold">Mainnet launch</div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/70">
                <li>Security audit</li>
                <li>Bridge + liquidity</li>
                <li>Exchange strategy</li>
              </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="grid gap-6 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="font-semibold">Is KryptaFlow like BSC?</div>
              <div className="mt-2 text-sm text-white/70">
                Yes—EVM compatible. Same wallet + Solidity tooling. Fees and block time can be tuned.
              </div>
            </div>
            <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="font-semibold">Can investors verify activity?</div>
              <div className="mt-2 text-sm text-white/70">
                Yes—Blockscout shows transactions, blocks, and token transfers with direct links.
              </div>
            </div>
            <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="font-semibold">What is KFL used for?</div>
              <div className="mt-2 text-sm text-white/70">
                Payments inside apps, rewards, governance, staking, and ecosystem incentives.
              </div>
            </div>
            <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="font-semibold">What’s next?</div>
              <div className="mt-2 text-sm text-white/70">
                Public testnet (VPS), multi-node infra, audited contracts, and a clear distribution strategy.
              </div>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter variant="dark" />
    </div>
  );
}
