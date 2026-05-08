---
'@bem/sdk.naming.entity': major
---

Migrated to TypeScript / ESM (Node >=20). Public API:
`bemNaming(convention) → { parse, stringify, delims, wordPattern }`. The default
namespace is also attached to the factory itself (`bemNaming.parse`, etc.).
