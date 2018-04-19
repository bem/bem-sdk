# @bem/sdk

<div align="center">
    <img width="300" height="300" src="https://rawgithub.com/bem/bem-sdk/master/logo.svg" alt="logo" />
</div>

Usefull modules to work with [BEM][] methodology.

## General

* [@bem/sdk.walk](https://github.com/bem/bem-sdk/tree/master/packages/walk) — traversing a BEM project's file system
* [@bem/sdk.config](https://github.com/bem/bem-sdk/tree/master/packages/config) — keeping all configuration of BEM project in one place

## Naming

* [@bem/sdk.naming.entity](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity) — the old well-known `bem-naming` package. Contains of `parse` and `stringify` methods (DEPREACTED, use separated packages instead)
* [@bem/sdk.naming.entity.stringify](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity.stringify) — stringifier for [entity][] representation
* [@bem/sdk.naming.entity.parse](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity.parse) — parser for [entity][] representation
* [@bem/sdk.naming.cell.stringify](https://github.com/bem/bem-sdk/tree/master/packages/naming.cell.stringify) — stringifier path to [entity][] inside a BEM project's file system
* [@bem/sdk.naming.presets](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets) — well-known presets for `naming.*` packages

## Declarations

* [@bem/sdk.decl](https://github.com/bem/bem-sdk/tree/master/packages/decl) — working with sets of [entity][], intersecting, merging, substracting...
* [@bem/sdk.bemjson-to-decl](https://github.com/bem/bem-sdk/tree/master/packages/bemjson-to-decl) – extracting declarations from [bemjson][]
* [@bem/sdk.bemjson-to-jsx](https://github.com/bem/bem-sdk/tree/master/packages/bemjson-to-jsx) – transforming [bemjson] to [JSX][] markup
* [@bem/sdk.import-notation](https://github.com/bem/bem-sdk/tree/master/packages/import-notation) — extracting declarations from es6-import/require strings

## Dependencies

* [@bem/sdk.graph](https://github.com/bem/bem-sdk/tree/master/packages/graph) — working with graph of dependencies
* [@bem/sdk.deps](https://github.com/bem/bem-sdk/tree/master/packages/deps) — high-level tool for managing bem-deps

## Containers

* [@bem/sdk.entity-name](https://github.com/bem/bem-sdk/tree/master/packages/entity-name) — [entity][] name representation
* [@bem/sdk.cell](https://github.com/bem/bem-sdk/tree/master/packages/cell) — partial [entity][] with tech and layer
* [@bem/sdk.file](https://github.com/bem/bem-sdk/tree/master/packages/file) — partial cell with path and level
* [@bem/sdk.bundle](https://github.com/bem/bem-sdk/tree/master/packages/bundle) — representation of bem-bundle

[BEM]: https://en.bem.info
[entity]: https://en.bem.info/methodology/key-concepts/#bem-entity
[bemjson]: https://en.bem.info/platform/bemjson/
[JSX]: https://facebook.github.io/react/docs/introducing-jsx.html
