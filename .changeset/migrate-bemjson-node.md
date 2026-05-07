---
'@bem/sdk.bemjson-node': major
---

Migrated to TypeScript / ESM (Node >=20).
`BemjsonNode` is now a named export (default export retained for compatibility). Custom inspect uses `node:util` `inspect.custom` symbol instead of legacy `inspect()` method. Type definitions (`BemjsonNodeOptions`, `BemjsonNodeRepresentation`, `Modifiers`, `BemjsonNodeMix`) ship with the package.
