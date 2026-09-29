import { test as base, expect } from '@playwright/test';

/**
 * Playwright `test` with an automatic fixture that fails any test during which the page logged
 * a console error/warning, threw an uncaught error, or reported a CSP violation.
 */
export const test = base.extend({
  pageProblems: [
    async ({ page }, use) => {
      const problems = [];
      page.on('console', (message) => {
        if (message.type() === 'error' || message.type() === 'warning') {
          problems.push(`console.${message.type()}: ${message.text()}`);
        }
      });
      page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
      await page.addInitScript(() => {
        window.__cspViolations = [];
        document.addEventListener('securitypolicyviolation', (event) => {
          window.__cspViolations.push(`${event.violatedDirective} ${event.blockedURI}`);
        });
      });

      await use(problems);

      const violations = await page.evaluate(() => window.__cspViolations ?? []).catch(() => []);
      problems.push(...violations.map((violation) => `csp: ${violation}`));
      expect(problems, 'page reported console errors, page errors, or CSP violations').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
