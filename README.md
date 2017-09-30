bem-sdk
=======

<div align="center">
    <img width="300" height="300" src="https://rawgithub.com/bem/bem-sdk/master/logo.svg" alt="logo" />
</div>

Usefull modules to work with [BEM] methodology:

general:

* [bem-walk](https://github.com/bem/bem-sdk/tree/master/packages/walk) — traversing a BEM project's file system
* [bem-config](https://github.com/bem/bem-sdk/tree/master/packages/config) — keeping all configuration of BEM project in one place

naming:

* [bem-naming](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity) — working with [bem-entity] string representation
* [bem-fs-scheme](https://github.com/bem/bem-sdk/tree/master/packages/fs-scheme) — finding path to [bem-entity] inside a BEM project's file system

declarations:

* [bem-decl](https://github.com/bem/bem-sdk/tree/master/packages/decl) — working with sets of [bem-entity], intersecting, merging, substracting...
* [bemjson-to-decl](https://github.com/bem/bem-sdk/tree/master/packages/bemjson-to-decl) – extracting declarations from [bemjson]
* [bemjson-to-jsx](https://github.com/bem/bem-sdk/tree/master/packages/bemjson-to-jsx) – transforming [bemjson] to [JSX] markup
* [bem-import-notation](https://github.com/bem/bem-sdk/tree/master/packages/import-notation) — extracting declarations from es6-import/require strings

dependencies:

* [bem-graph](https://github.com/bem/bem-sdk/tree/master/packages/graph) — working with graph of dependencies
* [bem-deps](https://github.com/bem/bem-sdk/tree/master/packages/deps) — high-level tool for managing bem-deps

containers:

* [bem-entity-name](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity) — [bem-entity] name representation
* [bem-cell](https://github.com/bem/bem-sdk/tree/master/packages/cell) — partial [bem-entity] with tech and layer
* [bem-bundle](https://github.com/bem/bem-sdk/tree/master/packages/bundle) — representation of bem-bundle

[BEM]: https://en.bem.info
[bem-entity]: https://en.bem.info/methodology/key-concepts/#bem-entity
[bemjson]: https://en.bem.info/platform/bemjson/
[JSX]: https://facebook.github.io/react/docs/introducing-jsx.html
