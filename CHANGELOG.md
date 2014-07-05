Changelog
=========

0.1.0
-----

 * Methods `validate`, `isBlock`, `isElem`, `isBlockMod`, `isElemMod` were added.
 * Generated string will not get modifier if `modVal` field of BEM-naming object is `undefined`.
 * `stringify` method throws error if invalid BEM-naming object is specified.
 * `parse` method was fixed: BEM-naming object does not contain explicit `undefined` fields.
