// Scripted testing infrastructure only. Does not inspect or solve puzzles.
import type { Action, Engine, State } from '../shared/ww-v1.ts';
export function scriptedEngine(initial: State, responses: readonly State[]) {
  const actions: Action[] = [];
  let cursor = 0;
  const engine: Engine = {
    initial: () => structuredClone(initial),
    reduce: (_puzzle, _state, action) => {
      if (cursor >= responses.length) throw Error('script-exhausted');
      actions.push(structuredClone(action));
      return structuredClone(responses[cursor++]);
    },
  };
  return { engine, actions };
}
