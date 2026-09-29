# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Single-page personal portfolio for Aseel Almanahy, scaffolded with **GitHub Spec Kit** (v1.0.13.dev0). Active feature: `specs/001-portfolio-website` — spec, clarifications, and plan are done; application code does not exist yet (it is created by Implementation Phase 1 of `plan.md`).

The repo is not yet a git repository (step P1.1 of the plan initialises it with branch `001-portfolio-website`).

## Stack (decided in `specs/001-portfolio-website/plan.md`)

- **Shipped site**: hand-written HTML5, CSS3 (custom-property tokens, `@layer`, BEM), native ES modules. No runtime dependencies, frameworks, TypeScript, or preprocessors (constitution Principle I).
- **Layout**: `src/` is the deployable root and is served as-is in development; `tools/build.mjs` writes the production build to `dist/` (bundled/minified CSS, `?v=` cache-busting). Tests in `tests/unit` (node:test) and `tests/e2e` (Playwright + axe); dev scripts in `tools/`.
- **Only CSS/JS file allowed to contain colour literals**: `src/css/tokens.css` (Stylelint enforces; print colours live there too). JS reads colours via `getComputedStyle`.
- **Inline `<head>` theme bootstrap** (the only inline script the constitution allows; must stay < 1 KB) is protected by a CSP hash — after editing it, run `node tools/check-csp.mjs --write`.
- `[hidden]` is forced to `display: none !important` in `utilities.css`; JS-only controls ship `hidden`.
- **Hosting**: GitHub Pages via `.github/workflows/ci.yml` (`verify` job gates `deploy`).
- Dev tooling: Node.js 24 LTS.

## Commands (available after Implementation Phase 1)

- `npm ci` — install dev tooling; then `npx playwright install --with-deps chromium firefox webkit`
- `npm start` — serve `src/` at http://localhost:8080; `npm run preview` — build and serve `dist/` at :8081
- `npm run format:check` / `npm run lint` (ESLint + Stylelint + html-validate)
- `npm run test:unit` — single file: `node --test tests/unit/theme.test.js`
- `npm run build` then `npm run test:e2e` — single spec: `npx playwright test tests/e2e/nav-theme.spec.js --project=chromium`
- `npm run test:lighthouse`, `npm run check:links`, `npm run check:static`
- `npm run verify` — the full CI gate; must pass before merge/deploy

## Spec-Driven Development workflow

All feature work is meant to flow through Spec Kit skills, available in `.claude/skills/` (mirrored for Copilot in `.github/skills/`):

1. `/speckit-constitution` — project principles in `.specify/memory/constitution.md` (v2.1.0: vanilla stack, single CSP-hashed theme bootstrap exception, mobile-first, warm palette, WCAG 2.2 AA, single-page scope, GitHub Pages budgets, privacy). Plans are checked against it.
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
