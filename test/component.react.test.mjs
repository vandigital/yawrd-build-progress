// Codex-authored integration tests. Uses genuine React and React DOM SSR.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ProjectProgress } from '../.test-build/components/ProjectProgress.js';
import { SYNTHETIC_NOTICE, assertProjectProgressData } from '../.test-build/contracts/build-progress/contract.js';
import { syntheticProjectProgress as populated, syntheticEmptyProjectProgress as empty } from '../.test-build/contracts/build-progress/fixtures.js';

const render = data => renderToStaticMarkup(createElement(ProjectProgress, { data }));
const clone = () => structuredClone(populated);
const escape = text => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[c]));
const section = (html, label) => {
  const found = html.match(new RegExp(`<section[^>]*><h2[^>]*>${label}</h2>(.*?)</section>`));
  assert.ok(found, `Missing section ${label}`);
  return found[1];
};
const labels = { not_started: 'Not started', in_progress: 'In progress', blocked: 'Blocked', completed: 'Completed' };

test('reviewed component and accepted public contract/fixtures match recorded checksums', () => {
  for (const [path, hash] of [
    ['components/ProjectProgress.tsx', 'bcf7fd9e2c8256fae77d5f3d2250da59c3948bd8de245e4bd9fc7c14049c9c8a'],
    ['contracts/build-progress/contract.ts', '755754f8d54f136409797d5a1697b7eb96936d06fa08577b6e2f975826b50bd4'],
    ['contracts/build-progress/fixtures.ts', '3d9717b119237f6b811de2a779b0ce38071d1ae4188b9ae5008e3804c7761821'],
  ]) assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), hash);
});

test('populated fixture: all titles/status labels and supplied order in both lists', () => {
  const html = render(populated);
  assert.match(html, /role="region" aria-label="Project Progress"/);
  for (const [heading, entries] of [['Milestones', populated.milestones], ['Tasks', populated.tasks]]) {
    const part = section(html, heading);
    let last = -1;
    for (const entry of entries) {
      const position = part.indexOf(escape(entry.title));
      assert.ok(position > last);
      last = position;
      assert.match(part, new RegExp(`>${labels[entry.status]}</span> ${escape(entry.title)}`));
    }
    assert.equal((part.match(/<li /g) ?? []).length, 4);
  }
  writeFileSync('.test-build/populated.react.html', '<!doctype html><meta charset="utf-8"><title>Task A synthetic verification</title>' + html);
});

for (let mask = 0; mask < 8; mask++) {
  test(`independently empty collections mask=${mask}`, () => {
    const data = mask === 7 ? empty : { ...populated, milestones: mask & 1 ? [] : populated.milestones, tasks: mask & 2 ? [] : populated.tasks, recentActivity: mask & 4 ? [] : populated.recentActivity };
    const html = render(data);
    for (const [bit, heading, message, sample] of [
      [1, 'Milestones', 'No published milestones yet', populated.milestones[0].title],
      [2, 'Tasks', 'No public tasks yet', populated.tasks[0].title],
      [4, 'Recent Activity', 'No accepted activity published yet', populated.recentActivity[0].summary],
    ]) {
      const part = section(html, heading);
      assert.equal(part.includes(message), Boolean(mask & bit));
      assert.equal(part.includes(sample), !Boolean(mask & bit));
    }
    if (mask === 7) writeFileSync('.test-build/empty.react.html', '<!doctype html><meta charset="utf-8"><title>Task A synthetic verification</title>' + html);
  });
}

test('exact disclosure once and before content for both synthetic fixtures', () => {
  for (const data of [populated, empty]) {
    const html = render(data);
    assert.equal(html.split(escape(SYNTHETIC_NOTICE)).length - 1, 1);
    assert.ok(html.indexOf(escape(SYNTHETIC_NOTICE)) < html.indexOf('<section'));
  }
  const { notice, ...rest } = empty;
  assert.ok(!render({ ...rest, dataKind: 'published' }).includes(escape(SYNTHETIC_NOTICE)));
});

test('accepted dates remain exact and activity retains supplied order, including ties', () => {
  const data = clone();
  data.recentActivity = [
    { id: 'synthetic-tie-z', summary: 'Synthetic first tie', acceptedOn: '2000-03-01' },
    { id: 'synthetic-tie-a', summary: 'Synthetic second tie', acceptedOn: '2000-03-01' },
    { id: 'synthetic-leap', summary: 'Synthetic leap day', acceptedOn: '2000-02-29' },
  ];
  for (const snapshot of [populated, data]) {
    const part = section(render(snapshot), 'Recent Activity');
    const items = [...part.matchAll(/<li[^>]*>(.*?)<\/li>/g)].map(m => m[1]);
    assert.equal(items.length, snapshot.recentActivity.length);
    items.forEach((item, i) => {
      assert.ok(item.includes(escape(snapshot.recentActivity[i].summary)));
      assert.ok(item.includes(`Accepted on ${snapshot.recentActivity[i].acceptedOn}`));
    });
  }
});

test('only supplied HTTPS link, accessible destination label and protected new tab', () => {
  const html = render(populated);
  const links = [...html.matchAll(/<a\b([^>]*)>(.*?)<\/a>/g)];
  assert.equal(links.length, 1);
  assert.ok(links[0][1].includes(`href="${populated.recentActivity[0].link}"`));
  assert.equal(links[0][2], populated.recentActivity[0].link);
  assert.match(links[0][1], /target="_blank"/);
  assert.match(links[0][1], /rel="noopener noreferrer"/);
  const data = clone();
  data.recentActivity = data.recentActivity.map(({ link, ...rest }) => rest);
  assert.doesNotMatch(render(data), /<a\b/);
  assert.doesNotMatch(render(empty), /<a\b/);
});

test('actual React HTML escaping for titles and activity summaries', () => {
  const hostile = '<script>alert("synthetic")</script> & <img src=x onerror=\'synthetic\'>';
  const data = clone();
  data.milestones[0].title = hostile;
  data.tasks[0].title = hostile;
  data.recentActivity[0].summary = hostile;
  const html = render(data);
  assert.equal(html.split(escape(hostile)).length - 1, 3);
  assert.ok(!html.includes(hostile));
  assert.doesNotMatch(html, /<(script|img|iframe)\b/i);
});

test('React escapes allowed special characters in supplied HTTPS href and label', () => {
  const data = clone();
  const link = 'https://example.invalid/synthetic/<tag>&"\'';
  data.recentActivity[0].link = link;
  assertProjectProgressData(data);
  const html = render(data);
  assert.ok(html.includes(`href="${escape(link)}"`));
  assert.ok(html.includes(`>${escape(link)}</a>`));
});

const invalid = [
  ['null', () => null],
  ['missing fields', () => ({})],
  ['extra field', () => ({ ...clone(), privateField: 'REJECTED_SYNTHETIC_VALUE' })],
  ['wrong schema', () => ({ ...clone(), schemaVersion: 2 })],
  ['wrong notice', () => ({ ...clone(), notice: 'REJECTED_SYNTHETIC_VALUE' })],
  ['missing notice', () => { const { notice, ...rest } = clone(); return rest; }],
  ['unknown status', () => ({ ...clone(), tasks: [{ ...populated.tasks[0], status: 'REJECTED_SYNTHETIC_VALUE' }] })],
  ['duplicate id', () => ({ ...clone(), tasks: [populated.tasks[0], populated.tasks[0]] })],
  ['blank title', () => ({ ...clone(), milestones: [{ ...populated.milestones[0], title: ' ' }] })],
  ['overlong title', () => ({ ...clone(), tasks: [{ ...populated.tasks[0], title: 'x'.repeat(121) }] })],
  ['control character', () => ({ ...clone(), tasks: [{ ...populated.tasks[0], title: 'synthetic\nvalue' }] })],
  ['sparse array', () => ({ ...clone(), tasks: Array(1) })],
  ['invalid date', () => ({ ...clone(), recentActivity: [{ ...populated.recentActivity[0], acceptedOn: '2001-02-29' }] })],
  ['bad date format', () => ({ ...clone(), recentActivity: [{ ...populated.recentActivity[0], acceptedOn: '2000-1-03' }] })],
  ['wrong date order', () => ({ ...clone(), recentActivity: [...populated.recentActivity].reverse() })],
  ['getter', () => Object.defineProperty(clone(), 'notice', { enumerable: true, get() { throw new Error('REJECTED_SYNTHETIC_VALUE'); } })],
];
for (const link of ['javascript:REJECTED_SYNTHETIC_VALUE', 'http://example.invalid/synthetic', 'https://user:pass@example.invalid/synthetic', 'https://example.invalid:444/synthetic', 'https://example.invalid/synthetic?q=x', 'https://example.invalid/synthetic#x', 'https://example.invalid/\\synthetic', 'https://example.invalid/synthetic space', 'HTTPS://example.invalid/synthetic', '', null, undefined]) {
  invalid.push([`unsafe/invalid link ${String(link)}`, () => ({ ...clone(), recentActivity: [{ ...populated.recentActivity[0], link }] })]);
}
for (const [scenario, input] of invalid) {
  test(`SSR rejects ${scenario} without returning partial markup or rejected values`, () => {
    let result;
    assert.throws(() => { result = render(input()); }, error => {
      assert.match(error.message, /^Invalid public Build Progress field:/);
      assert.ok(!error.message.includes('REJECTED_SYNTHETIC_VALUE'));
      return true;
    });
    assert.equal(result, undefined);
  });
}
