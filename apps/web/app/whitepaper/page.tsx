import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { siteConfig } from "@/app/siteConfig";
import { KRYPTAFLOW } from "@/app/generated/chain";
import { CopyButton } from "@/app/components/CopyButton";

const EXPLORER_URL = siteConfig.links.explorer;

export default function WhitepaperPage() {
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
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-white/60">Whitepaper (v0.1)</div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              KryptaFlow: an explorer-first EVM ecosystem with verifiable on-chain proof
            </h1>
          </div>
          <p className="mt-3 max-w-3xl text-sm text-white/70">
            This document explains the KryptaFlow vision, architecture, and token design. It is written to be easy for
            builders and investors to understand, and to be validated via on-chain explorer data.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="text-xs font-semibold text-white/60">Token</div>
              <div className="mt-1 text-lg font-semibold">KFL (ERC‑20)</div>
              <div className="mt-2 text-xs text-white/70">Contract: <span className="font-mono">{KRYPTAFLOW.tokenAddress}</span></div>
              <div className="mt-3 flex flex-wrap gap-2">
                <CopyButton value={KRYPTAFLOW.tokenAddress} label="Copy" />
                <a
                  className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400"
                  href={`${EXPLORER_URL}/token/${KRYPTAFLOW.tokenAddress}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="text-xs font-semibold text-white/60">Hard cap</div>
              <div className="mt-1 text-lg font-semibold">1,000,000,000 KFL</div>
              <div className="mt-2 text-xs text-white/70">Max supply cannot be exceeded by design.</div>
            </div>
            <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="text-xs font-semibold text-white/60">Transparency</div>
              <div className="mt-1 text-lg font-semibold">Blockscout explorer</div>
              <div className="mt-2 text-xs text-white/70">Transactions, token transfers, and contracts are verifiable.</div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-black/40 p-8 ring-1 ring-white/10">
            <h2 className="text-xl font-semibold">Problem</h2>
            <p className="mt-3 text-sm text-white/70">
              Most new ecosystems fail to build trust because progress is hard to verify, product iterations are slow,
              and developer onboarding is painful.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/70">
              <li>Unclear on-chain proof of activity</li>
              <li>Slow shipping cadence and fragmented tooling</li>
              <li>Hard for users to test without friction</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-black/40 p-8 ring-1 ring-white/10">
            <h2 className="text-xl font-semibold">Solution</h2>
            <p className="mt-3 text-sm text-white/70">
              KryptaFlow ships an EVM chain + token + explorer + faucet so anyone can verify progress and test UX end‑to‑end.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/70">
              <li>EVM compatibility (MetaMask + Solidity)</li>
              <li>Explorer-first transparency (Blockscout)</li>
              <li>Faucet and demo dApp for instant onboarding</li>
            </ul>
          </div>
        </section>

        <section className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
          <h2 className="text-xl font-semibold">Token utility</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="font-semibold">Payments</div>
              <div className="mt-2 text-sm text-white/70">KFL as a medium of exchange inside apps and services.</div>
            </div>
            <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="font-semibold">Rewards</div>
              <div className="mt-2 text-sm text-white/70">Incentivize usage, referrals, and liquidity programs.</div>
            </div>
            <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10">
              <div className="font-semibold">Governance</div>
              <div className="mt-2 text-sm text-white/70">Vote on upgrades, grants, and ecosystem directions.</div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
          <h2 className="text-xl font-semibold">Supply & distribution (starter)</h2>
          <p className="mt-3 text-sm text-white/70">
            Current demo setup mints an initial treasury supply and keeps the rest mintable under the hard cap. A real
            launch should publish a transparent allocation, vesting, and audit reports.
          </p>
          <div className="mt-4 rounded-2xl bg-black/40 p-6 ring-1 ring-white/10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold text-white/60">Final allocation (published)</div>
                <div className="mt-1 text-lg font-semibold">
                  {siteConfig.tokenomics.maxSupply.toLocaleString()} {siteConfig.tokenomics.symbol}
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

        <section className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
          <h2 className="text-xl font-semibold">Risk & disclaimer</h2>
          <p className="mt-3 text-sm text-white/70">
            Crypto assets are risky. This document is for information only and is not financial advice. Avoid promising
            guaranteed returns; focus on product, adoption, and verifiable progress.
          </p>
        </section>
      </main>

      <SiteFooter variant="dark" />
    </div>
  );
}

