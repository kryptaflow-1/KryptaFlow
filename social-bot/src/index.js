import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { postToTelegram } from "./adapters/telegram.js";
import { postToX } from "./adapters/x.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

function loadEnv() {
  const env = { ...process.env };
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return env;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const k = trimmed.slice(0, idx).trim();
    const v = trimmed.slice(idx + 1).trim();
    if (!env[k]) env[k] = v;
  }
  return env;
}

function loadQueue() {
  const queuePath = path.join(root, "content", "queue.json");
  const raw = fs.readFileSync(queuePath, "utf8");
  const parsed = JSON.parse(raw);
  return { queuePath, parsed };
}

function saveQueue(queuePath, parsed) {
  fs.writeFileSync(queuePath, JSON.stringify(parsed, null, 2) + "\n", "utf8");
}

async function postOnce() {
  const env = loadEnv();
  const interval = Number(env.BOT_INTERVAL_SECONDS ?? "3600");
  const { queuePath, parsed } = loadQueue();
  const next = parsed?.items?.[0];
  if (!next) {
    console.log("Queue empty.");
    return interval;
  }

  console.log("Posting:", next.id);
  const text = String(next.text ?? "").trim();
  if (!text) {
    parsed.items.shift();
    saveQueue(queuePath, parsed);
    console.log("Skipped empty post.");
    return interval;
  }

  const results = [];
  results.push(await postToTelegram({ text, env }));
  results.push(await postToX({ text, env }));

  // If at least one platform succeeded (or was configured), pop it.
  const anyOk = results.some((r) => r?.ok);
  const allSkipped = results.every((r) => r?.skipped);
  if (anyOk || allSkipped) {
    parsed.items.shift();
    saveQueue(queuePath, parsed);
  }

  console.log("Done:", results);
  return interval;
}

async function loop() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const interval = await postOnce();
      await new Promise((r) => setTimeout(r, Math.max(10, interval) * 1000));
    } catch (e) {
      console.error(e);
      await new Promise((r) => setTimeout(r, 30_000));
    }
  }
}

void loop();

