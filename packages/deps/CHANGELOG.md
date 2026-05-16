# @bem/sdk.deps

## 1.0.0

### Features

- `parseSync(parser?)` — synchronous counterpart of `parse()`. Useful when
  the file contents are already in memory and the caller does not need a
  Promise. Closes [#301].

[#301]: https://github.com/bem/bem-sdk/issues/301

### Major Changes

- c5d34fc: Migrated to TypeScript / ESM (Node >=20). Replaced legacy deps:
  - `mz` → `node:fs/promises`.
  - `debug@2` → `^4.4.3` (catalog).
  - `node-eval@1` → `^2` (catalog) with an ambient `.d.ts` declaration.

  The `gather` mock-fs-based suite is deferred (see
  `src/gather.test.skip.ts.txt`); `resolve` and the `deps.js` parser are
  still covered by direct TS tests.

  Public API: named exports `read`, `parse`, `gather`, `resolve`, `buildGraph`,
  `load`, plus `depsJs`, `depsJsReader`, `depsJsParser`. Default export keeps
  the same fields for backward compatibility.

### Patch Changes

- Updated dependencies [22ec60f]
- Updated dependencies [79068ed]
- Updated dependencies [4d093ac]
- Updated dependencies [6a4b1b3]
- Updated dependencies [eb101dc]
- Updated dependencies [8fac87b]
- Updated dependencies [c8a5c4e]
  - @bem/sdk.cell@1.0.0
  - @bem/sdk.config@1.0.0
  - @bem/sdk.decl@1.0.0
  - @bem/sdk.entity-name@1.0.0
  - @bem/sdk.file@1.0.0
  - @bem/sdk.graph@1.0.0
  - @bem/sdk.walk@1.0.0

## Pre-1.0 history (legacy)

## [0.3.1](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.3.0...@bem/sdk.deps@0.3.1) (2019-04-15)

**Note:** Version bump only for package @bem/sdk.deps





# [0.3.0](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.14...@bem/sdk.deps@0.3.0) (2019-02-03)


### Features

* **deps:** use config instance ([7aad088](https://github.com/bem/bem-sdk/commit/7aad088))





<a name="0.2.14"></a>
## [0.2.14](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.13...@bem/sdk.deps@0.2.14) (2018-08-21)




**Note:** Version bump only for package @bem/sdk.deps

<a name="0.2.13"></a>
## [0.2.13](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.12...@bem/sdk.deps@0.2.13) (2018-08-16)


### Bug Fixes

* **deps:** allow to pass object into format parser ([e650603](https://github.com/bem/bem-sdk/commit/e650603))




<a name="0.2.12"></a>
## [0.2.12](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.11...@bem/sdk.deps@0.2.12) (2018-08-12)




**Note:** Version bump only for package @bem/sdk.deps

<a name="0.2.11"></a>
## [0.2.11](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.10...@bem/sdk.deps@0.2.11) (2018-07-16)




**Note:** Version bump only for package @bem/sdk.deps

<a name="0.2.10"></a>
## [0.2.10](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.9...@bem/sdk.deps@0.2.10) (2018-07-12)




**Note:** Version bump only for package @bem/sdk.deps

<a name="0.2.9"></a>
## [0.2.9](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.8...@bem/sdk.deps@0.2.9) (2018-07-01)




**Note:** Version bump only for package @bem/sdk.deps

<a name="0.2.8"></a>
## [0.2.8](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.7...@bem/sdk.deps@0.2.8) (2018-04-17)




**Note:** Version bump only for package @bem/sdk.deps

<a name="0.2.7"></a>
## [0.2.7](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.6...@bem/sdk.deps@0.2.7) (2018-04-17)




**Note:** Version bump only for package @bem/sdk.deps

<a name="0.2.6"></a>
## [0.2.6](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.5...@bem/sdk.deps@0.2.6) (2017-12-17)




**Note:** Version bump only for package @bem/sdk.deps

<a name="0.2.5"></a>
## [0.2.5](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.4...@bem/sdk.deps@0.2.5) (2017-12-17)




**Note:** Version bump only for package @bem/sdk.deps

<a name="0.2.4"></a>
## [0.2.4](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.3...@bem/sdk.deps@0.2.4) (2017-12-16)


### Bug Fixes

* **decl:** drop modName-modVal fields support ([0dfa9be](https://github.com/bem/bem-sdk/commit/0dfa9be))




<a name="0.2.3"></a>
## [0.2.3](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.2...@bem/sdk.deps@0.2.3) (2017-12-12)




**Note:** Version bump only for package @bem/sdk.deps

<a name="0.2.2"></a>
## [0.2.2](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.0...@bem/sdk.deps@0.2.2) (2017-11-07)




**Note:** Version bump only for package @bem/sdk.deps

<a name="0.2.1"></a>
## [0.2.1](https://github.com/bem/bem-sdk/compare/@bem/sdk.deps@0.2.0...@bem/sdk.deps@0.2.1) (2017-10-02)




**Note:** Version bump only for package @bem/sdk.deps

<a name="0.2.0"></a>
# 0.2.0 (2017-10-01)


### Features

* split bem-naming to naming.entity.* packages ([0bf481d](https://github.com/bem/bem-sdk/commit/0bf481d))




<a name="0.1.0"></a>
# 0.1.0 (2017-09-30)


### Features

* split bem-naming to naming.entity.* packages ([0bf481d](https://github.com/bem/bem-sdk/commit/0bf481d))
