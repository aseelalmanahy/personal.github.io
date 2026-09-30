# Contract: Page Structure

The public, testable shape of `src/index.html` and `src/404.html`. End-to-end tests in
`tests/e2e/structure.spec.js` assert this contract; changing it requires updating the plan.

## Document head (index.html)

In this order:

1. `<meta charset="utf-8">`
2. `<meta name="viewport" content="width=device-width, initial-scale=1">` (never disables zoom)
3. `<meta http-equiv="Content-Security-Policy" content="…">` (policy in research R-20)
4. `<meta name="referrer" content="strict-origin-when-cross-origin">`
5. `<title>Aseel Almanahy — Full Stack Software Engineer</title>`
6. Inline theme bootstrap `<script>` (research R-02) — **before** any stylesheet
7. `<link rel="stylesheet" href="css/main.css">` and
   `<link rel="stylesheet" href="css/print.css" media="print">`
8. `<link rel="modulepreload">` for each submodule; `<script type="module" src="js/main.js">`
9. `meta description`, `link rel="canonical"`, Open Graph + Twitter tags, two
   `meta name="theme-color"` (light/dark `media`), icons (`favicon.svg`, `favicon-32.png`,
   `apple-touch-icon.png`)
10. `<script type="application/ld+json">` Person data block

`<html lang="en" class="no-js">` — the bootstrap swaps `no-js` → `js`.

## Body landmarks and order

```text
body
├── a.skip-link[href="#main"]          "Skip to main content" — first focusable element
├── header.site-header                  sticky, height var(--nav-height) collapsed
│   ├── a.site-header__brand[href="#home"]   "Aseel Almanahy"
│   └── nav[aria-label="Primary"]
│       ├── a.nav__toggle[href="#nav-menu"]  "Menu" (shown only under html.js below 48em;
│       │                                       nav.js swaps it for button[aria-expanded])
│       ├── ul#nav-menu.nav__list
│       │   ├── a[href="#about"]       About
│       │   ├── a[href="#experience"]  Experience
│       │   ├── a[href="#interests"]   Interests
│       │   ├── a[href="#projects"]    Projects
│       │   └── a[href="#contact"]     Contact
│       └── button.theme-toggle[hidden][aria-pressed]  accessible name "Dark theme"
├── main#main[tabindex="-1"]
│   ├── section#home       aria-labelledby → h1   (Hero)
│   ├── section#about      aria-labelledby → h2 "About Me"
│   ├── section#experience aria-labelledby → h2 "Experience"
│   ├── section#interests  aria-labelledby → h2 "Interests"
│   ├── section#projects   aria-labelledby → h2 "Projects"
│   └── section#contact    aria-labelledby → h2 "Contact"
└── footer.site-footer     "© <year> Aseel Almanahy"
```

- Section order is fixed (FR-001, constitution Principle V, as amended in v2.0.1).
- Every `section` has `tabindex="-1"` so navigation can move focus to it (FR-024).
- Each section `id` is stable and shareable (FR-002).

## Heading outline

```text
h1  Hi, I'm Aseel.
h2  About Me
  h3  Education
    h4  <degree> ×2
  h3  Skills
    h4  Languages
    h4  Frameworks & Security
    h4  Cloud & DevOps
    h4  Quality & Methodology
h2  Experience
  (one narrative paragraph — no sub-headings; amendment 2026-09-30)
h2  Interests
  (list of five items — no sub-headings)
h2  Projects
  h3  <project title> ×N  |  h3 "More projects coming soon"
h2  Contact
```

Exactly one `h1`; no skipped levels (Best Practice 2).

## 404.html

Same head items 1–7 (no module script needed unless the header toggle is included), a
`<base href="<site base path>">` (research R-21), the site header brand link, an `h1`
"Page not found", one sentence, and a link "Back to the home page" → `./`. Excluded from
`sitemap.xml`; `<meta name="robots" content="noindex">`.

## Root files

| File | Content |
|---|---|
| `robots.txt` | `User-agent: *`, `Allow: /`, `Sitemap: <site URL>sitemap.xml` |
| `sitemap.xml` | One `<url>` with the canonical URL |
| `.nojekyll` | Empty |
