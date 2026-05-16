# @bem/sdk.cell

> Identifier of a single piece of a [BEM entity][bem-entity]: an entity
> name plus optional `tech` and `layer`. Used as a vertex in dependency
> graphs and as a stringifier input.

[![npm](https://img.shields.io/npm/v/@bem/sdk.cell.svg)](https://www.npmjs.org/package/@bem/sdk.cell)

## Install

```sh
pnpm add @bem/sdk.cell
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { BemCell } from '@bem/sdk.cell';
import { BemEntityName } from '@bem/sdk.entity-name';

const entity = new BemEntityName({ block: 'button', elem: 'text' });
const cell = new BemCell({ entity, tech: 'css', layer: 'desktop' });

cell.entity; // BemEntityName { block: 'button', elem: 'text' }
cell.tech;   // 'css'
cell.layer;  // 'desktop'
cell.id;     // 'button__text@desktop.css'
```

## API

### `new BemCell(options: BemCellOptions): BemCell`

`options.entity` must be a `BemEntityName` instance. `tech` and `layer`
are optional strings. Throws on missing or invalid `entity`.

```ts
import { BemCell } from '@bem/sdk.cell';
import { BemEntityName } from '@bem/sdk.entity-name';

new BemCell({
  entity: new BemEntityName({ block: 'button', mod: 'theme' }),
  tech: 'css',
});
```

### `BemCell.create(input: BemCellCreateOptions | BemEntityName | BemCell): BemCell`

Permissive factory. Accepts:

- an existing `BemCell` (returned as-is);
- a `BemEntityName` (wrapped without tech/layer);
- `{ entity: <name | options>, tech?, layer? }`;
- flat options `{ block, elem?, mod?, val?, tech?, layer? }`.

```ts
import { BemCell } from '@bem/sdk.cell';

BemCell.create({ block: 'button', mod: 'theme', val: 'red', tech: 'js' });
// → BemCell { entity: { block: 'button', mod: { name: 'theme', val: 'red' } }, tech: 'js' }
```

### `cell.entity: BemEntityName`

The underlying entity. `cell.block`, `cell.elem`, `cell.mod` are
proxied from it for convenience.

### `cell.tech: Tech | undefined` / `cell.layer: Layer | undefined`

Optional strings.

### `cell.id: string`

Stable `<entity>[@<layer>][.<tech>]` identifier used for equality and
set keys. Not a naming-conventional path — use
`@bem/sdk.naming.cell.stringify` to produce a real file path.

```ts
new BemCell({
  entity: new BemEntityName({ block: 'button', elem: 'text' }),
  tech: 'css',
  layer: 'desktop',
}).id;
// → 'button__text@desktop.css'
```

### `cell.isEqual(other: BemCell): boolean`

Deep equality by entity, tech and layer.

### `cell.valueOf(): BemCellRepresentation` / `cell.toJSON(): BemCellRepresentation`

Plain-object representation.

### `cell.toString(): string`

Alias for `cell.id`.

### `BemCell.isBemCell(value: unknown): value is BemCell`

Cross-realm `instanceof`-style guard.

```ts
BemCell.isBemCell(BemCell.create({ block: 'button' })); // true
BemCell.isBemCell({ block: 'button' });                 // false
```

For exhaustive typings, see `BemCellOptions`, `BemCellCreateOptions`,
`BemCellRepresentation`, `Tech`, `Layer` in `dist/index.d.ts`.

## License

MPL-2.0

[bem-entity]: https://en.bem.info/methodology/key-concepts/#bem-entity
