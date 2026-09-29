import { test, expect } from '../helpers/fixtures.js';
import { isObscuredByHeader, TAB_REACHES_LINKS } from '../helpers/page-utils.js';

const DARK_BG = 'rgb(27, 19, 16)';
const LIGHT_BG = 'rgb(251, 246, 238)';

const bodyBackground = (page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test.describe('US4 — theme applies before first paint (FR-029)', () => {
  test('saved dark choice wins over a light device without a flash', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark');
      document.addEventListener('DOMContentLoaded', () => {
        window.__themeAtDomReady = document.documentElement.dataset.theme;
      });
    });
    await page.goto('/');
    expect(await page.evaluate(() => window.__themeAtDomReady)).toBe('dark');
    expect(await bodyBackground(page)).toBe(DARK_BG);
  });

  test('with nothing saved, the device preference applies', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    expect(await page.locator('html').getAttribute('data-theme')).toBeNull();
    expect(await bodyBackground(page)).toBe(DARK_BG);
    await page.emulateMedia({ colorScheme: 'light' });
    expect(await bodyBackground(page)).toBe(LIGHT_BG);
  });
});

test.describe('US4 — headings and focus never hidden under the bar (FR-023a)', () => {
  for (const width of [375, 1440]) {
    test(`deep links land below the bar at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      for (const id of ['about', 'experience', 'projects', 'contact']) {
        await page.goto(`/#${id}`);
        await page.waitForTimeout(100);
        const heading = await page.locator(`#${id} h2`).boundingBox();
        const header = await page.locator('.site-header').boundingBox();
        expect(heading.y, id).toBeGreaterThanOrEqual(header.y + header.height - 1);
      }
    });

    test(`tabbing never hides focus under the bar at ${width}px`, async ({ page, browserName }) => {
      test.skip(!TAB_REACHES_LINKS(browserName), 'WebKit build does not Tab to links');
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      const stops = await page
        .locator('a[href], button, [tabindex="0"]')
        .evaluateAll((els) => els.filter((el) => !el.closest('[hidden]')).length);
      for (let step = 0; step < stops; step += 1) {
        await page.keyboard.press('Tab');
        const focused = page.locator(':focus');
        if (await focused.evaluate((el) => el.closest('.site-header, .skip-link') !== null)) {
          continue;
        }
        expect(await isObscuredByHeader(page, focused), `stop ${step}`).toBe(false);
      }
    });
  }
});

test.describe('US4 — theme without scripting', () => {
  test.use({ javaScriptEnabled: false, colorScheme: 'dark' });

  test('dark device gives the dark theme', async ({ page }) => {
    await page.goto('/');
    expect(await bodyBackground(page)).toBe(DARK_BG);
  });
});
