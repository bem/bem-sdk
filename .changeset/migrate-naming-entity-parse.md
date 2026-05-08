---
'@bem/sdk.naming.entity.parse': major
---

Migrated to TypeScript / ESM (Node >=20).
Public API: named export `bemNamingEntityParse(convention)` returning a
`(str) => BemEntityName | undefined` parser; default export retained for
back-compat. Convention is typed via `@bem/sdk.naming.presets`
(`Pick<NamingConvention, 'delims' | 'wordPattern'>`). Initial unit tests added
against the `origin` preset.
