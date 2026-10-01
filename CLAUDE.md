# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Single-page personal portfolio for Aseel Almanahy, scaffolded with **GitHub Spec Kit** (v1.0.13.dev0). `specs/001-portfolio-website` is complete: released 2026-10-01 at https://aseelalmanahy.com/ (repository `personal.github.io`, deployed from `main`). New work starts a new feature via `/speckit-specify`. Gate evidence lives in `specs/001-portfolio-website/checklists/implementation-gates.md`.

- **Content**: all owner content is final (spec FR-006, FR-008, FR-011, FR-037; site URL `https://aseelalmanahy.com/` (custom domain; `src/CNAME`, repository `personal.github.io`); no email by design) — keep it verbatim. `node tools/check-content.mjs --strict` must stay at 0 markers; never invent content.
- The parent folder (`../`) contains an unrelated, empty git repository; this project's repository root is this directory.

## Stack (decided in `specs/001-portfolio-website/plan.md`)

- **Shipped site**: hand-written HTML5, CSS3 (custom-property tokens, `@layer`, BEM), native ES modules. No runtime dependencies, frameworks, TypeScript, or preprocessors (constitution Principle I).
- **Layout**: `src/` is the deployable root and is served as-is in development; `tools/build.mjs` writes the production build to `dist/` (bundled/minified CSS, `?v=` cache-busting). Tests in `tests/unit` (node:test) and `tests/e2e` (Playwright + axe); dev scripts in `tools/`.
- **Only CSS/JS file allowed to contain colour literals**: `src/css/tokens.css` (Stylelint enforces; print colours live there too). JS reads colours via `getComputedStyle`.
- **Inline `<head>` theme bootstrap** (the only inline script the constitution allows; must stay < 1 KB) is protected by a CSP hash — after editing it, run `node tools/check-csp.mjs --write`.
- **W3C checker**: `tools/build.mjs` strips trailing slashes from HTML void elements in `dist/` (Prettier keeps them in `src/`). The two remaining checker warnings (inline theme bootstrap, JSON-LD vs the CSP meta) are permanent, documented false positives: `specs/002-w3c-validation-cleanup/validation-exceptions.md`.
- `[hidden]` is forced to `display: none !important` in `utilities.css`; the JS-only theme toggle ships `hidden`. No email is published — LinkedIn is the primary contact (spec FR-021).
- **Mobile menu**: collapsed from first paint under `html.js` (avoids layout shift). The Menu control ships as `<a href="#nav-menu">` (works via `:target` if scripts fail) and `nav.js` swaps it for a `<button aria-expanded>`. Without scripting (`html.no-js`) links wrap in the bar.
- **Tests**: every e2e spec imports `test`/`expect` from `tests/helpers/fixtures.js`, which fails a test on any console error/warning or CSP violation (use the `expectedProblems` RegExp option for deliberate ones). Playwright's WebKit never Tabs to links, so Tab-order tests skip WebKit and use structural checks.
- **Hosting**: GitHub Pages via `.github/workflows/ci.yml` (`verify` job gates `deploy`).
- Dev tooling: Node.js 24 LTS.

## Commands

- `npm ci` — install dev tooling; then `npx playwright install --with-deps chromium firefox webkit`
- `npm start` — serve `src/` at http://localhost:8080; `npm run preview` — build and serve `dist/` at :8081
- `npm run format:check` / `npm run lint` (ESLint + Stylelint + html-validate)
- `npm run test:unit` — single file: `node --test tests/unit/theme.test.js`
- `npm run build` then `npm run test:e2e` (e2e runs against `dist/`, so rebuild after source changes) — single spec: `npx playwright test tests/e2e/nav-theme.spec.js --project=chromium`
- `npm run test:lighthouse` (uses local Chrome; set `CHROME_PATH` if none is installed), `npm run check:links`, `npm run check:static`
- `node tools/generate-images.mjs` — regenerate `og-image.png` and PNG icons after changing `tools/og-template.html` or `favicon.svg`
- `npm run verify` — the full CI gate; must pass before merge/deploy

## Spec-Driven Development workflow

All feature work is meant to flow through Spec Kit skills, available in `.claude/skills/` (mirrored for Copilot in `.github/skills/`):

1. `/speckit-constitution` — project principles in `.specify/memory/constitution.md` (v5.0.0: vanilla stack, four sections (Intro = greeting, biography, education, skills (no statement line), without contact links; Contact is the only home of the GitHub/LinkedIn links) incl. a static Interests list, single CSP-hashed theme bootstrap exception, mobile-first, warm palette, WCAG 2.2 AA, single-page scope, GitHub Pages budgets, privacy). Plans are checked against it.
2. `/speckit-specify <description>` — creates a numbered feature dir under `specs/` (sequential numbering) with `spec.md`, and records the active feature in `.specify/feature.json`.
3. `/speckit-clarify` — optional, resolves ambiguities in the spec.
4. `/speckit-plan` — produces the technical plan (tech stack decisions live here).
5. `/speckit-tasks` — breaks the plan into `tasks.md`.
6. `/speckit-analyze`, `/speckit-checklist` — optional consistency/quality checks.
7. `/speckit-implement` — executes the tasks.

The full cycle is also defined in `.specify/workflows/speckit/workflow.yml` with review gates after specify and plan.

## Spec Kit internals

- Helper scripts are **PowerShell** (`.specify/scripts/powershell/`); `common.ps1` holds shared path resolution. Skills invoke these scripts, so run them with PowerShell, not Bash.
- The active feature directory is resolved from `SPECIFY_FEATURE_DIRECTORY` env var, then `.specify/feature.json`. If a Spec Kit command can't find the feature, check these.
- Templates for specs/plans/tasks/checklists are in `.specify/templates/`.
- Files under `.claude/skills/speckit-*` and `.github/skills/speckit-*` are tracked by hash in `.specify/integrations/*.manifest.json` — they're managed by Spec Kit, so avoid hand-editing them.
