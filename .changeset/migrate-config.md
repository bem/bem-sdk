---
'@bem/sdk.config': major
---

Migrated to TypeScript / ESM (Node >=20).
Public API: named export `bemConfig` factory (default export retained), plus `BemConfig` class. Helpers `merge` and `resolveSets` are now public exports. New `configs` option allows pre-resolved configs for tests and DI (replacing legacy `proxyquire`-based mocks). Types `BemConfigOptions`, `RawConfig`, `MergedConfig`, `LevelConfig`, `LibConfig`, `SetChunk`, `SetDefinition`, `ConfigPlugin` ship with the package.

Replaced deps:
- `pinkie-promise` -> native `Promise`.
- `lodash.flatten` -> `Array.prototype.flat()`.
- `lodash.clonedeep` -> `structuredClone`.
- `lodash.isequal` -> `node:util.isDeepStrictEqual`.
- `glob@7` -> `glob@13` (no default export; `glob` / `globSync` named imports).
- `is-glob@3` -> `is-glob@4`.

Kept: `betterc`, `lodash.mergewith` (custom merge semantics), `lodash.uniqwith` (custom comparator).
