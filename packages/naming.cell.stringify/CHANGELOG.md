# @bem/sdk.naming.cell.stringify

## 1.0.0

### Major Changes

- 7456f4f: Migrated to TypeScript / ESM (Node >=20).
  Public API: named export `cellStringifyWrapper` (default export retained), plus
  types `BemCellLike`, `CellStringify`, `FsConvention`, `NamingConvention`,
  `NamingDelims`. Entity rendering now goes through the migrated
  `@bem/sdk.naming.entity.stringify` package (added as a prod-dep instead of the
  legacy implicit `@bem/sdk.naming.entity` couple). The structural `BemCellLike`
  type avoids a hard runtime dependency on `@bem/sdk.cell`. Tests against
  `@bem/sdk.cell` were parked in `src/index.test.skip.ts.txt` until that package
  is migrated; behaviour is covered by inline structural fixtures.

### Patch Changes

- Updated dependencies [d4f07ec]
- Updated dependencies [d5954b2]
  - @bem/sdk.naming.cell.pattern-parser@1.0.0
  - @bem/sdk.naming.entity.stringify@2.0.0

## Pre-1.0 history (legacy)

## [0.0.13](https://github.com/bem/bem-sdk/compare/@bem/sdk.naming.cell.stringify@0.0.12...@bem/sdk.naming.cell.stringify@0.0.13) (2019-02-03)

**Note:** Version bump only for package @bem/sdk.naming.cell.stringify





<a name="0.0.12"></a>
## [0.0.12](https://github.com/bem/bem-sdk/compare/@bem/sdk.naming.cell.stringify@0.0.11...@bem/sdk.naming.cell.stringify@0.0.12) (2018-07-16)




**Note:** Version bump only for package @bem/sdk.naming.cell.stringify

<a name="0.0.11"></a>
## [0.0.11](https://github.com/bem/bem-sdk/compare/@bem/sdk.naming.cell.stringify@0.0.10...@bem/sdk.naming.cell.stringify@0.0.11) (2018-07-12)




**Note:** Version bump only for package @bem/sdk.naming.cell.stringify

<a name="0.0.10"></a>
## [0.0.10](https://github.com/bem/bem-sdk/compare/@bem/sdk.naming.cell.stringify@0.0.9...@bem/sdk.naming.cell.stringify@0.0.10) (2018-07-01)




**Note:** Version bump only for package @bem/sdk.naming.cell.stringify

<a name="0.0.9"></a>
## [0.0.9](https://github.com/bem/bem-sdk/compare/@bem/sdk.naming.cell.stringify@0.0.8...@bem/sdk.naming.cell.stringify@0.0.9) (2018-04-17)




**Note:** Version bump only for package @bem/sdk.naming.cell.stringify

<a name="0.0.8"></a>
## [0.0.8](https://github.com/bem/bem-sdk/compare/@bem/sdk.naming.cell.stringify@0.0.7...@bem/sdk.naming.cell.stringify@0.0.8) (2018-04-17)




**Note:** Version bump only for package @bem/sdk.naming.cell.stringify

<a name="0.0.7"></a>
## [0.0.7](https://github.com/bem/bem-sdk/compare/@bem/sdk.naming.cell.stringify@0.0.6...@bem/sdk.naming.cell.stringify@0.0.7) (2017-12-16)


### Bug Fixes

* **walk:** resolve cycle dependency ([9e8d925](https://github.com/bem/bem-sdk/commit/9e8d925))




<a name="0.0.6"></a>
## [0.0.6](https://github.com/bem/bem-sdk/compare/@bem/sdk.naming.cell.stringify@0.0.5...@bem/sdk.naming.cell.stringify@0.0.6) (2017-12-12)




**Note:** Version bump only for package @bem/sdk.naming.cell.stringify

<a name="0.0.5"></a>
## [0.0.5](https://github.com/bem/bem-sdk/compare/@bem/sdk.naming.cell.stringify@0.0.3...@bem/sdk.naming.cell.stringify@0.0.5) (2017-11-07)




**Note:** Version bump only for package @bem/sdk.naming.cell.stringify

<a name="0.0.4"></a>
## [0.0.4](https://github.com/bem/bem-sdk/compare/@bem/sdk.naming.cell.stringify@0.0.3...@bem/sdk.naming.cell.stringify@0.0.4) (2017-10-02)




**Note:** Version bump only for package @bem/sdk.naming.cell.stringify

<a name="0.0.3"></a>
## 0.0.3 (2017-10-01)




**Note:** Version bump only for package @bem/sdk.naming.cell.stringify

<a name="0.0.2"></a>
## 0.0.2 (2017-09-30)




**Note:** Version bump only for package @bem/sdk.naming.cell.stringify
