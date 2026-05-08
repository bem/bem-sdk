# @bem/sdk.decl

> Toolkit for working with BEM [declarations][decl]: parse, format,
> normalise, merge / subtract / intersect, load and save BEMDECL files.

[![npm](https://img.shields.io/npm/v/@bem/sdk.decl.svg)](https://www.npmjs.org/package/@bem/sdk.decl)

## Install

```sh
pnpm add @bem/sdk.decl
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { parse, format, merge, normalize, stringify } from '@bem/sdk.decl';

const a = parse([{ block: 'button' }, { block: 'input' }]);
const b = parse([{ block: 'input' }, { block: 'select' }]);

const merged = merge(a, b);              // BemCell[] (deduplicated)
const decl = format(merged, { format: 'v2' }); // [{ block: 'button' }, ...]

console.log(stringify(decl, { format: 'v2' }));
// `module.exports = [...];`
```

## API

The package exports a flat set of named functions. All entity-shaped
data is exchanged as `BemCell` (from `@bem/sdk.cell`).

### Parsing / formatting

- `parse(bemdecl): BemCell[]` — accepts either a JS source string
  (evaluated with `node-eval`) or an already-parsed object. Detects
  format automatically.
- `detect(data): BemDeclFormat | undefined` — recognises `'enb'`,
  `'v1'` or `'v2'` shapes.
- `format(cells, opts?): unknown` — converts `BemCell[]` into the
  requested BEMDECL shape (`opts.format`).
- `normalize(cells, opts?): BemCell[]` — canonicalises declarations
  (sort order, mod expansion, etc.).
- `stringify(cells, opts?): string` — renders a JS-source BEMDECL
  module string. Honours `opts.format` and `opts.exportType`
  (`'cjs' | 'esm'`).
- `cellify(cells, opts?): BemCell[]` — converts plain entity objects
  into `BemCell`s.

### Set operations

- `merge(a, b, ...): BemCell[]`
- `subtract(a, b): BemCell[]`
- `intersect(a, b): BemCell[]`
- `assign(target, source): BemCell[]`

### IO

- `load(path): Promise<BemCell[]>` — reads a BEMDECL file from disk.
- `save(path, cells, opts?): Promise<void>` — writes a BEMDECL file.

For exhaustive typings, see `BemDeclFormat`, `ExportType`,
`NormalizeOptions`, `StringifyOptions` in `dist/index.d.ts`.

## License

MPL-2.0

[decl]: https://en.bem.info/methodology/declarations/
