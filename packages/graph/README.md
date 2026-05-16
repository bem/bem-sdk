# @bem/sdk.graph

> Dependency graph for BEM entities. Stores `BemCell` vertices, mixed
> ordered/unordered edges, and resolves declarations into a
> dependency-ordered list with circular-dependency detection.

[![npm](https://img.shields.io/npm/v/@bem/sdk.graph.svg)](https://www.npmjs.org/package/@bem/sdk.graph)

## Install

```sh
pnpm add @bem/sdk.graph
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { BemGraph } from '@bem/sdk.graph';

const graph = new BemGraph();

graph.vertex({ block: 'button' })
  .dependsOn({ block: 'icon' })   // ordered edge: 'icon' must come before
  .linkWith({ block: 'helper' }); // unordered edge

const sorted = graph.dependenciesOf({ block: 'button' });
// → [{ entity: { block: 'icon' } },
//    { entity: { block: 'helper' } },
//    { entity: { block: 'button' } }]
```

## API

### `new BemGraph(): BemGraph`

Create an empty graph.

### `graph.vertex(entity: EntityInput, tech?: string): Vertex`

Add (or retrieve) a vertex for an entity/cell and return a `Vertex`
builder for chaining edges. `entity` accepts a `BemEntityName`, a flat
`{ block, elem?, mod? }` object, or a block name string.

### `graph.dependenciesOf(cells: EntityInput | BemCell | Array<EntityInput | BemCell>, tech?: string): DependencyResult[]`

Topologically sorted list of `{ entity, tech? }` records. Accepts a
single entity / cell or an array.

```ts
graph.dependenciesOf([{ block: 'button' }, { block: 'icon' }], 'css');
```

### `graph.naturalDependenciesOf(entities: Array<EntityInput | { entity, tech? }>, tech?: string): DependencyResult[]`

Same as `dependenciesOf`, but pre-sorts the input declaration in
"natural" order (elems after blocks, value-mods after key-mods) before
resolving.

### `graph.naturalize(): void`

Adds implicit ordered edges (`block → elem`, `block → mod`, etc.)
based on naming relationships. Useful when edges come from a parser
that only records explicit `deps.js` links.

### `class Vertex`

#### `vertex.dependsOn(entity: EntityInput, tech?: string): this`

Ordered edge — `entity` must precede the current vertex in the result.

#### `vertex.linkWith(entity: EntityInput, tech?: string): this`

Unordered edge — both vertices must end up in the result; their
relative order is unconstrained.

Both methods return `this` for chaining.

### `CircularDependencyError`

Thrown when ordered edges form a cycle. Exposes the offending path on
`error.path`.

### Lower-level building blocks

`MixedGraph`, `DirectedGraph`, `VertexSet` — internals exposed for
advanced use; not part of the public stability surface.

For exhaustive typings (`DependencyResult`) see `dist/index.d.ts`.

## License

MPL-2.0
