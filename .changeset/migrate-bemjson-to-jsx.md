---
'@bem/sdk.bemjson-to-jsx': major
---

Migrated to TypeScript / ESM (Node >=20).
Public API preserved: factory `bemjsonToJsx(options)` exposing
`tagToClass`/`plugins`/`styleToObj` as static fields, plus named exports
`Transformer`, `bemjsonToJsx`, `tagToClass`, `styleToObj`, and the typed
`BemJson`/`JSXNode`/`Plugin`/`PluginFactory`/`WhiteListOptions` shapes. Replaced
deprecated `camel-case@^3` and `pascal-case@^2` with `change-case@^5` (ESM,
typed). All 45 unit tests ported.
