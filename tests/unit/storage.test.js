import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPreference, writePreference } from '../../src/js/storage.js';

const memoryStore = () => {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
  };
};

const throwingStore = {
  getItem() {
    throw new Error('SecurityError');
  },
  setItem() {
    throw new Error('QuotaExceededError');
  },
};

test('reads a stored value', () => {
  const store = memoryStore();
  store.setItem('theme', 'dark');
  assert.equal(readPreference('theme', store), 'dark');
});

test('returns null for a missing key', () => {
  assert.equal(readPreference('theme', memoryStore()), null);
});

test('returns null when storage throws', () => {
  assert.equal(readPreference('theme', throwingStore), null);
});

test('returns null when storage is unavailable', () => {
  assert.equal(readPreference('theme', undefined), null);
});

test('writes and reports success', () => {
  const store = memoryStore();
  assert.equal(writePreference('theme', 'light', store), true);
  assert.equal(store.getItem('theme'), 'light');
});

test('reports failure instead of throwing', () => {
  assert.equal(writePreference('theme', 'light', throwingStore), false);
  assert.equal(writePreference('theme', 'light', undefined), false);
});
