import { test, expect } from '../helpers/fixtures.js';

// Owner-approved text, verbatim (spec FR-008 and FR-011, amendment 2026-09-30).
const ABOUT_INTRO =
  "I'm a full-stack software engineer who loves turning complex problems into reliable, " +
  'well-structured systems. I studied Computer Science at UMass Lowell and am now pursuing an ' +
  'MBA in Project Management at LSU Shreveport, pairing engineering depth with strategic ' +
  'delivery know-how. Mentorship is incredibly important to me; I actively dedicate time to ' +
  'sharing my industry experience to accelerate the growth of other engineers while ' +
  'continuously sharpening my own leadership capabilities.';

const EXPERIENCE_NARRATIVE =
  'My engineering journey is rooted in a strong technical foundation, starting as a ' +
  "Professor's Assistant and grader at UMass Lowell, where I evaluated complex algorithmic " +
  'concepts and mentored students in core Data Structures in C and Object-Oriented ' +
  'Programming in C++. I built upon these fundamentals in industry, working as an Android ' +
  'Engineer using Kotlin in the healthcare sector to integrate secure services and optimize ' +
  'user-facing mobile interfaces. Transitioning into full-stack engineering, I have evolved ' +
  'into a Full Stack Engineer specialized in building robust systems, constructing ' +
  'microservices, and managing cloud infrastructure on AWS within high-stakes fields like ' +
  'Financial Services and Healthcare. Beyond the code, I focus on bridging the gap between ' +
  'technical execution and organizational strategy. My career is defined not just by the ' +
  'systems I build, but by my active involvement in mentorship, collaborating with ' +
  'leadership to share technical insights while mentoring new associate software engineers ' +
  'to help them onboard smoothly, master best practices, and achieve both technical and ' +
  'personal growth.';

// Spec FR-010 (amendment 2026-09-30): four tiers, owner's items and order.
const SKILLS = {
  Languages: ['Java', 'TypeScript/JavaScript', 'C/C++', 'C#', 'SQL', 'Python'],
  'Frameworks & Security': [
    'Spring Boot',
    'Angular',
    'Flask',
    'Hibernate',
    'Spring Data JPA',
    'RESTful APIs',
    'OAuth2',
    'JWT',
  ],
  'Cloud & DevOps': [
    'AWS (EC2, Lambda, S3)',
    'Docker',
    'Kubernetes',
    'Jenkins',
    'uDeploy',
    'Git/GitLab/Bitbucket',
  ],
  'Quality & Methodology': [
    'Test-Driven Development (TDD)',
    'JUnit',
    'Karate',
    'SonarQube',
    'Splunk',
    'Datadog',
    'Scrum/Kanban/SAFe',
    'Architecture Grooming',
  ],
};

const normalise = (value) => value.replace(/\s+/g, ' ').trim();
const text = (locator) => locator.evaluateAll((els) => els.map((el) => el.textContent.trim()));

test.describe('US2: About Me', () => {
  test('introduction is the approved text, verbatim (FR-008)', async ({ page }) => {
    await page.goto('/');
    expect(normalise(await page.locator('.about__intro').textContent())).toBe(ABOUT_INTRO);
    await expect(page.locator('.about__intro')).not.toHaveAttribute('data-content-status');
  });

  test('education entries and statuses', async ({ page }) => {
    await page.goto('/');
    expect((await text(page.locator('.education__degree'))).map(normalise)).toEqual([
      'Bachelor of Science in Computer Science',
      'Master of Business Administration in Project Management',
    ]);
    expect(await text(page.locator('.education__status'))).toEqual(['Completed', 'Candidate']);
  });

  test('four skill tiers with the owner’s items, in order (FR-010)', async ({ page }) => {
    await page.goto('/');
    expect(await text(page.locator('.skill-group__title'))).toEqual(Object.keys(SKILLS));
    const groups = page.locator('.skill-group');
    await expect(groups).toHaveCount(4);
    for (const [index, items] of Object.values(SKILLS).entries()) {
      const list = groups.nth(index).locator('ul.tag-list');
      await expect(list).toHaveCount(1);
      expect(await text(list.locator('li.tag'))).toEqual(items);
    }
  });

  for (const [width, columns] of [
    [375, 1],
    [768, 2],
    [1024, 2],
    [1440, 4],
  ]) {
    test(`skill tiers use ${columns} column(s) at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const lefts = await page
        .locator('.skill-group')
        .evaluateAll((groups) => groups.map((group) => Math.round(group.offsetLeft)));
      expect(new Set(lefts).size).toBe(columns);
    });
  }
});

test.describe('US2: Experience narrative (FR-011 to FR-013)', () => {
  test('one paragraph with the approved narrative, verbatim', async ({ page }) => {
    await page.goto('/');
    const narrative = page.locator('#experience .experience__narrative');
    await expect(narrative).toHaveCount(1);
    expect(normalise(await narrative.textContent())).toBe(EXPERIENCE_NARRATIVE);
  });

  test('comfortable line length at desktop width (≤ 75 characters)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const charactersPerLine = await page.locator('.experience__narrative').evaluate((el) => {
      const probe = document.createElement('span');
      probe.textContent = '0';
      el.append(probe);
      const zero = probe.getBoundingClientRect().width;
      probe.remove();
      return el.getBoundingClientRect().width / zero;
    });
    expect(charactersPerLine).toBeLessThanOrEqual(75);
  });

  test('readable and unclipped at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    const narrative = page.locator('.experience__narrative');
    await narrative.scrollIntoViewIfNeeded();
    await expect(narrative).toBeVisible();
    const box = await narrative.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(320);
  });
});
