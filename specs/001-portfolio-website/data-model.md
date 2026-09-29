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
| `displayName` | "Aseel" | hero `h1` greeting "Hi, I'm Aseel." |
| `fullName` | "Aseel Almanahy" | `<title>`, brand link, OG tags, JSON-LD, footer |
| `statement` | "Full Stack Software Engineer specializing in scalable systems, robust architectures, and engineering mentorship." — verbatim (FR-004) | hero paragraph, meta/OG description |
| `intro` | 2–4 sentences, first person, warm tone (FR-008) — **content input** | About Me paragraph |

**Validation**: greeting and statement match the spec byte-for-byte (checked by e2e);
`intro` sentence count 2–4; no `CONTENT:` placeholder at launch.

### ContactLink

| Field | Rule |
|---|---|
| `type` | `github` \| `linkedin` \| `email` — exactly these three, in this order (FR-005, FR-022a) |
| `label` | Visible text: "GitHub", "LinkedIn", "Email" (hero); descriptive in Contact section (e.g. "GitHub profile") |
| `href` | `https://github.com/<user>`, `https://www.linkedin.com/in/<user>`, `mailto:<address>` — **content inputs** |
| `opensNewTab` | `true` for github/linkedin, `false` for email |

**Validation**: new-tab links carry `target="_blank"`, `rel="noopener noreferrer"`, and a
visible or visually-hidden "(opens in a new tab)" (FR-006); email `href` uses the same address
shown as text (FR-021); each appears once in the hero and once in Contact (6 links total).

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
| `name` | "Languages" \| "Tools/Frameworks" |
| `skills` | Ordered list. Languages: Java, C/C++, SQL, Python. Tools/Frameworks: Git, SpringBoot, Angular, AWS |

**Validation**: two categories, each a heading followed by a `ul` (FR-010); no proficiency
ratings.

### TimelineEntry

| Field | Rule |
|---|---|
| `id` | kebab-case slug, unique (e.g. `role-fse`), used for `aria-labelledby` |
| `title` | One of: Full Stack Software Engineer; Associate Full Stack Software Engineer; Leap to Lead Reverse Mentor; LEAP Program Mentor (FR-011) |
| `organization` | "Fidelity Investments" |
| `category` | `engineering` \| `leadership` — Engineering: the two engineer titles; Leadership: the two mentor titles |
| `start` | `YYYY-MM` (machine) / "Mon YYYY" (display) — **content input** |
| `end` | `YYYY-MM` / "Mon YYYY", or `present` → display "Present" — **content input** |

**Validation**:
- Exactly four entries; no other fields — no description, bullets, team, system, tool, or
  metric text (FR-013, FR-014); enforced by the `privacy-scope` e2e spec, which asserts each
  entry contains only title, organisation, dates, and category.
- `start ≤ end` when `end` is a date.
- **Ordering**: by `start` descending; ties broken with `engineering` before `leadership`
  (edge case "Overlapping or ongoing roles").
- Written privacy review recorded before publication (FR-015).

### Project

| Field | Rule |
|---|---|
| `title` | Required, ≤ 60 characters |
| `description` | Required, ≤ 200 characters (FR-017) |
| `tags` | ≥ 1 short technology names (e.g. HTML, CSS, JS) |
| `repoUrl` | Optional absolute URL; omitted link when absent (FR-018) |
| `demoUrl` | Optional absolute URL; omitted link when absent (FR-018) |

**Validation**: link labels include the project title (FR-017); no `#`, empty, or placeholder
hrefs (SC-010). Zero projects at launch.

### ComingSoonCard

| Field | Rule |
|---|---|
| `heading` | e.g. "More projects coming soon" |
| `message` | One friendly sentence, e.g. "New projects are on the way — follow along on GitHub." |
| `githubUrl` | Optional; same URL as the GitHub ContactLink |

**Validation**: present **iff** the number of Project entries is 0 (FR-020); has no tags, no
sample titles, no demo link.

## Section-level state

**ProjectsSection**: `empty` (0 projects → exactly one ComingSoonCard) → `populated` (≥ 1
project → no ComingSoonCard). Transition happens by editing HTML: add the first project card
and delete the coming-soon card in the same change. The grid layout is identical in both states
(FR-019, US3 scenario 5).

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

### CopyStatus

`idle` → (click) → `success` ("Copied!") | `error` ("Couldn't copy — please select the address
above") → (4s) → `idle`. A new click during `success`/`error` restarts the timer.

### RevealState (per timeline entry)

`shown` (default; no attribute) | `pending` → `visible`. Only entries below the viewport at init,
with motion allowed and `IntersectionObserver` available, enter `pending`. No path leaves an entry
in `pending` once it intersects.

### ActiveSection

At most one nav link has `aria-current="true"` — the section whose top has crossed below the nav
bar and which occupies the upper part of the viewport; none while the hero is in view.
