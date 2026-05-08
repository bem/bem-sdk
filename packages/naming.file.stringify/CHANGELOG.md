# @bem/sdk.naming.file.stringify

## 1.0.0

### Major Changes

- bae5762: Migrated to TypeScript / ESM (Node >=20).
  Public API: named export `fileStringifyWrapper(convention)` (default export
  retained). The wrapper consumes any `BemFile`-shaped object with `cell` plus
  optional `level`/`tech` fields and delegates to
  `@bem/sdk.naming.cell.stringify`. Tests rewritten in TS using the migrated
  `@bem/sdk.file` as a fixture source.

### Patch Changes

- Updated dependencies [7456f4f]
  - @bem/sdk.naming.cell.stringify@1.0.0
