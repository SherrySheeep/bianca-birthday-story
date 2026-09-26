import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const source = path.resolve('public/desk-clean-sprites.png');
const outputDir = path.resolve('public/desk-items');
const image = sharp(source);
const { width, height } = await image.metadata();

if (!width || !height) throw new Error('Could not read sprite dimensions');

const cellWidth = width / 2;
const cellHeight = height / 3;
const sprites = [
  ['desk.png', 0, 0, 0, 0, 0, 0],
  ['lamp.png', 1, 0, 45, 0, 0, 0],
  ['books.png', 0, 1, 0, 0, 0, 30],
  ['laptop.png', 1, 1, 0, 28, 0, 0],
  ['coffee.png', 0, 2, 0, 0, 0, 0],
  ['plant.png', 1, 2, 0, 0, 0, 0],
];

await mkdir(outputDir, { recursive: true });
console.log(`Source dimensions: ${width}×${height}; cells: ${cellWidth}×${cellHeight}`);
for (const [name, column, row, insetLeft, insetTop, insetRight, insetBottom] of sprites) {
  await sharp(source)
    .extract({
      left: Number(column) * cellWidth + Number(insetLeft),
      top: Number(row) * cellHeight + Number(insetTop),
      width: cellWidth - Number(insetLeft) - Number(insetRight),
      height: cellHeight - Number(insetTop) - Number(insetBottom),
    })
    .png()
    .toFile(path.join(outputDir, name));
}

console.log(`Created ${sprites.length} desk item images in ${outputDir}`);
