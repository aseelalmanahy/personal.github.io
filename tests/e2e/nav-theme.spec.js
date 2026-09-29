import { test, expect } from '../helpers/fixtures.js';
import { isObscuredByHeader, layoutShiftScore, TAB_REACHES_LINKS } from '../helpers/page-utils.js';

const DARK_BG = 'rgb(27, 19, 16)';
const LIGHT_BG = 'rgb(251, 246, 238)';

const bodyBackground = (page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test.describe('US4 — theme applies before first paint (FR-029)', () => {
  test('saved dark choice wins over a light device without a flash', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark');
      document.addEventListener('DOMContentLoaded', () => {
        window.__themeAtDomReady = document.documentElement.dataset.theme;
      });
    });
    await page.goto('/');
    expect(await page.evaluate(() => window.__themeAtDomReady)).toBe('dark');
    expect(await bodyBackground(page)).toBe(DARK_BG);
  });

  test('with nothing saved, the device preference applies', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    expect(await page.locator('html').getAttribute('data-theme')).toBeNull();
    expect(await bodyBackground(page)).toBe(DARK_BG);
    await page.emulateMedia({ colorScheme: 'light' });
    expect(await bodyBackground(page)).toBe(LIGHT_BG);
  });
});

test.describe('US4 — headings and focus never hidden under the bar (FR-023a)', () => {
  for (const width of [375, 1440]) {
    test(`deep links land below the bar at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      for (const id of ['about', 'experience', 'projects', 'contact']) {
        await page.goto(`/#${id}`);
        await page.waitForTimeout(100);
        const heading = await page.locator(`#${id} h2`).boundingBox();
        const header = await page.locator('.site-header').boundingBox();
        expect(heading.y, id).toBeGreaterThanOrEqual(header.y + header.height - 1);
      }
    });

    test(`tabbing never hides focus under the bar at ${width}px`, async ({ page, browserName }) => {
      test.skip(!TAB_REACHES_LINKS(browserName), 'WebKit build does not Tab to links');
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      const stops = await page
        .locator('a[href], button, [tabindex="0"]')
        .evaluateAll((els) => els.filter((el) => el.getClientRects().length > 0).length);
      for (let step = 0; step < stops; step += 1) {
        await page.keyboard.press('Tab');
        const focused = page.locator(':focus');
        if (await focused.evaluate((el) => el.closest('.site-header, .skip-link') !== null)) {
          continue;
        }
        expect(await isObscuredByHeader(page, focused), `stop ${step}`).toBe(false);
      }
    });
  }
});

test.describe('US4 — theme without scripting', () => {
  test.use({ javaScriptEnabled: false, colorScheme: 'dark' });

  test('dark device gives the dark theme', async ({ page }) => {
    await page.goto('/');
    expect(await bodyBackground(page)).toBe(DARK_BG);
  });
});

const toggle = (page) => page.locator('.theme-toggle');
const theme = (page) => page.locator('html').getAttribute('data-theme');

test.describe('US4 — theme toggle (FR-030, FR-031, SC-008)', () => {
  // Reduced motion so colours are read after the switch, not mid-fade (fade tested below).
  test.use({ colorScheme: 'light', reducedMotion: 'reduce' });

  test('click, Enter, and Space each switch the theme and persist it', async ({ page }) => {
    await page.goto('/');
    await expect(toggle(page)).toBeVisible();
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');

    await toggle(page).click();
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
    expect(await theme(page)).toBe('dark');
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
    expect(await bodyBackground(page)).toBe(DARK_BG);

    await toggle(page).focus();
    await page.keyboard.press('Enter');
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
    expect(await theme(page)).toBe('light');

    await page.keyboard.press('Space');
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    expect(await theme(page)).toBe('dark');
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
  });

  test('theme-color metas follow the chosen theme', async ({ page }) => {
    await page.goto('/');
    await toggle(page).click();
    const colors = await page
      .locator('meta[name="theme-color"]')
      .evaluateAll((metas) => metas.map((meta) => meta.content.toLowerCase()));
    expect(colors).toEqual(['#1b1310', '#1b1310']);
  });

  test('blocked storage: toggle still works for the visit, without errors', async ({ page }) => {
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new Error('SecurityError');
      };
      Storage.prototype.setItem = () => {
        throw new Error('SecurityError');
      };
    });
    await page.goto('/');
    await toggle(page).click();
    expect(await theme(page)).toBe('dark');
    await toggle(page).click();
    expect(await theme(page)).toBe('light');
  });

  test('follows the device only until the visitor chooses', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
    expect(await bodyBackground(page)).toBe(DARK_BG);

    await toggle(page).click();
    expect(await theme(page)).toBe('light');
    await page.emulateMedia({ colorScheme: 'light' });
    await page.emulateMedia({ colorScheme: 'dark' });
    expect(await theme(page)).toBe('light');
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
  });
});

const longestTransition = (page) =>
  page.evaluate(() =>
    Math.max(
      ...getComputedStyle(document.body)
        .transitionDuration.split(',')
        .map((value) => parseFloat(value)),
    ),
  );

test.describe('US4 — theme transition respects reduced motion (FR-031)', () => {
  test('instant with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await toggle(page).click();
    expect(await longestTransition(page)).toBe(0);
  });

  test('smooth but no longer than 300ms otherwise', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await toggle(page).click();
    const seconds = await longestTransition(page);
    expect(seconds).toBeGreaterThan(0);
    expect(seconds).toBeLessThanOrEqual(0.3);
  });
});

test.describe('US4 — mobile menu (FR-023, FR-025)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('compact bar, disclosure, Escape, and choosing a link', async ({ page }) => {
    await page.goto('/');
    const menu = page.locator('.nav__toggle');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('.nav__link').first()).toBeHidden();
    const bar = await page.locator('.site-header').boundingBox();
    expect(bar.height).toBeLessThanOrEqual(57);

    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    for (const link of await page.locator('.nav__link').all()) {
      await expect(link).toBeVisible();
    }

    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();

    await menu.click();
    await page.getByRole('link', { name: 'Experience' }).click();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#experience')).toBeFocused();
    await page.waitForTimeout(800);
    expect(await isObscuredByHeader(page, page.locator('#experience h2'))).toBe(false);
  });

  test('menu button is hidden on wider screens', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/');
    await expect(page.locator('.nav__toggle')).toBeHidden();
  });
});

test.describe('US4 — current section and smooth scrolling (FR-024, FR-026)', () => {
  test('exactly one nav link marks the section in view; none in the hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.nav__link[aria-current="true"]')).toHaveCount(0);
    for (const id of ['about', 'experience', 'projects', 'contact']) {
      await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ behavior: 'instant' }));
      const current = page.locator('.nav__link[aria-current="true"]');
      await expect(current).toHaveCount(1);
      await expect(current).toHaveAttribute('href', `#${id}`);
    }
  });

  for (const [reducedMotion, expected] of [
    ['no-preference', 'smooth'],
    ['reduce', 'auto'],
  ]) {
    test(`scroll-behavior is ${expected} with reducedMotion=${reducedMotion}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto('/');
      const behavior = await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      );
      expect(behavior).toBe(expected);
    });
  }
});

test.describe('US4 — navigation survives a failed script (constitution IV)', () => {
  test.use({
    viewport: { width: 375, height: 667 },
    expectedProblems: /main.js|Failed to load resource|ERR_FAILED/i,
  });

  test('the Menu link still opens the menu via #nav-menu', async ({ page }) => {
    await page.route(/\/js\/main\.js/, (route) => route.abort());
    await page.goto('/');
    const menu = page.locator('a.nav__toggle');
    await expect(menu).toBeVisible();
    await expect(page.locator('.nav__link').first()).toBeHidden();
    await menu.click();
    for (const link of await page.locator('.nav__link').all()) {
      await expect(link).toBeVisible();
    }
    await page.locator('.nav__link', { hasText: 'Projects' }).click();
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator('.nav__link').first()).toBeHidden();
  });
});

test.describe('US4 — no layout shift when the menu enhances (CLS)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('the bar is compact before and after nav.js runs', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Layout Instability API is Chromium-only');
    // Delay the module graph so enhancement certainly happens after first paint.
    await page.route(/\/js\/main\.js/, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await route.continue();
    });
    await page.goto('/');
    await expect(page.locator('button.nav__toggle')).toBeVisible();
    expect(await layoutShiftScore(page)).toBeLessThanOrEqual(0.05);
  });
});
