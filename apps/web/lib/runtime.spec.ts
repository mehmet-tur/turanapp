import test from 'node:test';
import assert from 'node:assert/strict';
import { getWebBaseUrl, normalizeBaseUrl } from './runtime';

test('normalizeBaseUrl sondaki slash karakterini kaldırır', () => {
  assert.equal(normalizeBaseUrl('http://localhost:3000/'), 'http://localhost:3000');
});

test('getWebBaseUrl varsayılan adresi döner', () => {
  assert.equal(getWebBaseUrl(), 'http://localhost:3000');
});
