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
import { BemConfig, bemConfig } from '@bem/sdk.config';

const config = bemConfig({ cwd: process.cwd() });

const merged = await config.get();           // MergedConfig
const root   = await config.root();          // project root path
const level  = await config.level('common.blocks');
const levels = await config.levels('desktop');
```

Sync mirrors are provided for environments that need them
(`config.getSync()`, `config.levelSync()`, etc.).

## API

### `bemConfig(options?): BemConfig`

Convenience factory; equivalent to `new BemConfig(options)`.

### `class BemConfig`

`new BemConfig(options?)` — `options.cwd` defaults to `process.cwd()`.
Other notable fields: `defaults`, `configs` (skip the search and inject
configs directly), `pathToConfig`, `extendBy`, `plugins`,
`fsRoot`, `fsHome`.

Async methods (and matching `*Sync` variants):

- `configs()` — list of raw configs after the `resolve-level` plugin
  pass.
- `get()` — fully merged `MergedConfig`.
- `root()` — project root path.
- `level(path)` — resolved `LevelConfig` for a single level.
- `levels(setName)` — `LevelConfig[]` for a named set, expanding
  library references.
- `levelMap()` — `Record<path, LevelConfig>` for every known level.
- `library(name)` — `BemConfig` rooted at a referenced library.

### Helpers

- `merge(...configs): MergedConfig` — deep merge with set-aware
  semantics.
- `resolveSets(sets): Record<setName, SetChunk[]>` — expands `sets`
  references.

For exhaustive typings, see `BemConfigOptions`, `LevelConfig`,
`LibConfig`, `MergedConfig`, `RawConfig`, `SetChunk`, `SetDefinition`,
`ConfigPlugin` in `dist/index.d.ts`.

## License

MPL-2.0

[betterc]: https://www.npmjs.com/package/betterc
