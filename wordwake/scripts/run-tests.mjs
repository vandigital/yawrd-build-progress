import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const track = process.argv[2];
if (!['t1', 't2'].includes(track)) throw Error('expected t1 or t2');
function find(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory()
    ? find(resolve(dir, e.name)) : /\.test\.(ts|tsx|mjs)$/.test(e.name) ? [resolve(dir, e.name)] : []);
}
const tests = [track === 't1' ? 'baseline-tests/t1.test.ts' : 'baseline-tests/t2.test.tsx',
  ...find(track === 't1' ? 'engine-tests' : 'player-tests')];
const result = spawnSync(process.execPath, ['--import', './scripts/register-tsx.mjs', '--test', ...tests], {stdio:'inherit'});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
