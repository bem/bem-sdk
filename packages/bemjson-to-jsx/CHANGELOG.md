# @bem/sdk.bemjson-to-jsx

## 1.0.0

### Major Changes

- 10c3c72: Migrated to TypeScript / ESM (Node >=20).
  Public API preserved: factory `bemjsonToJsx(options)` exposing
  `tagToClass`/`plugins`/`styleToObj` as static fields, plus named exports
  `Transformer`, `bemjsonToJsx`, `tagToClass`, `styleToObj`, and the typed
  `BemJson`/`JSXNode`/`Plugin`/`PluginFactory`/`WhiteListOptions` shapes. Replaced
  deprecated `camel-case@^3` and `pascal-case@^2` with `change-case@^5` (ESM,
  typed). All 45 unit tests ported.

### Patch Changes

- Updated dependencies [6a4b1b3]
- Updated dependencies [d5954b2]
- Updated dependencies [d5954b2]
  - @bem/sdk.entity-name@1.0.0
  - @bem/sdk.naming.entity.stringify@2.0.0
  - @bem/sdk.naming.presets@1.0.0
