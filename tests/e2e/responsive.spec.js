import { test, expect } from '../helpers/fixtures.js';
import { hasHorizontalOverflow, layoutShiftScore } from '../helpers/page-utils.js';

const WIDTHS = [320, 375, 768, 1024, 1440, 2560];

test.describe('responsive baseline', () => {
  test('layout shift during load stays ≤ 0.05', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Layout Instability API is Chromium-only');
    await page.goto('/');
    expect(await layoutShiftScore(page)).toBeLessThanOrEqual(0.05);
  });
});

test.describe('SC-004: no horizontal overflow from 320 to 2560px', () => {
  for (const colorScheme of ['light', 'dark']) {
    for (const width of WIDTHS) {
      test(`${width}px, ${colorScheme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme });
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/');
        expect(await hasHorizontalOverflow(page)).toBe(false);
      });
    }
  }

  test('320px with 200% root font size (zoom/reflow proxy)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    // CSSOM changes are allowed by the CSP (a <style> tag would not be).
    await page.evaluate(() => {
      document.documentElement.style.setProperty('font-size', '200%');
    });
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });
});

test.describe('navigation layouts (FR-023, FR-025)', () => {
  test('at 768px and wider all links sit in the bar without a menu', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto('/');
    await expect(page.locator('.nav__link')).toHaveCount(4);
    for (const link of await page.locator('.nav__link').all()) {
      await expect(link).toBeVisible();
    }
    await expect(page.locator('.nav__toggle')).toBeHidden();
    // All links fit one compact row, so the bar keeps its height (FR-023).
    const bar = await page.locator('.site-header').boundingBox();
    expect(bar.height).toBeLessThanOrEqual(57);
  });

  test.describe('without scripting at 375px', () => {
    test.use({ javaScriptEnabled: false, viewport: { width: 375, height: 667 } });

    test('all links are visible and reachable', async ({ page }) => {
      await page.goto('/');
      for (const link of await page.locator('.nav__link').all()) {
        await expect(link).toBeVisible();
      }
    });
  });
});

test.describe('print (edge case "Printing the page")', () => {
  for (const saved of [null, 'dark']) {
    test(`prints light with controls hidden (saved theme: ${saved ?? 'none'})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      if (saved) {
        await page.addInitScript((value) => localStorage.setItem('theme', value), saved);
      }
      await page.goto('/');
      await page.emulateMedia({ media: 'print', colorScheme: 'dark' });
      await expect(page.locator('.nav__toggle')).toBeHidden();
      await expect(page.locator('.theme-toggle')).toBeHidden();
      const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(background).toBe('rgb(251, 246, 238)');
    });
  }
});
