# @bem/sdk.walk

> Streaming walker over a BEM project's file system. Reads `BemConfig`,
> traverses level directories under the configured naming scheme and
> emits a stream of `BemFile`-like objects.

[![npm](https://img.shields.io/npm/v/@bem/sdk.walk.svg)](https://www.npmjs.org/package/@bem/sdk.walk)

## Install

```sh
pnpm add @bem/sdk.walk
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { walk, walkSets, asArray } from '@bem/sdk.walk';

// Quick: walk an explicit list of level paths.
walk(['common.blocks', 'desktop.blocks'])
  .on('data', (file) => console.log(file.cell.id, '->', file.path))
  .on('end',  () => console.log('done'));

// Drained into an array.
const files = await asArray(['common.blocks', 'desktop.blocks']);

// Config-driven: pulls levels and sets from `BemConfig`.
import { BemConfig } from '@bem/sdk.config';

walkSets({
  sets: 'desktop',
  config: new BemConfig({ cwd: process.cwd() }),
})
  .on('data', (file) => /* ... */ {});
```

## API

### `walk(levels?, options?): Readable`

Quick entry point for the legacy "give me a list of paths" workflow.
Returns an object-mode `Readable` that emits one file per chunk.

- `levels` — array of level paths.
- `options` — `LegacyWalkOptions`. Common fields:
  `defaults.scheme` (`'nested' | 'mixed' | 'flat'`),
  `defaults.naming`, `levels`, `configs`.

### `walkSets(options): Readable`

Config-driven variant.

- `options.sets` — comma- or space-separated set names.
- `options.levels` — narrows the levels included from the resolved
  sets.
- `options.config` — a `BemConfig` instance or plain
  `BemConfigOptions` object.

### `asArray(...args): Promise<unknown[]>`

Convenience wrapper around `walk(...)` that resolves with the full
list of emitted files (use only when the result fits in memory).

### `walkers`

Map of built-in walker implementations (`walkers.sdk`,
`walkers.nested`, etc.). Mostly internal; useful when wiring custom
schemes via `defaults.legacyWalker = true`.

For exhaustive typings, see `Walker`, `WalkerInfo`, `WalkerAdd`,
`WalkerName`, `LegacyWalkOptions`, `WalkOptions` in `dist/index.d.ts`.

## License

MPL-2.0
