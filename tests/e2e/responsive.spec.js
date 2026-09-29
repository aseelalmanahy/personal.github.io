import { test, expect } from '../helpers/fixtures.js';
import { hasHorizontalOverflow, layoutShiftScore } from '../helpers/page-utils.js';

test.describe('responsive baseline', () => {
  test('no horizontal overflow at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test('layout shift during load stays ≤ 0.05', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Layout Instability API is Chromium-only');
    await page.goto('/');
    expect(await layoutShiftScore(page)).toBeLessThanOrEqual(0.05);
  });
});
