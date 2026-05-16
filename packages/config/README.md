# @bem/sdk.config

> Resolves a BEM project's `bem.config.*` files (via [`betterc`][betterc]),
> merges them, and exposes per-level / per-set / per-library settings.

[![npm](https://img.shields.io/npm/v/@bem/sdk.config.svg)](https://www.npmjs.org/package/@bem/sdk.config)

## Install

```sh
pnpm add @bem/sdk.config
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { bemConfig } from '@bem/sdk.config';

const config = bemConfig({ cwd: process.cwd() });

const merged = await config.get();           // MergedConfig
const root   = await config.root();          // project root path
const level  = await config.level('common.blocks');
const levels = await config.levels('desktop');
```

Every async method has a `*Sync` counterpart with the same signature.

## API

### `bemConfig(options?: BemConfigOptions): BemConfig`

Convenience factory; equivalent to `new BemConfig(options)`.

### `new BemConfig(options?: BemConfigOptions): BemConfig`

`options.cwd` must be absolute (defaults to `process.cwd()`). Other
notable fields: `defaults`, `configs` (skip the `betterc` search and
inject configs directly), `pathToConfig`, `extendBy`, `plugins`,
`fsRoot`, `fsHome`, `name`.

### `config.configs(): Promise<RawConfig[]>` / `config.configsSync(): RawConfig[]`

Raw configs after the built-in `resolve-level` plugin pass and any
user plugins.

### `config.get(): Promise<MergedConfig>` / `config.getSync(): MergedConfig`

Fully merged config.

### `config.root(): Promise<string | undefined>` / `config.rootSync(): string | undefined`

Project root path (taken from the deepest config with `root: true`).

### `config.level(path: string): Promise<LevelConfig | undefined>` / `config.levelSync(path: string): LevelConfig | undefined`

Merged config for a single level identified by path.

### `config.levelByPath(input: string): Promise<LevelConfig | undefined>` / `config.levelByPathSync(input: string): LevelConfig | undefined`

> Added in current release (closes #277).

Picks the most specific level whose path is a directory-aware prefix of
`input`. `/a/b/blocks` does not match `/a/b/blocks-extra/…`.

### `config.levels(setName: string): Promise<LevelConfig[]>` / `config.levelsSync(setName: string): LevelConfig[]`

Levels for a named set, expanding `library` and nested set references.

### `config.levelMap(): Promise<Record<string, LevelConfig>>` / `config.levelMapSync(): Record<string, LevelConfig>`

Map of level-path → merged `LevelConfig` for every known level.

### `config.library(name: string): Promise<BemConfig>` / `config.librarySync(name: string): BemConfig`

A `BemConfig` rooted at the referenced library.

### `config.module(name: string): Promise<unknown>` / `config.moduleSync(name: string): unknown`

Module section for a given name from the merged config.

### `merge(...configs: RawConfig[]): MergedConfig`

Deep merge with set-aware semantics. Used internally and exported for
custom plugins.

### `resolveSets(sets: Record<string, SetDefinition>): Record<string, SetChunk[]>`

Expands string forms (`"common"`, `"@lib/layer"`, `"setName@lib"`) into
arrays of `SetChunk`.

For exhaustive typings (`BemConfigOptions`, `LevelConfig`, `LibConfig`,
`MergedConfig`, `RawConfig`, `SetChunk`, `SetDefinition`, `ConfigPlugin`)
see `dist/index.d.ts`.

## License

MPL-2.0

[betterc]: https://www.npmjs.com/package/betterc
