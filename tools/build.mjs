// Production build (research R-07, R-22): src/ → dist/ with one bundled, minified stylesheet
// and content-hashed `?v=` URLs. src/ itself stays directly servable (constitution VI).
import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { bundle, transform } from 'lightningcss';

const SRC = 'src';
const DIST = 'dist';
// Last two majors of the supported browsers at planning time, encoded as Lightning CSS expects.
const version = (major) => major << 16;
const TARGETS = {
  chrome: version(120),
  edge: version(120),
  firefox: version(121),
  safari: version(17),
  ios_saf: version(17),
};

const hash8 = (content) => createHash('sha256').update(content).digest('hex').slice(0, 8);
const toPosix = (file) => file.split(path.sep).join('/');

async function buildCss() {
  await mkdir(path.join(DIST, 'css'), { recursive: true });
  const main = bundle({
    filename: path.join(SRC, 'css', 'main.css'),
    minify: true,
    targets: TARGETS,
  });
  await writeFile(path.join(DIST, 'css', 'main.css'), main.code);
  const printFile = path.join(SRC, 'css', 'print.css');
  const print = transform({
    filename: printFile,
    code: await readFile(printFile),
    minify: true,
    targets: TARGETS,
  });
  await writeFile(path.join(DIST, 'css', 'print.css'), print.code);
}

/** Rewrites a module's relative imports to versioned URLs; returns its own version hash. */
async function versionModule(file, versions) {
  if (versions.has(file)) return versions.get(file);
  let source = await readFile(file, 'utf8');
  const specifiers = [...source.matchAll(/from '(\.\/[\w-]+\.js)'/g)].map(([, spec]) => spec);
  for (const specifier of new Set(specifiers)) {
    const dependency = path.join(path.dirname(file), specifier);
    const depVersion = await versionModule(dependency, versions);
    source = source.replaceAll(`'${specifier}'`, `'${specifier}?v=${depVersion}'`);
  }
  await writeFile(file, source);
  const own = hash8(source);
  versions.set(file, own);
  return own;
}

async function assetVersions() {
  const versions = new Map();
  for (const name of await readdir(path.join(DIST, 'js'))) {
    await versionModule(path.join(DIST, 'js', name), versions);
  }
  for (const dir of ['css', 'assets']) {
    for (const name of await readdir(path.join(DIST, dir))) {
      const file = path.join(DIST, dir, name);
      versions.set(file, hash8(await readFile(file)));
    }
  }
  return new Map([...versions].map(([file, v]) => [toPosix(path.relative(DIST, file)), v]));
}

async function versionHtml(versions) {
  const pages = (await readdir(DIST)).filter((name) => name.endsWith('.html'));
  for (const page of pages) {
    const file = path.join(DIST, page);
    const html = await readFile(file, 'utf8');
    // Only relative local URLs; the inline bootstrap script is untouched, so its CSP hash holds.
    const rewritten = html.replace(
      /(href|src)="((?:css|js|assets)\/[^"#?]+)(#[^"]*)?"/g,
      (match, attribute, url, fragment = '') =>
        versions.has(url) ? `${attribute}="${url}?v=${versions.get(url)}${fragment}"` : match,
    );
    await writeFile(file, rewritten);
  }
}

try {
  await rm(DIST, { recursive: true, force: true });
  await cp(SRC, DIST, {
    recursive: true,
    filter: (source) => !toPosix(source).startsWith(`${SRC}/css`),
  });
  await buildCss();
  const versions = await assetVersions();
  await versionHtml(versions);
  console.log(`Built ${DIST}/ (${versions.size} versioned assets)`);
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exit(1);
}
