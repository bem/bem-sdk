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
