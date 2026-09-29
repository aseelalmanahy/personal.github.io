import { test, expect } from '../helpers/fixtures.js';

const SAMPLES = [
  { slug: 'alpha', title: 'Alpha Planner', demo: true },
  { slug: 'beta', title: 'Beta Notes', demo: false },
  { slug: 'gamma', title: 'Gamma Charts', demo: true },
];

/** Replaces the coming-soon card with sample cards built from contracts/content-blocks.md. */
async function injectSampleProjects(page) {
  await page.evaluate((samples) => {
    const grid = document.querySelector('.projects__grid');
    grid.innerHTML = samples
      .map(
        ({ slug, title, demo }) => `
        <li class="projects__item">
          <article class="project-card" aria-labelledby="project-${slug}">
            <h3 class="project-card__title" id="project-${slug}">${title}</h3>
            <p class="project-card__description">A short description of ${title}.</p>
            <ul class="tag-list" aria-label="Technologies used">
              <li class="tag">HTML</li><li class="tag">CSS</li><li class="tag">JS</li>
            </ul>
            <p class="project-card__links">
              <a class="project-card__link" href="https://example.com/${slug}/source" target="_blank"
                 rel="noopener noreferrer">Source code<span class="visually-hidden"> for ${title}
                 (opens in a new tab)</span></a>
              ${
                demo
                  ? `<a class="project-card__link" href="https://example.com/${slug}" target="_blank"
                 rel="noopener noreferrer">Live demo<span class="visually-hidden"> of ${title}
                 (opens in a new tab)</span></a>`
                  : ''
              }
            </p>
          </article>
        </li>`,
      )
      .join('');
  }, SAMPLES);
}

async function columnCount(page) {
  const xs = await page
    .locator('.projects__item')
    .evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().x)));
  return new Set(xs).size;
}

test.describe('US3 — projects (FR-016 – FR-020)', () => {
  test('launch state: one coming-soon card, no tags, no dead links', async ({ page }) => {
    await page.goto('/');
    const placeholder = page.locator('.project-card--placeholder');
    await expect(placeholder).toHaveCount(1);
    await expect(placeholder.locator('.tag')).toHaveCount(0);
    const hrefs = await placeholder
      .locator('a')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    for (const href of hrefs) {
      expect(href).not.toBe('#');
      expect(href).toBeTruthy();
    }
  });

  test('coming-soon card appears only when there are no projects', async ({ page }) => {
    await page.goto('/');
    const real = await page.locator('.project-card:not(.project-card--placeholder)').count();
    const placeholders = await page.locator('.project-card--placeholder').count();
    expect(placeholders).toBe(real === 0 ? 1 : 0);
  });

  test('coming-soon card stays card-sized at 2560px', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1200 });
    await page.goto('/');
    const box = await page.locator('.project-card--placeholder').boundingBox();
    expect(box.width).toBeLessThanOrEqual(28 * 16);
  });

  for (const [width, minColumns, maxColumns] of [
    [375, 1, 1],
    [768, 2, 4],
    [1024, 2, 4],
    [1440, 2, 4],
  ]) {
    test(`sample cards reflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await injectSampleProjects(page);
      const columns = await columnCount(page);
      expect(columns).toBeGreaterThanOrEqual(minColumns);
      expect(columns).toBeLessThanOrEqual(maxColumns);
    });
  }

  test('cards show all elements, name their project, and omit missing demos', async ({ page }) => {
    await page.goto('/');
    await injectSampleProjects(page);
    for (const sample of SAMPLES) {
      const card = page.locator('.project-card', { has: page.locator(`#project-${sample.slug}`) });
      await expect(card.locator('.project-card__title')).toHaveText(sample.title);
      await expect(card.locator('.project-card__description')).toBeVisible();
      expect(await card.locator('.tag').count()).toBeGreaterThanOrEqual(1);
      const links = card.getByRole('link');
      await expect(links).toHaveCount(sample.demo ? 2 : 1);
      for (const link of await links.all()) {
        expect(await link.textContent()).toContain(sample.title);
      }
    }
  });
});
