import { test, expect } from '../helpers/fixtures.js';
import { layoutShiftScore } from '../helpers/page-utils.js';

const states = (page) =>
  page.locator('.timeline__entry').evaluateAll((els) =>
    els.map((el) => ({
      reveal: el.dataset.reveal ?? null,
      opacity: Number(getComputedStyle(el).opacity),
    })),
  );

test.describe('US2 — timeline scroll-in (FR-013, FR-013a)', () => {
  test.use({ viewport: { width: 375, height: 667 }, reducedMotion: 'no-preference' });

  test('entries below the fold wait, then animate in when scrolled to', async ({ page }) => {
    await page.goto('/');
    const initial = await states(page);
    expect(initial.every((s) => s.reveal === 'pending' && s.opacity === 0)).toBe(true);

    for (const entry of await page.locator('.timeline__entry').all()) {
      await entry.scrollIntoViewIfNeeded();
      await expect(entry).toHaveAttribute('data-reveal', 'visible', { timeout: 1000 });
      await expect.poll(() => entry.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
    }
  });

  test('deep link below the timeline leaves nothing pending', async ({ page }) => {
    await page.goto('/#projects');
    await expect
      .poll(async () => (await states(page)).filter((s) => s.reveal === 'pending').length)
      .toBe(0);
  });

  test('jumping to the end leaves nothing pending', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('End');
    await page.waitForTimeout(1000);
    expect((await states(page)).filter((s) => s.reveal === 'pending')).toHaveLength(0);
  });

  test('scrolling the page causes no layout shift', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Layout Instability API is Chromium-only');
    await page.goto('/');
    for (let y = 0; y < 4000; y += 400) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(50);
    }
    expect(await layoutShiftScore(page)).toBeLessThanOrEqual(0.05);
  });
});

test.describe('US2 — no animation when it is not wanted', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('reduced motion: entries are simply shown', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const result = await states(page);
    expect(result.every((s) => s.reveal === null && s.opacity === 1)).toBe(true);
  });

  test.describe('scripting unavailable', () => {
    test.use({ javaScriptEnabled: false });

    test('entries are fully visible', async ({ page }) => {
      await page.goto('/');
      expect((await states(page)).every((s) => s.opacity === 1)).toBe(true);
    });
  });
});
