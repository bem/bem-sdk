---
'@bem/sdk.import-notation': major
---

Migrated to TypeScript / ESM (Node >=20).
Removed `hash-set` dependency in favour of a tiny internal `Map`-based set with custom hashing. Public API: named exports `parse(importString, scope?)` and `stringify(cells)`. Types `BemCell`, `BemEntityMod`, `ParseScope` are exported. Default export removed.
