import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCallRoomUrl, extractErrorMessage } from './api';

test('buildCallRoomUrl varsayılan web url ile çalışır', () => {
  assert.equal(buildCallRoomUrl('booking-123'), 'http://localhost:3000/call/booking-123');
});

test('extractErrorMessage iç içe hata mesajını okur', () => {
  assert.equal(extractErrorMessage({ error: { message: 'Özel hata' } }), 'Özel hata');
});

test('extractErrorMessage fallback döner', () => {
  assert.equal(extractErrorMessage(null, 'Varsayılan'), 'Varsayılan');
});
