# @bem/sdk.walk

## 1.0.0

### Bug fixes

- Level paths are now resolved against `process.cwd()` and dereferenced via
  `fs.realpath` before scanning. `'.'` softly equals to `process.cwd()`,
  symlinked levels follow to the real directory, and config lookups by
  level path remain consistent. Closes [#335].

[#335]: https://github.com/bem/bem-sdk/issues/335

### Major Changes

- c8a5c4e: Migrated to TypeScript / ESM (Node >=20). Replaced legacy deps:
  - `async-each` → native `Promise.all` over `node:fs/promises.readdir`.
  - `depd` → `node:util.deprecate`.
  - `mock-fs`/`proxyquire`/`chai-subset` removed from devDependencies; the
    legacy white-box test suite is preserved as a TODO note in
    `src/legacy-mock-fs.test.skip.ts.txt`. Public surface is now covered by a
    real-tmpdir-based suite in `src/index.test.ts`.

  Public API: `walk(levels, options)` (legacy stream entry), `walk.walk()`
  (by config sets), `walk.asArray()`, plus named exports for the same.

### Patch Changes

- Updated dependencies [22ec60f]
- Updated dependencies [79068ed]
- Updated dependencies [6a4b1b3]
- Updated dependencies [eb101dc]
- Updated dependencies [93526f7]
- Updated dependencies [670a68b]
- Updated dependencies [d5954b2]
- Updated dependencies [d5954b2]
  - @bem/sdk.cell@1.0.0
  - @bem/sdk.config@1.0.0
  - @bem/sdk.entity-name@1.0.0
  - @bem/sdk.file@1.0.0
  - @bem/sdk.naming.cell.match@1.0.0
  - @bem/sdk.naming.entity.parse@1.0.0
  - @bem/sdk.naming.entity.stringify@2.0.0
  - @bem/sdk.naming.presets@1.0.0

## Pre-1.0 history (legacy)

# [0.6.0](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.5.1...@bem/sdk.walk@0.6.0) (2019-04-15)


### Features

* allow to use new config format ([b8c0a22](https://github.com/bem/bem-sdk/commit/b8c0a22))





## [0.5.1](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.5.0...@bem/sdk.walk@0.5.1) (2019-02-03)

**Note:** Version bump only for package @bem/sdk.walk





<a name="0.5.0"></a>
# [0.5.0](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.4.0...@bem/sdk.walk@0.5.0) (2018-08-21)


### Features

* **walk:** asArray method ([24625c8](https://github.com/bem/bem-sdk/commit/24625c8))




<a name="0.4.0"></a>
# [0.4.0](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.3.2...@bem/sdk.walk@0.4.0) (2018-08-16)


### Bug Fixes

* **walk:** use realpath on passed paths, early fail on empties and enoent ([d43c70e](https://github.com/bem/bem-sdk/commit/d43c70e))


### Features

* **walk:** asArray method ([9a8911a](https://github.com/bem/bem-sdk/commit/9a8911a))




<a name="0.3.2"></a>
## [0.3.2](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.3.1...@bem/sdk.walk@0.3.2) (2018-07-16)




**Note:** Version bump only for package @bem/sdk.walk

<a name="0.3.1"></a>
## [0.3.1](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.3.0...@bem/sdk.walk@0.3.1) (2018-07-12)




**Note:** Version bump only for package @bem/sdk.walk

<a name="0.3.0"></a>
# [0.3.0](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.2.7...@bem/sdk.walk@0.3.0) (2018-07-01)


### Features

* **walk:** sdk cell match and presets support ([187647d](https://github.com/bem/bem-sdk/commit/187647d))




<a name="0.2.7"></a>
## [0.2.7](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.2.6...@bem/sdk.walk@0.2.7) (2018-04-17)




**Note:** Version bump only for package @bem/sdk.walk

<a name="0.2.6"></a>
## [0.2.6](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.2.5...@bem/sdk.walk@0.2.6) (2018-04-17)




**Note:** Version bump only for package @bem/sdk.walk

<a name="0.2.5"></a>
## [0.2.5](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.2.4...@bem/sdk.walk@0.2.5) (2017-12-17)




**Note:** Version bump only for package @bem/sdk.walk

<a name="0.2.4"></a>
## [0.2.4](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.2.3...@bem/sdk.walk@0.2.4) (2017-12-16)


### Bug Fixes

* **walk:** resolve cycle dependency ([9e8d925](https://github.com/bem/bem-sdk/commit/9e8d925))




<a name="0.2.3"></a>
## [0.2.3](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.2.2...@bem/sdk.walk@0.2.3) (2017-12-12)




**Note:** Version bump only for package @bem/sdk.walk

<a name="0.2.2"></a>
## [0.2.2](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.2.0...@bem/sdk.walk@0.2.2) (2017-11-07)


### Bug Fixes

* **walk:** typos in level field ([9976038](https://github.com/bem/bem-sdk/commit/9976038))




<a name="0.2.1"></a>
## [0.2.1](https://github.com/bem/bem-sdk/compare/@bem/sdk.walk@0.2.0...@bem/sdk.walk@0.2.1) (2017-10-02)


### Bug Fixes

* **walk:** typos in level field ([9976038](https://github.com/bem/bem-sdk/commit/9976038))




<a name="0.2.0"></a>
# 0.2.0 (2017-10-01)


### Bug Fixes

* renames inside the code ([913b259](https://github.com/bem/bem-sdk/commit/913b259))


### Features

* split bem-naming to naming.entity.* packages ([0bf481d](https://github.com/bem/bem-sdk/commit/0bf481d))




<a name="0.1.0"></a>
# 0.1.0 (2017-09-30)


### Bug Fixes

* renames inside the code ([913b259](https://github.com/bem/bem-sdk/commit/913b259))


### Features

* split bem-naming to naming.entity.* packages ([0bf481d](https://github.com/bem/bem-sdk/commit/0bf481d))
