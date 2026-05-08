# @bem/sdk.bemjson-node

> Object representation of a [BEM tree][bem-tree] node: block, element,
> modifiers and mixes.

[![npm](https://img.shields.io/npm/v/@bem/sdk.bemjson-node.svg)](https://www.npmjs.org/package/@bem/sdk.bemjson-node)

## Install

```sh
pnpm add @bem/sdk.bemjson-node
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { BemjsonNode } from '@bem/sdk.bemjson-node';

const node = new BemjsonNode({
  block: 'button',
  mods: { theme: 'normal', size: 'm' },
  elem: 'text',
  elemMods: { bold: true },
  mix: [{ block: 'link', mods: { external: true } }],
});

node.block;     // 'button'
node.elem;      // 'text'
node.mods;      // { theme: 'normal', size: 'm' }
node.elemMods;  // { bold: true }
node.mix;       // [BemjsonNode { block: 'link', ... }]

JSON.stringify(node);
// '{"block":"button","mods":{"theme":"normal","size":"m"},"elem":"text",...}'
```

## API

### `new BemjsonNode({ block, elem?, mods?, elemMods?, mix? })`

`block` is required. `elemMods` requires `elem`. `mix` accepts a single
node or an array; entries may be `BemjsonNode` instances, options
objects, or plain block-name strings.

### `BemjsonNode.isBemjsonNode(value)`

Cross-realm `instanceof`-style guard.

### Instance properties

- `block` — block name.
- `elem` — element name or `null`.
- `mods` — block-level modifier map.
- `elemMods` — element-level modifier map, or `null` when `elem` is
  absent.
- `mix` — array of mixed-in `BemjsonNode` instances.

### Instance methods

- `valueOf()` / `toJSON()` — plain `BemjsonNodeRepresentation` object.
- `toString()` — compact debug-style string. **Not** a naming-aware
  serializer; use `@bem/sdk.naming.*` for that.

For exhaustive typings, see `BemjsonNodeOptions`,
`BemjsonNodeRepresentation`, `BemjsonNodeMix`, `Modifiers`,
`ModifierValue` in `dist/index.d.ts`.

## License

MPL-2.0

[bem-tree]: https://en.bem.info/methodology/key-concepts/#bem-tree
