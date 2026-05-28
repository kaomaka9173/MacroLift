import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const source = await readFile(new URL("../public/favicon.svg", import.meta.url));

const outputs = [
  ["../public/apple-touch-icon.png", 180],
  ["../public/icons/icon-192.png", 192],
  ["../public/icons/icon-512.png", 512],
  ["../public/icons/maskable-512.png", 512],
];

await mkdir(new URL("../public/icons/", import.meta.url), { recursive: true });

await Promise.all(
  outputs.map(([path, size]) =>
    sharp(source)
      .resize(size, size)
      .png()
      .toFile(fileURLToPath(new URL(path, import.meta.url))),
  ),
);

console.log("Generated MacroLift app icons.");
