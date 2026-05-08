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
// => [{ entity: { block: 'icon' } },
//     { entity: { block: 'helper' } },
//     { entity: { block: 'button' } }]
```

## API

### `class BemGraph`

- `vertex(entity, tech?): Vertex` — adds (or returns) a vertex for a
  cell and returns a `Vertex` builder.
- `dependenciesOf(cells, tech?): DependencyResult[]` — topologically
  sorted list. Accepts a single entity / cell or an array.
- `naturalDependenciesOf(entities, tech?): DependencyResult[]` — same
  as `dependenciesOf`, but preserves the input declaration order
  before sorting.

### `class Vertex`

- `dependsOn(entity, tech?)` — ordered edge: dependency must precede
  the current vertex.
- `linkWith(entity, tech?)` — unordered edge: both vertices must end
  up in the result, order between them is unconstrained.

Both methods return `this` for chaining.

### Errors

- `CircularDependencyError` — thrown when ordered edges form a cycle.
  Exposes the offending path on `error.path`.

### Lower-level building blocks

- `MixedGraph`, `DirectedGraph`, `VertexSet` — internals exposed for
  advanced use; not part of the public stability surface.

For exhaustive typings, see `DependencyResult` in `dist/index.d.ts`.

## License

MPL-2.0
