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
import { convert, stringify } from '@bem/sdk.bemjson-to-decl';

const bemjson = {
  block: 'button',
  mods: { theme: 'normal' },
  content: { elem: 'text', content: 'Submit' },
};

convert(bemjson);
// => [BemEntityName('button'),
//     BemEntityName('button', mod 'theme=normal'),
//     BemEntityName('button', elem 'text')]

console.log(stringify(bemjson));
// [
//     { block: 'button' },
//     { block: 'button', mod: { name: 'theme', val: 'normal' } },
//     { block: 'button', elem: 'text' }
// ]
```

## API

### `convert(bemjson, ctx?): BemEntityName[]`

Walks the tree and returns a deduplicated, insertion-ordered array of
`BemEntityName`s referenced by the BEMJSON.

- `bemjson` — any BEMJSON-shaped value (single node, array, nested
  `content` / `js` / `attrs`, etc.).
- `ctx.block` — optional fallback block name for nodes without `block`.

### `stringify(bemjson, ctx?, opts?): string`

Same walk as `convert`, then renders the entities with
[`stringify-object`][stringify-object]. `opts.indent` defaults to
four spaces; remaining options are forwarded to `stringify-object`.

For exhaustive typings, see `Bemjson`, `ConvertContext`,
`StringifyOptions` in `dist/index.d.ts`.

## License

MPL-2.0

[bemjson]: https://en.bem.info/platform/bemjson/
[bemdecl]: https://en.bem.info/methodology/declarations/
[stringify-object]: https://www.npmjs.com/package/stringify-object
