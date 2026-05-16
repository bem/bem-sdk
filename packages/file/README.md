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

### `new BemFile(options: BemFileOptions): BemFile`

`options.cell` may be a `BemCell` instance or any value accepted by
`BemCell.create`. `level` and `path` must be strings or `null` when
provided.

### `BemFile.create(input: BemFileCreateOptions | BemCell | BemFile): BemFile`

Permissive factory. Accepts an existing `BemFile`, a `BemCell`, or a
flat options object combining `BemCell.create` fields with
`level` / `path`.

```ts
import { BemFile } from '@bem/sdk.file';

BemFile.create({ block: 'button', tech: 'css', level: 'common.blocks' });
```

### `file.cell: BemCell`

The underlying cell. `file.entity`, `file.tech`, `file.layer` are
proxied from it for convenience.

### `file.level: Level | undefined`, `file.path: Path | undefined`

Optional strings.

### `file.id: string`

`<level>/<cell.id>` (level part is optional). Stable identifier for
equality and set keys.

### `file.isEqual(other: BemFile): boolean`

Deep equality by cell, level and path.

### `file.valueOf(): BemFileRepresentation` / `file.toJSON(): BemFileRepresentation`

Plain-object representation.

### `file.toString(): string`

Alias for `file.id`.

### `BemFile.isBemFile(value: unknown): value is BemFile`

Cross-realm `instanceof`-style guard.

For exhaustive typings (`BemFileOptions`, `BemFileCreateOptions`,
`BemFileRepresentation`, `Level`, `Path`) see `dist/index.d.ts`.

## License

MPL-2.0
