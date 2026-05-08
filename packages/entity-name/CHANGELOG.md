# @bem/sdk.entity-name

## 1.0.0

### Major Changes

- `BemEntityName.belongsTo` now treats a key-value modifier as a
  specialization of its boolean counterpart with the same name and scope
  (closes [#269]). `popup2_target_position.belongsTo(popup2_target)` is
  now `true`; the reverse stays `false`.

[#269]: https://github.com/bem/bem-sdk/issues/269

- 6a4b1b3: Migrated to TypeScript / ESM (Node >=20).
  Public API: named export `BemEntityName` (default export retained), plus
  `EntityTypeError` and types `BlockName`, `ElementName`, `EntityNameOptions`,
  `EntityNameCreateOptions`, `EntityRepresentation`, `EntityType`, `Id`,
  `Modifier`, `ModifierName`, `ModifierValue`. Behaviour, deprecation messages
  and error wording are preserved.

  Replaced runtime deps with native APIs:
  - `depd` → custom `emitDeprecation()` based on `process.stderr` + the
    `process.emit('deprecation', err)` event (same listener contract, honours
    `NO_DEPRECATION=@bem/sdk.entity-name`).
  - `es6-error` → native `class extends Error`.

  The `proxyquire`/`sinon`-based legacy specs (`deprecate.test.js`,
  `id.test.js`, `to-string.test.js`) have been rewritten to plain TS without
  module mocking — `to-string` and `id` now exercise the real
  `@bem/sdk.naming.entity.stringify`, and `deprecate` covers the same surface
  through the new public function plus the `process.on('deprecation', …)`
  listener.

### Patch Changes

- Updated dependencies [d5954b2]
- Updated dependencies [d5954b2]
  - @bem/sdk.naming.entity.stringify@2.0.0
  - @bem/sdk.naming.presets@1.0.0
