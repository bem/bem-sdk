# @bem/sdk.naming.entity.stringify

> Stringifier for [BEM entity][bem-entity] objects under a chosen
> [naming convention][naming]. Companion to
> `@bem/sdk.naming.entity.parse`.

[![npm](https://img.shields.io/npm/v/@bem/sdk.naming.entity.stringify.svg)](https://www.npmjs.org/package/@bem/sdk.naming.entity.stringify)

## Install

```sh
pnpm add @bem/sdk.naming.entity.stringify @bem/sdk.naming.presets
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { stringify, stringifyWrapper } from '@bem/sdk.naming.entity.stringify';
import { origin, react } from '@bem/sdk.naming.presets';

stringify(
  { block: 'button', mod: { name: 'theme', val: 'red' } },
  origin.delims,
);
// → 'button_theme_red'

const toReact = stringifyWrapper(react);
toReact({ block: 'Button', elem: 'Text' });
// → 'Button-Text'
```

## API

### `stringify(entity: EntityLike | null | undefined, delims: NamingDelims): string`

One-shot stringifier.

- `entity` — `{ block, elem?, mod? }`. `mod` accepts a string
  shorthand or `{ name, val? }`.
- `delims` — `{ elem, mod: { name, val } }`.

Returns the conventional BEM string. Returns `''` for `null` /
`undefined` or for objects without a `block`.

```ts
stringify({ block: 'b', mod: 'm' },         { elem: '__', mod: { name: '_', val: '_' } });
// → 'b_m'
stringify({ block: 'b', elem: 'e', mod: { name: 'm', val: true } }, origin.delims);
// → 'b__e_m'
```

### `stringifyWrapper(convention: NamingConvention): Stringify`

> Was: `createStringify(naming)` in 0.x.

Return a curried stringifier bound to `convention.delims`. Convenient
when the convention is fixed (e.g. one of the `@bem/sdk.naming.presets`
exports).

### `type Stringify = (entity: EntityLike | null | undefined) => string`

For exhaustive typings (`EntityLike`, `NamingDelims`, `NamingConvention`,
`Stringify`) see `dist/index.d.ts`.

## License

MPL-2.0

[bem-entity]: https://en.bem.info/methodology/key-concepts/#bem-entity
[naming]: https://en.bem.info/methodology/naming-convention/
