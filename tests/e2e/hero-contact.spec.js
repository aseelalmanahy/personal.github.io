import { test, expect } from '../helpers/fixtures.js';

const GREETING = "Hi, I'm Aseel.";
const STATEMENT =
  'Full Stack Software Engineer specializing in scalable systems, robust architectures, and engineering mentorship.';

const normalise = (text) => text.replace(/\s+/g, ' ').trim();

async function describeLinks(locator) {
  return locator.evaluateAll((links) =>
    links.map((link) => ({
      text: link.textContent.replace(/\s+/g, ' ').trim(),
      href: link.getAttribute('href'),
      target: link.getAttribute('target'),
      rel: link.getAttribute('rel') ?? '',
    })),
  );
}

test.describe('US1 — hero and contact content', () => {
  test('hero greeting and statement are verbatim', async ({ page }) => {
    await page.goto('/');
    expect(normalise(await page.locator('h1').textContent())).toBe(GREETING);
    expect(normalise(await page.locator('.hero__statement').textContent())).toBe(STATEMENT);
  });

  test('hero has GitHub, LinkedIn, Email in order with correct attributes', async ({ page }) => {
    await page.goto('/');
    const links = await describeLinks(page.locator('#home a'));
    expect(links).toHaveLength(3);
    expect(links[0].text).toContain('GitHub');
    expect(links[1].text).toContain('LinkedIn');
    expect(links[2].text).toContain('Email');
    for (const external of links.slice(0, 2)) {
      expect(external.target).toBe('_blank');
      expect(external.rel).toContain('noopener');
      expect(external.rel).toContain('noreferrer');
      expect(external.text).toContain('(opens in a new tab)');
    }
    expect(links[2].href.startsWith('mailto:')).toBe(true);
    expect(links[2].target).toBeNull();
  });

  test('contact section repeats the same three routes', async ({ page }) => {
    await page.goto('/');
    const hero = await describeLinks(page.locator('#home a'));
    const contact = await describeLinks(page.locator('#contact .contact__links a'));
    expect(contact.map((link) => link.href)).toEqual(hero.map((link) => link.href));
    expect(hero.length + contact.length).toBe(6);
  });

  test('visible email address matches its mailto link', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('#contact .contact__email-link');
    const href = await link.getAttribute('href');
    expect(normalise(await link.textContent())).toBe(href.replace(/^mailto:/, ''));
  });
});

test.describe('US1 — hero above the fold (SC-001)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('greeting, statement, and three actions are visible without scrolling', async ({ page }) => {
    await page.goto('/');
    const targets = [
      page.locator('h1'),
      page.locator('.hero__statement'),
      ...(await page.locator('.hero__actions a').all()),
    ];
    expect(targets).toHaveLength(5);
    for (const target of targets) {
      const box = await target.boundingBox();
      expect(box.y + box.height, await target.textContent()).toBeLessThanOrEqual(667);
    }
  });
});
