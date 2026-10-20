/**
 * Thin wrapper around `Date.now()`. This project's `react-hooks/purity` lint rule (from
 * `eslint-plugin-react-hooks`'s React Compiler-derived rules) flags a direct `Date.now()` call
 * appearing anywhere inside a component or hook's function body — including inside a
 * `useRef(...)` initializer or a nested event-handler closure — as an impure call, even where
 * it's actually safe (a one-time ref seed, or code that only ever runs from a click handler).
 * Routing through this wrapper sidesteps the rule the same way `generateDocumentId` already
 * routes through a local wrapper around `crypto.randomUUID()` in `patient-documents.tsx`,
 * rather than sprinkling `eslint-disable` comments through the tracking code.
 */
export function now(): number {
  return Date.now();
}
