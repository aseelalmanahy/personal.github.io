// Checks the compressed page weight in dist/ against constitution Principle VI budgets.
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const KB = 1024;
const BUDGETS = { core: 100 * KB, js: 30 * KB, total: 300 * KB };
const DIST = 'dist';

if (!existsSync(DIST)) {
  console.warn('skip: dist/ not found — run `npm run build` first');
  process.exit(0);
}

const gzipSize = async (file) => gzipSync(await readFile(file), { level: 9 }).length;

// Every non-print stylesheet the page can load: the bundle in production, or main.css plus
// its @import partials when dist/ is an unbundled copy of src/.
const stylesheets = (await readdir(path.join(DIST, 'css'), { recursive: true }))
  .filter((name) => name.endsWith('.css') && path.basename(name) !== 'print.css')
  .map((name) => path.join(DIST, 'css', name));
const scripts = (await readdir(path.join(DIST, 'js'))).map((name) => path.join(DIST, 'js', name));
const aboveFold = ['assets/icons.svg', 'assets/favicon.svg'].map((file) => path.join(DIST, file));

const sizes = {};
for (const file of [path.join(DIST, 'index.html'), ...stylesheets, ...scripts, ...aboveFold]) {
  sizes[file] = await gzipSize(file);
}
const sum = (files) => files.reduce((total, file) => total + sizes[file], 0);

const js = sum(scripts);
const core = sum([path.join(DIST, 'index.html'), ...stylesheets, ...scripts]);
const total = core + sum(aboveFold);

console.table(
  Object.fromEntries(
    Object.entries(sizes).map(([file, bytes]) => [file, `${(bytes / KB).toFixed(1)} KB`]),
  ),
);

let failed = false;
for (const [name, actual, budget] of [
  ['HTML + CSS + JS', core, BUDGETS.core],
  ['JS', js, BUDGETS.js],
  ['Initial total', total, BUDGETS.total],
]) {
  const ok = actual <= budget;
  failed ||= !ok;
  console.log(
    `${ok ? 'ok  ' : 'FAIL'} ${name}: ${(actual / KB).toFixed(1)} KB / ${budget / KB} KB (gzip)`,
  );
}
process.exit(failed ? 1 : 0);
