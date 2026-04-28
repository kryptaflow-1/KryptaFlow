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

/** Per-slide animation length (Ken Burns ~ slow zoom); 130f @30fps ≈ 4.333s */
const SLIDE_FRAMES = 130;
const FPS = 30;
/** Crossfade between slides (must be < slide duration in seconds) */
const XFADE_SEC = 0.5;

const slideSec = SLIDE_FRAMES / FPS;

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

function zoompanForSlide(index) {
  const zStep = index === 1 ? "0.00085" : index === 2 ? "0.00075" : "0.00092";
  const maxZ = index === 1 ? "1.14" : index === 2 ? "1.12" : "1.15";
  const xe = index === 2 ? "iw*0.52-(iw/zoom/2)" : "iw/2-(iw/zoom/2)";
  const ye = "ih/2-(ih/zoom/2)";
  /** Comma in min() must be escaped for the filter graph parser */
  const zExpr = `min(zoom+${zStep}\\,${maxZ})`;
  return [
    "scale=2160:3840:flags=lanczos",
    `zoompan=z='${zExpr}':d=${SLIDE_FRAMES}:x=${xe}:y=${ye}:s=${tiktokWidth}x${tiktokHeight}:fps=${FPS}`,
    "format=yuv420p",
    "eq=contrast=1.04:saturation=1.06",
  ].join(",");
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

  const finalName = "tiktok-day1-short-12s-1080x1920.mp4";
  const finalBrand = path.join(root, "brand-kit", finalName);
  const finalPublic = path.join(root, "apps", "web", "public", "brand", finalName);

  const partPaths = [];
  for (let i = 0; i < tiktokPngs.length; i++) {
    const part = path.join(tmpRoot, `part-${i + 1}.mp4`);
    partPaths.push(part);

    const vf = zoompanForSlide(i + 1);

    await execFileAsync(
      "ffmpeg",
      [
        "-y",
        "-loop",
        "1",
        "-i",
        tiktokPngs[i],
        "-vf",
        vf,
        "-frames:v",
        String(SLIDE_FRAMES),
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "20",
        "-pix_fmt",
        "yuv420p",
        "-r",
        String(FPS),
        part,
      ],
      { windowsHide: true },
    );
  }

  const offset1 = slideSec - XFADE_SEC;
  const afterFirst = slideSec * 2 - XFADE_SEC;
  const offset2 = afterFirst - XFADE_SEC;

  const filterComplex = [
    `[0:v][1:v]xfade=transition=fade:duration=${XFADE_SEC}:offset=${offset1.toFixed(6)}[v01]`,
    `[v01][2:v]xfade=transition=fade:duration=${XFADE_SEC}:offset=${offset2.toFixed(6)}[vout]`,
  ].join(";");

  const xfadeOut = path.join(tmpRoot, "xfade.mp4");

  await execFileAsync(
    "ffmpeg",
    [
      "-y",
      "-i",
      partPaths[0],
      "-i",
      partPaths[1],
      "-i",
      partPaths[2],
      "-filter_complex",
      filterComplex,
      "-map",
      "[vout]",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      xfadeOut,
    ],
    { windowsHide: true },
  );

  await execFileAsync(
    "ffmpeg",
    [
      "-y",
      "-i",
      xfadeOut,
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
