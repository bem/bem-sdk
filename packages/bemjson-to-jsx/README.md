# @bem/sdk.bemjson-to-jsx

> Transforms a [BEMJSON][bemjson] tree into JSX markup with class names
> generated from a configurable BEM naming convention.

[![npm](https://img.shields.io/npm/v/@bem/sdk.bemjson-to-jsx.svg)](https://www.npmjs.org/package/@bem/sdk.bemjson-to-jsx)

## Install

```sh
pnpm add @bem/sdk.bemjson-to-jsx
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { bemjsonToJsx } from '@bem/sdk.bemjson-to-jsx';

const transformer = bemjsonToJsx({ naming: 'react' });

const { JSX } = transformer.process({
  block: 'button',
  mods: { theme: 'normal' },
  content: 'Submit',
});

console.log(JSX);
// <Button className="Button Button_theme_normal">
//   Submit
// </Button>
```

Re-using a single transformer:

```ts
import { Transformer, plugins } from '@bem/sdk.bemjson-to-jsx';

const t = new Transformer({ naming: 'origin' });
t.use([plugins.classNames(), plugins.style()]);
```

## API

### `bemjsonToJsx(options?): Transformer`

Factory that builds a `Transformer` with the default plugin chain.

- `options.naming` — preset name (default `'react'`) or a
  `CreateOptions` object from `@bem/sdk.naming.presets`.

Also exposes `bemjsonToJsx.tagToClass`, `bemjsonToJsx.styleToObj`,
`bemjsonToJsx.plugins`.

### `class Transformer`

- `use(plugin | plugin[])` — add plugins.
- `process(bemjson): ProcessResult` — returns
  `{ bemjson, tree, JSX }`. `JSX` is a getter that renders the JSX
  string on access.

### Helpers

- `tagToClass(tag)` — leaves native HTML/SVG tag names as-is, otherwise
  PascalCases (`my-block` → `MyBlock`).
- `styleToObj(css)` — converts a CSS string into a plain JS object
  suitable for the React `style` prop.
- `plugins` — built-in plugin set; see `Plugin`, `PluginFactory`,
  `WhiteListOptions` types.

For exhaustive typings, see `BemJson`, `BemJsonObject`, `JSXNode`,
`TransformerOptions`, `ProcessResult`, `Plugin` in `dist/index.d.ts`.

## License

MPL-2.0

[bemjson]: https://en.bem.info/platform/bemjson/
