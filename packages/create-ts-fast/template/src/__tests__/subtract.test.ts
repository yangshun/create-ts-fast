import { expect, test } from 'vitest';
import { subtract } from '../subtract';

test('subtract', () => {
  expect(subtract(3, 2)).toBe(1);
});
