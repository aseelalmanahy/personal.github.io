import { test, expect } from '../helpers/fixtures.js';

test.use({ javaScriptEnabled: false });

test.describe('scripting unavailable (FR-035, edge case)', () => {
  test('all content and navigation remain available', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/\bno-js\b/);
    for (const id of ['home', 'about', 'experience', 'projects', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeVisible();
      await expect(page.locator(`#${id} :is(h1, h2)`).first()).toBeVisible();
    }
    const navLinks = page.locator('.nav__list a');
    await expect(navLinks).toHaveCount(4);
    for (const link of await navLinks.all()) {
      await expect(link).toBeVisible();
    }
    await expect(page.locator('.experience__narrative')).toBeVisible();
  });

  test('JS-only controls are not shown', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.theme-toggle')).toBeHidden();
    await expect(page.locator('.nav__toggle')).toBeHidden();
    await expect(page.locator('[data-js="copy-email"]')).toBeHidden();
  });
});
