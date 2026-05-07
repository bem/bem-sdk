---
'@bem/sdk.keyset': major
---

Migrated to TypeScript / ESM (Node >=20).
Public API: named exports `Key`, `ParamedKey`, `PluralKey`, `LangKeys`, `Keyset`, plus types `FormatName`, `KeyValue`, `PluralForm`, `PluralForms`. Default export removed. Keyset I/O moved to `node:fs/promises` (no more callback-based `util.promisify`). Internal `xamel` access goes through a typed promise wrapper. Tests no longer use `mock-fs` — `Keyset.load` / `Keyset.save` are exercised against real temp directories.
