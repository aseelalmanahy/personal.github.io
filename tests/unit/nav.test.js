import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shouldCollapse } from '../../src/js/nav.js';

test('the menu collapses below 48em', () => {
  assert.equal(shouldCollapse(20), true);
  assert.equal(shouldCollapse(47.99), true);
});

test('the menu is inline from 48em', () => {
  assert.equal(shouldCollapse(48), false);
  assert.equal(shouldCollapse(90), false);
});
