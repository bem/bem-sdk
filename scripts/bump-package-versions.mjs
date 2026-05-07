#!/usr/bin/env node
// One-shot script: bumps every packages/*/package.json to current target deps.
// Idempotent — safe to re-run.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const packagesDir = join(root, 'packages');

// Latest pinned versions (caret ranges).
const LATEST = {
  // External runtime
  debug: '^4.4.3',
  glob: '^13.0.6',
  'is-glob': '^4.0.3',
  json5: '^2.2.3',
  'node-eval': '^2.0.0',
  'graceful-fs': '^4.2.11',
  'stringify-object': '^6.0.0',
  betterc: '^1.3.0',
  'change-case': '^5.4.4',
  benchmark: '^2.1.4',

  // Lodash (will be replaced in Phase 6, kept on latest 4.x for now)
  lodash: '^4.17.21',
  'lodash.clonedeep': '^4.5.0',
  'lodash.flatten': '^4.4.0',
  'lodash.isequal': '^4.5.0',
  'lodash.mergewith': '^4.6.2',
  'lodash.uniqwith': '^4.5.0',

  // Replaceable deps — kept on latest for now, removed in Phase 6
  'es6-promisify': '^7.0.0',
  'es6-error': '^4.1.1',
  mz: '^2.7.0',
  'pinkie-promise': '^2.0.1',
  'async-each': '^1.0.6',
  depd: '^2.0.0',
  'camel-case': '^5.0.0',
  'pascal-case': '^4.0.0',
  'hash-set': '^1.0.1',
  'ho-iter': '^0.3.0',
  xamel: '^0.3.1',

  // Test frameworks
  mocha: '^11.7.5',
  chai: '^6.2.2',
  'chai-as-promised': '^8.0.2',
  'chai-subset': '^1.6.0',
  sinon: '^22.0.0',
  c8: '^11.0.0',
  proxyquire: '^2.1.3',
  'mock-fs': '^5.5.0',
  matcha: '^0.7.0',
  'common-tags': '^1.8.2',
  'promise-map-series': '^0.3.0',
  'stream-to-array': '^2.3.0',
  through2: '^5.0.0',

  // Types
  '@types/node': '^25.6.2',
  '@types/chai': '^5.2.3',
  '@types/chai-as-promised': '^8.0.2',
  '@types/mocha': '^10.0.10',
  '@types/sinon': '^21.0.1',
  '@types/proxyquire': '^1.3.31',
};

function bumpDeps(deps) {
  if (!deps) return deps;
  const out = {};
  for (const [name, current] of Object.entries(deps)) {
    if (name.startsWith('@bem/sdk')) {
      // Internal cross-package deps — switch to workspace protocol
      out[name] = 'workspace:^';
      continue;
    }
    out[name] = LATEST[name] ?? current;
  }
  return out;
}

const dirs = readdirSync(packagesDir).filter((d) =>
  statSync(join(packagesDir, d)).isDirectory(),
);

for (const d of dirs) {
  const pkgPath = join(packagesDir, d, 'package.json');
  let raw;
  try {
    raw = readFileSync(pkgPath, 'utf8');
  } catch {
    continue;
  }
  const pkg = JSON.parse(raw);

  pkg.engines = { node: '>=20' };
  if (pkg.dependencies) pkg.dependencies = bumpDeps(pkg.dependencies);
  if (pkg.devDependencies) pkg.devDependencies = bumpDeps(pkg.devDependencies);
  if (pkg.peerDependencies)
    pkg.peerDependencies = bumpDeps(pkg.peerDependencies);

  delete pkg.greenkeeper;

  // Standardize publishConfig
  pkg.publishConfig = { access: 'public' };

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`bumped ${pkg.name}`);
}
