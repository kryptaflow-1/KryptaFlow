export const siteConfig = {
  name: "KryptaFlow",
  domain: "kryptaflow.com",
  launch: {
    network: "BSC",
    pair: "KFL/USDT",
    tax: "0%",
    contractAddress: null as string | null,
    launchPriceUsdt: 0.000003,
    startingLiquidity: {
      usdt: 300,
      kfl: 100_000_000,
    },
  },
  tokenomics: {
    symbol: "KFL",
    maxSupply: 1_000_000_000,
    distribution: [
      { label: "Liquidity (KFL/USDT pool)", percent: 10, amount: 100_000_000 },
      { label: "Community rewards / airdrops", percent: 25, amount: 250_000_000 },
      { label: "Ecosystem incentives (staking, grants, partners)", percent: 20, amount: 200_000_000 },
      { label: "Treasury (ops/dev/marketing)", percent: 15, amount: 150_000_000 },
      { label: "Team (vesting)", percent: 20, amount: 200_000_000 },
      { label: "Reserve / CEX later", percent: 10, amount: 100_000_000 },
    ],
    lpLock: {
      months: 8,
      note: "LP tokens locked for 8 months to reduce rug risk and build trust.",
    },
  },
  socials: {
    x: "https://x.com/kryptaflow",
    instagram: "https://www.instagram.com/kryptaflow1/",
    tiktok: "https://www.tiktok.com/@kryptaflow.com",
    youtube: "https://www.youtube.com/@KryptaFlow",
    github: "https://github.com/kryptaflow-1",
    telegram: "https://t.me/kryptaflow",
    reddit: "https://www.reddit.com/user/Kryptaflow/",
    discord: "https://discord.gg/V967c7qsU",
    email: "mailto:kryptaflow@gmail.com",
  },
  links: {
    explorer: "https://bscscan.com",
    dapp: "/dapp",
    whitepaper: "/whitepaper",
    community: "/community",
  },
} as const;

