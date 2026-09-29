import { readFile } from 'node:fs/promises';
import { test, expect } from '../helpers/fixtures.js';

const ALLOWED_ENTRY_CHILDREN = [
  'timeline__title',
  'timeline__org',
  'timeline__dates',
  'timeline__category',
];

test.describe('privacy and scope guardrails (FR-013, FR-014, FR-022, FR-022a, G11, G16)', () => {
  test('timeline entries contain only the allowed fields', async ({ page }) => {
    await page.goto('/');
    const entries = page.locator('.timeline__entry');
    await expect(entries).toHaveCount(4);
    const childClasses = await entries.evaluateAll((els) =>
      els.map((el) => [...el.children].map((child) => child.className)),
    );
    for (const classes of childClasses) {
      for (const className of classes) {
        expect(ALLOWED_ENTRY_CHILDREN).toContain(className);
      }
    }
  });

  test('no forms and no résumé download', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('form, input, textarea, select')).toHaveCount(0);
    const resumeLinks = await page
      .locator('a')
      .evaluateAll(
        (links) =>
          links.filter((link) =>
            /résumé|resume|\bcv\b|\.pdf$/i.test(`${link.textContent} ${link.getAttribute('href')}`),
          ).length,
      );
    expect(resumeLinks).toBe(0);
  });

  test('every request is same-origin', async ({ page, baseURL }) => {
    const origins = new Set();
    page.on('request', (request) => origins.add(new URL(request.url()).origin));
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState('networkidle');
    expect([...origins]).toEqual([new URL(baseURL).origin]);
  });

  test('shipped HTML has no comments and the project has no runtime dependencies', async () => {
    const html = await readFile('dist/index.html', 'utf8');
    expect(html).not.toContain('<!--');
    const pkg = JSON.parse(await readFile('package.json', 'utf8'));
    expect(pkg.dependencies).toBeUndefined();
  });
});
