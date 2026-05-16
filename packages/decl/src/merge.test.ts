import { expect } from 'chai';

import { BemCell } from '@bem/sdk.cell';

import { merge } from './merge.js';

const cell = (block: string): BemCell => BemCell.create({ entity: { block } });

describe('merge', () => {
  it('supports a single decl', () => {
    const decl = [cell('block')];
    expect(merge(decl)).to.deep.equal(decl);
  });

  it('supports several decls', () => {
    const A = cell('A'), B = cell('B'), C = cell('C');
    expect(merge([A], [B], [C])).to.deep.equal([A, B, C]);
  });

  it('supports many decls', () => {
    const A = cell('A'), B = cell('B'), C = cell('C');
    expect(merge([A], [B], [A, B], [B, C], [A, C])).to.deep.equal([A, B, C]);
  });

  it('dedupes equal cells', () => {
    const decl = [cell('block')];
    expect(merge(decl, decl)).to.deep.equal(decl);
  });

  it('merges with an empty set', () => {
    const decl = [cell('block')];
    expect(merge(decl, [])).to.deep.equal(decl);
  });

  it('merges disjoint sets', () => {
    const A = [cell('A')];
    const B = [cell('B')];
    expect(merge(A, B)).to.deep.equal([...A, ...B]);
  });

  it('merges intersecting sets', () => {
    const ABC = [cell('A'), cell('B'), cell('C')];
    const B = [cell('B')];
    expect(merge(ABC, B)).to.deep.equal(ABC);
  });
});
