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

### `new BemjsonNode(options: BemjsonNodeOptions): BemjsonNode`

Create a node. `block` is required; `elemMods` requires `elem`. `mix`
accepts a single value or an array, where entries may be `BemjsonNode`
instances, option objects, or plain block-name strings.

```ts
import { BemjsonNode } from '@bem/sdk.bemjson-node';

new BemjsonNode({ block: 'button', mods: { view: 'action' } });
new BemjsonNode({ block: 'button', elem: 'icon', elemMods: { type: 'load' } });
new BemjsonNode({ block: 'button', mix: { block: 'button', elem: 'text' } });

new BemjsonNode({ block: 'button', mods: 'icon' as never });
// → AssertionError: `mods` field should be a simple object or null.
```

### `node.block: string`

The name of the block this node belongs to.

### `node.elem: string | null`

The element name, or `null` for block-level nodes.

```ts
new BemjsonNode({ block: 'button' }).elem;                // null
new BemjsonNode({ block: 'button', elem: 'text' }).elem;  // 'text'
```

### `node.mods: Modifiers`

Block-level modifier map. Always an object (possibly empty).

### `node.elemMods: Modifiers | null`

Element-level modifier map; `null` when `elem` is absent.

### `node.mix: BemjsonNode[]`

Array of mixed-in `BemjsonNode` instances (each option/string entry
passed to the constructor is normalised to a `BemjsonNode`).

### `node.valueOf(): BemjsonNodeRepresentation`

Returns a plain-object representation of the node.

```ts
new BemjsonNode({ block: 'button', mods: { focused: true }, elem: 'text' }).valueOf();
// → { block: 'button', mods: { focused: true }, elem: 'text', elemMods: {} }
```

### `node.toJSON(): BemjsonNodeRepresentation`

Hook used by `JSON.stringify()`.

```ts
JSON.stringify(new BemjsonNode({ block: 'input', mods: { available: true } }));
// → '{"block":"input","mods":{"available":true}}'
```

### `node.toString(): string`

Compact debug-style string. **Not** a naming-aware serializer — use
`@bem/sdk.naming.*` for that.

```ts
new BemjsonNode({
  block: 'button',
  mods: { focused: true },
  mix: { block: 'mixed', mods: { bg: 'red' } },
}).toString();
// → 'button _focused  mixed _bg_red'
```

### `BemjsonNode.isBemjsonNode(value: unknown): value is BemjsonNode`

Cross-realm `instanceof`-style guard.

```ts
BemjsonNode.isBemjsonNode(new BemjsonNode({ block: 'input' })); // true
BemjsonNode.isBemjsonNode({ block: 'button' });                 // false
```

For exhaustive typings (`BemjsonNodeOptions`, `BemjsonNodeRepresentation`,
`BemjsonNodeMix`, `Modifiers`, `ModifierValue`) see `dist/index.d.ts`.

## License

MPL-2.0

[bem-tree]: https://en.bem.info/methodology/key-concepts/#bem-tree
