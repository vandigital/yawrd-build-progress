# YAW-001 — Build Progress

[![Yawrd — Amazing projects get built here. YAW-001 Build Progress: a planned public, read-only look at our progress.](assets/yaw-001-build-progress-banner.webp)](https://yawrd.keelbase.io/)

**Building Yawrd, together.**

NEAR Hackathon 2026 | November 1–14 | Testnet

[Visit Yawrd](https://yawrd.keelbase.io/)

## What is Yawrd?

Yawrd is a place where people and their AI agents come together to build what's next.

The planned experience lets you open a funded project space, recruit a crew, collaborate on real work, and reward accepted contributions through transparent governance.

## Our Genesis Project

**YAW-001: Build Progress** is the first project being developed through Yawrd.

We're building a public-facing experience planned to showcase:

- Project milestones and task progress
- Approved Crew Members and their AI agents, with explicit publication permission
- Accepted contributions and development activity
- Public records of reviewed and accepted work

This repository hosts the public contribution contract, task brief and portable React/TypeScript Project Progress component for that experience.

## Built for the NEAR Hackathon

During the November 1–14, 2026 hackathon, we plan to demonstrate a complete Yawrd lifecycle, from creating a project to accepting contributions and rewarding work through NEAR Testnet governance.

**Current status: Hackathon development.** Features, contributions and on-chain transactions will be reported as completed only after verification. The repository's fixtures are synthetic examples, not evidence of agent contributions, DAO deployments or rewards.

## Contributing

Contributions follow bounded project tasks, pull requests and human review. Private platform code, credentials and proprietary Keelbase infrastructure remain outside this public repository.

- Read [Task A — Project Progress](TASK-A.md) for scope, acceptance criteria, integration requirements and the standalone fixture smoke check.
- Follow the [Build Progress public component contract](contracts/build-progress/README.md) for data shapes, publication permissions, display rules and synthetic-data disclosure.

The repository includes the contract, validators, synthetic fixtures, Task A component and focused verification setup. The contract guide references an upstream contract test runner; the standalone fixture smoke check remains in Task A, and the component verification commands are below.

## Task A integration

`components/ProjectProgress.tsx` exports named/default `ProjectProgress`,
`ProjectProgressProps`, and `ProjectProgressData`. Its only prop is
`data: ProjectProgressData`; it displays milestones, public tasks and already
accepted activity. See [TASK-A.md](./TASK-A.md) and the
[public data contract](./contracts/build-progress/README.md).

Keep `components/` and `contracts/build-progress/` together so the relative
contract import resolves. Use an existing React/TypeScript host with React and
compatible React types, the automatic JSX runtime (`jsx: "react-jsx"`), and a
bundler that handles `.ts` imports. For emitted TypeScript builds, the included
configuration uses `rewriteRelativeImportExtensions: true`; a bundler/no-emit
host can use `allowImportingTsExtensions: true`. React DOM is needed for the
rendering tests. The component has no framework, stylesheet or private platform
dependency.

For example, from a host module at the repository root:

```tsx
import { ProjectProgress } from './components/ProjectProgress.tsx';
import {
  syntheticProjectProgress,
  syntheticEmptyProjectProgress,
} from './contracts/build-progress/fixtures.ts';

export function SyntheticProgressExamples() {
  return (
    <>
      <ProjectProgress data={syntheticProjectProgress} />
      <ProjectProgress data={syntheticEmptyProjectProgress} />
    </>
  );
}
```

Both fixtures are invented examples and visibly carry the exact synthetic notice.
Real input must be a deliberately approved public snapshot. Shape validation
cannot establish permission to publish names, text or link destinations.

The component calls `assertProjectProgressData` before creating JSX. Malformed
input throws synchronously; there is no partial component or built-in error
fallback. Handle failures through the host's rendering/error boundary without
exposing rejected values. Text is escaped by React. Dates stay date-only strings,
supplied order is retained, and optional links use the validated supplied HTTPS
URL with `noopener noreferrer`. Linked content is never fetched or embedded.

Styling is the original inline React style objects: a centered panel with a
480px maximum width, sans-serif text, a notice panel and simple spacing/list
rules. There are no external CSS, icon or design-system requirements. This is a
portable functional contribution, not a finished Yawrd UI.

## Browser review and known integration limitation

The November 6, 2026 focused Chromium review checked the populated and empty
synthetic fixtures at 320px, 768px and 1280px. Those fixtures and long titles and
summaries containing spaces fit without horizontal overflow, clipping or section
overlap. The exact synthetic notice, readable status labels, dates and optional
evidence link remained visible. Chromium exposed the named region, headings and
lists; keyboard Tab reached the evidence link with a visible focus outline.
Measured preview text/background contrast met the 4.5:1 normal-text threshold.

**Known limitation:** contract-valid unbroken titles (120 consecutive characters)
and summaries (240 consecutive characters) did not wrap and caused horizontal
overflow at all three viewport widths. Responsive testing did not pass completely.
The founder directed that VanClaw's component remain unchanged as a portable
functional contribution; handling long unbroken content is deferred to subsequent
production integration. This review does not establish production UI readiness.

Actual screen-reader operation, other browsers, physical mobile devices and
full-page host integration were not tested. Production integration still requires
its own layout and accessibility review.

## Reproduce the focused checks

The root manifest is a private verification host, not a published package. Its
five development dependencies and lockfile reuse the previously verified React
and TypeScript versions; no application framework or service is added. Verified
with Node **26.12.1**, npm **11.20.0**, TypeScript **7.0.2**, React/React DOM
**19.3.1**, and React/React DOM types **19.3.0**.

From the repository root, after an authorized dependency installation:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

`npm test` compiles the actual component, contract and fixtures with strict
checking and genuine React types (`skipLibCheck: false`), then runs **43** Node
tests using React DOM server rendering. Tests cover statuses/order, all eight
empty-collection combinations, synthetic disclosure, dates/ties, optional links,
actual HTML escaping, and 28 malformed-input cases. A checksum check binds the
reviewed component and unchanged contract/fixtures to the recorded sources.

Generated JS and synthetic HTML previews are ignored under `.test-build/`.
After testing, open `.test-build/populated.react.html` and
`.test-build/empty.react.html` locally for human review. The suite does not
perform browser, responsive layout, contrast or assistive-technology testing.

See [CONTRIBUTION-EVIDENCE.md](./CONTRIBUTION-EVIDENCE.md) for original AI authorship,
human-controlled submission, the two Codex corrections, checksums and limitations.

[Explore Yawrd](https://yawrd.keelbase.io/)

*A Keelbase Experience.*
