# Migration guide — `0.x` → `1.x`

This release ships every package in the `@bem/sdk.*` family on a new
toolchain: **TypeScript ESM, Node.js >= 20**.

The public API of each package is preserved as much as it makes sense, but
the package format itself changed. This document walks you through the
upgrade.

> If you only consume one or two packages, jump straight to the
> [Per-package changes](#per-package-changes) section — most packages have
> no source-level breaking changes beyond the format.

---

## Common changes (apply to every `@bem/sdk.*` package)

### 1. Node.js >= 20

Each package's `engines.node` is now `>=20`. Older Node versions are not
supported because the new code relies on `node:fs/promises`,
`structuredClone`, `node:util.isDeepStrictEqual`, modern Iterator helpers
and ESM resolution rules.

### 2. ESM-only

```diff
- const BemEntityName = require('@bem/sdk.entity-name');
+ import { BemEntityName } from '@bem/sdk.entity-name';
```

If your project is still CommonJS:

- Either add `"type": "module"` to your `package.json` and migrate the
  surrounding code to `import`/`export`.
- Or load BEM SDK via dynamic import inside async code:
  ```js
  const { BemEntityName } = await import('@bem/sdk.entity-name');
  ```

### 3. Named exports are now canonical

The legacy "default-only" entry point was unfortunate when typed (it
stopped working with `esModuleInterop=false`, `verbatimModuleSyntax`, etc.).
Every package now exposes named exports for its main symbols **and** keeps
the original default export for backward compatibility:

```diff
- const BemEntityName = require('@bem/sdk.entity-name');
+ import { BemEntityName } from '@bem/sdk.entity-name';

- const stringify = require('@bem/sdk.naming.entity.stringify');
+ import { stringifyWrapper } from '@bem/sdk.naming.entity.stringify';
```

### 4. Types ship out of the box

Every package distributes its `dist/index.d.ts`. You no longer need to
install or write `@types/bem__sdk.*`. TypeScript-friendly entry types
include `BemEntityName`, `BemCell`, `BemFile`, `BemBundle`, `BemGraph`,
`Keyset`, `BemConfig`, `Walker`, etc.

### 5. Replaced runtime dependencies

The migration removes a swathe of legacy / deprecated deps in favour of
the Node standard library. Most of this is invisible to users, but worth
noting if you patched against internals:

| Was | Replaced by |
|---|---|
| `es6-promisify`, `mz`, `pinkie-promise` | `node:fs/promises`, `node:util.promisify` |
| `graceful-fs` | `node:fs/promises` (raw `fs` is enough on Node 20) |
| `async-each` | `Promise.all` over `node:fs/promises.readdir` |
| `es6-error` | native `class … extends Error` |
| `lodash.flatten`, `lodash.clonedeep`, `lodash.isequal` | `Array.prototype.flat()`, `structuredClone`, `node:util.isDeepStrictEqual` |
| `lodash` (full, in `graph`) | targeted native ops + `Set`/`Map` |
| `hash-set`, `ho-iter` | native `Set`, ES2023 Iterator helpers |
| `depd` | `node:util.deprecate` (or local `emitDeprecation()`) |
| `camel-case@^3`, `pascal-case@^2` | `change-case@^5` |
| `debug@2` | `debug@^4` |
| `glob@7` | `glob@^13` (named `import { glob, globSync }`) |
| `json5@0.5` | `json5@^2` |
| `node-eval@1` | `node-eval@^2` |
| `stringify-object@3` | `stringify-object@^6` |

The `deprecation` event semantics are preserved — code that listened for
`process.on('deprecation', err => …)` keeps working.

---

## Per-package changes

> Format: each subsection lists the **before / after** API for the most
> common usage and any source-level breaking changes. Internal refactors
> that don't affect users are omitted — see each package's `CHANGELOG.md`
> for the full story.

### `@bem/sdk.entity-name` — 0.2.x → 1.0.0

```diff
- const BemEntityName = require('@bem/sdk.entity-name');
+ import { BemEntityName } from '@bem/sdk.entity-name';
```

Public surface is preserved: constructor, getters
(`block`/`elem`/`mod`/`modName`/`modVal`/`type`/`scope`/`id`), methods
(`isEqual`, `belongsTo`, `valueOf`, `toJSON`, `toString`,
`isSimpleMod`, custom inspect), statics (`create`, `isBemEntityName`).
The `EntityTypeError` is now also a named export.

`modName` and `modVal` getters remain in the API but are flagged as
`@deprecated` — the canonical accessor is `entity.mod.name` /
`entity.mod.val`.

### `@bem/sdk.cell` — 0.2.x → 1.0.0

```diff
- const BemCell = require('@bem/sdk.cell');
+ import { BemCell } from '@bem/sdk.cell';
```

`BemCell.create({ block, elem?, modName?, modVal?, tech?, layer? })` and
the legacy short-hand `new BemCell({ entity, tech?, layer?, id? })` both
still work.

### `@bem/sdk.file` — 0.3.x → 1.0.0

```diff
- const BemFile = require('@bem/sdk.file');
+ import { BemFile } from '@bem/sdk.file';
```

### `@bem/sdk.bemjson-node` — 0.0.x → 1.0.0

```diff
- const BemjsonNode = require('@bem/sdk.bemjson-node');
+ import { BemjsonNode } from '@bem/sdk.bemjson-node';
```

The legacy `inspect()` method is replaced by the standard
`util.inspect.custom` symbol. `console.log(node)` and
`util.inspect(node)` keep working — direct `.inspect()` calls don't.

### `@bem/sdk.bundle` — 0.2.x → 1.0.0

```diff
- const BemBundle = require('@bem/sdk.bundle');
+ import { BemBundle } from '@bem/sdk.bundle';
```

### `@bem/sdk.naming.entity.stringify` — 1.1.x → 2.0.0

```diff
- const stringify = require('@bem/sdk.naming.entity.stringify')(naming);
+ import { stringifyWrapper } from '@bem/sdk.naming.entity.stringify';
+ const stringify = stringifyWrapper(naming);
```

Default export still equals `stringifyWrapper`.

### `@bem/sdk.naming.entity.parse` — 0.2.x → 1.0.0

```diff
- const parse = require('@bem/sdk.naming.entity.parse')(naming);
+ import { bemNamingEntityParse } from '@bem/sdk.naming.entity.parse';
+ const parse = bemNamingEntityParse(naming);
```

### `@bem/sdk.naming.entity` — 0.2.x → 1.0.0

```diff
- const naming = require('@bem/sdk.naming.entity')('origin');
+ import { bemNaming } from '@bem/sdk.naming.entity';
+ const naming = bemNaming('origin');
```

### `@bem/sdk.naming.presets` — 0.2.x → 1.0.0

Presets are now individually-typed named exports:

```diff
- const origin = require('@bem/sdk.naming.presets/origin');
+ import { origin } from '@bem/sdk.naming.presets';

- const presets = require('@bem/sdk.naming.presets');
- const preset = presets.create({ preset: 'react' });
+ import { create } from '@bem/sdk.naming.presets';
+ const preset = create({ preset: 'react' });
```

The deep `@bem/sdk.naming.presets/origin` import path **no longer works**
— use the named export instead.

### `@bem/sdk.naming.cell.pattern-parser` — 0.0.x → 1.0.0

```diff
- const parse = require('@bem/sdk.naming.cell.pattern-parser');
+ import { patternParser } from '@bem/sdk.naming.cell.pattern-parser';
```

### `@bem/sdk.naming.cell.stringify` — 0.0.x → 1.0.0

```diff
- const createStringify = require('@bem/sdk.naming.cell.stringify');
+ import { cellStringifyWrapper } from '@bem/sdk.naming.cell.stringify';
```

The cell argument is now structurally typed via `BemCellLike` — anything
shaped like `{ entity: { block, elem?, mod? }, tech?, layer? }` works,
including `BemCell` instances.

### `@bem/sdk.naming.cell.match` — 0.1.x → 1.0.0

```diff
- const match = require('@bem/sdk.naming.cell.match')(naming);
+ import { bemNamingCellMatch } from '@bem/sdk.naming.cell.match';
+ const match = bemNamingCellMatch(naming);
```

### `@bem/sdk.naming.file.stringify` — 0.1.x → 1.0.0

```diff
- const stringify = require('@bem/sdk.naming.file.stringify')(naming);
+ import { fileStringifyWrapper } from '@bem/sdk.naming.file.stringify';
+ const stringify = fileStringifyWrapper(naming);
```

### `@bem/sdk.decl` — 0.3.x → 1.0.0

```diff
- const decl = require('@bem/sdk.decl');
- decl.normalize(...);
+ import { normalize, intersect, merge, subtract } from '@bem/sdk.decl';
+ normalize(...);
```

The legacy `format: 'harmony'` option (which was silently ignored) is
gone — pass `format: 'v2'` explicitly.

### `@bem/sdk.bemjson-to-decl` — 0.2.x → 1.0.0

```diff
- const convert = require('@bem/sdk.bemjson-to-decl');
+ import { convert, stringify } from '@bem/sdk.bemjson-to-decl';
```

### `@bem/sdk.bemjson-to-jsx` — 0.2.x → 1.0.0

```diff
- const factory = require('@bem/sdk.bemjson-to-jsx');
- const transform = factory(opts);
+ import { bemjsonToJsx } from '@bem/sdk.bemjson-to-jsx';
+ const transform = bemjsonToJsx(opts);
```

The factory still exposes `tagToClass`, `plugins` and `styleToObj` as
static fields, and the underlying `Transformer` class is now also a
named export.

### `@bem/sdk.import-notation` — 0.0.x → 1.0.0

```diff
- const parse = require('@bem/sdk.import-notation/parse');
+ import { parse, stringify } from '@bem/sdk.import-notation';
```

### `@bem/sdk.keyset` — 0.1.x → 1.0.0

```diff
- const Keyset = require('@bem/sdk.keyset');
+ import { Keyset, LangKeys, Key } from '@bem/sdk.keyset';
```

`Keyset.load()` and `.save()` now use `node:fs/promises` directly — the
old `mock-fs` driven test fixtures should be replaced with `fs.mkdtemp()`
in your tests.

### `@bem/sdk.config` — 0.1.x → 1.0.0

```diff
- const bemConfig = require('@bem/sdk.config');
- const cfg = bemConfig();
+ import { bemConfig } from '@bem/sdk.config';
+ const cfg = bemConfig();
```

`bemConfig.library()` rejects with an `Error` instance instead of a bare
string when the named library is missing.

### `@bem/sdk.graph` — 0.3.x → 1.0.0

```diff
- const BemGraph = require('@bem/sdk.graph').BemGraph;
+ import { BemGraph } from '@bem/sdk.graph';
```

Internal types `MixedGraph`, `DirectedGraph`, `VertexSet` are still
exported for advanced use, but they used to be access through
`require('@bem/sdk.graph/lib/...')` paths — those subpaths are gone.

### `@bem/sdk.walk` — 0.6.x → 1.0.0

```diff
- const walk = require('@bem/sdk.walk');
- walk(levels, opts).pipe(...)
+ import { walk, walkSets, asArray } from '@bem/sdk.walk';
+ const files = await asArray(walk(levels, opts));
```

`walk()` now returns an `AsyncIterable` instead of a Node stream. `asArray`
collects it into a plain array. If you need the streaming API, wrap with
`stream.Readable.from(walk(...))`.

### `@bem/sdk.deps` — 0.3.x → 1.0.0

```diff
- const deps = require('@bem/sdk.deps');
+ import { read, parse, resolve } from '@bem/sdk.deps';
```

---

## Upgrading a downstream project

```sh
# 1. Bump every @bem/sdk.* dep to ^1.0.0 in package.json
#    (or ^2.0.0 for naming.entity.stringify).
pnpm up '@bem/sdk.*' --latest

# 2. Make sure your project is ESM (or use dynamic imports).
#    Add to package.json:
#    {
#      "type": "module",
#      "engines": { "node": ">=20" }
#    }

# 3. Re-run typecheck — TypeScript will flag every place that needs to
#    switch from default to named imports.
tsc --noEmit
```

If you hit something that's not covered here, please open an issue at
<https://github.com/bem/bem-sdk/issues> with a minimal reproduction.
