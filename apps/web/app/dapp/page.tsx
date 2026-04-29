"use client";

import { BrowserProvider, Contract, formatEther, formatUnits, parseEther, parseUnits } from "ethers";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { KRYPTAFLOW } from "@/app/generated/chain";

type EthLikeProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

function getInjectedProvider(): EthLikeProvider | null {
  if (typeof window === "undefined") return null;
  const anyWindow = window as unknown as { ethereum?: EthLikeProvider };
  return anyWindow.ethereum ?? null;
}

const KRYPTAFLOW_CHAIN_ID_DEC = KRYPTAFLOW.chainIdDec;
const KRYPTAFLOW_CHAIN_ID_HEX = KRYPTAFLOW.chainIdHex;
const KRYPTAFLOW_RPC_URL = KRYPTAFLOW.rpcUrl;
const KFL_TOKEN_ADDRESS = KRYPTAFLOW.tokenAddress;
const EXPLORER_BASE_URL = "http://localhost:4000";
const GAS_SYMBOL = "KRY";

const KFL_ABI = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function mint(address to, uint256 value) returns (bool)",
  "function owner() view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

type TransferItem = {
  hash: string;
  from: string;
  to: string;
  amount: string;
};

function txUrl(hash: string) {
  return `${EXPLORER_BASE_URL}/tx/${hash}`;
}

function shortAddr(addr: string) {
  if (!addr) return "";
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function DAppPage() {
  const injected = useMemo(() => getInjectedProvider(), []);
  const [address, setAddress] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [amount, setAmount] = useState<string>("0.001");

  const [kflSymbol, setKflSymbol] = useState<string>("KFL");
  const [kflDecimals, setKflDecimals] = useState<number>(18);
  const [kflBalance, setKflBalance] = useState<string>("");
  const [kflTo, setKflTo] = useState<string>("");
  const [kflAmount, setKflAmount] = useState<string>("10");
  const [mintTo, setMintTo] = useState<string>("");
  const [mintAmount, setMintAmount] = useState<string>("100");
  const [treasuryTo, setTreasuryTo] = useState<string>("");
  const [treasuryAmount, setTreasuryAmount] = useState<string>("1000000");
  const [savedNormalAddress, setSavedNormalAddress] = useState<string>("");
  const [ownerAddr, setOwnerAddr] = useState<string>("");

  const [recentTransfers, setRecentTransfers] = useState<TransferItem[]>([]);

  function isOnKryptaFlow() {
    return String(chainId) === String(KRYPTAFLOW_CHAIN_ID_DEC);
  }

  function isTreasurySelected() {
    if (!ownerAddr || !address) return false;
    return ownerAddr.toLowerCase() === address.toLowerCase();
  }

  function isTreasuryAddress(addr: string) {
    if (!ownerAddr || !addr) return false;
    return ownerAddr.toLowerCase() === addr.toLowerCase();
  }

  async function loadRecentTransfers(provider: BrowserProvider) {
    try {
      const kfl = new Contract(KFL_TOKEN_ADDRESS, KFL_ABI, provider);
      const latest = await provider.getBlockNumber();
      const fromBlock = Math.max(0, latest - 5000);

      const transferEvent = kfl.interface.getEvent("Transfer");
      if (!transferEvent) {
        setRecentTransfers([]);
        return;
      }

      const logs = await provider.getLogs({
        address: KFL_TOKEN_ADDRESS,
        fromBlock,
        toBlock: latest,
        topics: [transferEvent.topicHash],
      });

      const items: TransferItem[] = logs
        .slice(-15)
        .reverse()
        .map((log) => {
          const parsed = kfl.interface.parseLog({ topics: log.topics, data: log.data });
          const from = String(parsed?.args?.from ?? "");
          const to = String(parsed?.args?.to ?? "");
          const value = parsed?.args?.value as bigint;
          return {
            hash: log.transactionHash,
            from,
            to,
            amount: formatUnits(value ?? BigInt(0), kflDecimals),
          };
        });

      setRecentTransfers(items);
    } catch {
      setRecentTransfers([]);
    }
  }

  async function refresh() {
    if (!injected) return;
    const provider = new BrowserProvider(injected as never);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    const network = await provider.getNetwork();
    const bal = await provider.getBalance(addr);

    setAddress(addr);
    setChainId(String(network.chainId));
    setBalance(formatEther(bal));
    if (!isTreasuryAddress(addr)) setSavedNormalAddress(addr);
    if (!to) setTo(addr);
    if (!kflTo) setKflTo(addr);
    if (!mintTo) setMintTo(addr);

    try {
      const kfl = new Contract(KFL_TOKEN_ADDRESS, KFL_ABI, provider);
      const [sym, dec, rawBal, ownerRes] = await Promise.all([
        kfl.symbol(),
        kfl.decimals(),
        kfl.balanceOf(addr),
        kfl.owner().catch(() => ""),
      ]);
      const decNum = Number(dec);
      setKflSymbol(String(sym));
      setKflDecimals(Number.isFinite(decNum) ? decNum : 18);
      setKflBalance(formatUnits(rawBal, Number.isFinite(decNum) ? decNum : 18));
      setOwnerAddr(typeof ownerRes === "string" ? ownerRes : String(ownerRes ?? ""));
    } catch {
      setKflBalance("");
      setOwnerAddr("");
    }

    await loadRecentTransfers(provider);
  }

  async function ensureKryptaFlowNetwork() {
    if (!injected) return;
    try {
      await injected.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: KRYPTAFLOW_CHAIN_ID_HEX }],
      });
    } catch (e) {
      const msg = (e as Error).message ?? "";
      if (msg.includes("4902") || msg.toLowerCase().includes("unknown chain")) {
        await injected.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: KRYPTAFLOW_CHAIN_ID_HEX,
                    chainName: "KryptaFlow",
              rpcUrls: [KRYPTAFLOW_RPC_URL],
                    nativeCurrency: { name: "KryptaFlow Gas", symbol: GAS_SYMBOL, decimals: 18 },
                    blockExplorerUrls: [EXPLORER_BASE_URL],
            },
          ],
        });
      } else {
        throw e;
      }
    }
  }

  async function connect() {
    try {
      if (!injected) {
        setStatus("MetaMask not found. Install MetaMask extension first.");
        return;
      }
      setStatus("Requesting wallet connection...");
      await injected.request({ method: "eth_requestAccounts" });
      setStatus("Switching to kryptaflow network...");
      await ensureKryptaFlowNetwork();
      setStatus("Connected.");
      await refresh();
    } catch (e) {
      setStatus(`Connect failed: ${(e as Error).message}`);
    }
  }

  async function send() {
    try {
      if (!injected) return;
      if (!isOnKryptaFlow()) {
        setStatus("Wrong network. Click “Switch to KryptaFlow”, then try again.");
        return;
      }
      setStatus("Preparing transaction...");
      const provider = new BrowserProvider(injected as never);
      const signer = await provider.getSigner();

      const dest = (to || "").trim();
      if (!dest) {
        setStatus("Enter a destination address.");
        return;
      }

      const value = parseEther((amount || "0").trim());
      setStatus("Sending...");
      const tx = await signer.sendTransaction({ to: dest, value });
      setStatus(`Sent: ${tx.hash} (waiting...)`);
      await tx.wait();
      setStatus(`Confirmed: ${tx.hash}`);
      await refresh();
    } catch (e) {
      setStatus(`Send failed: ${(e as Error).message}`);
    }
  }

  async function sendKfl() {
    try {
      if (!injected) return;
      if (!isOnKryptaFlow()) {
        setStatus("Wrong network. Switch to KryptaFlow, then try again.");
        return;
      }

      const dest = (kflTo || "").trim();
      if (!dest) {
        setStatus("Enter a destination address for KFL.");
        return;
      }

      const provider = new BrowserProvider(injected as never);
      const signer = await provider.getSigner();
      const kfl = new Contract(KFL_TOKEN_ADDRESS, KFL_ABI, signer);

      const value = parseUnits((kflAmount || "0").trim(), kflDecimals);
      setStatus(`Sending ${kflSymbol}...`);
      const tx = await kfl.transfer(dest, value);
      setStatus(`KFL sent: ${tx.hash} (waiting...)`);
      await tx.wait();
      setStatus(`KFL confirmed: ${tx.hash}`);
      await refresh();
    } catch (e) {
      setStatus(`KFL send failed: ${(e as Error).message}`);
    }
  }

  async function sendFromTreasury() {
    try {
      if (!injected) return;
      if (!isOnKryptaFlow()) {
        setStatus("Wrong network. Switch to KryptaFlow, then try again.");
        return;
      }
      if (!isTreasurySelected()) {
        setStatus("Switch MetaMask to the treasury account, then try again.");
        return;
      }

      const dest = (treasuryTo || "").trim();
      if (!dest) {
        setStatus("Paste your normal wallet address in Treasury → To.");
        return;
      }
      if (isTreasuryAddress(dest)) {
        setStatus("Destination is the treasury (owner) wallet itself. Paste a different destination address.");
        return;
      }

      const provider = new BrowserProvider(injected as never);
      const signer = await provider.getSigner();
      const kfl = new Contract(KFL_TOKEN_ADDRESS, KFL_ABI, signer);

      const value = parseUnits((treasuryAmount || "0").trim(), kflDecimals);
      setStatus(`Treasury sending ${kflSymbol}...`);
      const tx = await kfl.transfer(dest, value);
      setStatus(`Treasury tx: ${tx.hash} (waiting...)`);
      await tx.wait();
      setStatus(`Treasury confirmed: ${tx.hash}`);
      await refresh();
    } catch (e) {
      setStatus(`Treasury send failed: ${(e as Error).message}`);
    }
  }

  async function mintKfl() {
    try {
      if (!injected) return;
      if (!isOnKryptaFlow()) {
        setStatus("Wrong network. Switch to KryptaFlow, then try again.");
        return;
      }

      const dest = (mintTo || "").trim();
      if (!dest) {
        setStatus("Enter an address to mint to.");
        return;
      }

      const provider = new BrowserProvider(injected as never);
      const signer = await provider.getSigner();
      const kfl = new Contract(KFL_TOKEN_ADDRESS, KFL_ABI, signer);

      const value = parseUnits((mintAmount || "0").trim(), kflDecimals);
      setStatus(`Minting ${kflSymbol}...`);
      const tx = await kfl.mint(dest, value);
      setStatus(`Mint tx: ${tx.hash} (waiting...)`);
      await tx.wait();
      setStatus(`Mint confirmed: ${tx.hash}`);
      await refresh();
    } catch (e) {
      setStatus(`Mint failed: ${(e as Error).message}`);
    }
  }

  async function switchToKryptaFlow() {
    try {
      if (!injected) return;
      setStatus("Switching to kryptaflow...");
      await ensureKryptaFlowNetwork();
      await refresh();
      setStatus("Switched to kryptaflow.");
    } catch (e) {
      setStatus(`Switch failed: ${(e as Error).message}`);
    }
  }

  useEffect(() => {
    if (!injected?.on) return;

    const onChainChanged = () => {
      void refresh();
    };
    const onAccountsChanged = () => {
      void refresh();
    };

    injected.on("chainChanged", onChainChanged);
    injected.on("accountsChanged", onAccountsChanged);

    return () => {
      injected.removeListener?.("chainChanged", onChainChanged);
      injected.removeListener?.("accountsChanged", onAccountsChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injected]);

  useEffect(() => {
    if (!injected) return;
    const provider = new BrowserProvider(injected as never);
    const kfl = new Contract(KFL_TOKEN_ADDRESS, KFL_ABI, provider);

    const onTransfer = async () => {
      await refresh();
    };

    kfl.on("Transfer", onTransfer);
    return () => {
      kfl.removeAllListeners("Transfer");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injected, KFL_TOKEN_ADDRESS]);

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">KryptaFlow DApp</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Local wallet + KFL transfers. No public mint; initial supply is with the contract owner (OpenZeppelin-style
                token).
              </p>
            </div>
            <Link
              href="/"
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              Back to site
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              <div className="font-medium">Wallet</div>
              <div className="text-zinc-600 dark:text-zinc-400">
                {address ? (
                  <>
                    <div>Address: {address}</div>
                    <div>Chain ID: {chainId || "?"}</div>
                    <div>Native Balance: {balance || "0"} {GAS_SYMBOL} (gas)</div>
                    <div>
                      Token ({kflSymbol}) Balance: {kflBalance ? `${kflBalance} ${kflSymbol}` : "—"}
                    </div>
                  </>
                ) : (
                  "Not connected"
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={connect}
                className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Connect MetaMask
              </button>
              <button
                onClick={switchToKryptaFlow}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                Switch to KryptaFlow
              </button>
              <button
                onClick={refresh}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                Refresh
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium">Send native transaction</div>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">To</span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="0x..."
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Amount ({GAS_SYMBOL} native gas)</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
              />
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={send}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                disabled={!address}
              >
                Send
              </button>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{status}</div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium">KFL Token</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Token address: <span className="font-mono break-all">{KFL_TOKEN_ADDRESS || "—"}</span>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
              Public <span className="font-medium">claim / faucet</span> minting is disabled for security (mainnet-safe
              design). Get test {kflSymbol} using <span className="font-medium">Mint (owner only)</span> with the owner
              account, or <span className="font-medium">Treasury send</span> from the owner wallet.
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <div className="text-sm font-medium">Transfer</div>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">To</span>
                  <input
                    value={kflTo}
                    onChange={(e) => setKflTo(e.target.value)}
                    placeholder="0x..."
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Amount ({kflSymbol})</span>
                  <input
                    value={kflAmount}
                    onChange={(e) => setKflAmount(e.target.value)}
                    inputMode="decimal"
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
                  />
                </label>
                <button
                  onClick={sendKfl}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                  disabled={!address}
                >
                  Send {kflSymbol}
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="text-sm font-medium">Mint (owner only)</div>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">To</span>
                  <input
                    value={mintTo}
                    onChange={(e) => setMintTo(e.target.value)}
                    placeholder="0x..."
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Amount ({kflSymbol})</span>
                  <input
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    inputMode="decimal"
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
                  />
                </label>
                <button
                  onClick={mintKfl}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                  disabled={!address}
                >
                  Mint {kflSymbol}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-medium">Treasury send (recommended)</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    If MetaMask says “duplicate”, the owner account is already imported. Switch to the owner address (
                    <span className="font-mono">{ownerAddr ? shortAddr(ownerAddr) : "—"}</span>) then send to your normal
                    wallet.
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">To (your normal wallet)</span>
                    <input
                      value={treasuryTo}
                      onChange={(e) => setTreasuryTo(e.target.value)}
                      placeholder="0x..."
                      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
                    />
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <button
                        type="button"
                        onClick={() => setTreasuryTo(savedNormalAddress)}
                        className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                        disabled={!savedNormalAddress}
                      >
                        Use saved normal address
                      </button>
                      <span className="font-mono">{savedNormalAddress ? shortAddr(savedNormalAddress) : "—"}</span>
                    </div>
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Amount ({kflSymbol})</span>
                    <input
                      value={treasuryAmount}
                      onChange={(e) => setTreasuryAmount(e.target.value)}
                      inputMode="decimal"
                      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
                    />
                  </label>
                </div>

                <button
                  onClick={sendFromTreasury}
                  className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  disabled={!address}
                >
                  Send from Treasury
                </button>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  Selected account:{" "}
                  <span className="font-mono">
                    {address ? shortAddr(address) : "—"} {isTreasurySelected() ? "(treasury)" : "(not treasury)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-sm font-medium">Recent transfers</div>
              {recentTransfers.length ? (
                <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {recentTransfers.map((t) => (
                      <div
                        key={t.hash}
                        className="flex flex-col gap-1 p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="text-zinc-600 dark:text-zinc-400">
                          {shortAddr(t.from)} → {shortAddr(t.to)}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-medium">
                            {t.amount} {kflSymbol}
                          </div>
                          <div className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
                            <a
                              href={txUrl(t.hash)}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline"
                              title="Open in explorer"
                            >
                              {t.hash.slice(0, 10)}…
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-zinc-600 dark:text-zinc-400">No transfers yet.</div>
              )}
            </div>
          </div>
        </section>

        <section className="text-xs text-zinc-500 dark:text-zinc-500">
          Local chain settings for MetaMask: RPC <span className="font-mono">{KRYPTAFLOW_RPC_URL}</span>, Chain ID{" "}
          <span className="font-mono">{KRYPTAFLOW_CHAIN_ID_DEC}</span>. Explorer{" "}
          <a className="underline" href={EXPLORER_BASE_URL} target="_blank" rel="noreferrer">
            {EXPLORER_BASE_URL}
          </a>
          .
        </section>
      </main>
    </div>
  );
}

