import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { scriptedEngine } from '../test-support/scripted-engine.ts';
import type { State } from '../shared/ww-v1.ts';
test('T2 can render React and script fixture states without an engine implementation', () => {
  const fixtures = JSON.parse(readFileSync(new URL('../CONTRACT_FIXTURES.json', import.meta.url), 'utf8'));
  const initial: State = { selected: [], accepted: [], hint: null, complete: false, feedback: 'idle' };
  const responses: State[] = fixtures.vectors.map((v: { expected: State }) => v.expected);
  const { engine, actions } = scriptedEngine(initial, responses);
  let state = engine.initial(fixtures.puzzle);
  for (const expected of responses) {
    state = engine.reduce(fixtures.puzzle, state, { type: 'hint' });
    assert.deepEqual(state, expected);
    assert.match(renderToStaticMarkup(<output>{state.feedback}</output>), /<output>/);
  }
  assert.equal(actions.length, responses.length);
  assert.throws(() => engine.reduce(fixtures.puzzle, state, { type: 'hint' }), /script-exhausted/);
});
