# Data Model: Personal Portfolio Website

**Feature**: `specs/001-portfolio-website` | **Date**: 2026-09-29 | **Plan**: [plan.md](plan.md)

There is no database or data file. Every content entity is authored directly as semantic HTML in
`src/index.html` (Principle V: content lives in HTML). This document defines each entity's
fields, validation rules, and where it lives in the markup; the exact markup patterns are in
[contracts/content-blocks.md](contracts/content-blocks.md). Client-side UI state is modelled at
the end.

## Content entities

### Profile

| Field | Value / rule | Rendered in |
|---|---|---|
| `displayName` | "Aseel" | intro `h1` greeting "Hi, I'm Aseel." |
| `fullName` | "Aseel Almanahy" | `<title>`, brand link, OG tags, JSON-LD, footer |
| `statement` | "Full Stack Software Engineer specializing in scalable systems, robust architectures, and engineering mentorship." — verbatim | meta/OG description and JSON-LD only; not shown on the page (FR-004, amendment 2026-09-30) |
| `intro` | The owner's approved text in spec FR-008, verbatim (3 sentences) | intro biography paragraph (directly below the greeting) |

**Validation**: greeting and meta description match the spec byte-for-byte, and the statement is absent from visible text (checked by e2e);
`intro` matches FR-008 verbatim (checked by e2e); no `CONTENT:` placeholder at launch.

### ContactLink

| Field | Rule |
|---|---|
| `type` | `github` \| `linkedin` — Contact only, order LinkedIn (primary), GitHub (FR-021, FR-042) |
| `label` | Visible text: "Connect on LinkedIn", "GitHub profile" |
| `href` | `https://github.com/aseelalmanahy`, `https://www.linkedin.com/in/aseel-almanahy-97342b109/` (FR-006); no `mailto:` (email removed 2026-09-30) |
| `opensNewTab` | always `true` |

**Validation**: new-tab links carry `target="_blank"`, `rel="noopener noreferrer"`, and a
visible or visually-hidden "(opens in a new tab)" (FR-006); no `mailto:` link or email address anywhere (FR-021); each route appears exactly once, in Contact (2 links total, FR-042); the intro has none (FR-005).

### EducationEntry

| Field | Rule |
|---|---|
| `degree` | "Bachelor of Science" \| "Master of Business Administration" |
| `field` | "Computer Science" \| "Project Management" |
| `institution` | "University of Massachusetts Lowell" \| "Louisiana State University Shreveport" |
| `status` | `completed` \| `candidate` — shown as text ("Candidate" / "In progress" for the MBA) |

**Validation**: exactly two entries (FR-009); status is text, not colour.

### SkillCategory

| Field | Rule |
|---|---|
| `name` | "Languages" \| "Frameworks & Security" \| "Cloud & DevOps" \| "Quality & Methodology" |
| `skills` | Ordered list, exactly as in spec FR-010 (6 + 8 + 6 + 8 = 28 items) |

**Validation**: four categories, each a heading followed by a `ul` (FR-010); no proficiency
ratings.

### ExperienceNarrative *(replaces TimelineEntry, amendment 2026-09-30)*

| Field | Rule |
|---|---|
| `text` | The owner's paragraph in spec FR-011, verbatim (5 sentences; corrected 2026-09-30) |

**Validation**:
- Exactly one paragraph inside `#experience` besides the section heading (FR-012); no `ol`,
  `ul`, `time`, `article`, or per-role headings; no month/year dates; no employer or program
  names — the owner's university is the only organization named (FR-012, FR-014) — enforced by the `privacy-scope` and `about-experience` e2e specs.
- Written privacy review recorded before publication (FR-015).

### Interest *(amendment 2026-09-30)*

| Field | Rule |
|---|---|
| `label` | One of: Cooking, Reading Books, Weightlifting, Cycling, Skiing — exactly these five, in this order (FR-037) |
| `icon` | Decorative inline SVG, hidden from assistive technology, drawn with `currentColor` (FR-039) |

**Validation**: rendered as `ul > li` (FR-038); no links, controls, or motion (FR-040).

### Project *(removed 2026-09-30)*

The Projects section was removed (constitution v3.0.0); there are no project entities.

### ComingSoonCard *(removed 2026-09-30)*

Removed together with the Projects section.

## Client-side UI state

All UI state lives in DOM attributes (see [contracts/behaviour.md](contracts/behaviour.md)); the
only persisted value is the theme preference.

### ThemePreference (persisted)

| Field | Values | Storage |
|---|---|---|
| `saved` | `"light"` \| `"dark"` \| absent | `localStorage["theme"]` |
| `effective` | `light` \| `dark` | `html[data-theme]` if saved, else device `prefers-color-scheme` |

```text
            first visit
 [follow device] ──────────────▶ effective = device preference
       │   ▲                      (device change → effective follows)
 toggle│   │ (no path back — two-state toggle, FR-030)
       ▼   │
 [saved: light] ◀── toggle ──▶ [saved: dark]
```

Rules: toggling always writes the opposite of the current **effective** theme; a device-setting
change updates `effective` only while `saved` is absent; if storage throws, `saved` lives in
memory for the visit only.

### MenuState (phones, < 48em)

`collapsed` ⇄ `expanded` via the Menu button; `expanded` → `collapsed` on Escape (focus returns to
the button), on choosing a link, or on widening past the breakpoint. Exposed as
`aria-expanded`.

### ActiveSection

At most one nav link has `aria-current="true"` — the section whose top has crossed below the nav
bar and which occupies the upper part of the viewport; none while the intro is in view.
