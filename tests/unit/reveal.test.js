import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBelowViewport, shouldReveal } from '../../src/js/reveal.js';

test('animates only with an observer and motion allowed', () => {
  assert.equal(shouldReveal({ hasObserver: true, prefersReducedMotion: false }), true);
  assert.equal(shouldReveal({ hasObserver: false, prefersReducedMotion: false }), false);
  assert.equal(shouldReveal({ hasObserver: true, prefersReducedMotion: true }), false);
});

test('only entries starting below the viewport count as below it', () => {
  assert.equal(isBelowViewport(900, 800), true);
  assert.equal(isBelowViewport(800, 800), true);
  assert.equal(isBelowViewport(799, 800), false);
  assert.equal(isBelowViewport(-50, 800), false);
});
