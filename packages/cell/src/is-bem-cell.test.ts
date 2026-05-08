import { expect } from 'chai';

import { BemEntityName } from '@bem/sdk.entity-name';

import { BemCell } from './cell.js';

describe('BemCell.isBemCell', () => {
  it('passes valid cells', () => {
    const cell = new BemCell({ entity: new BemEntityName({ block: 'block' }) });
    expect(BemCell.isBemCell(cell)).to.equal(true);
  });

  it('rejects plain objects and arrays', () => {
    expect(BemCell.isBemCell({})).to.equal(false);
    expect(BemCell.isBemCell([])).to.equal(false);
  });

  it('rejects null', () => {
    expect(BemCell.isBemCell(null)).to.equal(false);
  });
});
