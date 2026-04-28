# KryptaFlow

Local, BSC-like starter: **your own EVM chain** + a **Next.js website** that connects MetaMask and sends transactions.

## Public status (official)

**Investor / community hub (source of truth):** [kryptaflow.com](https://kryptaflow.com)

KryptaFlow (KFL) is in **pre-launch**. Messaging on the site prioritises clear tokenomics and security. **Contract address: TBA** until published through official channels and on the site — do not trust random contracts.

| Topic | Summary (see site for full detail) |
|--------|-------------------------------------|
| Planned network | BSC |
| Pair (published on-site) | KFL/USDT |
| Tax | 0% |
| LP lock | 8 months |
| Contract | **TBA** |

**Official links**

- GitHub (source code): https://github.com/kryptaflow-1/KryptaFlow  
- X: https://x.com/kryptaflow  
- Telegram: https://t.me/kryptaflow  
- Discord: https://discord.gg/V967c7qsU  
- Reddit: https://www.reddit.com/user/Kryptaflow/  
- Instagram: https://www.instagram.com/kryptaflow1/  
- TikTok: https://www.tiktok.com/@kryptaflow.com  
- YouTube: https://www.youtube.com/@KryptaFlow  

**Security:** we will not DM you first asking for money, seed phrases, or “verification fees”. Treat any contract shared outside official announcements as **fake** until it appears on [kryptaflow.com](https://kryptaflow.com).

*Not financial advice. Crypto is risky.*

---

## Prerequisites

- Node.js (LTS recommended)
- MetaMask installed in your browser

## Install

From the repo root:

```powershell
npm install
```

## Run the local chain

```powershell
npm run chain:node
```

This will print local accounts + private keys and start an RPC at `http://127.0.0.1:8545`.

## Run the block explorer (Blockscout)

Requires Docker Desktop running.

```powershell
npm run explorer:up
```

Open the explorer at `http://localhost:4000`.

If you want MetaMask to show explorer links, set your network's block explorer URL to:

`http://localhost:4000`

## Run the website

In another terminal:

```powershell
npm run dev
```

Open the URL it prints (usually `http://localhost:3000`), click **Connect Wallet**, and send a test transaction.

