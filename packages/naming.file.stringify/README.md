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
// => 'src/common.blocks/button/button.css'
```

## API

### `fileStringifyWrapper(convention): FileStringify`

Builds a stringifier from a `NamingConvention` (typically one of the
`@bem/sdk.naming.presets` exports). Throws when neither
`file.tech` nor `file.cell.tech` is set.

Returns `FileStringify: (file: BemFileLike) => string`. `BemFileLike`
is `{ cell: BemCellLike, level?: string, tech?: string }`.

For exhaustive typings, see `BemFileLike`, `FileStringify`,
`NamingConvention` in `dist/index.d.ts`.

## License

MPL-2.0

[naming]: https://en.bem.info/methodology/naming-convention/
