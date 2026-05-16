# @bem/sdk.naming.entity.parse

> Parser for [BEM entity][bem-entity] strings under a chosen
> [naming convention][naming]. Returns `BemEntityName` instances.

[![npm](https://img.shields.io/npm/v/@bem/sdk.naming.entity.parse.svg)](https://www.npmjs.org/package/@bem/sdk.naming.entity.parse)

## Install

```sh
pnpm add @bem/sdk.naming.entity.parse @bem/sdk.naming.presets
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { bemNamingEntityParse } from '@bem/sdk.naming.entity.parse';
import { origin } from '@bem/sdk.naming.presets';

const parse = bemNamingEntityParse(origin);

parse('button');
// → BemEntityName { block: 'button' }

parse('button__text');
// → BemEntityName { block: 'button', elem: 'text' }

parse('button_disabled');
// → BemEntityName { block: 'button', mod: { name: 'disabled', val: true } }

parse('button_theme_red');
// → BemEntityName { block: 'button', mod: { name: 'theme', val: 'red' } }

parse('not a bem string'); // → undefined
```

## API

### `bemNamingEntityParse(convention: NamingConvention): EntityParse`

> Was: `parse(naming)` factory in 0.x (returns the same callable).

Build a parser bound to a `{ delims, wordPattern }` slice of a
`NamingConvention` (see `@bem/sdk.naming.presets`).

- `convention.delims.elem: string` — element delimiter (e.g. `'__'`);
- `convention.delims.mod: { name: string; val: string } | string` —
  modifier delimiters;
- `convention.wordPattern: string` — regex source for one BEM word.

### `EntityParse: (str: string) => BemEntityName | undefined`

Yields `undefined` for non-matching strings.

```ts
import { bemNamingEntityParse } from '@bem/sdk.naming.entity.parse';
import { react } from '@bem/sdk.naming.presets';

const parse = bemNamingEntityParse(react);
parse('MyBlock-Element_mod_val');
// → BemEntityName { block: 'MyBlock', elem: 'Element', mod: { name: 'mod', val: 'val' } }
```

For exhaustive typings (`EntityParse`) see `dist/index.d.ts`.

## License

MPL-2.0

[bem-entity]: https://en.bem.info/methodology/key-concepts/#bem-entity
[naming]: https://en.bem.info/methodology/naming-convention/
