# @bem/sdk

<div align="center">
    <img width="300" height="300" src="https://rawgithub.com/bem/bem-sdk/master/logo.svg" alt="logo" />
</div>

Useful modules to work with projects based on principles of [BEM][] methodology.

## General

* [walk](https://github.com/bem/bem-sdk/tree/master/packages/walk) — traversing a BEM project's file system
* [config](https://github.com/bem/bem-sdk/tree/master/packages/config) — keeping all configuration of BEM project in one place

## Naming

* [naming.entity](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity) — the old well-known `bem-naming` package. Contains of `parse` and `stringify` methods — package under consideration, better to use separated packages instead.
* [naming.entity.stringify](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity.stringify) — stringifier for [entity][] representation
* [naming.entity.parse](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity.parse) — parser for [entity][] representation
* [naming.cell.stringify](https://github.com/bem/bem-sdk/tree/master/packages/naming.cell.stringify) — stringifier path to [entity][] inside a BEM project's file system
* [naming.cell.match](https://github.com/bem/bem-sdk/tree/master/packages/naming.cell.match) — loose parser for [entity][] path to [entity][] inside a BEM project's file system
* [naming.presets](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets) — well-known presets for `naming.*` packages

## Declarations

* [decl](https://github.com/bem/bem-sdk/tree/master/packages/decl) — working with sets of [entity][], intersecting, merging, substracting...
* [bemjson-to-decl](https://github.com/bem/bem-sdk/tree/master/packages/bemjson-to-decl) – extracting declarations from [bemjson][]
* [bemjson-to-jsx](https://github.com/bem/bem-sdk/tree/master/packages/bemjson-to-jsx) – transforming [bemjson][] to [JSX][] markup
* [import-notation](https://github.com/bem/bem-sdk/tree/master/packages/import-notation) — extracting declarations from es6-import and require strings

## Dependencies

* [graph](https://github.com/bem/bem-sdk/tree/master/packages/graph) — working with graph of dependencies
* [deps](https://github.com/bem/bem-sdk/tree/master/packages/deps) — high-level tool for managing [BEM][]-based deps

## Containers

* [entity-name](https://github.com/bem/bem-sdk/tree/master/packages/entity-name) — [entity][] name representation
* [cell](https://github.com/bem/bem-sdk/tree/master/packages/cell) — partial [entity][] with tech and layer
* [file](https://github.com/bem/bem-sdk/tree/master/packages/file) — partial cell with full path and level
* [bundle](https://github.com/bem/bem-sdk/tree/master/packages/bundle) — representation of [BEM][] bundles: name, set of cells, and bemjson optionally

[BEM]: https://en.bem.info
[entity]: https://en.bem.info/methodology/key-concepts/#bem-entity
[bemjson]: https://en.bem.info/platform/bemjson/
[JSX]: https://facebook.github.io/react/docs/introducing-jsx.html
