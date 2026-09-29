// Ensures canonical URL, Open Graph URLs, robots.txt, sitemap.xml, and the 404 <base href>
// all agree (research R-21). Skips with a warning while the site URL is still a CONTENT: marker.
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(file, 'utf8');
const attr = (html, pattern) => html.match(pattern)?.[1];

const index = await read('src/index.html');
const canonical = attr(index, /<link rel="canonical" href="([^"]+)"/);

if (!canonical) {
  console.error('FAIL: no canonical URL in src/index.html');
  process.exit(1);
}
if (canonical.includes('CONTENT:')) {
  console.warn(`skip: site URL is still a placeholder (${canonical})`);
  process.exit(0);
}

const robots = await read('src/robots.txt');
const sitemap = await read('src/sitemap.xml');
const notFound = await read('src/404.html');
const checks = [
  ['og:url', attr(index, /property="og:url" content="([^"]+)"/), canonical],
  [
    'og:image prefix',
    attr(index, /property="og:image" content="([^"]+)"/)?.slice(0, canonical.length),
    canonical,
  ],
  ['robots.txt Sitemap', attr(robots, /Sitemap:\s*(\S+)/), `${canonical}sitemap.xml`],
  ['sitemap.xml loc', attr(sitemap, /<loc>([^<]+)<\/loc>/), canonical],
  ['404 base href', attr(notFound, /<base href="([^"]+)"/), new URL(canonical).pathname],
];

let failed = false;
for (const [name, actual, expected] of checks) {
  const ok = actual === expected;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${actual} ${ok ? '' : `(expected ${expected})`}`);
  failed ||= !ok;
}
process.exit(failed ? 1 : 0);
