# @bem/sdk.naming.presets

> Built-in [BEM naming convention][naming] presets and a `create()`
> helper for assembling custom ones. Consumed by every other
> `@bem/sdk.naming.*` package.

[![npm](https://img.shields.io/npm/v/@bem/sdk.naming.presets.svg)](https://www.npmjs.org/package/@bem/sdk.naming.presets)

## Install

```sh
pnpm add @bem/sdk.naming.presets
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import {
  origin,
  react,
  legacy,
  twoDashes,
  originReact,
  create,
  getPreset,
} from '@bem/sdk.naming.presets';

origin.delims; // { elem: '__', mod: { name: '_', val: '_' } }
react.delims;  // { elem: '-',  mod: { name: '_', val: '_' } }

// Resolve a preset by name.
getPreset('two-dashes').delims; // { elem: '__', mod: { name: '--', val: '_' } }

// Build a custom convention based on `origin`.
const custom = create({
  preset: 'origin',
  delims: { mod: '--' },
  fs: { scheme: 'nested', pattern: '${entity}.${tech}' },
});
```

## API

### Preset exports

`origin`, `originReact`, `react`, `legacy`, `twoDashes` — full
`NamingConvention` objects (`{ delims, fs, wordPattern }`).

### `getPreset(name): NamingConvention`

Returns one of the named presets. Accepts `'origin' | 'origin-react' |
'react' | 'legacy' | 'two-dashes'`. Throws on unknown names.

### `create(options?, defaults?): NamingConvention`

Composes a `NamingConvention`.

- `options` — `string` (preset name) or `CreateOptions`
  (`{ preset?, delims?, fs?, wordPattern? }`).
- `defaults` — fallback preset name or `CreateOptions`. Used when
  `options` does not specify a base preset.

`origin` is the implicit default. `delims.mod` accepts a string
shorthand expanded to `{ name, val }`. `fs` is shallow-merged on top of
the resolved preset.

For exhaustive typings, see `NamingConvention`, `NamingDelims`,
`FsConvention`, `CreateOptions` in `dist/index.d.ts`.

## License

MPL-2.0

[naming]: https://en.bem.info/methodology/naming-convention/
