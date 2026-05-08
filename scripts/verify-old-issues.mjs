#!/usr/bin/env node
// Verifier for historical bug-reports against the migrated 1.0.0 packages.
// Run from the repo root: `node scripts/verify-old-issues.mjs`.
// Exits 0 always — output is human-reviewed; we are not asserting here.

import { resolve } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

console.log('# Verifying historical bugs against 1.0.0 packages\n');

const decl = await import(resolve(root, 'packages/decl/dist/index.js'));
const cell = await import(resolve(root, 'packages/cell/dist/index.js'));
const entity = await import(
  resolve(root, 'packages/entity-name/dist/index.js')
);
const presets = await import(
  resolve(root, 'packages/naming.presets/dist/index.js')
);

console.log('## #344 — decl.normalize({block, elems:{elem, mods:[...]}})');
try {
  const out = decl.normalize({
    block: 'b',
    elems: { elem: 'e', mods: ['m1', 'm2'] },
  });
  for (const c of out) console.log('  ', c.id ?? c.entity?.id ?? c);
} catch (e) {
  console.log('  THROWS:', e.message);
}

console.log('\n## #341 — decl.normalize({elems:{elem,mod,val}}, {scope}) v2');
try {
  const scope = new cell.BemCell({
    entity: new entity.BemEntityName({ block: 'foo' }),
    tech: null,
  });
  const out = decl.normalize(
    { elems: { elem: 'bar', mod: 'm', val: 'v' } },
    { scope, format: 'v2' },
  );
  for (const c of out) console.log('  ', c.id ?? c.entity?.id ?? c);
} catch (e) {
  console.log('  THROWS:', e.message);
}

console.log('\n## #272 — decl.parse with {block, elem, mod} (v2)');
try {
  const out = decl.parse(`
exports.format = "v2";
exports.decl = [
  {block: 'xxx', elem: 'skin', mod: 'red'},
];
`);
  for (const c of out) console.log('  ', c.id ?? c.entity?.id ?? c);
} catch (e) {
  console.log('  THROWS:', e.message);
}

console.log(
  '\n## #385 — naming.cell.match react preset with hyphenated layer/value',
);
try {
  const { bemNamingCellMatch } = await import(
    resolve(root, 'packages/naming.cell.match/dist/index.js')
  );
  const match = bemNamingCellMatch(presets.react);
  console.log(
    '  MyBlock/_kind/MyBlock_kind@touch-phone.js →',
    match('MyBlock/_kind/MyBlock_kind@touch-phone.js'),
  );
  console.log(
    '  MyBlock/_kind/MyBlock_kind-name.js →',
    match('MyBlock/_kind/MyBlock_kind-name.js'),
  );
} catch (e) {
  console.log('  THROWS:', e.message);
}

console.log('\n## #395 — naming.entity.parse react preset with @layer');
try {
  const { bemNamingEntityParse } = await import(
    resolve(root, 'packages/naming.entity.parse/dist/index.js')
  );
  const parse = bemNamingEntityParse(presets.react);
  console.log(
    '  MyBlock/MyBlock_myModifier@layer →',
    parse('MyBlock/MyBlock_myModifier@layer'),
  );
  console.log('  MyBlock_myModifier →', parse('MyBlock_myModifier'));
} catch (e) {
  console.log('  THROWS:', e.message);
}

console.log('\n## #269 — entity-name.belongsTo with simple modifiers');
try {
  const a = entity.BemEntityName.create({
    block: 'popup2',
    mod: { name: 'target', val: 'position' },
  });
  const b = entity.BemEntityName.create({
    block: 'popup2',
    mod: { name: 'target' },
  });
  console.log('  a.belongsTo(b) =', a.belongsTo(b), '(expect true)');
  console.log('  b.belongsTo(a) =', b.belongsTo(a), '(expect false)');
} catch (e) {
  console.log('  THROWS:', e.message);
}

console.log(
  '\n## #293 — naming.cell.match react fs-scheme MyBlock/MyElem/MyBlock-MyElem.css',
);
try {
  const { bemNamingCellMatch } = await import(
    resolve(root, 'packages/naming.cell.match/dist/index.js')
  );
  const match = bemNamingCellMatch(presets.react);
  console.log(
    '  MyBlock/MyElem/MyBlock-MyElem.css →',
    match('MyBlock/MyElem/MyBlock-MyElem.css'),
  );
} catch (e) {
  console.log('  THROWS:', e.message);
}
