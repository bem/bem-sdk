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
import { parse, format, merge, stringify } from '@bem/sdk.decl';

const a = parse([{ block: 'button' }, { block: 'input' }]);
const b = parse([{ block: 'input' }, { block: 'select' }]);

const merged = merge(a, b);                       // BemCell[] (deduplicated)
const decl = format(merged, { format: 'v2' });    // [{ block: 'button' }, ...]

console.log(stringify(decl, { format: 'v2' }));
// `module.exports = [...];`
```

## API

All entity-shaped data is exchanged as `BemCell` (from `@bem/sdk.cell`).

### `parse(bemdecl: string | object): BemCell[]`

Accepts either a JS source string (evaluated with `node-eval`) or an
already-parsed object. Detects format automatically; throws on unknown
formats. Returns a flat `BemCell[]`.

```ts
import { parse } from '@bem/sdk.decl';

parse([{ block: 'button' }, { block: 'input', elem: 'text' }]);
parse(`module.exports = { format: 'v1', deps: [{ block: 'button' }] };`);
```

### `detect(data: object): BemDeclFormat | undefined`

Recognises `'enb'`, `'v1'`, `'v2'` or `'harmony'` shapes. Returns
`undefined` when nothing matches.

### `format(cells: BemCell[], opts?: NormalizeOptions): unknown[]`

Converts `BemCell[]` into the requested BEMDECL shape via
`opts.format` (default `'v2'`).

### `normalize(cells: BemCell[], opts?: NormalizeOptions): BemCell[]`

Canonicalises declarations (sort order, mod expansion, scope resolution).

### `stringify(cells: BemCell | BemCell[], opts?: StringifyOptions): string`

Renders a JS-source BEMDECL module string. Honours `opts.format` and
`opts.exportType` (`'cjs' | 'esm' | 'json'`).

```ts
stringify(merged, { format: 'v2', exportType: 'esm' });
// `export default [...];`
```

### `cellify(data: unknown): BemCell[]`

Wraps any value (single object or array) into `BemCell` instances via
`BemCell.create`.

### Set operations

#### `merge(a: BemCell[], ...rest: BemCell[][]): BemCell[]`

Union of cell sets, deduplicated by `cell.id`.

#### `subtract(a: BemCell[], b: BemCell[]): BemCell[]`

`a` minus cells found in `b`.

#### `intersect(a: BemCell[], b: BemCell[]): BemCell[]`

Cells present in both `a` and `b`.

#### `assign(target: BemCell[], source: BemCell[]): BemCell[]`

Variant of `merge` that mutates `target`.

### IO

#### `load(path: string, encoding?: BufferEncoding): Promise<BemCell[]>`

Reads a BEMDECL file from disk and parses it.

#### `save(path: string, cells: BemCell | BemCell[], opts?: SaveOptions): Promise<void>`

Serialises with `stringify` (default `format: 'v2'`, `exportType: 'cjs'`)
and writes the result. `opts.mode` is forwarded to `node:fs/promises`.

For exhaustive typings (`BemDeclFormat`, `ExportType`,
`NormalizeOptions`, `StringifyOptions`, `SaveOptions`) see
`dist/index.d.ts`.

## License

MPL-2.0

[decl]: https://en.bem.info/methodology/declarations/
