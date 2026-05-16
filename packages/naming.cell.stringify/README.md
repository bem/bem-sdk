# @bem/sdk.naming.cell.stringify

> Turns a `BemCell`-like object into a file path under a chosen
> [naming convention][naming]. Inverse of `@bem/sdk.naming.cell.match`.

[![npm](https://img.shields.io/npm/v/@bem/sdk.naming.cell.stringify.svg)](https://www.npmjs.org/package/@bem/sdk.naming.cell.stringify)

## Install

```sh
pnpm add @bem/sdk.naming.cell.stringify @bem/sdk.naming.presets
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { cellStringifyWrapper } from '@bem/sdk.naming.cell.stringify';
import { origin } from '@bem/sdk.naming.presets';

const stringify = cellStringifyWrapper(origin);

stringify({
  entity: { block: 'button' },
  tech: 'css',
  layer: 'common',
});
// → 'common.blocks/button/button.css'

stringify({
  entity: { block: 'button', mod: { name: 'theme', val: 'red' } },
  tech: 'css',
  layer: 'common',
});
// → 'common.blocks/button/_theme/button_theme_red.css'
```

## API

### `cellStringifyWrapper(convention: NamingConvention): CellStringify`

> Was: `createStringify(naming)` in 0.x (returned the same callable).

Build a stringifier from a `NamingConvention` (typically one of the
`@bem/sdk.naming.presets` exports). Throws when `convention` is missing
or has no `fs.pattern`.

### `CellStringify: (cell: BemCellLike) => string`

The cell must have `tech`; `layer` defaults to `'common'`. Throws when
`tech` is missing.

```ts
const stringify = cellStringifyWrapper(origin);

stringify({ entity: { block: 'icon', elem: 'svg' }, tech: 'js' });
// → 'common.blocks/icon/__svg/icon__svg.js'
```

For exhaustive typings (`BemCellLike`, `CellStringify`,
`NamingConvention`, `NamingDelims`, `FsConvention`) see
`dist/index.d.ts`.

## License

MPL-2.0

[naming]: https://en.bem.info/methodology/naming-convention/
