# @bem/sdk.entity-name

> Representation of a [BEM entity][bem-entity] name (block, element,
> modifier) with stable identity, equality and JSON serialization.

[![npm](https://img.shields.io/npm/v/@bem/sdk.entity-name.svg)](https://www.npmjs.org/package/@bem/sdk.entity-name)

## Install

```sh
pnpm add @bem/sdk.entity-name
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { BemEntityName } from '@bem/sdk.entity-name';

const name = new BemEntityName({ block: 'button', elem: 'text' });

name.block; // 'button'
name.elem;  // 'text'
name.mod;   // undefined
name.type;  // 'elem'
name.id;    // 'button__text'

name.isEqual(new BemEntityName({ block: 'button' }));               // false
name.isEqual(new BemEntityName({ block: 'button', elem: 'text' })); // true

const mod = BemEntityName.create({ block: 'button', mod: 'focused' });
mod.belongsTo(new BemEntityName({ block: 'button' })); // true
JSON.stringify(mod); // '{"block":"button","mod":{"name":"focused","val":true}}'
```

## API

### `new BemEntityName({ block, elem?, mod? })`

Builds an immutable entity. `mod` accepts a string (shorthand for
`{ name, val: true }`) or `{ name, val? }`. Throws `EntityTypeError`
when `block` is missing or when `mod.val` is given without `mod.name`.

### `BemEntityName.create(input)`

Permissive factory. Accepts a string (block name), an existing
`BemEntityName`, or a flat options object that may also use
`{ modName, modVal, val }` shorthands.

### `BemEntityName.isBemEntityName(value)`

Cross-realm `instanceof`-style guard.

### Instance properties

- `block`, `elem`, `mod` — normalised parts of the entity.
- `type` — one of `'block' | 'elem' | 'blockMod' | 'elemMod'`.
- `scope` — parent `BemEntityName` for elements / mods, `null` for a
  plain block.
- `id` — stable string identifier (uses the `origin` naming preset);
  intended for set keys and equality only, **not** for output.

### Instance methods

- `isSimpleMod()` — `true` for `mod.val === true`, `false` otherwise,
  `null` for entities without `mod`.
- `isEqual(entityName)` — deep equality by `id`.
- `belongsTo(entityName)` — modifier-belongs-to-block / elem-belongs-to
  block / mod-of-elem-belongs-to elem.
- `valueOf()` / `toJSON()` — plain object form.
- `toString()` — alias for `id`.

### `EntityTypeError`

Thrown by the constructor on invalid input. Exposes the offending
object via `error.entity`.

For full typings, see `EntityNameOptions`, `EntityNameCreateOptions`,
`EntityRepresentation`, `Modifier` and `EntityType` in
`dist/index.d.ts`.

## Naming-aware string form

`id` is **not** a naming-conventional string. To produce one, pass the
entity to a stringifier from `@bem/sdk.naming.entity.stringify` or the
combined `@bem/sdk.naming.entity` package.

## License

MPL-2.0

[bem-entity]: https://en.bem.info/methodology/key-concepts/#bem-entity
