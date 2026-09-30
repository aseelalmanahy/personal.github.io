import { test, expect } from '../helpers/fixtures.js';
import { runAxe, TAB_REACHES_LINKS, tabKey, tabOrder } from '../helpers/page-utils.js';

const THEMES = [
  { name: 'light device', colorScheme: 'light', saved: null },
  { name: 'dark device', colorScheme: 'dark', saved: null },
  { name: 'saved dark on light device', colorScheme: 'light', saved: 'dark' },
];

test.describe('accessibility: axe WCAG 2.2 AA', () => {
  // axe's own injected style would trip the site's CSP; CSP is enforced by every other spec.
  test.use({ bypassCSP: true });

  for (const path of ['/', '/404.html']) {
    for (const theme of THEMES) {
      test(`${path} has no violations (${theme.name})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: theme.colorScheme });
        if (theme.saved) {
          await page.addInitScript((value) => localStorage.setItem('theme', value), theme.saved);
        }
        await page.goto(path);
        expect(await runAxe(page)).toEqual([]);
      });
    }
  }
});

test.describe('keyboard focus and target size (FR-033)', () => {
  test('every focusable element shows a visible outline', async ({ page, browserName }) => {
    test.skip(!TAB_REACHES_LINKS(browserName), 'WebKit build does not Tab to links');
    await page.goto('/');
    const count = await page
      .locator('a[href], button:not([hidden]), [tabindex="0"]')
      .evaluateAll((els) => els.filter((el) => el.getClientRects().length > 0).length);
    for (let step = 0; step < count; step += 1) {
      await page.keyboard.press(tabKey());
      const outline = await page.evaluate(() => {
        const style = getComputedStyle(document.activeElement);
        return {
          element: document.activeElement.outerHTML.slice(0, 80),
          style: style.outlineStyle,
          width: parseFloat(style.outlineWidth),
        };
      });
      expect(outline.style, outline.element).not.toBe('none');
      expect(outline.width, outline.element).toBeGreaterThanOrEqual(2);
    }
  });

  test('every visible link and button is at least 44×44 CSS px', async ({ page }) => {
    await page.goto('/');
    const small = await page.locator('a[href], button').evaluateAll((els) =>
      els
        .filter((el) => el.getClientRects().length > 0 && !el.closest('[hidden]'))
        .map((el) => ({ html: el.outerHTML.slice(0, 80), rect: el.getBoundingClientRect() }))
        .filter(({ rect }) => rect.width > 1 && (rect.width < 43.5 || rect.height < 43.5))
        .map(({ html, rect }) => `${Math.round(rect.width)}×${Math.round(rect.height)} ${html}`),
    );
    expect(small).toEqual([]);
  });
});

test.describe('keyboard walkthrough (SC-006)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('logical tab order through every control, without traps', async ({ page, browserName }) => {
    test.skip(!TAB_REACHES_LINKS(browserName), 'WebKit build does not Tab to links');
    await page.goto('/');
    const labels = (await tabOrder(page, 17)).map(({ text }) => text);
    expect(labels).toEqual([
      'Skip to main content',
      'Aseel Almanahy',
      'About',
      'Experience',
      'Interests',
      'Projects',
      'Contact',
      'Dark theme',
      'GitHub (opens in a new tab)',
      'LinkedIn (opens in a new tab)',
      'Order Service source code for Event-Driven Microservices (opens in a new tab)',
      'Product Service source code for Event-Driven Microservices (opens in a new tab)',
      'Angular front end source code for Full-Stack Web Application (opens in a new tab)',
      'Spring Boot API source code for Full-Stack Web Application (opens in a new tab)',
      'Radix Calculator source code for Algorithmic Systems (opens in a new tab)',
      'Connect on LinkedIn (opens in a new tab)',
      'GitHub profile (opens in a new tab)',
    ]);
  });
});
