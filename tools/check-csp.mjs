// Verifies the constitution's "Theme bootstrap exception" (Principle I): each HTML page has at
// most one inline executable script, it is under 1 KB, and the CSP meta allows it by SHA-256.
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const MAX_BYTES = 1024;
const write = process.argv.includes('--write');

const INLINE_SCRIPT = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/g;
const CSP_HASH = /'sha256-[^']*'/;

async function htmlFiles(dir) {
  if (!existsSync(dir)) return [];
  const names = await readdir(dir);
  return names.filter((name) => name.endsWith('.html')).map((name) => path.join(dir, name));
}

function inlineScripts(html) {
  return [...html.matchAll(INLINE_SCRIPT)]
    .filter(([, attributes = '']) => !/\bsrc=/.test(attributes) && !/\btype=/.test(attributes))
    .map(([, , body]) => body);
}

async function checkFile(file) {
  const html = await readFile(file, 'utf8');
  const scripts = inlineScripts(html);
  if (scripts.length === 0) return [];
  const problems = [];
  if (scripts.length > 1) problems.push(`${scripts.length} inline scripts (max 1)`);
  const body = scripts[0];
  const bytes = Buffer.byteLength(body, 'utf8');
  if (bytes >= MAX_BYTES) problems.push(`bootstrap is ${bytes} bytes (must be < ${MAX_BYTES})`);
  const hash = `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`;
  const current = html.match(CSP_HASH)?.[0];
  console.log(`${file}: ${bytes} bytes, ${hash}`);
  if (current === hash) return problems;
  if (write && current) {
    await writeFile(file, html.replace(CSP_HASH, hash));
    console.log(`  updated CSP hash (was ${current})`);
    return problems;
  }
  problems.push(`CSP hash ${current ?? '(missing)'} does not match ${hash}`);
  return problems;
}

let failed = false;
for (const file of [...(await htmlFiles('src')), ...(await htmlFiles('dist'))]) {
  for (const problem of await checkFile(file)) {
    console.error(`  FAIL ${file}: ${problem}`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
