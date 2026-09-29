import { test, expect } from '../helpers/fixtures.js';

const text = (locator) =>
  locator.evaluateAll((els) => els.map((el) => el.textContent.replace(/\s+/g, ' ').trim()));

test.describe('US2 — About Me', () => {
  test('education entries and statuses', async ({ page }) => {
    await page.goto('/');
    expect(await text(page.locator('.education__degree'))).toEqual([
      'Bachelor of Science in Computer Science',
      'Master of Business Administration in Project Management',
    ]);
    expect(await text(page.locator('.education__status'))).toEqual(['Completed', 'Candidate']);
  });

  test('skills grouped and ordered', async ({ page }) => {
    await page.goto('/');
    expect(await text(page.locator('.skill-group__title'))).toEqual([
      'Languages',
      'Tools/Frameworks',
    ]);
    expect(await text(page.locator('.skill-group').nth(0).locator('.tag'))).toEqual([
      'Java',
      'C/C++',
      'SQL',
      'Python',
    ]);
    expect(await text(page.locator('.skill-group').nth(1).locator('.tag'))).toEqual([
      'Git',
      'SpringBoot',
      'Angular',
      'AWS',
    ]);
  });
});

test.describe('US2 — Experience timeline layout (FR-011, FR-012)', () => {
  for (const width of [375, 768, 1440]) {
    test(`single column with labels at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const entries = page.locator('.timeline__entry');
      await expect(entries).toHaveCount(4);
      const xs = new Set();
      let previousY = -Infinity;
      for (const entry of await entries.all()) {
        const box = await entry.boundingBox();
        xs.add(Math.round(box.x));
        expect(box.y).toBeGreaterThan(previousY);
        previousY = box.y;
        await expect(entry.locator('.timeline__category')).toHaveText(/^(Engineering|Leadership)$/);
      }
      expect(xs.size).toBe(1);
    });
  }

  test('engineering and leadership markers differ by shape', async ({ page }) => {
    await page.goto('/');
    const shape = (selector) =>
      page
        .locator(selector)
        .first()
        .evaluate((el) => {
          const style = getComputedStyle(el, '::before');
          return `${style.borderRadius} ${style.transform}`;
        });
    expect(await shape('.timeline__entry--engineering')).not.toBe(
      await shape('.timeline__entry--leadership'),
    );
  });
});

test.describe('US2 — identical highlight for hover, focus, and touch (FR-013)', () => {
  test.use({ reducedMotion: 'reduce', hasTouch: true });

  const highlight = (entry) =>
    entry.evaluate((el) => {
      const style = getComputedStyle(el);
      return [style.backgroundColor, style.borderColor, style.boxShadow].join(' | ');
    });

  test('hover, keyboard focus, and tap produce the same styles', async ({ page }) => {
    await page.goto('/');
    const entry = page.locator('.timeline__entry').first();
    const resting = await highlight(entry);

    await entry.hover();
    const hovered = await highlight(entry);
    await page.mouse.move(0, 0);

    await entry.focus();
    const focused = await highlight(entry);
    await entry.evaluate((el) => el.blur());

    await entry.tap();
    const tapped = await highlight(entry);

    expect(hovered).not.toBe(resting);
    expect(focused).toBe(hovered);
    expect(tapped).toBe(hovered);
  });
});
