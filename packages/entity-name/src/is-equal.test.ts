import { expect } from 'chai';

import { BemEntityName } from './entity-name.js';

describe('is-equal', () => {
  it('should detect equal block', () => {
    const a = new BemEntityName({ block: 'block' });
    const b = new BemEntityName({ block: 'block' });
    expect(a.isEqual(b)).to.be.true;
  });

  it('should not detect another block', () => {
    const a = new BemEntityName({ block: 'block1' });
    const b = new BemEntityName({ block: 'block2' });
    expect(a.isEqual(b)).to.be.false;
  });
});
