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

## Pre-1.0 history (legacy)

## [0.1.3](https://github.com/bem/bem-sdk/compare/@bem/sdk.naming.cell.match@0.1.2...@bem/sdk.naming.cell.match@0.1.3) (2019-02-03)

**Note:** Version bump only for package @bem/sdk.naming.cell.match





<a name="0.1.2"></a>
## [0.1.2](https://github.com/bem/bem-sdk/compare/@bem/sdk.naming.cell.match@0.1.1...@bem/sdk.naming.cell.match@0.1.2) (2018-07-16)




**Note:** Version bump only for package @bem/sdk.naming.cell.match

<a name="0.1.1"></a>
## [0.1.1](https://github.com/bem/bem-sdk/compare/@bem/sdk.naming.cell.match@0.1.0...@bem/sdk.naming.cell.match@0.1.1) (2018-07-12)


### Bug Fixes

* **naming.cell.match:** empty elem fs.delim in nested scheme issue ([14a7617](https://github.com/bem/bem-sdk/commit/14a7617))




<a name="0.1.0"></a>
# 0.1.0 (2018-07-01)


### Features

* **naming.cell.match:** initial implementation ([42eefb5](https://github.com/bem/bem-sdk/commit/42eefb5))
