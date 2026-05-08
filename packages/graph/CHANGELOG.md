# @bem/sdk.graph

## 1.0.0

### Major Changes

- 8fac87b: Migrated to TypeScript / ESM (Node >=20). Replaced legacy deps:
  - `lodash` (full) — removed (no actual usage in source).
  - `hash-set` — replaced by a small `VertexSet` keyed by `vertex.id`.
  - `ho-iter` — replaced by a tiny `series()` helper around native generators.
  - `es6-error` — replaced by `class extends Error` with custom `name`.
  - `debug@2` — bumped to `^4.4.3` via the workspace catalog.

  Public API is unchanged: `BemGraph`, `Vertex`, `MixedGraph`, `DirectedGraph`,
  `VertexSet`, and `CircularDependencyError` are all named exports.

### Patch Changes

- Updated dependencies [22ec60f]
- Updated dependencies [6a4b1b3]
- Updated dependencies [fc0d4c5]
  - @bem/sdk.cell@1.0.0
  - @bem/sdk.entity-name@1.0.0
  - @bem/sdk.naming.entity@1.0.0
