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
name.type;  // 'elem'
name.id;    // 'button__text'

name.isEqual(new BemEntityName({ block: 'button' }));               // false
name.isEqual(new BemEntityName({ block: 'button', elem: 'text' })); // true

const mod = BemEntityName.create({ block: 'button', mod: 'focused' });
mod.belongsTo(new BemEntityName({ block: 'button' })); // true
JSON.stringify(mod); // '{"block":"button","mod":{"name":"focused","val":true}}'
```

## API

### `new BemEntityName(options: EntityNameOptions): BemEntityName`

Builds an immutable entity. `mod` accepts either a string (shorthand
for `{ name, val: true }`) or `{ name, val? }`. Throws
`EntityTypeError` when `block` is missing or when `mod.val` is given
without `mod.name`.

```ts
new BemEntityName({ block: 'button' });
new BemEntityName({ block: 'button', mod: 'focused' });
new BemEntityName({ block: 'button', mod: { name: 'theme', val: 'normal' } });
```

### `BemEntityName.create(input: string | EntityNameCreateOptions | BemEntityName): BemEntityName`

Permissive factory. Accepts a string (block name), an existing
`BemEntityName`, or a flat options object that may also use
`{ modName, modVal, val }` shorthands.

```ts
BemEntityName.create('button');
BemEntityName.create({ block: 'button', modName: 'theme', val: 'normal' });
```

### `name.block: BlockName`, `name.elem: ElementName | undefined`, `name.mod: Modifier | undefined`

Normalised parts of the entity.

### `name.type: EntityType`

One of `'block' | 'elem' | 'blockMod' | 'elemMod'`.

### `name.scope: BemEntityName | null`

Parent entity for elements / mods, `null` for a plain block.

```ts
new BemEntityName({ block: 'button', elem: 'text' }).scope;
// → BemEntityName { block: 'button' }
```

### `name.id: Id`

Stable string identifier (uses the `origin` naming preset). For set
keys and equality only — **not** a naming-conventional path.

### `name.isSimpleMod(): boolean | null`

`true` for `mod.val === true`, `false` for any other value, `null` for
entities without `mod`.

### `name.isEqual(other: BemEntityName): boolean`

Deep equality by `id`.

### `name.belongsTo(other: BemEntityName): boolean`

> Fixed in current release (closes #269): key-value mod now belongs to
> its boolean form.

`true` if `this` is a modifier of `other`, or an element-mod whose
element matches `other`, etc.

### `name.valueOf(): EntityRepresentation` / `name.toJSON(): EntityRepresentation`

Plain-object representation.

### `name.toString(): string`

Alias for `name.id`.

### `BemEntityName.isBemEntityName(value: unknown): value is BemEntityName`

Cross-realm `instanceof`-style guard.

### `EntityTypeError`

Thrown by the constructor on invalid input. Exposes the offending
object via `error.entity`.

For full typings (`EntityNameOptions`, `EntityNameCreateOptions`,
`EntityRepresentation`, `Modifier`, `EntityType`) see
`dist/index.d.ts`.

## Naming-aware string form

`id` is **not** a naming-conventional string. To produce one, pass the
entity to a stringifier from `@bem/sdk.naming.entity.stringify` or the
combined `@bem/sdk.naming.entity` package.

## License

MPL-2.0

[bem-entity]: https://en.bem.info/methodology/key-concepts/#bem-entity
