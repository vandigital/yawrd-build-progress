# WordWake contributor baseline

Repository: https://github.com/vandigital/yawrd-build-progress, isolated under `wordwake/`.
This directory is the complete publication allowlist; it has no private repository history,
source imports, host integration, wallet or database requirements. GitHub staging
publication is founder-authorized; Yawrd project/task publication and contributor
assignments remain pending. No game implementation or original game puzzles exist yet.

Start with [BLUEPRINT.md](BLUEPRINT.md), then read the complete frozen handoff:
[SKILL.md](SKILL.md), [TASKS.json](TASKS.json),
[CONTRACT_FIXTURES.json](CONTRACT_FIXTURES.json) and the extracted
[shared/ww-v1.ts](shared/ww-v1.ts). [PUBLIC_REVIEW.json](PUBLIC_REVIEW.json)
records the approved defaults; [BASELINE_INTEGRITY.json](BASELINE_INTEGRITY.json)
identifies every baseline file. Keep this complete directory together.

Use Node >=22.15 (tested with 26.12.1) and npm (tested with 11.20.0). After explicit
permission to install dependencies, from the published `wordwake/` directory:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run validate
npm test
npm run typecheck
npm run dev
# Open http://127.0.0.1:3102; stop with Ctrl-C.
```

Clean-install verification runs in isolation with the command above and lifecycle scripts
disabled. The lock retains the reviewed dependency versions and integrity hashes; no
versions are upgraded. Next uses its documented TypeScript compiler API setting with
the pinned TypeScript 5.9 toolchain. `npm run build` builds locally; it does not deploy.
React/Next/TypeScript are the existing stack; no additional runner, styling framework,
wallet adapter, database driver or external service is required.

`npm run test:t1` runs the baseline fixture-access smoke test plus `engine-tests/`.
`npm run typecheck:t1` checks only T1/shared files. T1 owns `engine/**`, `engine-tests/**` and `puzzles/reference.json`; export `engine: Engine`
and re-export the frozen types. Add full vector replay, invalid-manifest and immutability
tests. The baseline test does not execute or validate any engine implementation.

`npm run test:t2` runs the React/scripted-double smoke test plus `player-tests/`.
`npm run typecheck:t2` checks T2/shared/preview files. T2 owns `player/**`, `player-tests/**` and `puzzles/additional-*.json`; export
`WordWakePlayer({puzzles, engine})`. Use `test-support/scripted-engine.ts`, frozen vector
states and action logs without importing `engine/**`. The double returns scripted states
for arbitrary actions and throws when exhausted; it does not solve puzzles or validate
rules. T2 may wire `app/page.tsx` to its injected-double preview after activation;
T1 does not edit the preview. Name added tests `*.test.ts`, `*.test.tsx` or `*.test.mjs`; the runner discovers them explicitly. Browser interaction, touch, accessibility and responsive
checks remain T2 deliverables. The baseline currently previews only a placeholder.

`npm run validate` verifies the allowlist and SHA-256 hashes, approved input checksums,
types extracted from SKILL.md, independent task structure, fixture shapes, authored
manifest data and seven negative manifests. It also checks any JSON added under
`puzzles/`. Integrity describes this initial baseline: later intentional file additions or
changes require reviewed regeneration of BASELINE_INTEGRITY.json; never silently
replace approved contract/fixture hashes. This validator is data QA, not a rules engine.

SKILL.md, TASKS.json and CONTRACT_FIXTURES.json are byte-identical approved inputs.
Their historical “proposed”/“review draft” wording is preserved for integrity;
PUBLIC_REVIEW.json records the subsequently approved defaults and split. Blueprint is
a public summary derivative. The complete original Blueprint, provenance, founder
review, raw source metadata and original context remain private. The original Python
validator depends on private context and is replaced here by public Node data QA.
Opaque source-review/file digests bind this candidate to its preserved private source;
these are integrity records, not signatures or proof of publication rights.

Before activation supply the authorized repository URL and baseline commit SHA,
assignees/access, branch convention (proposed `wordwake/t1-*`, `wordwake/t2-*`),
founder review routing and permitted install/test/preview commands. Keep frozen
TASKS.json unchanged; record the eventual activation separately with founder review.
Founder remains initial technical reviewer/acceptor; rewards and host integration stay
separately gated. Original WordWake code and associated original specification, fixture and documentation
materials in this directory use the scoped [MIT license](LICENSE).
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) preserves the generated Next.js
notice and explains exclusions. Unrelated repository content is not relicensed.
Rewards are not allocated or funded, and no contributor has been assigned a task.
Historical draft/publication wording in the frozen package is superseded only for
GitHub baseline publication by the founder authorization described here; Yawrd task
activation, merge and host deployment still require separate approval.

Publication corrections from the reviewed 29-file candidate: LICENSE and
THIRD_PARTY_NOTICES.md added; README/PUBLIC_REVIEW and package license metadata
updated; the TS/TSX loader independently rewritten with explicit-extension imports to
avoid a private-helper-derived resolver. BASELINE_INTEGRITY.json is regenerated.
Frozen Skill, tasks, fixtures and ww-v1 types are unchanged.
