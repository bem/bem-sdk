#!/usr/bin/env node
// Generates per-package tsconfig.json with composite project references
// based on dependencies in the package's package.json.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const packagesDir = join(root, 'packages');

const dirs = readdirSync(packagesDir).filter((d) =>
  statSync(join(packagesDir, d)).isDirectory(),
);

// Build name -> dir map
const byName = new Map();
for (const d of dirs) {
  const pkgPath = join(packagesDir, d, 'package.json');
  if (!existsSync(pkgPath)) continue;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  byName.set(pkg.name, d);
}

for (const d of dirs) {
  const dir = join(packagesDir, d);
  const pkgPath = join(dir, 'package.json');
  if (!existsSync(pkgPath)) continue;

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  // Project references must reflect *production* deps only — devDeps form
  // cycles via test fixtures and are compiled separately.
  const deps = pkg.dependencies ?? {};

  const refs = [];
  for (const depName of Object.keys(deps)) {
    if (!depName.startsWith('@bem/sdk')) continue;
    const depDir = byName.get(depName);
    if (!depDir) continue;
    const path = relative(dir, join(packagesDir, depDir));
    refs.push({ path });
  }
  refs.sort((a, b) => a.path.localeCompare(b.path));

  const tsconfig = {
    extends: relative(dir, join(root, 'tsconfig.base.json')),
    compilerOptions: {
      rootDir: 'src',
      outDir: 'dist',
    },
    include: ['src/**/*.ts', 'src/**/*.d.ts'],
    exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    references: refs,
  };

  writeFileSync(
    join(dir, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2) + '\n',
  );
  console.log(`tsconfig: ${pkg.name}`);
}
