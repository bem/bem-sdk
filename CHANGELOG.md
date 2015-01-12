Changelog
=========

0.5.1
-----

* Implemented caching for `BEMNaming` instances (#53).
* `stringify` method is speeded up by 2,5 times (#57).
* `parse` method is speeded up on 15% (#58).
* `typeOf` method is speeded up by 2,25 times (#59).

0.5.0
-----

* API: delimiters provided (#48).

0.4.0
-----

* Simplified API for custom naming convention (#37).
* Added method `typeOf` (#35).
* Added support for CamelCase (#34).
* Added license.

0.3.0
-----

* Option `elemSeparator` is **deprecated**, use `elem` instead.
* Option `modSeparator` is **deprecated**, use `mod` instead.
* Option `literal` is **deprecated**, use `wordPattern` instead.

0.2.1
-----

* Fixed `package.json` file.

0.2.0
-----

* Added ability to use BEM-naming object without `modVal` field.
* Added minified version.
* Fixed bug with `is*` methods for invalid strings.
* Fixed bug with `bemNaming` for IE6-8.

0.1.0
-----

* Methods `validate`, `isBlock`, `isElem`, `isBlockMod`, `isElemMod` were added.
* Generated string will not get modifier if `modVal` field of BEM-naming object is `undefined`.
* `stringify` method throws error if invalid BEM-naming object is specified.
* `parse` method was fixed: BEM-naming object does not contain explicit `undefined` fields.
