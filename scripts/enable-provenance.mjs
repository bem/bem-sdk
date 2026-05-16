#!/usr/bin/env node
// Enable npm provenance for every published package by setting
// `publishConfig.provenance = true`.
// Provenance only takes effect when publishing from CI with OIDC; locally
// the flag is a no-op.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const packagesDir = join(root, 'packages');

const dirs = readdirSync(packagesDir).filter((d) =>
  statSync(join(packagesDir, d)).isDirectory(),
);

let touched = 0;
for (const d of dirs) {
  const pkgPath = join(packagesDir, d, 'package.json');
  let raw;
  try {
    raw = readFileSync(pkgPath, 'utf8');
  } catch {
    continue;
  }
  const pkg = JSON.parse(raw);
  if (pkg.private) continue;

  pkg.publishConfig = {
    access: 'public',
    provenance: true,
    ...pkg.publishConfig,
  };
  // ensure the two flags are set even if publishConfig already existed
  pkg.publishConfig.access = 'public';
  pkg.publishConfig.provenance = true;

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  touched += 1;
  console.log(`provenance: ${pkg.name}`);
}

console.log(`\nUpdated ${touched} packages.`);
