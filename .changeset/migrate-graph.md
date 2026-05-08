---
'@bem/sdk.graph': major
---

Migrated to TypeScript / ESM (Node >=20). Replaced legacy deps:
- `lodash` (full) — removed (no actual usage in source).
- `hash-set` — replaced by a small `VertexSet` keyed by `vertex.id`.
- `ho-iter` — replaced by a tiny `series()` helper around native generators.
- `es6-error` — replaced by `class extends Error` with custom `name`.
- `debug@2` — bumped to `^4.4.3` via the workspace catalog.

Public API is unchanged: `BemGraph`, `Vertex`, `MixedGraph`, `DirectedGraph`,
`VertexSet`, and `CircularDependencyError` are all named exports.
