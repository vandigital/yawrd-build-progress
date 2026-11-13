// Frozen type declarations extracted verbatim from approved SKILL.md. No engine implementation.
type Puzzle = {
  id: string; title: string; rows: number; cols: number;
  letters: readonly string[];
  solutions: readonly { id: string; word: string; path: readonly number[] }[];
};
type Feedback = 'idle' | 'invalid-step' | 'invalid-answer' | 'accepted' | 'hint';
type State = {
  selected: readonly number[];
  accepted: readonly string[]; // solution IDs, acceptance order
  hint: { solutionId: string; cell: number } | null;
  complete: boolean;
  feedback: Feedback;
};
type Action = { type: 'select'; cell: number }
  | { type: 'submit' } | { type: 'hint' }
  | { type: 'undo' } | { type: 'restart' };
type Engine = {
  initial(puzzle: Puzzle): State;
  reduce(puzzle: Puzzle, state: State, action: Action): State;
};
// T1 exports `engine: Engine` plus the above types.
// T2 exports WordWakePlayer(props: { puzzles: readonly Puzzle[]; engine: Engine }).
// No singleton, DOM, network, storage, React or wallet required by Engine.
export type { Puzzle, Feedback, State, Action, Engine };
