import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Puzzle, State } from '../shared/ww-v1.ts';
test('T1 can read the frozen vectors without player files', () => {
  const fixtures = JSON.parse(readFileSync(new URL('../CONTRACT_FIXTURES.json', import.meta.url), 'utf8'));
  const puzzle: Puzzle = fixtures.puzzle;
  const expected: State[] = fixtures.vectors.map((v: { expected: State }) => v.expected);
  assert.equal(fixtures.contractVersion, 'ww-v1');
  assert.equal(puzzle.letters.length, puzzle.rows * puzzle.cols);
  assert.ok(expected.some(state => state.complete));
});
