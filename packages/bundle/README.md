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

### `new BemBundle({ name?, path?, levels?, bemjson?, decl? })`

At least one of `bemjson` / `decl` is required. At least one of
`name` / `path` is required (path is fallback for the name; the
extension is stripped). Throws via `node:assert` on invalid input.

### `BemBundle.isBundle(value)`

Cross-realm `instanceof`-style guard (checks the internal `_isBundle`
brand).

### Instance properties

- `name` — explicit `name`, otherwise derived from `path`.
- `bemjson` — the original BEMJSON object, if provided.
- `decl` — `BemEntityName[]`. Returned as-is when `decl` was passed in;
  otherwise computed lazily from `bemjson` on first access.
- `levels` — array of level paths (default `[]`).
- `path` — string (default `'.'`).

For exhaustive typings, see `BemBundleOptions` in `dist/index.d.ts`.

## License

MPL-2.0
