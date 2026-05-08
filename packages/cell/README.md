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

BemCell.create({ block: 'button', mod: 'theme', val: 'red', tech: 'js' });
// BemCell { entity: { block: 'button', mod: { name: 'theme', val: 'red' } }, tech: 'js' }
```

## API

### `new BemCell({ entity, tech?, layer? })`

`entity` must be a `BemEntityName` instance. Throws on missing or
invalid `entity`.

### `BemCell.create(input)`

Permissive factory. Accepts:

- an existing `BemCell` (returned as-is);
- a `BemEntityName` (wrapped without tech/layer);
- `{ entity: <name | options>, tech?, layer? }`;
- flat options `{ block, elem?, mod?, val?, tech?, layer? }`.

### `BemCell.isBemCell(value)`

Cross-realm `instanceof`-style guard.

### Instance properties

- `entity` — the underlying `BemEntityName`.
- `tech`, `layer` — optional strings.
- `block`, `elem`, `mod` — proxied from `entity`.
- `id` — stable `<entity>[@<layer>][.<tech>]` string used for equality
  and set keys (not a naming-conventional path).

### Instance methods

- `isEqual(cell)` — deep equality by entity, tech and layer.
- `valueOf()` / `toJSON()` — plain `BemCellRepresentation` object.
- `toString()` — alias for `id`.

For exhaustive typings, see `BemCellOptions`,
`BemCellCreateOptions`, `BemCellRepresentation`, `Tech`, `Layer` in
`dist/index.d.ts`.

## Stringifying as a path

`id` is for identity only. Use `@bem/sdk.naming.cell.stringify` to
produce a real file path under a chosen naming convention.

## License

MPL-2.0

[bem-entity]: https://en.bem.info/methodology/key-concepts/#bem-entity
