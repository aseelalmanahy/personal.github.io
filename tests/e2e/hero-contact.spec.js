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

const COPY_FAILURE = "Couldn't copy — please select the address above";

test.describe('US1 — copy email (FR-021a)', () => {
  const copyButton = (page) => page.locator('[data-js="copy-email"]');
  const status = (page) => page.locator('[data-js="copy-email-status"]');

  test('copies the address and announces it, then clears', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'Clipboard permissions can only be granted in Chromium');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    const address = (await page.locator('.contact__email-link').getAttribute('href')).replace(
      /^mailto:/,
      '',
    );
    await copyButton(page).click();
    await expect(status(page)).toHaveText('Copied!');
    await expect(status(page)).toHaveAttribute('role', 'status');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(address);
    await expect(status(page)).toHaveText('', { timeout: 6000 });
  });

  test('explains what to do when copying fails', async ({ page }) => {
    await page.addInitScript(() => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText = () => Promise.reject(new Error('NotAllowedError'));
      }
    });
    await page.goto('/');
    test.skip(!(await copyButton(page).isVisible()), 'No Clipboard API in this engine context');
    await copyButton(page).click();
    await expect(status(page)).toHaveText(COPY_FAILURE);
  });

  test('stays hidden when the Clipboard API is unavailable', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, 'clipboard', { get: () => undefined });
    });
    await page.goto('/');
    await expect(copyButton(page)).toBeHidden();
    await expect(page.locator('.contact__email-link')).toBeVisible();
  });
});
