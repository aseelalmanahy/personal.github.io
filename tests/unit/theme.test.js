import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextTheme, resolveEffectiveTheme } from '../../src/js/theme.js';

test('a saved choice wins over the device preference', () => {
  assert.equal(resolveEffectiveTheme('light', true), 'light');
  assert.equal(resolveEffectiveTheme('dark', false), 'dark');
});

test('with nothing saved, the device preference applies', () => {
  assert.equal(resolveEffectiveTheme(null, true), 'dark');
  assert.equal(resolveEffectiveTheme(null, false), 'light');
});

test('an unrecognised saved value is ignored', () => {
  assert.equal(resolveEffectiveTheme('bogus', true), 'dark');
  assert.equal(resolveEffectiveTheme('bogus', false), 'light');
});

test('nextTheme flips between the two themes', () => {
  assert.equal(nextTheme('light'), 'dark');
  assert.equal(nextTheme('dark'), 'light');
});
