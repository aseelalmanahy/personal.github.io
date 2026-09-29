import AxeBuilder from '@axe-core/playwright';

/** True when the page or any visible element extends past the viewport's right edge. */
export async function hasHorizontalOverflow(page) {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > viewportWidth + 1) return true;
    return [...document.querySelectorAll('body *')].some((element) => {
      if (element.closest('.visually-hidden')) return false;
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.right > viewportWidth + 1;
    });
  });
}

/** True when the element's top edge sits under the sticky site header. */
export async function isObscuredByHeader(page, locator) {
  const header = await page.locator('.site-header').boundingBox();
  const target = await locator.boundingBox();
  if (!header || !target) return false;
  return target.y < header.y + header.height - 1;
}

/**
 * Playwright's WebKit build never moves focus to links with Tab (a WebKit preference with no
 * API), so keyboard-order tests run in Chromium and Firefox; WebKit gets structural checks.
 */
export const TAB_REACHES_LINKS = (browserName) => browserName !== 'webkit';

/** The key that moves focus to the next focusable element. */
export function tabKey() {
  return 'Tab';
}

/** The first element in document order that can receive keyboard focus. */
export async function firstFocusable(page) {
  return page.evaluate(() => {
    const candidates = document.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const element = [...candidates].find((el) => !el.closest('[hidden]'));
    return { text: element?.textContent.trim(), href: element?.getAttribute('href') };
  });
}

/** Presses Tab `maxSteps` times and describes each focused element. */
export async function tabOrder(page, maxSteps) {
  const order = [];
  for (let step = 0; step < maxSteps; step += 1) {
    await page.keyboard.press(tabKey());
    order.push(
      await page.evaluate(() => {
        const element = document.activeElement;
        return {
          tag: element?.tagName.toLowerCase() ?? '',
          text: (element?.textContent ?? '').replace(/\s+/g, ' ').trim(),
          href: element?.getAttribute('href') ?? null,
          className: element?.className ?? '',
        };
      }),
    );
  }
  return order;
}

/** Sum of layout-shift entries (excluding those after recent input) since navigation. */
export async function layoutShiftScore(page) {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        let score = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) score += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(score), 300);
      }),
  );
}

/** Runs axe with the WCAG 2.2 AA rule tags and returns the violations. */
export async function runAxe(page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  return results.violations;
}
