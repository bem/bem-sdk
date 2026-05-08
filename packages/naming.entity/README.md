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
// => BemEntityName { block: 'button', elem: 'text' }
bemNaming.stringify({ block: 'button', mod: { name: 'theme', val: 'red' } });
// => 'button_theme_red'

// React-style namespace.
const react = bemNaming('react');
react.stringify({ block: 'Button', elem: 'Text' });
// => 'Button-Text'

// Custom convention.
const custom = bemNaming({
  delims: { elem: '__', mod: { name: '--', val: '_' } },
});
custom.stringify({ block: 'b', mod: { name: 'm', val: 'v' } });
// => 'b--m_v'
```

## API

### `bemNaming(options?): BemNaming`

Factory that returns a namespace bound to a naming convention.
`options` is one of:

- `undefined` — default `origin` preset;
- a preset name: `'origin' | 'origin-react' | 'react' | 'legacy' | 'two-dashes'`;
- a `CreateOptions` object (`{ preset?, delims?, fs?, wordPattern? }`).

Same options yield the same cached instance.

### `bemNaming.parse` / `bemNaming.stringify` / `bemNaming.delims` / `bemNaming.wordPattern`

Shortcuts for the default (`origin`) namespace. Equivalent to
`bemNaming().parse`, etc.

### `BemNaming` namespace

Each created namespace exposes:

- `parse(str): BemEntityName | undefined` — parses a BEM string under
  the convention.
- `stringify(entity): string` — serialises a `BemEntityName`-shaped
  object to its conventional string form.
- `delims` — resolved `{ elem, mod: { name, val } }` delimiters.
- `wordPattern` — regex source describing one BEM word.

For exhaustive typings, see `BemNaming`, `BemNamingFactory` in
`dist/index.d.ts`.

## License

MPL-2.0

[naming]: https://en.bem.info/methodology/naming-convention/
