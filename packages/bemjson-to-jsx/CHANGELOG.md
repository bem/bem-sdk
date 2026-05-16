# @bem/sdk.bemjson-to-jsx

## 1.0.0

### Bug fixes

- `styleToObj` now trims whitespace around colons and semicolons in inline
  `style="..."` strings, so `'width: 200px; height: 100px;'` parses into
  `{ width: '200px', height: '100px' }` instead of `{ width: ' 200px' }`.
  Ports the fix from the archived bem-sdk-archive/bemjson-to-jsx#34.
  Closes [#241].

[#241]: https://github.com/bem/bem-sdk/issues/241

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

## Pre-1.0 history (legacy)

## [0.2.9](https://github.com/bem/bem-sdk/compare/@bem/sdk.bemjson-to-jsx@0.2.8...@bem/sdk.bemjson-to-jsx@0.2.9) (2019-02-03)

**Note:** Version bump only for package @bem/sdk.bemjson-to-jsx





<a name="0.2.8"></a>
## [0.2.8](https://github.com/bem/bem-sdk/compare/@bem/sdk.bemjson-to-jsx@0.2.7...@bem/sdk.bemjson-to-jsx@0.2.8) (2018-07-16)




**Note:** Version bump only for package @bem/sdk.bemjson-to-jsx

<a name="0.2.7"></a>
## [0.2.7](https://github.com/bem/bem-sdk/compare/@bem/sdk.bemjson-to-jsx@0.2.6...@bem/sdk.bemjson-to-jsx@0.2.7) (2018-07-01)




**Note:** Version bump only for package @bem/sdk.bemjson-to-jsx

<a name="0.2.6"></a>
## [0.2.6](https://github.com/bem/bem-sdk/compare/@bem/sdk.bemjson-to-jsx@0.2.5...@bem/sdk.bemjson-to-jsx@0.2.6) (2018-04-17)




**Note:** Version bump only for package @bem/sdk.bemjson-to-jsx

<a name="0.2.5"></a>
## [0.2.5](https://github.com/bem/bem-sdk/compare/@bem/sdk.bemjson-to-jsx@0.2.4...@bem/sdk.bemjson-to-jsx@0.2.5) (2018-04-17)




**Note:** Version bump only for package @bem/sdk.bemjson-to-jsx

<a name="0.2.4"></a>
## [0.2.4](https://github.com/bem/bem-sdk/compare/@bem/sdk.bemjson-to-jsx@0.2.3...@bem/sdk.bemjson-to-jsx@0.2.4) (2017-12-16)




**Note:** Version bump only for package @bem/sdk.bemjson-to-jsx

<a name="0.2.3"></a>
## [0.2.3](https://github.com/bem/bem-sdk/compare/@bem/sdk.bemjson-to-jsx@0.2.2...@bem/sdk.bemjson-to-jsx@0.2.3) (2017-12-12)




**Note:** Version bump only for package @bem/sdk.bemjson-to-jsx

<a name="0.2.2"></a>
## [0.2.2](https://github.com/bem/bem-sdk/compare/@bem/sdk.bemjson-to-jsx@0.2.0...@bem/sdk.bemjson-to-jsx@0.2.2) (2017-11-07)




**Note:** Version bump only for package @bem/sdk.bemjson-to-jsx

<a name="0.2.1"></a>
## [0.2.1](https://github.com/bem-sdk/bemjson-to-jsx/compare/@bem/sdk.bemjson-to-jsx@0.2.0...@bem/sdk.bemjson-to-jsx@0.2.1) (2017-10-02)




**Note:** Version bump only for package @bem/sdk.bemjson-to-jsx

<a name="0.2.0"></a>
# 0.2.0 (2017-10-01)


### Bug Fixes

* renames inside the code ([913b259](https://github.com/bem-sdk/bemjson-to-jsx/commit/913b259))


### Features

* split bem-naming to naming.entity.* packages ([0bf481d](https://github.com/bem-sdk/bemjson-to-jsx/commit/0bf481d))




<a name="0.1.0"></a>
# 0.1.0 (2017-09-30)


### Bug Fixes

* renames inside the code ([913b259](https://github.com/bem-sdk/bemjson-to-jsx/commit/913b259))


### Features

* split bem-naming to naming.entity.* packages ([0bf481d](https://github.com/bem-sdk/bemjson-to-jsx/commit/0bf481d))
