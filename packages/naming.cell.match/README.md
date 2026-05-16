# @bem/sdk.naming.cell.match

> Matcher that turns a file path into a `BemCell` under a chosen
> [naming convention][naming]. Inverse of
> `@bem/sdk.naming.cell.stringify`.

[![npm](https://img.shields.io/npm/v/@bem/sdk.naming.cell.match.svg)](https://www.npmjs.org/package/@bem/sdk.naming.cell.match)

## Install

```sh
pnpm add @bem/sdk.naming.cell.match @bem/sdk.naming.presets
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { bemNamingCellMatch } from '@bem/sdk.naming.cell.match';
import { origin } from '@bem/sdk.naming.presets';

const match = bemNamingCellMatch(origin);

match('common.blocks/button/button.css');
// → { isMatch: true,
//     cell: BemCell { entity: { block: 'button' }, tech: 'css', layer: 'common' },
//     rest: null }

match('common.blocks/button/_theme/button_theme_red.css');
// → { isMatch: true, cell: BemCell { ..., mod: { name: 'theme', val: 'red' } }, ... }

match('common.blocks/button/__text/button__text.js');
// → { isMatch: true, cell: BemCell { ..., elem: 'text', tech: 'js' }, ... }

match('common.blocks/button'); // partial match → { isMatch: false, cell: null, rest: '...' }
match('not/a/bem/path');       // → { isMatch: false, cell: null, rest: null }
```

## API

### `bemNamingCellMatch(convention: MatchConvention): Match`

> Was: `bemNamingCellMatch(naming)` in 0.x (signature compatible).

Build a matcher from a `MatchConvention` (a `NamingConvention` with at
least `fs.pattern`). Throws when `fs.pattern` is missing or when
`fs.scheme` is not one of `'nested' | 'mixed' | 'flat'`.

### `Match: (relPath: string) => MatchResult`

Takes a relative path and returns:

- `cell: BemCell | null` — populated when the path is a fully
  qualified entity.
- `isMatch: boolean` — `true` only when the whole path is consumed.
- `rest: string | null` — leftover suffix when the path is a partial
  match (e.g. directory prefix).

```ts
const match = bemNamingCellMatch(origin);
match('common.blocks/button-with-icon/button-with-icon.js').cell?.entity.block;
// → 'button-with-icon'  (closes #385: hyphens are allowed)
```

For exhaustive typings (`MatchConvention`, `MatchFsConvention`,
`MatchResult`, `Match`) see `dist/index.d.ts`.

## License

MPL-2.0

[naming]: https://en.bem.info/methodology/naming-convention/
