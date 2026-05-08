---
'@bem/sdk.walk': major
---

Migrated to TypeScript / ESM (Node >=20). Replaced legacy deps:
- `async-each` → native `Promise.all` over `node:fs/promises.readdir`.
- `depd` → `node:util.deprecate`.
- `mock-fs`/`proxyquire`/`chai-subset` removed from devDependencies; the
  legacy white-box test suite is preserved as a TODO note in
  `src/legacy-mock-fs.test.skip.ts.txt`. Public surface is now covered by a
  real-tmpdir-based suite in `src/index.test.ts`.

Public API: `walk(levels, options)` (legacy stream entry), `walk.walk()`
(by config sets), `walk.asArray()`, plus named exports for the same.
