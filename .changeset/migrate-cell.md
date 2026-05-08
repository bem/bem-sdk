---
'@bem/sdk.cell': major
---

Migrated to TypeScript / ESM (Node >=20).
Public API preserved: `BemCell` class with `entity`/`tech`/`layer`/`block`/
`elem`/`mod`/`id`/`valueOf`/`toString`/`toJSON`/`isEqual` and statics
`BemCell.create`/`BemCell.isBemCell`. Legacy `modName`/`modVal` getters retained
behind deprecation notices. Replaced `depd` with an inline
`process.emit('deprecation')` helper sharing semantics with the migrated
`@bem/sdk.entity-name` package. All 48 unit tests ported and rewritten in TS.
