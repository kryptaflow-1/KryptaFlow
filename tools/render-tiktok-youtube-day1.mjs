import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import sharp from "sharp";

const execFileAsync = promisify(execFile);

const root = path.resolve(process.cwd());

const tiktokSvgs = [
  "tiktok-day1-slide-1-1080x1920.svg",
  "tiktok-day1-slide-2-1080x1920.svg",
  "tiktok-day1-slide-3-1080x1920.svg",
];

const tiktokWidth = 1080;
const tiktokHeight = 1920;

const ytSvg = "youtube-thumb-day1-1280x720.svg";
const ytWidth = 1280;
const ytHeight = 720;

const SLIDE_SECONDS = 4;

async function assertFfmpegAvailable() {
  await execFileAsync("ffmpeg", ["-version"], { windowsHide: true });
}

async function renderPng(inputSvg, width, height, outPng) {
  const svg = await fs.readFile(inputSvg);
  const png = await sharp(svg, { density: 300 })
    .resize({ width, height, fit: "fill" })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  await fs.mkdir(path.dirname(outPng), { recursive: true });
  await fs.writeFile(outPng, png);
}

async function writeConcatList(partPaths, concatPath) {
  const body = partPaths
    .map((p) => {
      const normalized = p.replace(/\\/g, "/");
      return `file '${normalized}'`;
    })
    .join("\n");
  await fs.writeFile(concatPath, `${body}\n`, "utf8");
}

async function main() {
  await assertFfmpegAvailable();

  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "kryptaflow-tiktok-day1-"));

  const tiktokPngs = [];

  for (const name of tiktokSvgs) {
    const inputSvg = path.join(root, "brand-kit", name);
    const outBrandKitPng = path.join(root, "brand-kit", name.replace(".svg", ".png"));
    const outPublicPng = path.join(root, "apps", "web", "public", "brand", name.replace(".svg", ".png"));
    const outPublicSvg = path.join(root, "apps", "web", "public", "brand", name);

    await fs.mkdir(path.dirname(outBrandKitPng), { recursive: true });
    await fs.mkdir(path.dirname(outPublicPng), { recursive: true });

    await renderPng(inputSvg, tiktokWidth, tiktokHeight, outBrandKitPng);
    await renderPng(inputSvg, tiktokWidth, tiktokHeight, outPublicPng);
    await fs.copyFile(inputSvg, outPublicSvg);

    tiktokPngs.push(outBrandKitPng);

    console.log(`Wrote: ${path.relative(root, outBrandKitPng)}`);
    console.log(`Wrote: ${path.relative(root, outPublicPng)}`);
    console.log(`Wrote: ${path.relative(root, outPublicSvg)}`);
  }

  const ytInput = path.join(root, "brand-kit", ytSvg);
  const ytOutBrand = path.join(root, "brand-kit", ytSvg.replace(".svg", ".png"));
  const ytOutPublicPng = path.join(root, "apps", "web", "public", "brand", ytSvg.replace(".svg", ".png"));
  const ytOutPublicSvg = path.join(root, "apps", "web", "public", "brand", ytSvg);

  await renderPng(ytInput, ytWidth, ytHeight, ytOutBrand);
  await renderPng(ytInput, ytWidth, ytHeight, ytOutPublicPng);
  await fs.copyFile(ytInput, ytOutPublicSvg);

  console.log(`Wrote: ${path.relative(root, ytOutBrand)}`);
  console.log(`Wrote: ${path.relative(root, ytOutPublicPng)}`);
  console.log(`Wrote: ${path.relative(root, ytOutPublicSvg)}`);

  const concatNoAudio = path.join(tmpRoot, "tiktok-day1-concat-noaudio.mp4");
  const finalName = "tiktok-day1-short-12s-1080x1920.mp4";
  const finalBrand = path.join(root, "brand-kit", finalName);
  const finalPublic = path.join(root, "apps", "web", "public", "brand", finalName);

  const partPaths = [];
  for (let i = 0; i < tiktokPngs.length; i++) {
    const part = path.join(tmpRoot, `part-${i + 1}.mp4`);
    partPaths.push(part);

    await execFileAsync(
      "ffmpeg",
      [
        "-y",
        "-loop",
        "1",
        "-i",
        tiktokPngs[i],
        "-vf",
        "fps=30,scale=1080:1920:flags=lanczos,format=yuv420p",
        "-t",
        String(SLIDE_SECONDS),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-r",
        "30",
        part,
      ],
      { windowsHide: true },
    );
  }

  const concatListPath = path.join(tmpRoot, "concat.txt");
  await writeConcatList(partPaths, concatListPath);

  await execFileAsync(
    "ffmpeg",
    ["-y", "-f", "concat", "-safe", "0", "-i", concatListPath, "-c", "copy", concatNoAudio],
    { windowsHide: true },
  );

  await execFileAsync(
    "ffmpeg",
    [
      "-y",
      "-i",
      concatNoAudio,
      "-f",
      "lavfi",
      "-i",
      "anullsrc=channel_layout=stereo:sample_rate=44100",
      "-shortest",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      finalBrand,
    ],
    { windowsHide: true },
  );

  await fs.mkdir(path.dirname(finalPublic), { recursive: true });
  await fs.copyFile(finalBrand, finalPublic);

  console.log(`Wrote: ${path.relative(root, finalBrand)}`);
  console.log(`Wrote: ${path.relative(root, finalPublic)}`);

  await fs.rm(tmpRoot, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
