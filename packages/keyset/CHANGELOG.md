# Change Log

## 1.0.0

### Features

- `Keyset.merge(...keysets)` (and `keyset.merge(...others)`) and
  `LangKeys.merge(...langKeys)` — combine sources, deduplicating by key
  name with last-write-wins semantics. Inputs are not mutated. Closes [#350].

[#350]: https://github.com/bem/bem-sdk/issues/350

### Major Changes

- b717cfd: Migrated to TypeScript / ESM (Node >=20).
  Public API: named exports `Key`, `ParamedKey`, `PluralKey`, `LangKeys`, `Keyset`, plus types `FormatName`, `KeyValue`, `PluralForm`, `PluralForms`. Default export removed. Keyset I/O moved to `node:fs/promises` (no more callback-based `util.promisify`). Internal `xamel` access goes through a typed promise wrapper. Tests no longer use `mock-fs` — `Keyset.load` / `Keyset.save` are exercised against real temp directories.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.1](https://github.com/bem/bem-sdk/compare/@bem/sdk.keyset@0.1.0...@bem/sdk.keyset@0.1.1) (2019-04-15)

**Note:** Version bump only for package @bem/sdk.keyset
