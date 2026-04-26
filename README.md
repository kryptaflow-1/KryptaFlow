# KryptaFlow

Local, BSC-like starter: **your own EVM chain** + a **Next.js website** that connects MetaMask and sends transactions.

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

