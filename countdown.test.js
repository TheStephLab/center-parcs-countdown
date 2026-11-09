import { test } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';
import { getCountdown, getUnits } from './countdown.js';

test('shows total hours or days and remaining hours', () => {
  const countdown = getCountdown(1000 * (49 * 3600 + 2 * 60 + 3), 0);
  deepStrictEqual(getUnits(countdown, false), [['hours', 49], ['minutes', 2], ['seconds', 3]]);
  deepStrictEqual(getUnits(countdown, true), [['days', 2], ['hours', 1], ['minutes', 2]]);
});

test('rounds up partial seconds and stops at zero', () => {
  strictEqual(getCountdown(1001, 1000).seconds, 1);
  strictEqual(getCountdown(1000, 1000).ended, true);
  deepStrictEqual(getCountdown(1000, 2000), { ended: true, hours: 0, minutes: 0, seconds: 0, days: 0, dayHours: 0 });
});

test('UK winter dates are 10:00 UTC, three days apart', () => {
  const arrival = Date.parse('2026-12-07T10:00:00Z');
  const second = Date.parse('2026-12-10T10:00:00Z');
  strictEqual(second - arrival, 3 * 24 * 60 * 60 * 1000);
  strictEqual(getCountdown(second, arrival).hours, 72);
});
