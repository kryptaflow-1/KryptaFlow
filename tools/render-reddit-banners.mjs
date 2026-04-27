import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(process.cwd());

const inputs = [
  {
    in: path.join(root, "brand-kit", "reddit-profile-banner-1000x300.svg"),
    outBrandKit: path.join(root, "brand-kit", "reddit-profile-banner-1000x300.png"),
    outPublic: path.join(root, "apps", "web", "public", "brand", "reddit-profile-banner-1000x300.png"),
  },
  {
    in: path.join(root, "brand-kit", "reddit-subreddit-banner-1920x384.svg"),
    outBrandKit: path.join(root, "brand-kit", "reddit-subreddit-banner-1920x384.png"),
    outPublic: path.join(root, "apps", "web", "public", "brand", "reddit-subreddit-banner-1920x384.png"),
  },
];

for (const item of inputs) {
  const svg = await fs.readFile(item.in);
  const width = item.in.includes("1000x300") ? 1000 : 1920;
  const height = item.in.includes("1000x300") ? 300 : 384;

  const png = await sharp(svg, { density: 300 })
    .resize({ width, height, fit: "fill" })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  await fs.mkdir(path.dirname(item.outBrandKit), { recursive: true });
  await fs.mkdir(path.dirname(item.outPublic), { recursive: true });
  await fs.writeFile(item.outBrandKit, png);
  await fs.writeFile(item.outPublic, png);

  console.log(`Wrote: ${path.relative(root, item.outBrandKit)}`);
  console.log(`Wrote: ${path.relative(root, item.outPublic)}`);
}
