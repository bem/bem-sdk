# @bem/sdk.naming.file.stringify

> Turns a `BemFile`-like object into a file path under a chosen
> [naming convention][naming]. Thin wrapper over
> `@bem/sdk.naming.cell.stringify` that prepends `<level>/` when the
> file has a level.

[![npm](https://img.shields.io/npm/v/@bem/sdk.naming.file.stringify.svg)](https://www.npmjs.org/package/@bem/sdk.naming.file.stringify)

## Install

```sh
pnpm add @bem/sdk.naming.file.stringify @bem/sdk.naming.presets
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { fileStringifyWrapper } from '@bem/sdk.naming.file.stringify';
import { origin } from '@bem/sdk.naming.presets';

const stringify = fileStringifyWrapper(origin);

stringify({
  cell: { entity: { block: 'button' }, tech: 'css', layer: 'common' },
  level: 'src',
});
// → 'src/common.blocks/button/button.css'
```

## API

### `fileStringifyWrapper(convention: NamingConvention): FileStringify`

> Was: `createStringify(naming)` in 0.x.

Build a stringifier from a `NamingConvention` (typically one of the
`@bem/sdk.naming.presets` exports). Throws when `convention` is
missing.

### `FileStringify: (file: BemFileLike) => string`

`BemFileLike` is `{ cell: BemCellLike, level?: string, tech?: string }`.
Throws when neither `file.tech` nor `file.cell.tech` is set.

```ts
stringify({ cell: { entity: { block: 'icon' }, tech: 'js' } });
// → 'common.blocks/icon/icon.js'  (no level prefix when level is omitted)
```

For exhaustive typings (`BemFileLike`, `FileStringify`,
`NamingConvention`) see `dist/index.d.ts`.

## License

MPL-2.0

[naming]: https://en.bem.info/methodology/naming-convention/
