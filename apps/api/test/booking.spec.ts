import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addMinutes, overlaps } from '../src/modules/common/date.utils';

describe('booking domain rules', () => {
  it('detects overlap correctly', () => {
    const aStart = new Date('2026-06-08T11:00:00.000Z');
    const aEnd = new Date('2026-06-08T11:15:00.000Z');
    const bStart = new Date('2026-06-08T11:10:00.000Z');
    const bEnd = new Date('2026-06-08T11:25:00.000Z');
    assert.equal(overlaps(aStart, aEnd, bStart, bEnd), true);
  });

  it('adds duration to slot end', () => {
    const start = new Date('2026-06-08T11:00:00.000Z');
    assert.equal(addMinutes(start, 30).toISOString(), '2026-06-08T11:30:00.000Z');
  });
});
