import { test, expect } from '../helpers/fixtures.js';

const INTERESTS = ['Cooking', 'Reading Books', 'Weightlifting', 'Cycling', 'Skiing'];

const columnCount = (page) =>
  page
    .locator('.interests__item')
    .evaluateAll((items) => new Set(items.map((item) => Math.round(item.offsetLeft))).size);

test.describe('US5: Interests (FR-037 to FR-040)', () => {
  test('sits between Experience and Projects with the five hobbies in order', async ({ page }) => {
    await page.goto('/');
    const order = await page
      .locator('main > section')
      .evaluateAll((sections) => sections.map((section) => section.id));
    expect(order.indexOf('interests')).toBe(order.indexOf('experience') + 1);
    expect(order.indexOf('projects')).toBe(order.indexOf('interests') + 1);
    await expect(page.locator('#interests h2')).toHaveText('Interests');
    await expect(page.locator('#interests ul.interests__list > li')).toHaveCount(5);
    const labels = await page
      .locator('.interests__item')
      .evaluateAll((items) => items.map((item) => item.textContent.replace(/\s+/g, ' ').trim()));
    expect(labels).toEqual(INTERESTS);
  });

  test('each item has one decorative inline icon', async ({ page }) => {
    await page.goto('/');
    const icons = await page.locator('.interests__item').evaluateAll((items) =>
      items.map((item) => {
        const svgs = item.querySelectorAll('svg');
        return {
          count: svgs.length,
          hidden: svgs[0]?.getAttribute('aria-hidden'),
          usesSprite: item.querySelector('use') !== null,
        };
      }),
    );
    for (const icon of icons) {
      expect(icon).toEqual({ count: 1, hidden: 'true', usesSprite: false });
    }
  });

  test('is static: nothing to click and no motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await expect(page.locator('#interests').locator('a, button, [tabindex="0"]')).toHaveCount(0);
    const motion = await page.locator('.interests__item').evaluateAll((items) =>
      items.map((item) => {
        const style = getComputedStyle(item);
        return `${style.animationName} ${style.transitionDuration}`;
      }),
    );
    for (const value of motion) expect(value).toBe('none 0s');
  });

  for (const [width, columns] of [
    [320, 1],
    [375, 2],
    [1440, 5],
  ]) {
    test(`grid shows ${columns} column(s) at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      expect(await columnCount(page)).toBe(columns);
    });
  }

  for (const colorScheme of ['light', 'dark']) {
    test(`icons use the accent colour (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto('/');
      const { stroke, accent } = await page.evaluate(() => {
        const probe = document.createElement('span');
        probe.style.color = 'var(--color-accent)';
        document.body.append(probe);
        const accentColour = getComputedStyle(probe).color;
        probe.remove();
        const icon = document.querySelector('.interests__icon');
        return { stroke: getComputedStyle(icon).stroke, accent: accentColour };
      });
      expect(stroke).toBe(accent);
    });
  }
});
