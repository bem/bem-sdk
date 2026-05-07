---
'@bem/sdk.naming.presets': major
---

Migrated to TypeScript / ESM (Node >=20).
Presets are now named exports: `origin`, `originReact`, `react`, `twoDashes`, `legacy`. The `create(...)` factory and `getPreset(name)` helper are also named exports. Type `NamingConvention` exported.
