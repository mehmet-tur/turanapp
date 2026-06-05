import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('auth validation rules', () => {
  it('rejects weak password', () => {
    const weakPassword = 'weakpass';
    const valid =
      weakPassword.length >= 10 &&
      /[A-Z]/.test(weakPassword) &&
      /[a-z]/.test(weakPassword) &&
      /[0-9]/.test(weakPassword) &&
      /[^A-Za-z0-9]/.test(weakPassword);
    assert.equal(valid, false);
  });
});
