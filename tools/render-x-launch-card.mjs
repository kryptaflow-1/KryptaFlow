import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(process.cwd());

const input = path.join(root, "brand-kit", "x-launch-card-1600x900.svg");
const outBrandKitPng = path.join(root, "brand-kit", "x-launch-card-1600x900.png");
const outPublicPng = path.join(root, "apps", "web", "public", "brand", "x-launch-card-1600x900.png");

const svg = await fs.readFile(input);
const width = 1600;
const height = 900;

const png = await sharp(svg, { density: 300 })
  .resize({ width, height, fit: "fill" })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toBuffer();

await fs.mkdir(path.dirname(outBrandKitPng), { recursive: true });
await fs.mkdir(path.dirname(outPublicPng), { recursive: true });
await fs.writeFile(outBrandKitPng, png);
await fs.writeFile(outPublicPng, png);

console.log(`Wrote: ${path.relative(root, outBrandKitPng)}`);
console.log(`Wrote: ${path.relative(root, outPublicPng)}`);
