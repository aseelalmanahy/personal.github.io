# Tasks: Unified Section Spacing

**Feature**: [spec.md](spec.md) · **Plan**: [plan.md](plan.md)

- [X] T001 Measure the baseline gaps at 320/375/768/1024/1440 (recorded in spec and plan)
- [X] T002 [US1] Add `tests/e2e/spacing.spec.js` (equal gaps, bounds, token use, 404); confirm all 7 fail
- [X] T003 [US1] Add `--section-spacing-vertical` to `src/css/tokens.css` (replacing `--space-section`); apply it in `src/css/layout.css` (sections top-only, last section bottom, `.not-found`); remove the Intro override in `src/css/components/hero.css`
- [X] T004 Per-change review: full-page captures at 320/375/768/1024/1440 in both themes
- [X] T005 Run `npm run verify` (exit 0, Lighthouse 1.00 ×4); record gates; update `CLAUDE.md`
- [X] T006 Merge to `main`, push, and confirm the live deploy
