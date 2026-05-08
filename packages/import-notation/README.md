# @bem/sdk.import-notation

> Parser and stringifier for BEM short import notation
> (`b:button e:text m:theme=normal|inverted t:css`).

[![npm](https://img.shields.io/npm/v/@bem/sdk.import-notation.svg)](https://www.npmjs.org/package/@bem/sdk.import-notation)

## Install

```sh
pnpm add @bem/sdk.import-notation
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { parse, stringify } from '@bem/sdk.import-notation';

parse('b:button m:theme=normal|inverted t:css');
// => [
//   { block: 'button',                               tech: 'css' },
//   { block: 'button', mod: { name: 'theme' },        tech: 'css' },
//   { block: 'button', mod: { name: 'theme', val: 'normal' },   tech: 'css' },
//   { block: 'button', mod: { name: 'theme', val: 'inverted' }, tech: 'css' },
// ]

stringify([
  { block: 'button' },
  { block: 'button', mod: { name: 'theme', val: 'normal' } },
]);
// => 'b:button m:theme=normal'
```

## API

### `parse(importString, scope?): BemCell[]`

Parses an import string and expands it into a deduplicated
insertion-ordered array of plain `BemCell` objects.

- `importString` — space-separated tokens of the form
  `b:<block>`, `e:<elem>`, `m:<name>[=<v1>|<v2>...]`, `t:<tech>`.
- `scope` — optional `{ block?, elem? }` used as defaults for tokens
  that omit `b:` / `e:`.

### `stringify(cells): string`

Inverse of `parse`. Accepts a single cell or an array, merges them,
and renders the canonical short form.

For exhaustive typings, see `BemCell`, `BemEntityMod`, `ParseScope` in
`dist/index.d.ts`.

## License

MPL-2.0
