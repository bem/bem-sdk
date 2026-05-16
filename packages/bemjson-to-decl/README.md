# @bem/sdk.bemjson-to-decl

> Walks a [BEMJSON][bemjson] tree and collects every referenced BEM
> entity, optionally serialised back as a declaration ([BEMDECL][bemdecl]).

[![npm](https://img.shields.io/npm/v/@bem/sdk.bemjson-to-decl.svg)](https://www.npmjs.org/package/@bem/sdk.bemjson-to-decl)

## Install

```sh
pnpm add @bem/sdk.bemjson-to-decl
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { convert } from '@bem/sdk.bemjson-to-decl';

convert([
  { elem: 'control', elemMods: { theme: 'normal' } },
  { elem: 'control', elemMods: { theme: 'ghost' } },
], { block: 'button' });

// →
// [ BemEntityName { block: 'button', elem: 'control' },
//   BemEntityName { block: 'button', elem: 'control', mod: { name: 'theme', val: true } },
//   BemEntityName { block: 'button', elem: 'control', mod: { name: 'theme', val: 'normal' } },
//   BemEntityName { block: 'button', elem: 'control', mod: { name: 'theme', val: 'ghost' } }
// ]
```

## API

### `convert(bemjson: Bemjson, scope?: BemEntityName): BemEntityName[]`

Extract BEM entities from a BEMJSON value.

```ts
import { convert } from '@bem/sdk.bemjson-to-decl';

convert({ block: 'button', mods: { theme: 'normal' } });

// →
// [ BemEntityName { block: 'button' },
//   BemEntityName { block: 'button', mod: { name: 'theme', val: true } },
//   BemEntityName { block: 'button', mod: { name: 'theme', val: 'normal' } }
// ]
```

### `stringify(bemjson: Bemjson, scope?: BemEntityName, opts?: { indent?: string }): string`

Extract BEM entities and serialise the result as a string (uses
[`stringify-object`][stringify-object] under the hood).

```ts
import { stringify } from '@bem/sdk.bemjson-to-decl';

stringify({ block: 'button' }, null, { indent: '\t' });

// → "[\n\t{\n\t\tblock: 'button'\n\t}\n]"
```

For exhaustive typings (`Bemjson`, `ConvertContext`, `StringifyOptions`)
see `dist/index.d.ts`.

## License

MPL-2.0

[bemjson]: https://en.bem.info/platform/bemjson/
[bemdecl]: https://en.bem.info/methodology/declarations/
[stringify-object]: https://www.npmjs.com/package/stringify-object
