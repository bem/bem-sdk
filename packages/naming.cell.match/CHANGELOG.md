# @bem/sdk.naming.cell.match

## 1.0.0

### Bug fixes

- Pattern placeholders other than `entity` (`layer`, `tech`, …) no longer
  inherit `wordPattern` from the convention. Hyphens in layer values and
  similar scenarios (`MyBlock_kind@touch-phone.js` with the react preset)
  now match correctly. Closes [#385].

[#385]: https://github.com/bem/bem-sdk/issues/385

### Major Changes

- 93526f7: Migrated to TypeScript / ESM (Node >=20). Public API stays as a single function
  `bemNamingCellMatch(convention) → (relPath) => { cell, isMatch, rest }`.

### Patch Changes

- Updated dependencies [22ec60f]
- Updated dependencies [6a4b1b3]
- Updated dependencies [d4f07ec]
- Updated dependencies [670a68b]
- Updated dependencies [d5954b2]
  - @bem/sdk.cell@1.0.0
  - @bem/sdk.entity-name@1.0.0
  - @bem/sdk.naming.cell.pattern-parser@1.0.0
  - @bem/sdk.naming.entity.parse@1.0.0
  - @bem/sdk.naming.presets@1.0.0
