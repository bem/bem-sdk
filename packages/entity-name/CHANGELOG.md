# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.11](https://github.com/bem/bem-sdk/compare/@bem/sdk.entity-name@0.2.10...@bem/sdk.entity-name@0.2.11) (2019-02-03)

**Note:** Version bump only for package @bem/sdk.entity-name





<a name="0.2.10"></a>
## [0.2.10](https://github.com/bem/bem-sdk/compare/@bem/sdk.entity-name@0.2.9...@bem/sdk.entity-name@0.2.10) (2018-07-16)




**Note:** Version bump only for package @bem/sdk.entity-name

<a name="0.2.9"></a>
## [0.2.9](https://github.com/bem/bem-sdk/compare/@bem/sdk.entity-name@0.2.6...@bem/sdk.entity-name@0.2.9) (2018-07-01)


### Bug Fixes

* **entity-name:** fix typo in typings ([37ca24c](https://github.com/bem/bem-sdk/commit/37ca24c))
* **entity-name:** rely on constructor in isBemEntityName ([74224de](https://github.com/bem/bem-sdk/commit/74224de))




<a name="0.2.6"></a>
## [0.2.6](https://github.com/bem/bem-sdk/compare/@bem/sdk.entity-name@0.2.5...@bem/sdk.entity-name@0.2.6) (2018-04-17)




**Note:** Version bump only for package @bem/sdk.entity-name

<a name="0.2.5"></a>
## [0.2.5](https://github.com/bem/bem-sdk/compare/@bem/sdk.entity-name@0.2.4...@bem/sdk.entity-name@0.2.5) (2018-04-17)


### Bug Fixes

* **entity-name:** fix typings exports ([df3f3d6](https://github.com/bem/bem-sdk/commit/df3f3d6))




<a name="0.2.4"></a>
## [0.2.4](https://github.com/bem/bem-sdk/compare/@bem/sdk.entity-name@0.2.3...@bem/sdk.entity-name@0.2.4) (2017-12-16)




**Note:** Version bump only for package @bem/sdk.entity-name

<a name="0.2.3"></a>
## [0.2.3](https://github.com/bem/bem-sdk/compare/@bem/sdk.entity-name@0.2.2...@bem/sdk.entity-name@0.2.3) (2017-12-12)


### Bug Fixes

* **entity-name:** dont add mod if value is falsy ([62b3453](https://github.com/bem/bem-sdk/commit/62b3453))




<a name="0.2.2"></a>
## [0.2.2](https://github.com/bem/bem-sdk/compare/@bem/sdk.entity-name@0.2.0...@bem/sdk.entity-name@0.2.2) (2017-11-07)




**Note:** Version bump only for package @bem/sdk.entity-name

<a name="0.2.1"></a>
## [0.2.1](https://github.com/bem/bem-sdk/compare/@bem/sdk.entity-name@0.2.0...@bem/sdk.entity-name@0.2.1) (2017-10-02)




**Note:** Version bump only for package @bem/sdk.entity-name

<a name="0.2.0"></a>
# 0.2.0 (2017-10-01)


### Bug Fixes

* renames inside the code ([913b259](https://github.com/bem/bem-sdk/commit/913b259))
* **entity-name:** normalizing tunings ([7e107af](https://github.com/bem/bem-sdk/commit/7e107af))
* **entity-name:** Return value must be always boolean ([7bf03b8](https://github.com/bem/bem-sdk/commit/7bf03b8))


### Features

* split bem-naming to naming.entity.* packages ([0bf481d](https://github.com/bem/bem-sdk/commit/0bf481d))




<a name="0.1.0"></a>
# 0.1.0 (2017-09-30)


### Bug Fixes

* renames inside the code ([913b259](https://github.com/bem/bem-sdk/commit/913b259))
* **entity-name:** normalizing tunings ([7e107af](https://github.com/bem/bem-sdk/commit/7e107af))


### Features

* split bem-naming to naming.entity.* packages ([0bf481d](https://github.com/bem/bem-sdk/commit/0bf481d))




Changelog
=========

1.5.0 (2017-04-20)
------------------

* Add [scope](./README.md#scope) field (@blond [#110]).
* Add [belongsTo](./README.md#belongstoentityname) method (@zxqfox @blond [#71], [#99]).
* Support [TypeScript](./README.md#typescript-support) (@blond [#93], [#113]).
* Handy error messages for invalid entities (@Yeti-or @blond [#77], [#95]).
* [Deprecation](./README.md#deprecation) messages for `modName` and `modVal` fields (@blond [#98], [#105]).
* [Serialization](./README.md#serialization) recipe (@blond [#113]).

[#113]: https://github.com/bem-sdk/bem-entity-name/pull/113
[#110]: https://github.com/bem-sdk/bem-entity-name/pull/110
[#105]: https://github.com/bem-sdk/bem-entity-name/pull/105
[#99]: https://github.com/bem-sdk/bem-entity-name/pull/99
[#98]: https://github.com/bem-sdk/bem-entity-name/pull/98
[#95]: https://github.com/bem-sdk/bem-entity-name/pull/95
[#93]: https://github.com/bem-sdk/bem-entity-name/pull/93
[#77]: https://github.com/bem-sdk/bem-entity-name/pull/77
[#71]: https://github.com/bem-sdk/bem-entity-name/pull/71

1.4.0
-----

* Support string in `BemEntityName.create()` method (@zxqfox [#89]).

[#89]: https://github.com/bem-sdk/bem-entity-name/pull/89

1.3.2
-----

* Update `@bem/naming` to `2.x` (@blond [#84]).

[#84]: https://github.com/bem-sdk/bem-entity-name/pull/84

1.3.1
-----

* Improve `isSimpleMod` method (@yeti-or [#82]).
Now it returns `null` for entities without modifier.

[#82]: https://github.com/bem-sdk/bem-entity-name/pull/82

1.3.0
-----

* Added `isSimpleMod` method (@yeti-or [#79]).

[#79]: https://github.com/bem-sdk/bem-entity-name/pull/79

1.2.0
-----

* Added `create` method (@zxqfox [#72]).
* Added `toJSON` method (@zxqfox [#66]).

[#72]: https://github.com/bem-sdk/bem-entity-name/pull/72
[#66]: https://github.com/bem-sdk/bem-entity-name/pull/66

1.1.0
-----

* Added `isBemEntityName` method ([#65]).

[#65]: https://github.com/bem-sdk/bem-entity-name/pull/65
