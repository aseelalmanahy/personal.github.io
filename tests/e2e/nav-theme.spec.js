import { test, expect } from '../helpers/fixtures.js';

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

test.describe('US4 — theme without scripting', () => {
  test.use({ javaScriptEnabled: false, colorScheme: 'dark' });

  test('dark device gives the dark theme', async ({ page }) => {
    await page.goto('/');
    expect(await bodyBackground(page)).toBe(DARK_BG);
  });
});
