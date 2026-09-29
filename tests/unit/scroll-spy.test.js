import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickActiveSection } from '../../src/js/scroll-spy.js';

const entry = (id, top, isIntersecting = true) => ({
  target: { id },
  isIntersecting,
  boundingClientRect: { top },
});

test('no entries or none intersecting → no active section', () => {
  assert.equal(pickActiveSection([]), null);
  assert.equal(pickActiveSection([entry('about', 10, false)]), null);
});

test('the intersecting section with the smallest non-negative top wins', () => {
  assert.equal(pickActiveSection([entry('about', 250), entry('experience', 40)]), 'experience');
  assert.equal(pickActiveSection([entry('about', -300), entry('experience', 120)]), 'experience');
});

test('when every intersecting section started above, the latest one wins', () => {
  assert.equal(pickActiveSection([entry('about', -900), entry('experience', -20)]), 'experience');
});

test('non-intersecting entries are ignored', () => {
  assert.equal(pickActiveSection([entry('about', 5, false), entry('projects', 200)]), 'projects');
});
