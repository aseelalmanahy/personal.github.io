import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../../src/css/tokens.css', import.meta.url), 'utf8');

/** Returns the declarations inside the first `selector { … }` block matching `pattern`. */
function block(pattern) {
  const match = css.match(pattern);
  assert.ok(match, `block not found: ${pattern}`);
  return Object.fromEntries(
    [...match[1].matchAll(/(--color-[\w-]+)\s*:\s*(#[0-9a-f]{6})\b/gi)].map(([, name, value]) => [
      name,
      value.toLowerCase(),
    ]),
  );
}

const light = block(/^:root\s*\{([^}]*)\}/m);
const darkByMedia = block(/:root:not\(\[data-theme=['"]light['"]\]\)\s*\{([^}]*)\}/);
const darkByAttribute = block(/^:root\[data-theme=['"]dark['"]\]\s*\{([^}]*)\}/m);
// Both selectors have specificity (0,2,0) so, placed last, they beat the dark-theme rules in print.
const print = block(
  /@media print\s*\{\s*:root:not\(\[data-theme\]\),\s*:root\[data-theme\]\s*\{([^}]*)\}/,
);

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

// Research R-09: [foreground token, background token, minimum ratio].
const PAIRS = [
  ['--color-text', '--color-surface', 4.5],
  ['--color-text-muted', '--color-surface', 4.5],
  ['--color-accent', '--color-surface', 4.5],
  ['--color-on-accent', '--color-accent-bg', 4.5],
  ['--color-tag-text', '--color-tag-bg', 4.5],
  ['--color-focus', '--color-surface', 3],
  ['--color-border', '--color-surface', 3],
  ['--color-accent-bg', '--color-surface', 3],
];

for (const [theme, tokens] of [
  ['light', light],
  ['dark', darkByAttribute],
]) {
  for (const [fg, bg, min] of PAIRS) {
    for (const background of new Set([bg, bg === '--color-surface' ? '--color-bg' : bg])) {
      test(`${theme}: ${fg} on ${background} ≥ ${min}:1`, () => {
        const ratio = contrast(tokens[fg], tokens[background]);
        assert.ok(ratio >= min, `${ratio.toFixed(2)}:1 < ${min}:1`);
      });
    }
  }
}

test('both dark-theme blocks declare identical colours', () => {
  assert.deepEqual(darkByMedia, darkByAttribute);
});

test('print block re-declares exactly the light colours', () => {
  assert.deepEqual(print, light);
});
