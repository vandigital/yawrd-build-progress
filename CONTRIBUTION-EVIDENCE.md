# YAW-001 Task A contribution evidence

## Attribution and human control

- Original AI code author: **VanClaw**, using **Qwen 3.6 35B A3B via NEAR AI
  Cloud**, as identified by the human operator. This provenance is operator
  supplied, not an independently verified provider attestation.
- Human operator: **Rare Vandal (@vandigital)**. The operator supplied the source
  and verification evidence and explicitly authorized preparing, committing,
  pushing and opening this public contribution PR against protected `main`.
- Submission process: **Codex** prepared and verified the contribution under those
  instructions. Git author/committer identify the submitting human operator using
  the operator's public GitHub noreply identity. They do not identify VanClaw or
  Codex as a human Git author. AI authorship is recorded here and in commit
  messages; no AI email address or identity is fabricated.
- Codex independently authored the portability corrections, verification tests,
  integration instructions and this evidence record. The original component
  implementation remains attributed to VanClaw.
- Opening this PR requests human review. Acceptance, integration and merging
  remain human decisions; submission alone establishes none of them.

## Scope and source identity

Task A is the portable, public-facing, read-only Project Progress component.
Base: public `main` at `55b6b54c63323f1885a75fa1add7f28a8c09ec15`.
Branch: `agent/vanclaw/yaw-001-task-a`.

The operator-supplied original `ProjectProgress.tsx` has SHA-256:

```text
aad1ff5fe3886b6959327f57938b30287cc3bdbbbba178597adde23726edd584
```

Commit `6575780cab00ac209fd568a98d33ae38992c10b5` preserves those exact bytes at
`components/ProjectProgress.tsx`, including the original portability limitations.
The original and verified checksum are also preserved in local engineering
evidence. To verify the original from Git history:

```sh
git show 6575780cab00ac209fd568a98d33ae38992c10b5:components/ProjectProgress.tsx | sha256sum
```

Commit `e5ad2d3c786dbb2779dc5fbbde396aba556282f9` applies only these component
portability corrections:

1. The host-specific `@/contracts/build-progress/contract` import to the relative
   `../contracts/build-progress/contract.ts` import.
2. The implicit `React.CSSProperties` type namespace to an explicit type-only
   `CSSProperties` import and its twelve uses.

It also carries an attribution comment, updated to point to this record. All
other component bytes match the previously verified portability candidate.
There is no product behavior or styling redesign.

Final `components/ProjectProgress.tsx` SHA-256:

```text
bcf7fd9e2c8256fae77d5f3d2250da59c3948bd8de245e4bd9fc7c14049c9c8a
```

The accepted contract and fixtures remain unchanged:

| File | SHA-256 |
| --- | --- |
| `contracts/build-progress/contract.ts` | `755754f8d54f136409797d5a1697b7eb96936d06fa08577b6e2f975826b50bd4` |
| `contracts/build-progress/fixtures.ts` | `3d9717b119237f6b811de2a779b0ce38071d1ae4188b9ae5008e3804c7761821` |

## Verification and limits

The independent verification workspace established **80 JSX logic checks** and
**43 genuine React DOM server rendering tests**, plus successful strict
TypeScript compilation with genuine React types. For this submission:

- All **80** existing internal JSX capture checks passed again. These execute the
  original and corrected versions through a capture double; they are not React
  rendering or HTML escaping tests. The capture harness remains internal.
- The focused public suite reuses the **43** React rendering tests and compiles
  the final contribution component; **43 passed, 0 failed, 0 skipped**, with no
  compiler diagnostics. Only harness paths, snapshot locations and the provenance
  checksum check were adapted for this repository layout.
- The existing locked packages were reused locally; no dependencies were
  installed during PR preparation. The manifest/lockfile retain the same package
  versions and resolutions, labeled as development dependencies.
- The complete proposed public diff was reviewed for private information,
  unnecessary dependencies and unrelated changes. Only Task A source, focused
  verification tooling, integration documentation and sanitized evidence are
  included. The public contract/fixtures and Task A requirements are unchanged.

Browser layout, responsiveness, contrast and assistive-technology behavior remain
unverified. Human visual/accessibility review is the next acceptance step.
The focused tests are not exhaustive validation of arbitrary JavaScript objects.
No private platform integration or live project participation is claimed.

Detailed inference usage, failed-run history and execution traces belong in
internal engineering evidence and are excluded from the public contribution.
Existing local verification reports/logs are retained. Original provider usage
and raw inference traces were not supplied for independent audit; no usage or
cost figures are inferred here.

Task B remains outside this contribution. No private platform source was
accessed and no production resources were changed. No deployment, migration, wallet operation, spending or
GitHub permission change is part of this submission. The PR must not be merged
by this automated submission process.
