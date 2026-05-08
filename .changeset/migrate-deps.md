---
'@bem/sdk.deps': major
---

Migrated to TypeScript / ESM (Node >=20). Replaced legacy deps:
- `mz` → `node:fs/promises`.
- `debug@2` → `^4.4.3` (catalog).
- `node-eval@1` → `^2` (catalog) with an ambient `.d.ts` declaration.

The `gather` mock-fs-based suite is deferred (see
`src/gather.test.skip.ts.txt`); `resolve` and the `deps.js` parser are
still covered by direct TS tests.

Public API: named exports `read`, `parse`, `gather`, `resolve`, `buildGraph`,
`load`, plus `depsJs`, `depsJsReader`, `depsJsParser`. Default export keeps
the same fields for backward compatibility.
