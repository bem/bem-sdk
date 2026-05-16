import { expect } from 'chai';

import { BemEntityName } from '@bem/sdk.entity-name';

import { BemCell } from './cell.js';

describe('toString', () => {
  it('returns id', () => {
    const cell = new BemCell({ entity: new BemEntityName({ block: 'block' }) });
    expect(cell.toString()).to.be.a('string');
    expect(cell.toString()).to.equal(cell.id);
  });
});
