import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC_DIRS = [
  path.join(ROOT, "apps", "web", "public", "brand"),
  path.join(ROOT, "brand-kit"),
];

const OUT_DIR = "C:\\Users\\surface\\Desktop\\KryptaFlow-Brand-Kit";

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readSvg(relOrAbs) {
  const abs = path.isAbsolute(relOrAbs) ? relOrAbs : path.join(ROOT, relOrAbs);
  return fs.readFileSync(abs);
}

function copyIfExists(filename) {
  for (const dir of SRC_DIRS) {
    const full = path.join(dir, filename);
    if (fs.existsSync(full)) return fs.readFileSync(full);
  }
  return null;
}

async function exportPng({ svg, outFile, width, height }) {
  const img = sharp(svg, { density: 300 }).resize(width, height, { fit: "cover" }).png({ quality: 100 });
  await img.toFile(outFile);
}

async function main() {
  ensureDir(OUT_DIR);

  const avatarSvg =
    copyIfExists("avatar.svg") ??
    copyIfExists("avatar-1024.svg") ??
    readSvg("apps/web/public/brand/avatar.svg");

  const banner169Svg =
    copyIfExists("banner.svg") ??
    copyIfExists("x-header-1500x500.svg") ??
    readSvg("apps/web/public/brand/banner.svg");

  const xHeaderSvg = copyIfExists("x-header-1500x500.svg") ?? banner169Svg;
  const ytArtSvg = copyIfExists("youtube-channel-art-2560x1440.svg") ?? banner169Svg;
  const discordProfileSvg =
    copyIfExists("discord-profile-banner-1360x480.svg") ??
    copyIfExists("discord-banner-1920x1080.svg") ??
    banner169Svg;

  // Profile / DP sizes
  const dpDir = path.join(OUT_DIR, "dp");
  ensureDir(dpDir);
  await exportPng({ svg: avatarSvg, outFile: path.join(dpDir, "kryptaflow-dp-1024.png"), width: 1024, height: 1024 });
  await exportPng({ svg: avatarSvg, outFile: path.join(dpDir, "kryptaflow-dp-512.png"), width: 512, height: 512 });
  await exportPng({ svg: avatarSvg, outFile: path.join(dpDir, "kryptaflow-dp-400.png"), width: 400, height: 400 });

  // X header
  const xDir = path.join(OUT_DIR, "x");
  ensureDir(xDir);
  await exportPng({ svg: xHeaderSvg, outFile: path.join(xDir, "x-header-1500x500.png"), width: 1500, height: 500 });

  // YouTube channel art
  const ytDir = path.join(OUT_DIR, "youtube");
  ensureDir(ytDir);
  await exportPng({ svg: ytArtSvg, outFile: path.join(ytDir, "youtube-channel-art-2560x1440.png"), width: 2560, height: 1440 });
  // YouTube "recommended minimum" shown in UI
  await exportPng({ svg: ytArtSvg, outFile: path.join(ytDir, "youtube-channel-art-2048x1152.png"), width: 2048, height: 1152 });

  // Discord banner (safe)
  const discordDir = path.join(OUT_DIR, "discord");
  ensureDir(discordDir);
  // Discord Profile Banner requires min 680x240 (wide)
  await exportPng({
    svg: discordProfileSvg,
    outFile: path.join(discordDir, "discord-profile-banner-1360x480.png"),
    width: 1360,
    height: 480,
  });
  await exportPng({
    svg: discordProfileSvg,
    outFile: path.join(discordDir, "discord-profile-banner-680x240.png"),
    width: 680,
    height: 240,
  });

  // Extra: Server banner friendly sizes (optional)
  await exportPng({
    svg: banner169Svg,
    outFile: path.join(discordDir, "discord-banner-1920x1080.png"),
    width: 1920,
    height: 1080,
  });
  await exportPng({
    svg: banner169Svg,
    outFile: path.join(discordDir, "discord-banner-960x540.png"),
    width: 960,
    height: 540,
  });

  // Telegram / Reddit / GitHub / TikTok / Instagram reuse DP
  const otherDir = path.join(OUT_DIR, "other-platforms");
  ensureDir(otherDir);
  await exportPng({ svg: avatarSvg, outFile: path.join(otherDir, "instagram-dp-1024.png"), width: 1024, height: 1024 });
  await exportPng({ svg: avatarSvg, outFile: path.join(otherDir, "tiktok-dp-1024.png"), width: 1024, height: 1024 });
  await exportPng({ svg: avatarSvg, outFile: path.join(otherDir, "telegram-dp-1024.png"), width: 1024, height: 1024 });
  await exportPng({ svg: avatarSvg, outFile: path.join(otherDir, "reddit-dp-1024.png"), width: 1024, height: 1024 });
  await exportPng({ svg: avatarSvg, outFile: path.join(otherDir, "github-dp-1024.png"), width: 1024, height: 1024 });

  console.log("Brand kit PNGs exported to:", OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

