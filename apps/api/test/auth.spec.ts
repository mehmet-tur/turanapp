import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { registerSchema } from '@celebrity-call/shared';

describe('auth validation rules', () => {
  it('rejects weak password', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'weakpass',
      firstName: 'A',
      lastName: 'B',
      consents: [
        { type: 'TERMS_OF_SERVICE', version: '2026-06-05', accepted: true },
        { type: 'PRIVACY_POLICY', version: '2026-06-05', accepted: true },
      ],
    });
    assert.equal(result.success, false);
  });
});
