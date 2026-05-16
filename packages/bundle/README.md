# @bem/sdk.bundle

> Lightweight wrapper that pairs a BEMJSON tree (or pre-built BEMDECL)
> with bundle metadata: levels, name, path. Lazily derives the
> declaration via `@bem/sdk.bemjson-to-decl` when only BEMJSON is given.

[![npm](https://img.shields.io/npm/v/@bem/sdk.bundle.svg)](https://www.npmjs.org/package/@bem/sdk.bundle)

## Install

```sh
pnpm add @bem/sdk.bundle
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { BemBundle } from '@bem/sdk.bundle';

const bundle = new BemBundle({
  name: 'index',
  levels: ['common.blocks', 'desktop.blocks'],
  bemjson: {
    block: 'page',
    content: { block: 'button', content: 'Submit' },
  },
});

bundle.name;   // 'index'
bundle.levels; // ['common.blocks', 'desktop.blocks']
bundle.decl;   // BemEntityName[] — derived from bemjson on first access
```

## API

### `new BemBundle(options: BemBundleOptions): BemBundle`

Create a bundle. At least one of `bemjson` / `decl` is required, and at
least one of `name` / `path` is required (path is the fallback for the
name; its extension is stripped). Throws via `node:assert` on invalid
input.

```ts
import { BemBundle } from '@bem/sdk.bundle';

new BemBundle({
  path: 'desktop.bundles/index/index.bemjson.js',
  bemjson: { block: 'page' },
});

new BemBundle({ name: 'index' });
// → AssertionError: BEMJSON or BEMDECL must be present
```

### `bundle.name: string`

Explicit `name`, otherwise derived from `path` (the basename up to the
first dot).

### `bundle.bemjson: object | undefined`

The original BEMJSON object, if provided.

### `bundle.decl: BemEntityName[]`

The declaration. Returned as-is when `decl` was passed in; otherwise
computed lazily from `bemjson` on first access and cached.

```ts
const b = new BemBundle({ name: 'x', bemjson: { block: 'button' } });
b.decl; // [BemEntityName { block: 'button' }]
```

### `bundle.levels: string[]`

Array of level paths (default `[]`).

### `bundle.path: string`

Path string (default `'.'`).

### `BemBundle.isBundle(value: unknown): value is BemBundle`

Cross-realm `instanceof`-style guard (checks the internal `_isBundle`
brand).

```ts
BemBundle.isBundle(new BemBundle({ name: 'x', bemjson: { block: 'b' } })); // true
BemBundle.isBundle({});                                                     // false
```

For exhaustive typings, see `BemBundleOptions` in `dist/index.d.ts`.

## License

MPL-2.0
