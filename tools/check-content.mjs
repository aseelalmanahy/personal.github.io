// Lists content inputs still awaiting the owner (research R-25). With --strict, fails if any
// remain; used as the launch gate (V5.8).
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const MARKERS = [/CONTENT:/g, /data-content-placeholder/g, /data-content-status="draft"/g];
const strict = process.argv.includes('--strict');

const files = (await readdir('src'))
  .filter((name) => /\.(html|txt|xml)$/.test(name))
  .map((name) => path.join('src', name));

let count = 0;
for (const file of files) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  lines.forEach((line, index) => {
    for (const marker of MARKERS) {
      for (const match of line.matchAll(marker)) {
        count += 1;
        console.log(`${file}:${index + 1}: ${match[0]}  ${line.trim().slice(0, 90)}`);
      }
    }
  });
}

console.log(`\n${count} content marker(s) remaining`);
process.exit(strict && count > 0 ? 1 : 0);
