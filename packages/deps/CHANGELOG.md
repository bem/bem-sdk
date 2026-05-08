# @bem/sdk.deps

## 1.0.0

### Features

- `parseSync(parser?)` — synchronous counterpart of `parse()`. Useful when
  the file contents are already in memory and the caller does not need a
  Promise. Closes [#301].

[#301]: https://github.com/bem/bem-sdk/issues/301

### Major Changes

- c5d34fc: Migrated to TypeScript / ESM (Node >=20). Replaced legacy deps:
  - `mz` → `node:fs/promises`.
  - `debug@2` → `^4.4.3` (catalog).
  - `node-eval@1` → `^2` (catalog) with an ambient `.d.ts` declaration.

  The `gather` mock-fs-based suite is deferred (see
  `src/gather.test.skip.ts.txt`); `resolve` and the `deps.js` parser are
  still covered by direct TS tests.

  Public API: named exports `read`, `parse`, `gather`, `resolve`, `buildGraph`,
  `load`, plus `depsJs`, `depsJsReader`, `depsJsParser`. Default export keeps
  the same fields for backward compatibility.

### Patch Changes

- Updated dependencies [22ec60f]
- Updated dependencies [79068ed]
- Updated dependencies [4d093ac]
- Updated dependencies [6a4b1b3]
- Updated dependencies [eb101dc]
- Updated dependencies [8fac87b]
- Updated dependencies [c8a5c4e]
  - @bem/sdk.cell@1.0.0
  - @bem/sdk.config@1.0.0
  - @bem/sdk.decl@1.0.0
  - @bem/sdk.entity-name@1.0.0
  - @bem/sdk.file@1.0.0
  - @bem/sdk.graph@1.0.0
  - @bem/sdk.walk@1.0.0
