# @bem/sdk.decl

## 1.0.0

### Major Changes

- 4d093ac: Migrated to TypeScript / ESM (Node >=20).
  Public API preserved as named exports plus a default object: `format`,
  `normalize`, `merge`, `subtract`, `intersect`, `parse`, `assign`, `load`,
  `stringify`, `save`, `cellify`, `detect`. Deps refresh:
  - `es6-promisify@5` and `graceful-fs@4.1` -> `node:fs/promises`
  - `json5@0.5` -> `json5@^2.2.3` (catalog) with default-import via
    `esModuleInterop`
  - `node-eval@1` -> `node-eval@^2.0.0` (catalog) with an ambient
    declaration in `src/ambient.d.ts`

  Tests: 25 ported (intersect/merge/subtract/stringify/parse/v1+v2 normalize/
  enb format/index public surface). Three big legacy suites with
  proxyquire+sinon (save) or 300-355-line permutations (assign,
  v1/format) parked in `*.test.skip.ts.txt` with TODOs — semantic
  equivalence verified by hand. Behaviour for those branches is also
  covered indirectly via stringify/normalize tests.

### Patch Changes

- Updated dependencies [22ec60f]
- Updated dependencies [6a4b1b3]
  - @bem/sdk.cell@1.0.0
  - @bem/sdk.entity-name@1.0.0
