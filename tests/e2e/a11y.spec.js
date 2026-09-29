import { test, expect } from '../helpers/fixtures.js';
import { runAxe } from '../helpers/page-utils.js';

test.describe('accessibility — axe WCAG 2.2 AA', () => {
  for (const path of ['/', '/404.html']) {
    test(`${path} has no violations (light)`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto(path);
      expect(await runAxe(page)).toEqual([]);
    });
  }
});
