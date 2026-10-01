import { test, expect } from '../helpers/fixtures.js';

// Spec 003: one vertical spacing value between all major blocks (FR-001 – FR-003).
async function measureGaps(page) {
  return page.evaluate(() => {
    const box = (el) => el.getBoundingClientRect();
    const y = (el) => box(el).top + scrollY;
    const edges = (section) => {
      const inner = section.querySelector('.container') ?? section;
      const kids = [...inner.children].filter((kid) => box(kid).height > 0);
      const last = kids[kids.length - 1];
      return { top: y(kids[0]), bottom: y(last) + box(last).height };
    };
    const sections = [...document.querySelectorAll('main > section')];
    const header = document.querySelector('.site-header');
    const footer = document.querySelector('.site-footer');
    const gaps = { 'bar→intro': edges(sections[0]).top - box(header).height };
    for (let i = 0; i < sections.length - 1; i += 1) {
      gaps[`${sections[i].id}→${sections[i + 1].id}`] =
        edges(sections[i + 1]).top - edges(sections[i]).bottom;
    }
    gaps['last→footer'] = y(footer) - edges(sections[sections.length - 1]).bottom;
    return gaps;
  });
}

test.describe('unified section spacing (spec 003)', () => {
  test.use({ reducedMotion: 'reduce' });

  for (const width of [320, 375, 768, 1024, 1440]) {
    test(`all section gaps are equal at ${width}px (FR-002)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const gaps = await measureGaps(page);
      const values = Object.values(gaps);
      expect(values).toHaveLength(5);
      expect(Math.max(...values) - Math.min(...values), JSON.stringify(gaps)).toBeLessThanOrEqual(
        1,
      );
      if (width <= 375) expect(Math.min(...values)).toBeGreaterThanOrEqual(55.5);
      if (width >= 1440) expect(Math.max(...values)).toBeLessThanOrEqual(80.5);
    });
  }

  test('every section takes its spacing from the one token (FR-001)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto('/');
    const result = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.paddingTop = 'var(--section-spacing-vertical)';
      document.body.append(probe);
      const token = getComputedStyle(probe).paddingTop;
      probe.remove();
      const tops = [...document.querySelectorAll('main > section')].map(
        (section) => getComputedStyle(section).paddingTop,
      );
      return { token, tops };
    });
    expect(result.token).not.toBe('0px');
    expect(new Set(result.tops)).toEqual(new Set([result.token]));
  });

  test('the not-found page uses the same token (FR-004)', async ({ page }) => {
    await page.goto('/404.html');
    const [padding, token] = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.paddingTop = 'var(--section-spacing-vertical)';
      document.body.append(probe);
      return [
        getComputedStyle(document.querySelector('.not-found')).paddingTop,
        getComputedStyle(probe).paddingTop,
      ];
    });
    expect(token).not.toBe('0px');
    expect(padding).toBe(token);
  });
});
