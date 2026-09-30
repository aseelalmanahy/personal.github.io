import { readFile } from 'node:fs/promises';
import { test, expect } from '../helpers/fixtures.js';

// Experience is one narrative with no dates, employer, program, or role structure (FR-012, FR-014).
const FORBIDDEN_IN_EXPERIENCE = [
  /\b(19|20)\d{2}\b/,
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.? \d{4}\b/,
  /Fidelity|Leap to Lead|LEAP|Present/,
];

test.describe('privacy and scope guardrails (FR-012, FR-014, FR-022, FR-022a, G11, G16)', () => {
  test('Experience is a single narrative with no dates, employer, or role list', async ({
    page,
  }) => {
    await page.goto('/');
    const experience = page.locator('#experience');
    await expect(experience.locator('ol, ul, li, time, article, h3')).toHaveCount(0);
    await expect(experience.locator('p')).toHaveCount(1);
    const content = await experience.textContent();
    for (const pattern of FORBIDDEN_IN_EXPERIENCE) {
      expect(content, String(pattern)).not.toMatch(pattern);
    }
    await expect(page.locator('.timeline, [class*="timeline__"]')).toHaveCount(0);
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
