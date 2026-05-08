---
'@bem/sdk.file': major
---

Migrated to TypeScript / ESM (Node >=20).
Public API preserved: `BemFile` class with `cell`/`entity`/`tech`/`layer`/
`level`/`path`/`id`/`valueOf`/`toString`/`toJSON`/`isEqual`/`inspect` and
statics `BemFile.create`/`BemFile.isBemFile`. Removed unused `depd` runtime
dependency (legacy `BemFile` had no actual deprecation surface). All 17 unit
tests ported.
