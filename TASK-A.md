# Task A — Project Progress

Implement a portable, public-facing, read-only React/TypeScript component consuming
`ProjectProgressData` from `contracts/build-progress/contract.ts`. Use the supplied
contract, validators and fixtures; the contract README defines the display rules.
This brief is for a later IronClaw assignment and grants no repository access or
write permission.

## Display and acceptance criteria

- Show published milestone titles and statuses, public task titles and statuses,
  and recent accepted development activity summaries with public acceptance dates
  and optional safe links. Retain supplied order, including activity date ties.
- Use the established status labels: **Not started**, **In progress**, **Blocked**,
  **Completed** (`not_started`, `in_progress`, `blocked`, `completed`). Use stable
  IDs as list keys. Do not infer relationships or completion percentages.
- Work directly with `syntheticProjectProgress` and
  `syntheticEmptyProjectProgress` from `contracts/build-progress/fixtures.ts`.
  For synthetic input, visibly render the exact `SYNTHETIC_NOTICE` before content.
  All example activity, dates, identities and links remain explicitly synthetic.
- Support independently empty collections: **No published milestones yet**,
  **No public tasks yet**, and **No accepted activity published yet**. Keep other
  collections visible. Missing published data does not establish no private work.
- Validate input with `assertProjectProgressData` before rendering. Malformed
  inputs must fail validation without partial rendering or exposing rejected
  values. Render untrusted text as escaped plain text; never inject HTML.
- Use only supplied, validated HTTPS links within the contract's restrictions.
  Give links accessible destination labels; new tabs require
  `rel="noopener noreferrer"`. Do not construct URLs from IDs or fetch, embed or
  preview destinations. Preserve date-only values without timezone shifts.
- Use accessible semantic markup and text status labels. Use approachable Yawrd
  language. Any styling must be portable and documented; this handoff supplies no
  visual redesign or private design-system dependency.

## Scope and delivery

No private platform dependencies, database access, authentication, private APIs,
wallet actions, write controls, rewards, new product features or infrastructure.
Do not claim completed YAW-001 activity, participation, deployment or rewards.
Do not implement Task B (Crew and Contributions), despite its types and synthetic
examples being present in the shared accepted contract.

Deliver a reviewable component implementation, minimal focused tests, and clear
integration instructions covering imports, React/TypeScript prerequisites, props,
validation/failure behavior, fixture usage and any styling. Tests should cover all
four statuses, populated and independently empty collections, exact synthetic
disclosure, dates/order, absent/present links, escaped hostile text and rejected
unsafe links/invalid input. No private repository access is needed or authorized.
Return the implementation for human review; do not merge or deploy it.

## Standalone handoff check

The three files under `contracts/build-progress/` are the accepted standalone
handoff, copied unchanged. The contract README's upstream `test/` file and
`npm test` runner are not included here. No dependency manifest, installed tooling
or component implementation is included. With Node supporting native TypeScript
stripping and ESM (verified with Node 26.12.1), run this offline smoke check from
the repository root:

```sh
node --input-type=module <<'JS'
import { assertProjectProgressData } from './contracts/build-progress/contract.ts';
import { syntheticProjectProgress, syntheticEmptyProjectProgress } from './contracts/build-progress/fixtures.ts';
assertProjectProgressData(syntheticProjectProgress);
assertProjectProgressData(syntheticEmptyProjectProgress);
console.log('Project Progress fixtures validated');
JS
```

This checks fixture validity only; the later implementation must supply the
component tests described above. Do not add tooling solely for this handoff.
