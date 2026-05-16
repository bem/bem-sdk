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

Re-using a single transformer with explicit plugins:

```ts
import { Transformer, plugins } from '@bem/sdk.bemjson-to-jsx';

const t = new Transformer({ naming: 'origin' });
t.use([plugins.classNames(), plugins.style()]);
```

## API

### `bemjsonToJsx(options?: TransformerOptions): Transformer`

> Was: `bemjsonToJSX(options)` default factory in 0.x.

Factory that builds a `Transformer` preloaded with the default plugin
chain. `options.naming` is a preset name (default `'react'`) or a
`CreateOptions` object from `@bem/sdk.naming.presets`. The factory also
exposes `bemjsonToJsx.tagToClass`, `bemjsonToJsx.styleToObj` and
`bemjsonToJsx.plugins`.

```ts
import { bemjsonToJsx } from '@bem/sdk.bemjson-to-jsx';

const t = bemjsonToJsx();
t.process({ block: 'button', content: 'Go' }).JSX;
// '<Button className="Button">\n  Go\n</Button>'
```

### `class Transformer`

#### `new Transformer(options?: TransformerOptions): Transformer`

Build a transformer without the default plugin chain when you want full
control. Add plugins explicitly via `use`.

#### `transformer.use(...plugins: Array<Plugin | Plugin[]>): this`

Append plugins to the pipeline. Returns `this` for chaining.

#### `transformer.process(bemjson: BemJson): ProcessResult`

Transform a BEMJSON tree. The result is
`{ bemjson, tree, JSX }`, where `JSX` is a lazy getter that renders the
final string on access.

```ts
const out = transformer.process({ block: 'icon', mods: { type: 'load' } });
out.JSX; // '<Icon className="Icon Icon_type_load"/>'
```

### `tagToClass(tag: string): string`

Leaves native HTML/SVG tag names as-is, otherwise PascalCases the
identifier so it is usable as a React component name.

```ts
import { bemjsonToJsx } from '@bem/sdk.bemjson-to-jsx';

bemjsonToJsx.tagToClass('div');       // 'div'
bemjsonToJsx.tagToClass('my-block');  // 'MyBlock'
```

### `styleToObj(css: string): Record<string, string>`

Convert an inline CSS string into a plain JS object suitable for the
React `style` prop.

```ts
import { bemjsonToJsx } from '@bem/sdk.bemjson-to-jsx';

bemjsonToJsx.styleToObj('color: red; font-size: 12px');
// → { color: 'red', fontSize: '12px' }
```

### `plugins`

Built-in plugin set (`classNames`, `style`, `mods`, etc.). See
`Plugin`, `PluginFactory` and `WhiteListOptions` in `dist/index.d.ts`.

For exhaustive typings (`BemJson`, `BemJsonObject`, `JSXNode`,
`TransformerOptions`, `ProcessResult`, `Plugin`) see `dist/index.d.ts`.

## License

MPL-2.0

[bemjson]: https://en.bem.info/platform/bemjson/
