// Renders the share image and PNG icons from source files with Playwright (research R-19).
// Run manually when the template or favicon changes; the PNGs are committed.
import { chromium } from '@playwright/test';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const OG_MAX_BYTES = 100 * 1024;
const CREAM = '#fbf6ee'; // --color-bg (light) from src/css/tokens.css

const browser = await chromium.launch();
try {
  const og = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    colorScheme: 'light',
  });
  await og.goto(pathToFileURL(path.resolve('tools/og-template.html')).href);
  await og.screenshot({ path: 'src/assets/og-image.png' });

  const favicon = (await readFile('src/assets/favicon.svg')).toString('base64');
  for (const [file, size] of [
    ['src/assets/apple-touch-icon.png', 180],
    ['src/assets/favicon-32.png', 32],
  ]) {
    const page = await browser.newPage({
      viewport: { width: size, height: size },
      colorScheme: 'light',
    });
    await page.setContent(
      `<body style="margin:0;background:${CREAM}"><img alt="" width="${size}" height="${size}" ` +
        `src="data:image/svg+xml;base64,${favicon}"></body>`,
    );
    await page.screenshot({ path: file, omitBackground: false });
  }
} finally {
  await browser.close();
}

const { size } = await stat('src/assets/og-image.png');
console.log(`og-image.png: ${(size / 1024).toFixed(1)} KB`);
if (size > OG_MAX_BYTES) {
  console.error(`FAIL: og-image.png exceeds ${OG_MAX_BYTES / 1024} KB`);
  process.exit(1);
}
