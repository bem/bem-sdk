# @bem/sdk.walk

## 1.0.0

### Bug fixes

- Level paths are now resolved against `process.cwd()` and dereferenced via
  `fs.realpath` before scanning. `'.'` softly equals to `process.cwd()`,
  symlinked levels follow to the real directory, and config lookups by
  level path remain consistent. Closes [#335].

[#335]: https://github.com/bem/bem-sdk/issues/335

### Major Changes

- c8a5c4e: Migrated to TypeScript / ESM (Node >=20). Replaced legacy deps:
  - `async-each` → native `Promise.all` over `node:fs/promises.readdir`.
  - `depd` → `node:util.deprecate`.
  - `mock-fs`/`proxyquire`/`chai-subset` removed from devDependencies; the
    legacy white-box test suite is preserved as a TODO note in
    `src/legacy-mock-fs.test.skip.ts.txt`. Public surface is now covered by a
    real-tmpdir-based suite in `src/index.test.ts`.

  Public API: `walk(levels, options)` (legacy stream entry), `walk.walk()`
  (by config sets), `walk.asArray()`, plus named exports for the same.

### Patch Changes

- Updated dependencies [22ec60f]
- Updated dependencies [79068ed]
- Updated dependencies [6a4b1b3]
- Updated dependencies [eb101dc]
- Updated dependencies [93526f7]
- Updated dependencies [670a68b]
- Updated dependencies [d5954b2]
- Updated dependencies [d5954b2]
  - @bem/sdk.cell@1.0.0
  - @bem/sdk.config@1.0.0
  - @bem/sdk.entity-name@1.0.0
  - @bem/sdk.file@1.0.0
  - @bem/sdk.naming.cell.match@1.0.0
  - @bem/sdk.naming.entity.parse@1.0.0
  - @bem/sdk.naming.entity.stringify@2.0.0
  - @bem/sdk.naming.presets@1.0.0
