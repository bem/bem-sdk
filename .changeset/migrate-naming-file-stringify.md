---
'@bem/sdk.naming.file.stringify': major
---

Migrated to TypeScript / ESM (Node >=20).
Public API: named export `fileStringifyWrapper(convention)` (default export
retained). The wrapper consumes any `BemFile`-shaped object with `cell` plus
optional `level`/`tech` fields and delegates to
`@bem/sdk.naming.cell.stringify`. Tests rewritten in TS using the migrated
`@bem/sdk.file` as a fixture source.
