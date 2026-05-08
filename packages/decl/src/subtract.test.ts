import { expect } from 'chai';

import { BemCell } from '@bem/sdk.cell';

import { subtract } from './subtract.js';

const cell = (block: string): BemCell => BemCell.create({ entity: { block } });

describe('subtract', () => {
  it('subtracts from empty set', () => {
    expect(subtract([], [cell('A')])).to.deep.equal([]);
  });

  it('subtracts an empty set', () => {
    const A = [cell('A')];
    expect(subtract(A, [])).to.deep.equal(A);
  });

  it('handles disjoint sets', () => {
    const A = [cell('A')];
    const B = [cell('B')];
    expect(subtract(A, B)).to.deep.equal(A);
  });

  it('handles intersecting sets', () => {
    const ABC = [cell('A'), cell('B'), cell('C')];
    const B = [cell('B')];
    expect(subtract(ABC, B).map((c) => c.id)).to.deep.equal(['A', 'C']);
  });

  it('subtracts several sets at once', () => {
    const A = cell('A'), B = cell('B'), C = cell('C');
    expect(subtract([A, B, C], [B], [C])).to.deep.equal([A]);
  });
});
