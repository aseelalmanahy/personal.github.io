import { test, expect } from '../helpers/fixtures.js';

// Owner-approved text, verbatim (spec FR-008 and FR-011, amendment 2026-09-30).
const ABOUT_INTRO =
  "I'm a full-stack software engineer who loves turning complex problems into reliable, " +
  'well-structured systems. I studied Computer Science at UMass Lowell and am now pursuing an ' +
  'MBA in Project Management at LSU Shreveport, pairing engineering depth with strategic ' +
  'delivery know-how. Mentorship is incredibly important to me—I actively dedicate time to ' +
  'sharing my industry experience to accelerate the growth of other engineers while ' +
  'continuously sharpening my own leadership capabilities.';

const EXPERIENCE_NARRATIVE =
  'My engineering journey is rooted in a strong technical foundation, starting with early ' +
  'hands-on work in data structures, object-oriented systems, and core software engineering ' +
  'integrations. Over the years, I have evolved into a Full Stack Engineer specialized in ' +
  'architecting robust systems, constructing high-throughput microservices, and managing ' +
  'resilient cloud infrastructure on AWS. Beyond the code, I bridge the gap between technical ' +
  'execution and organizational strategy. My career is defined not just by the systems I ' +
  'build, but by my active involvement in leadership development—collaborating directly with ' +
  'executive technology leaders to share technical insights while structuring onboarding ' +
  'environments that empower engineering teams to deploy stable, high-quality features with ' +
  'absolute confidence.';

const normalise = (value) => value.replace(/\s+/g, ' ').trim();
const text = (locator) => locator.evaluateAll((els) => els.map((el) => el.textContent.trim()));

test.describe('US2 — About Me', () => {
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

  test('skills grouped and ordered', async ({ page }) => {
    await page.goto('/');
    expect(await text(page.locator('.skill-group__title'))).toEqual([
      'Languages',
      'Tools/Frameworks',
    ]);
    expect(await text(page.locator('.skill-group').nth(0).locator('.tag'))).toEqual([
      'Java',
      'C/C++',
      'SQL',
      'Python',
    ]);
    expect(await text(page.locator('.skill-group').nth(1).locator('.tag'))).toEqual([
      'Git',
      'SpringBoot',
      'Angular',
      'AWS',
    ]);
  });
});

test.describe('US2 — Experience narrative (FR-011 – FR-013)', () => {
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
