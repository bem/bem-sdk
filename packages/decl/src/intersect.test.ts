import { expect } from 'chai';

import { BemCell } from '@bem/sdk.cell';

import { intersect } from './intersect.js';

const cell = (block: string, tech?: string | null): BemCell =>
  BemCell.create({ entity: { block }, ...(tech ? { tech } : {}) });

describe('intersect', () => {
  it('supports a single set', () => {
    const decl = [cell('block')];
    expect(intersect(decl)).to.deep.equal(decl);
  });

  it('supports several identical sets', () => {
    const block = [cell('block')];
    expect(intersect(block, block, block, block)).to.deep.equal(block);
  });

  it('intersects with empty set', () => {
    expect(intersect([cell('block')], [])).to.deep.equal([]);
  });

  it('intersects disjoint sets', () => {
    expect(intersect([cell('A')], [cell('B')])).to.deep.equal([]);
  });

  it('intersects intersecting sets', () => {
    const ABC = [cell('A'), cell('B'), cell('C')];
    const B = [cell('B')];
    expect(intersect(ABC, B).map((c) => c.id)).to.deep.equal(['B']);
  });

  it('intersects sets with different techs', () => {
    const common = cell('C', 't1');
    const ABC = [cell('A'), cell('B', 't1'), common];
    const B = [cell('B', 't2'), common];
    expect(intersect(ABC, B).map((c) => c.id)).to.deep.equal([common.id]);
  });

  it('intersects 3 sets', () => {
    const common = cell('COMMON', 'common');
    const ABC = [cell('A'), cell('B', 't1'), common];
    const A = [cell('A'), common];
    const B = [cell('B'), common];
    expect(intersect(ABC, A, B).map((c) => c.id)).to.deep.equal([common.id]);
  });
});
