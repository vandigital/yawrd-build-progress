// Data/integrity QA only: this never executes Engine actions.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, relative } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const read = name => readFileSync(resolve(root, name), 'utf8');
const json = name => JSON.parse(read(name));
const digest = name => createHash('sha256').update(readFileSync(resolve(root, name))).digest('hex');
const integrity = json('BASELINE_INTEGRITY.json');
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (['node_modules', '.next', '.git', 'next-env.d.ts'].includes(entry.name) || entry.name.endsWith('.tsbuildinfo')) return [];
    const path = resolve(dir, entry.name);
    assert.ok(!entry.isSymbolicLink(), 'unexpected symlink: ' + path);
    return entry.isDirectory() ? files(path) : [relative(root, path)];
  });
}
assert.deepEqual(files(root).filter(n => n !== 'BASELINE_INTEGRITY.json').sort(), Object.keys(integrity.files).sort(), 'publication allowlist differs');
for (const [name, hash] of Object.entries(integrity.files)) assert.equal(digest(name), hash, name);
const review = json('PUBLIC_REVIEW.json');
for (const [name, hash] of Object.entries(review.preservedFiles)) assert.equal(digest(name), hash, 'approved input: ' + name);
const types = read('SKILL.md').match(/```ts\n([\s\S]*?)\n```/)[1];
assert.ok(read('shared/ww-v1.ts').includes(types), 'frozen type declarations drifted');
const tasks = json('TASKS.json'), fixtures = json('CONTRACT_FIXTURES.json');
assert.equal(tasks.contractVersion, 'ww-v1'); assert.equal(fixtures.contractVersion, 'ww-v1');
assert.deepEqual(tasks.tasks.map(t => t.id), ['T1', 'T2']);
assert.ok(Object.values(tasks.activation).every(v => v === null));
const ownership = tasks.tasks.flatMap(t => { assert.deepEqual(t.dependencies, []); return t.ownership; });
assert.equal(new Set(ownership).size, ownership.length);
function manifest(p) {
  assert.ok(Number.isInteger(p.rows) && Number.isInteger(p.cols) && Math.min(p.rows, p.cols) > 0);
  assert.ok(typeof p.id === 'string' && p.id.trim() && typeof p.title === 'string' && p.title.trim());
  assert.equal(p.letters.length, p.rows * p.cols); assert.ok(p.letters.every(c => /^[A-Z]$/.test(c)));
  const used = [], ids = new Set();
  for (const s of p.solutions) {
    assert.ok(typeof s.id === 'string' && s.id.trim() && !ids.has(s.id)); ids.add(s.id);
    assert.ok(/^[A-Z]+$/.test(s.word) && s.path.length > 0 && new Set(s.path).size === s.path.length);
    assert.ok(s.path.every(c => Number.isInteger(c) && c >= 0 && c < p.letters.length));
    assert.equal(s.path.map(c => p.letters[c]).join(''), s.word);
    for (let i = 1; i < s.path.length; i++) {
      const a = s.path[i - 1], b = s.path[i];
      assert.equal(Math.max(Math.abs(Math.floor(a / p.cols) - Math.floor(b / p.cols)), Math.abs(a % p.cols - b % p.cols)), 1);
    }
    used.push(...s.path);
  }
  assert.deepEqual(used.sort((a,b) => a-b), Array.from({length:p.letters.length}, (_,i) => i));
}
manifest(fixtures.puzzle);
let manifests = 1;
for (const name of readdirSync(resolve(root, 'puzzles')).filter(n => n.endsWith('.json'))) { manifest(json('puzzles/' + name)); manifests++; }
const negatives = [p => p.rows = 0, p => p.solutions[0].path[0] = 999, p => p.solutions[0].path[1] = p.solutions[0].path[0], p => p.solutions[0].word = 'FAIL', p => p.solutions.pop(), p => p.solutions.push({...p.solutions[0], id:'overlap'}), p => p.solutions = [{id:'wrap', word:'RC', path:[3,4]}]];
for (const mutate of negatives) { const p = structuredClone(fixtures.puzzle); mutate(p); assert.throws(() => manifest(p)); }
assert.equal(new Set(fixtures.vectors.map(v => v.id)).size, fixtures.vectors.length);
for (const v of fixtures.vectors) {
  assert.deepEqual(Object.keys(v.expected).sort(), ['selected','accepted','hint','complete','feedback'].sort());
  assert.ok(['idle','invalid-step','invalid-answer','accepted','hint'].includes(v.expected.feedback));
  for (const a of v.actions) assert.ok(['select','submit','hint','undo','restart'].includes(a.type));
}
console.log(`PASS: integrity allowlist (${Object.keys(integrity.files).length} files), approved input hashes/types, 2 independent task cards, ${fixtures.vectors.length} vector shapes, ${manifests} manifests, ${negatives.length} rejected negative manifests.`);
console.log('No engine replay, puzzle authoring or player/game behavior validated.');
