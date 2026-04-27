import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(process.cwd());

const files = [
  "instagram-day1-slide-1-1080.svg",
  "instagram-day1-slide-2-1080.svg",
  "instagram-day1-slide-3-1080.svg",
];

const width = 1080;
const height = 1080;

for (const name of files) {
  const input = path.join(root, "brand-kit", name);
  const outBrandKitPng = path.join(root, "brand-kit", name.replace(".svg", ".png"));
  const outPublicPng = path.join(root, "apps", "web", "public", "brand", name.replace(".svg", ".png"));
  const outPublicSvg = path.join(root, "apps", "web", "public", "brand", name);

  const svg = await fs.readFile(input);
  const png = await sharp(svg, { density: 300 })
    .resize({ width, height, fit: "fill" })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  await fs.mkdir(path.dirname(outBrandKitPng), { recursive: true });
  await fs.mkdir(path.dirname(outPublicPng), { recursive: true });
  await fs.writeFile(outBrandKitPng, png);
  await fs.writeFile(outPublicPng, png);
  await fs.copyFile(input, outPublicSvg);

  console.log(`Wrote: ${path.relative(root, outBrandKitPng)}`);
  console.log(`Wrote: ${path.relative(root, outPublicPng)}`);
  console.log(`Wrote: ${path.relative(root, outPublicSvg)}`);
}
