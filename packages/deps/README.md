# @bem/sdk.deps

> Tools for working with BEM [`.deps.js`][deps-spec] files: gather them
> from a config, read, parse and resolve dependency graphs.

[![npm](https://img.shields.io/npm/v/@bem/sdk.deps.svg)](https://www.npmjs.org/package/@bem/sdk.deps)

## Install

```sh
pnpm add @bem/sdk.deps
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { load, buildGraph, resolve } from '@bem/sdk.deps';

const links = await load({ levels: ['common.blocks', 'desktop.blocks'] });

const graph = buildGraph(links);
const sorted = resolve(graph, [{ block: 'button' }]);
// => BemCell[] in dependency order
```

Lower-level pipeline:

```ts
import { gather, read, parse, depsJs } from '@bem/sdk.deps';

const files = await gather({ levels: ['common.blocks'] });
const data  = await read(depsJs.reader)(files);
const links = parse(depsJs.parser)(data);
```

## API

The package is a small composition kit. `load` is the all-in-one entry
point; the other exports allow swapping formats or staging your own
pipeline.

### High-level

- `load(config, format?): Promise<DepsLink[]>` — `gather → read → parse`
  in one call. `format` defaults to `depsJs`.
- `buildGraph(links, options?): BemGraph` — turns dependency links into
  a `@bem/sdk.graph` `BemGraph`.
- `resolve(graph, entities): BemCell[]` — sorts a graph against a
  declaration, returning a topologically resolved cell list.

### Pipeline parts

- `gather(options): Promise<FileWithData[]>` — collects deps files from
  the configured levels.
- `read(reader): (files) => Promise<...>` — reads the gathered files.
- `parse(parser): (data) => DepsLink[]` — parses raw deps payloads
  into `DepsLink` records.

### Formats

- `depsJs` — the canonical `.deps.js` format (`{ reader, parser }`).
- `depsJsReader`, `depsJsParser` — exposed individually for custom
  pipelines.

For exhaustive typings, see `Reader`, `Parser`, `GatherOptions`,
`BuildGraphOptions`, `ResolveOptions`, `ResolveResult`, `DepsFormat`,
`DepsLink`, `FileWithData` in `dist/index.d.ts`.

## License

MPL-2.0

[deps-spec]: https://en.bem.info/technologies/classic/deps-spec/
