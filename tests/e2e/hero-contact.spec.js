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

test.describe('US1: hero and contact content', () => {
  test('hero greeting and statement are verbatim', async ({ page }) => {
    await page.goto('/');
    expect(normalise(await page.locator('h1').textContent())).toBe(GREETING);
    expect(normalise(await page.locator('.hero__statement').textContent())).toBe(STATEMENT);
  });

  test('unified intro: greeting, statement, biography, education, skills; no links (FR-005)', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('#home a, #home button')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'About Me' })).toHaveCount(0);
    const order = await page
      .locator('#home :is(h1, .hero__statement, .about__intro, .education, .skills)')
      .evaluateAll((els) => els.map((el) => (el.tagName === 'H1' ? 'h1' : el.classList[0])));
    expect(order).toEqual(['h1', 'hero__statement', 'about__intro', 'education', 'skills']);
    expect(
      await page.locator('#home h2').evaluateAll((els) => els.map((el) => el.textContent.trim())),
    ).toEqual(['Education', 'Skills']);
  });

  test('Contact names LinkedIn as the primary way to connect and lists it first (FR-021)', async ({
    page,
  }) => {
    await page.goto('/');
    const intro = normalise(await page.locator('#contact .contact__intro').textContent());
    expect(intro).toMatch(/LinkedIn/);
    expect(intro).toMatch(/primary and best/i);
    expect(intro).toMatch(/initiate professional discussions/i);
    const links = await describeLinks(page.locator('#contact .contact__links a'));
    expect(links.map((link) => link.href)).toEqual([LINKEDIN_URL, GITHUB_URL]);
    expect(links[0].className).toContain('button--primary');
    expect(links[1].className).toContain('button--secondary');
    links.forEach(expectExternal);
  });

  test('no email address or mailto link anywhere (FR-021)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
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
    const github = await hrefs(`a[href="${GITHUB_URL}"]`);
    const linkedin = await hrefs('a[href*="linkedin.com"]');
    expect(github).toHaveLength(1); // Contact only
    expect(linkedin).toHaveLength(1); // Contact only
    expect(new Set(linkedin)).toEqual(new Set([LINKEDIN_URL]));
    const person = await page
      .locator('script[type="application/ld+json"]')
      .evaluate((el) => JSON.parse(el.textContent));
    expect(person.sameAs).toEqual([GITHUB_URL, LINKEDIN_URL]);
  });

  test('profile links appear only in Contact, once each (FR-042)', async ({ page }) => {
    await page.goto('/');
    const placement = await page
      .locator(`a[href="${GITHUB_URL}"], a[href="${LINKEDIN_URL}"]`)
      .evaluateAll((links) =>
        links.map((a) => `${a.closest('section')?.id ?? 'outside'}:${a.getAttribute('href')}`),
      );
    expect(placement).toEqual([`contact:${LINKEDIN_URL}`, `contact:${GITHUB_URL}`]);
  });
});

test.describe('US1: intro closes the landing gap (FR-005a)', () => {
  for (const [width, height] of [
    [1024, 768],
    [1440, 900],
  ]) {
    test(`education cards start in the first viewport at ${width}×${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      const box = await page.locator('.education__item').first().boundingBox();
      expect(box.y).toBeLessThan(height);
    });
  }

  test('text blocks follow each other without a section-sized gap', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const gap = async (upper, lower) => {
      const a = await page.locator(upper).boundingBox();
      const b = await page.locator(lower).boundingBox();
      return b.y - (a.y + a.height);
    };
    expect(await gap('.hero__statement', '.about__intro')).toBeLessThanOrEqual(64);
    expect(await gap('.about__intro', '.education')).toBeLessThanOrEqual(96);
  });
});

test.describe('US1: hero above the fold (SC-001)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('greeting and statement are visible without scrolling', async ({ page }) => {
    await page.goto('/');
    const targets = [page.locator('h1'), page.locator('.hero__statement')];
    for (const target of targets) {
      const box = await target.boundingBox();
      expect(box.y + box.height, await target.textContent()).toBeLessThanOrEqual(667);
    }
  });
});
