import { test, expect } from '../helpers/fixtures.js';
import { firstFocusable, TAB_REACHES_LINKS, tabKey } from '../helpers/page-utils.js';

const SECTION_IDS = ['home', 'about', 'experience', 'projects', 'contact'];

test.describe('page structure — contracts/page-structure.md', () => {
  test('head: language, charset, viewport, CSP, and bootstrap before stylesheet', async ({
    page,
  }) => {
    await page.goto('/');
    const head = await page.evaluate(() => {
      const children = [...document.head.children];
      const inlineScripts = children.filter((el) => el.tagName === 'SCRIPT' && !el.src && !el.type);
      const firstStylesheet = children.findIndex(
        (el) => el.tagName === 'LINK' && el.rel === 'stylesheet',
      );
      return {
        lang: document.documentElement.lang,
        firstIsCharset: children[0]?.matches('meta[charset]') ?? false,
        viewport: document.querySelector('meta[name="viewport"]')?.content,
        hasCsp: Boolean(document.querySelector('meta[http-equiv="Content-Security-Policy"]')),
        bootstrapIndex: children.indexOf(inlineScripts[0]),
        firstStylesheet,
      };
    });
    expect(head.lang).toBe('en');
    expect(head.firstIsCharset).toBe(true);
    expect(head.viewport).toBe('width=device-width, initial-scale=1');
    expect(head.hasCsp).toBe(true);
    expect(head.bootstrapIndex).toBeGreaterThanOrEqual(0);
    expect(head.bootstrapIndex).toBeLessThan(head.firstStylesheet);
  });

  test('head: share, icon, and structured-data metadata', async ({ page }) => {
    await page.goto('/');
    const meta = (selector) => page.locator(selector).first().getAttribute('content');
    expect(await meta('meta[name="description"]')).toBeTruthy();
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBeTruthy();
    for (const property of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt']) {
      expect(await meta(`meta[property="${property}"]`), property).toBeTruthy();
    }
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
    const themeColors = page.locator('meta[name="theme-color"][media]');
    await expect(themeColors).toHaveCount(2);
    await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveCount(1);
    const person = await page
      .locator('script[type="application/ld+json"]')
      .evaluate((el) => JSON.parse(el.textContent));
    expect(person['@type']).toBe('Person');
  });

  test('body: landmark order and section order', async ({ page }) => {
    await page.goto('/');
    const landmarks = await page.evaluate(() =>
      [...document.body.children]
        .filter((el) => el.tagName !== 'SCRIPT')
        .map((el) => (el.className ? `${el.tagName}.${el.className}` : el.tagName)),
    );
    expect(landmarks).toEqual(['A.skip-link', 'HEADER.site-header', 'MAIN', 'FOOTER.site-footer']);
    await expect(page.locator('main#main')).toHaveAttribute('tabindex', '-1');
    const sections = await page.locator('main > section').evaluateAll((els) =>
      els.map((el) => ({
        id: el.id,
        tabindex: el.getAttribute('tabindex'),
        labelledBy: el.getAttribute('aria-labelledby'),
        headingExists: Boolean(document.getElementById(el.getAttribute('aria-labelledby'))),
      })),
    );
    expect(sections.map((s) => s.id)).toEqual(SECTION_IDS);
    for (const section of sections) {
      expect(section.tabindex, section.id).toBe('-1');
      expect(section.headingExists, section.id).toBe(true);
    }
  });

  test('headings: one h1 and no skipped levels', async ({ page }) => {
    await page.goto('/');
    const levels = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((els) => els.map((el) => Number(el.tagName[1])));
    expect(levels.filter((level) => level === 1)).toHaveLength(1);
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i] - levels[i - 1], `heading ${i}`).toBeLessThanOrEqual(1);
    }
  });

  test('skip link is the first focusable element', async ({ page, browserName }) => {
    await page.goto('/');
    expect(await firstFocusable(page)).toEqual({ text: 'Skip to main content', href: '#main' });
    if (!TAB_REACHES_LINKS(browserName)) return;
    await page.keyboard.press(tabKey());
    const focused = page.locator(':focus');
    await expect(focused).toHaveText('Skip to main content');
    await expect(focused).toHaveAttribute('href', '#main');
  });

  test('404 page', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.locator('h1')).toHaveText('Page not found');
    await expect(page.getByRole('link', { name: 'Back to the home page' })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.locator('base[href]')).toHaveCount(1);
  });
});
