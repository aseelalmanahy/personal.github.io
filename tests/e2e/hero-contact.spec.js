import { readFile } from 'node:fs/promises';
import { test, expect } from '../helpers/fixtures.js';

const GREETING = "Hi, I'm Aseel.";
const STATEMENT =
  'Full Stack Software Engineer specializing in scalable systems, robust architectures, and engineering mentorship.';

const GITHUB_URL = 'https://github.com/aseelalmanahy';
const LINKEDIN_URL = 'https://www.linkedin.com/in/aseel-almanahy-97342b109/';

const normalise = (text) => text.replace(/\s+/g, ' ').trim();

async function describeLinks(locator) {
  return locator.evaluateAll((links) =>
    links.map((link) => ({
      text: link.textContent.replace(/\s+/g, ' ').trim(),
      href: link.getAttribute('href'),
      target: link.getAttribute('target'),
      rel: link.getAttribute('rel') ?? '',
      className: link.className,
    })),
  );
}

function expectExternal(link) {
  expect(link.target).toBe('_blank');
  expect(link.rel).toContain('noopener');
  expect(link.rel).toContain('noreferrer');
  expect(link.text).toContain('(opens in a new tab)');
}

test.describe('US1 — hero and contact content', () => {
  test('hero greeting and statement are verbatim', async ({ page }) => {
    await page.goto('/');
    expect(normalise(await page.locator('h1').textContent())).toBe(GREETING);
    expect(normalise(await page.locator('.hero__statement').textContent())).toBe(STATEMENT);
  });

  test('hero has exactly GitHub then LinkedIn, opening in new tabs (FR-005)', async ({ page }) => {
    await page.goto('/');
    const links = await describeLinks(page.locator('#home a'));
    expect(links.map((link) => link.href)).toEqual([GITHUB_URL, LINKEDIN_URL]);
    links.forEach(expectExternal);
  });

  test('Contact names LinkedIn as the primary way to connect and lists it first (FR-021)', async ({
    page,
  }) => {
    await page.goto('/');
    const intro = normalise(await page.locator('#contact .contact__intro').textContent());
    expect(intro).toMatch(/LinkedIn/);
    expect(intro).toMatch(/best|primary/i);
    const links = await describeLinks(page.locator('#contact .contact__links a'));
    expect(links.map((link) => link.href)).toEqual([LINKEDIN_URL, GITHUB_URL]);
    expect(links[0].className).toContain('button--primary');
    expect(links[1].className).toContain('button--secondary');
    links.forEach(expectExternal);
  });

  test('no email address, mailto link, or copy control anywhere (FR-021)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.locator('[data-js*="copy"], .copy-email, .contact__email')).toHaveCount(0);
    const html = await readFile('dist/index.html', 'utf8');
    expect(html).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
    expect(html).not.toMatch(/mailto:/i);
  });

  test('profile links point at the owner’s GitHub and LinkedIn everywhere (FR-006)', async ({
    page,
  }) => {
    await page.goto('/');
    const hrefs = (selector) =>
      page.locator(selector).evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    const github = await hrefs('a[href*="github.com"]');
    const linkedin = await hrefs('a[href*="linkedin.com"]');
    expect(github).toHaveLength(3); // hero, Contact, coming-soon card
    expect(new Set(github)).toEqual(new Set([GITHUB_URL]));
    expect(linkedin).toHaveLength(2); // hero, Contact
    expect(new Set(linkedin)).toEqual(new Set([LINKEDIN_URL]));
    const person = await page
      .locator('script[type="application/ld+json"]')
      .evaluate((el) => JSON.parse(el.textContent));
    expect(person.sameAs).toEqual([GITHUB_URL, LINKEDIN_URL]);
  });
});

test.describe('US1 — hero above the fold (SC-001)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('greeting, statement, and both actions are visible without scrolling', async ({ page }) => {
    await page.goto('/');
    const targets = [
      page.locator('h1'),
      page.locator('.hero__statement'),
      ...(await page.locator('.hero__actions a').all()),
    ];
    expect(targets).toHaveLength(4);
    for (const target of targets) {
      const box = await target.boundingBox();
      expect(box.y + box.height, await target.textContent()).toBeLessThanOrEqual(667);
    }
  });
});
