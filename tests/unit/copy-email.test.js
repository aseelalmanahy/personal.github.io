import { test } from 'node:test';
import assert from 'node:assert/strict';
import { copyText, statusMessage } from '../../src/js/copy-email.js';

test('resolves success and passes the text to the clipboard', async () => {
  const written = [];
  const clipboard = { writeText: async (text) => written.push(text) };
  assert.equal(await copyText('a@b.c', clipboard), 'success');
  assert.deepEqual(written, ['a@b.c']);
});

test('resolves error when the clipboard rejects', async () => {
  const clipboard = {
    writeText: async () => {
      throw new Error('NotAllowedError');
    },
  };
  assert.equal(await copyText('a@b.c', clipboard), 'error');
});

test('resolves error when there is no clipboard', async () => {
  assert.equal(await copyText('a@b.c', undefined), 'error');
});

test('status messages', () => {
  assert.equal(statusMessage('success'), 'Copied!');
  assert.equal(statusMessage('error'), "Couldn't copy — please select the address above");
});
