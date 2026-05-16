# @bem/sdk.naming.entity

> Combined `parse` / `stringify` namespace for BEM entity strings under
> a chosen [naming convention][naming]. Thin wrapper over
> `@bem/sdk.naming.entity.parse`, `@bem/sdk.naming.entity.stringify` and
> `@bem/sdk.naming.presets`.

[![npm](https://img.shields.io/npm/v/@bem/sdk.naming.entity.svg)](https://www.npmjs.org/package/@bem/sdk.naming.entity)

## Install

```sh
pnpm add @bem/sdk.naming.entity
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { bemNaming } from '@bem/sdk.naming.entity';

// Default — `origin` preset.
bemNaming.parse('button__text');
// → BemEntityName { block: 'button', elem: 'text' }
bemNaming.stringify({ block: 'button', mod: { name: 'theme', val: 'red' } });
// → 'button_theme_red'

// React-style namespace.
const react = bemNaming('react');
react.stringify({ block: 'Button', elem: 'Text' });
// → 'Button-Text'

// Custom convention.
const custom = bemNaming({
  delims: { elem: '__', mod: { name: '--', val: '_' } },
});
custom.stringify({ block: 'b', mod: { name: 'm', val: 'v' } });
// → 'b--m_v'
```

## API

### `bemNaming(options?: CreateOptions | string): BemNaming`

Factory that returns a namespace bound to a naming convention.
`options` is one of:

- `undefined` — default `origin` preset;
- a preset name: `'origin' | 'origin-react' | 'react' | 'legacy' | 'two-dashes'`;
- a `CreateOptions` object (`{ preset?, delims?, fs?, wordPattern? }`).

Same options yield the same cached instance.

### `bemNaming.parse(str: string): BemEntityName | undefined`

> Shortcut for `bemNaming().parse`. Default `origin` preset.

### `bemNaming.stringify(entity: BemEntityName | EntityRepresentation): string`

> Shortcut for `bemNaming().stringify`. Default `origin` preset.

### `bemNaming.delims: { elem, mod: { name, val } }`, `bemNaming.wordPattern: string`

Direct access to the default namespace's resolved delimiters and word
pattern.

### `BemNaming` namespace

Each created namespace exposes:

#### `naming.parse(str: string): BemEntityName | undefined`

Parse a BEM string under the convention.

#### `naming.stringify(entity: BemEntityName | EntityRepresentation): string`

Serialise a `BemEntityName`-shaped object to its conventional string
form.

#### `naming.delims: { elem, mod: { name, val } }` / `naming.wordPattern: string`

Resolved delimiters and the regex source for a single BEM word.

For exhaustive typings (`BemNaming`, `BemNamingFactory`, `CreateOptions`)
see `dist/index.d.ts`.

## License

MPL-2.0

[naming]: https://en.bem.info/methodology/naming-convention/
