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
import { load, resolve } from '@bem/sdk.deps';

const links = await load({ platform: 'desktop' });
const { entities } = resolve([{ block: 'button' }], links);
// → entities is a topologically ordered list of BemEntityName-shaped objects
```

Lower-level pipeline:

```ts
import { gather, read, parse, depsJs } from '@bem/sdk.deps';

const files = await gather({ platform: 'desktop' });
const data  = await read(depsJs.reader)(files);
const links = parse(depsJs.parser)(data);
```

## API

`load` is the all-in-one entry point; the other exports allow swapping
formats or staging your own pipeline.

### `load(config: GatherOptions, format?: DepsFormat): Promise<DepsLink[]>`

`gather → read → parse` in one call. `format` defaults to `depsJs`.

### `buildGraph(deps: DepsLink | DepsLink[], options?: BuildGraphOptions): BemGraph`

Turns dependency links into a `@bem/sdk.graph` `BemGraph`. By default
the graph is naturalised; pass `{ denaturalized: true }` to skip that.

### `resolve(declaration: unknown[], relations: DepsLink | DepsLink[], options?: ResolveOptions): ResolveResult`

Resolves a declaration against a dependency graph. Returns
`{ entities, dependOn }`. When `options.tech` is given, `entities`
keeps only items of that tech and the other techs go into `dependOn`.

```ts
import { resolve } from '@bem/sdk.deps';

resolve([{ block: 'button' }], links, { tech: 'css' });
// → { entities: [...], dependOn: [{ tech: 'js', entities: [...] }] }
```

### `gather(options?: GatherOptions): Promise<BemFile[]>`

Walks the configured levels via `@bem/sdk.walk` and returns the
`*.deps.js` files. `options.platform` defaults to `'desktop'`;
`options.config` may be a custom `BemConfig` instance.

### `read(reader: Reader): (files: BemFile[]) => Promise<FileWithData[]>`

Returns an async reader bound to a format-specific `reader`. The
default reader is `depsJs.reader`.

### `parse(parser?: Parser): (data: FileWithData | FileWithData[]) => Promise<DepsLink[]>`

Returns an async parser bound to a format-specific `parser`. Defaults
to `depsJsParser`.

### `parseSync(parser?: Parser): (data: FileWithData | FileWithData[]) => DepsLink[]`

> Added in current release (closes #301).

Synchronous counterpart of `parse` for callers that already have the
data in memory.

### Formats

- `depsJs: DepsFormat` — canonical `.deps.js` format
  (`{ reader, parser }`).
- `depsJsReader: Reader` / `depsJsParser: Parser` — exposed
  individually for custom pipelines.

For exhaustive typings (`Reader`, `Parser`, `GatherOptions`,
`BuildGraphOptions`, `ResolveOptions`, `ResolveResult`, `DepsFormat`,
`DepsLink`, `FileWithData`) see `dist/index.d.ts`.

## License

MPL-2.0

[deps-spec]: https://en.bem.info/technologies/classic/deps-spec/
