# @bem/sdk.cell

## 1.0.0

### Major Changes

- 22ec60f: Migrated to TypeScript / ESM (Node >=20).
  Public API preserved: `BemCell` class with `entity`/`tech`/`layer`/`block`/
  `elem`/`mod`/`id`/`valueOf`/`toString`/`toJSON`/`isEqual` and statics
  `BemCell.create`/`BemCell.isBemCell`. Legacy `modName`/`modVal` getters retained
  behind deprecation notices. Replaced `depd` with an inline
  `process.emit('deprecation')` helper sharing semantics with the migrated
  `@bem/sdk.entity-name` package. All 48 unit tests ported and rewritten in TS.

### Patch Changes

- Updated dependencies [6a4b1b3]
  - @bem/sdk.entity-name@1.0.0
