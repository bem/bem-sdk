# @bem/sdk.file

> A `BemCell` plus its physical location: file `path` and `level`.
> Companion to `@bem/sdk.cell`.

[![npm](https://img.shields.io/npm/v/@bem/sdk.file.svg)](https://www.npmjs.org/package/@bem/sdk.file)

## Install

```sh
pnpm add @bem/sdk.file
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { BemFile } from '@bem/sdk.file';
import { BemCell } from '@bem/sdk.cell';
import { BemEntityName } from '@bem/sdk.entity-name';

const cell = new BemCell({
  entity: new BemEntityName({ block: 'button' }),
  tech: 'css',
});
const file = new BemFile({
  cell,
  level: 'common.blocks',
  path: 'common.blocks/button/button.css',
});

file.cell;  // BemCell
file.level; // 'common.blocks'
file.path;  // 'common.blocks/button/button.css'
file.id;    // 'common.blocks/button.css'
```

## API

### `new BemFile({ cell, level?, path? })`

`cell` may be a `BemCell` or any value accepted by `BemCell.create`.
`level` and `path` must be strings when provided.

### `BemFile.create(input)`

Permissive factory. Accepts an existing `BemFile`, a `BemCell`, or any
flat options object suitable for `BemCell.create` plus `level` / `path`.

### `BemFile.isBemFile(value)`

Cross-realm `instanceof`-style guard.

### Instance properties

- `cell` — the underlying `BemCell`.
- `level`, `path` — optional strings.
- `entity`, `tech`, `layer` — proxied from `cell`.
- `id` — `<level>/<cell.id>` (level optional). Stable identifier for
  equality / sets.

### Instance methods

- `isEqual(file)` — deep equality by cell, level and path.
- `valueOf()` / `toJSON()` — plain `BemFileRepresentation` object.
- `toString()` — alias for `id`.

For exhaustive typings, see `BemFileOptions`, `BemFileCreateOptions`,
`BemFileRepresentation`, `Level`, `Path` in `dist/index.d.ts`.

## License

MPL-2.0
