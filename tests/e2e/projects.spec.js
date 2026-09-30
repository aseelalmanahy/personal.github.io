import { test, expect } from '../helpers/fixtures.js';

const REPO = 'https://github.com/aseelalmanahy/';

// Featured cards (spec FR-017, FR-020, amendment 2026-09-30): competency, repositories, tags.
const FEATURED = [
  {
    slug: 'microservices',
    title: 'Event-Driven Microservices',
    tags: ['Spring Boot', 'Apache Kafka', 'MySQL', 'Docker Compose'],
    code: [
      ['Order Service', `${REPO}order-service`],
      ['Product Service', `${REPO}e-commerce-store-project`],
    ],
  },
  {
    slug: 'full-stack',
    title: 'Full-Stack Web Application',
    tags: ['Angular', 'TypeScript', 'REST API', 'Spring Data JPA'],
    code: [
      ['Angular front end', `${REPO}booky-frontend`],
      ['Spring Boot API', `${REPO}books`],
    ],
  },
  {
    slug: 'algorithms',
    title: 'Algorithmic Systems',
    tags: ['Android', 'Java', 'SQLite', 'Algorithms'],
    code: [['Radix Calculator', `${REPO}Radix-Calculator`]],
  },
];

const normalise = (text) => text.replace(/\s+/g, ' ').trim();

async function columnCount(page) {
  const xs = await page
    .locator('.projects__item')
    .evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().x)));
  return new Set(xs).size;
}

test.describe('US3: featured projects (FR-016 to FR-020)', () => {
  test('three featured cards with title, description, tags, and code links, in order', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('#projects .project-card')).toHaveCount(FEATURED.length);
    for (const [index, card] of FEATURED.entries()) {
      const article = page.locator('.project-card').nth(index);
      await expect(article).toHaveAttribute('aria-labelledby', `project-${card.slug}`);
      await expect(article.locator('.project-card__title')).toHaveText(card.title);
      const description = normalise(
        await article.locator('.project-card__description').textContent(),
      );
      expect(description.length).toBeGreaterThan(40);
      expect(description.length).toBeLessThanOrEqual(200);
      expect(await article.locator('.tag').allTextContents()).toEqual(card.tags);
      const links = await article.getByRole('link').evaluateAll((anchors) =>
        anchors.map((a) => ({
          text: a.textContent.replace(/\s+/g, ' ').trim(),
          href: a.getAttribute('href'),
          target: a.getAttribute('target'),
          rel: a.getAttribute('rel'),
        })),
      );
      expect(links.map(({ href }) => href)).toEqual(card.code.map(([, href]) => href));
      for (const [i, link] of links.entries()) {
        expect(link.text).toBe(
          `${card.code[i][0]} source code for ${card.title} (opens in a new tab)`,
        );
        expect(link.target).toBe('_blank');
        expect(link.rel).toBe('noopener noreferrer');
      }
    }
  });

  test('no placeholder card and no tag repeated across cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.project-card--placeholder')).toHaveCount(0);
    await expect(page.locator('#projects')).not.toContainText(/coming soon/i);
    const tags = await page.locator('#projects .tag').allTextContents();
    expect(new Set(tags).size).toBe(tags.length);
  });

  test('Projects links only to repositories, never to a profile (FR-042)', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page
      .locator('#projects a')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    expect(hrefs.length).toBe(5);
    for (const href of hrefs)
      expect(href).toMatch(/^https:\/\/github\.com\/aseelalmanahy\/[\w-]+$/);
  });

  for (const [width, columns] of [
    [375, 1],
    [768, 2],
    [1024, 3],
    [1440, 3],
  ]) {
    test(`cards reflow to ${columns} column(s) at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      expect(await columnCount(page)).toBe(columns);
    });
  }
});
