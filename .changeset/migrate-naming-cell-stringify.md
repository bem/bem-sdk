---
'@bem/sdk.naming.cell.stringify': major
---

Migrated to TypeScript / ESM (Node >=20).
Public API: named export `cellStringifyWrapper` (default export retained), plus
types `BemCellLike`, `CellStringify`, `FsConvention`, `NamingConvention`,
`NamingDelims`. Entity rendering now goes through the migrated
`@bem/sdk.naming.entity.stringify` package (added as a prod-dep instead of the
legacy implicit `@bem/sdk.naming.entity` couple). The structural `BemCellLike`
type avoids a hard runtime dependency on `@bem/sdk.cell`. Tests against
`@bem/sdk.cell` were parked in `src/index.test.skip.ts.txt` until that package
is migrated; behaviour is covered by inline structural fixtures.
