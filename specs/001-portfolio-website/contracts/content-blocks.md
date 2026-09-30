# Contract: Content Blocks

Markup patterns for every repeatable content block. Content editors add, remove, or replace a
block by copying its pattern; CSS and JS depend only on the classes and attributes shown here
(FR-019). `CONTENT:` marks a value that is a content input and must be replaced before launch.

Icon usage everywhere: `<svg class="icon" aria-hidden="true" focusable="false"><use
href="assets/icons.svg#<id>"></use></svg>` placed next to visible text.

## Contact link (hero and Contact section)

External profile (GitHub / LinkedIn):

```html
<a class="button button--primary" href="CONTENT:https://github.com/…"
   target="_blank" rel="noopener noreferrer">
  <svg class="icon" …><use href="assets/icons.svg#github"></use></svg>
  GitHub<span class="visually-hidden"> (opens in a new tab)</span>
</a>
```

A visible external-link glyph (`#external`) accompanies the text so sighted users also know it
opens a new tab (FR-006).

Email (hero):

```html
<a class="button button--secondary" href="mailto:CONTENT:address">
  <svg class="icon" …><use href="assets/icons.svg#email"></use></svg> Email
</a>
```

Contact section email with copy button (FR-021, FR-021a):

```html
<p class="contact__email">
  <a class="contact__email-link" href="mailto:CONTENT:address">CONTENT:address</a>
  <button class="button button--small copy-email" type="button" hidden
          data-js="copy-email">Copy email</button>
  <span class="copy-email__status" role="status" data-js="copy-email-status"></span>
</p>
```

## Education entry

```html
<li class="education__item">
  <h4 class="education__degree">Bachelor of Science in Computer Science</h4>
  <p class="education__school">University of Massachusetts Lowell</p>
  <p class="education__status">Completed</p>
</li>
```

Items sit in `<ul class="education">` under the `h3` "Education", so degrees are `h4`
(outline in page-structure.md). The MBA uses "Candidate" as its status text.

## Skill group

```html
<div class="skill-group">
  <h4 class="skill-group__title" id="skills-languages">Languages</h4>
  <ul class="tag-list" aria-labelledby="skills-languages">
    <li class="tag">Java</li><li class="tag">C/C++</li><li class="tag">SQL</li><li class="tag">Python</li>
  </ul>
</div>
```

## Experience narrative (FR-011–FR-014; replaces the timeline entry, 2026-09-30)

```html
<section id="experience" class="experience" tabindex="-1" aria-labelledby="experience-title">
  <div class="container">
    <h2 id="experience-title" class="section__title">Experience</h2>
    <p class="experience__narrative">My engineering journey is rooted in … absolute confidence.</p>
  </div>
</section>
```

- The paragraph is the owner's text from spec FR-011, **verbatim**.
- **Nothing else may appear in the section** — no lists, `<time>`, per-role headings, dates,
  employer or program names (FR-012, FR-014). The `privacy-scope` e2e spec enforces this.

## Project card (FR-016–FR-019)

```html
<li class="projects__item">
  <article class="project-card" aria-labelledby="project-<slug>">
    <h3 class="project-card__title" id="project-<slug>">Project Title</h3>
    <p class="project-card__description">≤ 200 characters.</p>
    <ul class="tag-list" aria-label="Technologies used">
      <li class="tag">HTML</li><li class="tag">CSS</li><li class="tag">JS</li>
    </ul>
    <p class="project-card__links">
      <a class="project-card__link" href="https://github.com/…" target="_blank"
         rel="noopener noreferrer">Source code<span class="visually-hidden"> for Project
         Title (opens in a new tab)</span></a>
      <a class="project-card__link" href="https://…" target="_blank"
         rel="noopener noreferrer">Live demo<span class="visually-hidden"> of Project Title
         (opens in a new tab)</span></a>
    </p>
  </article>
</li>
```

Omit an `<a>` entirely when its URL does not exist (FR-018). The grid container is
`<ul class="projects__grid">`.

## Coming-soon card (FR-020)

```html
<li class="projects__item">
  <article class="project-card project-card--placeholder" aria-labelledby="project-coming-soon">
    <h3 class="project-card__title" id="project-coming-soon">More projects coming soon</h3>
    <p class="project-card__description">New projects are on the way — follow along on GitHub.</p>
    <p class="project-card__links">
      <a class="project-card__link" href="CONTENT:https://github.com/…" target="_blank"
         rel="noopener noreferrer">Visit my GitHub<span class="visually-hidden"> (opens in a
         new tab)</span></a>
    </p>
  </article>
</li>
```

Present only while the grid has zero project cards; delete it in the same change that adds the
first project.
