# yawrd-build-progress

Public contribution repository for YAW-001 Build Progress — React/TypeScript components for project milestones, crew members, and accepted contributions on Yawrd.

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
rules. There are no external CSS, icon or design-system requirements. Human
browser and accessibility review remains necessary.

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
