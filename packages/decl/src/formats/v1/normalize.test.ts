import { expect } from 'chai';

import type { BemCell } from '@bem/sdk.cell';

import { normalize } from './normalize.js';

const simplify = (cell: BemCell): { entity: { block: string; elem?: string; modName?: string; modVal?: unknown }; tech: string | null } => {
  const entity: { block: string; elem?: string; modName?: string; modVal?: unknown } = { block: cell.entity.block };
  if (cell.entity.elem) entity.elem = cell.entity.elem;
  if (cell.entity.mod) {
    entity.modName = cell.entity.mod.name;
    entity.modVal = cell.entity.mod.val;
  }
  return { entity, tech: cell.tech ?? null };
};

describe('v1 normalize: common', () => {
  it('supports undefined', () => {
    expect(normalize()).to.deep.equal([]);
  });

  it('supports empty array', () => {
    expect(normalize([])).to.deep.equal([]);
  });

  it('supports plain object', () => {
    expect(normalize({ name: 'block' }).map(simplify)).to.deep.equal([
      { entity: { block: 'block' }, tech: null },
    ]);
  });

  it('dedupes entries', () => {
    expect(
      normalize([{ name: 'A' }, { name: 'A' }]).map(simplify),
    ).to.deep.equal([{ entity: { block: 'A' }, tech: null }]);
  });

  it('preserves order', () => {
    expect(
      normalize([{ name: 'A' }, { name: 'B' }, { name: 'A' }]).map(simplify),
    ).to.deep.equal([
      { entity: { block: 'A' }, tech: null },
      { entity: { block: 'B' }, tech: null },
    ]);
  });
});

describe('v1 normalize: mods', () => {
  it('emits bool mod', () => {
    expect(
      normalize({
        name: 'A',
        mods: [{ name: 'theme', vals: [] }],
      }).map(simplify),
    ).to.deep.equal([
      { entity: { block: 'A' }, tech: null },
      { entity: { block: 'A', modName: 'theme', modVal: true }, tech: null },
    ]);
  });

  it('emits valued mods', () => {
    expect(
      normalize({
        name: 'A',
        mods: [{ name: 'theme', vals: [{ name: 'normal' }] }],
      }).map(simplify),
    ).to.deep.equal([
      { entity: { block: 'A' }, tech: null },
      { entity: { block: 'A', modName: 'theme', modVal: 'normal' }, tech: null },
    ]);
  });
});
