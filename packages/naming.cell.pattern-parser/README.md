# @bem/sdk.naming.cell.pattern-parser

> Internal helper used by `@bem/sdk.naming.cell.stringify` and
> `@bem/sdk.naming.cell.match` to parse the `fs.pattern` template of a
> naming preset.

[![npm](https://img.shields.io/npm/v/@bem/sdk.naming.cell.pattern-parser.svg)](https://www.npmjs.org/package/@bem/sdk.naming.cell.pattern-parser)

## Install

```sh
pnpm add @bem/sdk.naming.cell.pattern-parser
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { patternParser } from '@bem/sdk.naming.cell.pattern-parser';

patternParser('${layer?${layer}.}blocks/${entity}.${tech}');
// => ['', ['layer', '', 'layer', '.'], 'blocks/', 'entity', '.', 'tech']
```

The pattern is a template-string-like description of a path layout in a
[BEM project][BEM]: literal text plus `${name}` slots, with an optional
`${name?...}` form that emits its body only when `name` is bound.

## API

### `patternParser(pattern): PatternSeparation`

Parses a path pattern into a flat array.

- `pattern` — `string`, the path pattern from a naming preset
  (for example, `${layer?${layer}.}blocks/${entity}.${tech}`).
- Returns: `PatternSeparation` (`Array<string | PatternSeparation>`) —
  literal segments interleaved with variable names, with optional groups
  represented as nested arrays.
- Throws: `Error` if the pattern has unbalanced `${ ... }` braces.

The exported `PatternSeparation` type is the recursive shape consumed by
the cell stringifier and matcher.

## License

MPL-2.0

[BEM]: https://en.bem.info/methodology/
