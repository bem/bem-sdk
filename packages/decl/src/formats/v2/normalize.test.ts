import { expect } from 'chai';

import type { BemCell } from '@bem/sdk.cell';

import { normalize } from './normalize.js';

interface Simplified {
  entity: { block: string; elem?: string; modName?: string; modVal?: unknown };
  tech: string | null;
}

const simplifyCell = (cell: BemCell): Simplified => {
  const entity: Simplified['entity'] = { block: cell.entity.block };
  if (cell.entity.elem) entity.elem = cell.entity.elem;
  if (cell.entity.mod) {
    entity.modName = cell.entity.mod.name;
    entity.modVal = cell.entity.mod.val;
  }
  return { entity, tech: cell.tech ?? null };
};

describe('v2 normalize: common', () => {
  it('supports undefined', () => {
    expect(normalize()).to.deep.equal([]);
  });

  it('supports empty array', () => {
    expect(normalize([])).to.deep.equal([]);
  });

  it('returns scope for empty object in array', () => {
    expect(
      normalize([{}], { entity: { block: 'sb' } }).map(simplifyCell),
    ).to.deep.equal([{ entity: { block: 'sb' }, tech: null }]);
  });

  it('returns scope for empty object', () => {
    expect(
      normalize({}, { entity: { block: 'sb' } }).map(simplifyCell),
    ).to.deep.equal([{ entity: { block: 'sb' }, tech: null }]);
  });

  it('dedupes identical entries', () => {
    const A = { block: 'A' };
    expect(normalize([A, A]).map(simplifyCell)).to.deep.equal([
      { entity: A, tech: null },
    ]);
  });

  it('preserves order', () => {
    const A = { block: 'A' };
    const B = { block: 'B' };
    expect(normalize([A, B, A]).map(simplifyCell)).to.deep.equal([
      { entity: A, tech: null },
      { entity: B, tech: null },
    ]);
  });

  it('supports plain array of blocks', () => {
    expect(
      normalize([{ block: 'A' }, { block: 'B' }]).map(simplifyCell),
    ).to.deep.equal([
      { entity: { block: 'A' }, tech: null },
      { entity: { block: 'B' }, tech: null },
    ]);
  });
});

describe('v2 normalize: block', () => {
  it('parses block from object', () => {
    expect(normalize({ block: 'A' }).map(simplifyCell)).to.deep.equal([
      { entity: { block: 'A' }, tech: null },
    ]);
  });

  it('parses block string', () => {
    expect(normalize('A').map(simplifyCell)).to.deep.equal([
      { entity: { block: 'A' }, tech: null },
    ]);
  });

  it('keeps tech', () => {
    expect(normalize({ block: 'A', tech: 'css' }).map(simplifyCell)).to.deep.equal([
      { entity: { block: 'A' }, tech: 'css' },
    ]);
  });
});

describe('v2 normalize: elem', () => {
  it('emits only elem cell when block has elem', () => {
    expect(normalize({ block: 'A', elem: 'e' }).map(simplifyCell)).to.deep.equal([
      { entity: { block: 'A', elem: 'e' }, tech: null },
    ]);
  });

  it('handles array of elems via `elem`', () => {
    expect(
      normalize({ block: 'A', elem: ['e1', 'e2'] }).map(simplifyCell),
    ).to.deep.equal([
      { entity: { block: 'A', elem: 'e1' }, tech: null },
      { entity: { block: 'A', elem: 'e2' }, tech: null },
    ]);
  });
});

describe('v2 normalize: mods', () => {
  it('emits modless block + bool mod', () => {
    expect(
      normalize({ block: 'A', mods: { theme: true } }).map(simplifyCell),
    ).to.deep.equal([
      { entity: { block: 'A' }, tech: null },
      { entity: { block: 'A', modName: 'theme', modVal: true }, tech: null },
    ]);
  });

  it('expands string mod-vals into bool + value', () => {
    expect(
      normalize({ block: 'A', mods: { theme: 'normal' } }).map(simplifyCell),
    ).to.deep.equal([
      { entity: { block: 'A' }, tech: null },
      { entity: { block: 'A', modName: 'theme', modVal: true }, tech: null },
      {
        entity: { block: 'A', modName: 'theme', modVal: 'normal' },
        tech: null,
      },
    ]);
  });
});
